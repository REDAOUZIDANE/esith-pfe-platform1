import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { MessageSquare, Search, Mic, Paperclip, Send, Volume2, Camera, Plus, Trash2, X } from 'lucide-react';
import AudioRecorder from './AudioRecorder';
import VideoRecorder from './VideoRecorder';
import axios from 'axios';
import { API_URL } from '../../config';

const socket = io(window.location.origin);

const Chat = () => {
    const [user, setUser] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [currentRoom, setCurrentRoom] = useState('room_global');
    const [rooms, setRooms] = useState<any[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [showNewRoomModal, setShowNewRoomModal] = useState(false);
    const [isRecording] = useState(false);
    const [recordingDuration] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [showVideoRecorder, setShowVideoRecorder] = useState(false);
    const [showAudioRecorder, setShowAudioRecorder] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
        }
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await axios.get(`${API_URL}/chat/rooms`);
            const fetchedRooms = res.data;

            const staticRooms = [{ id: 'room_global', name: 'Global Chat', icon: 'GL', type: 'GLOBAL' }];

            const userData = localStorage.getItem('user');
            if (userData) {
                const parsed = JSON.parse(userData);
                if (parsed.major) {
                    const majorRoomId = `room_major_${parsed.major.replace(/\s+/g, '_').toLowerCase()}`;
                    staticRooms.push({
                        id: majorRoomId,
                        name: `${parsed.major} Group`,
                        icon: 'MA',
                        type: 'MAJOR'
                    });
                }
            }

            setRooms([...staticRooms, ...fetchedRooms]);
        } catch (err) {
            console.error('Failed to fetch rooms:', err);
        }
    };

    useEffect(() => {
        socket.emit('authenticate', user?.id);
        socket.emit('join_global');
        if (user?.major) {
            socket.emit('join_major', user.major);
        }

        socket.on('receive_message', (data) => {
            if (data.room === currentRoom) {
                setMessages((prev) => [...prev, data]);
            }
        });

        socket.on('message_deleted', (id) => {
            setMessages(prev => prev.map(m => m.id === id ? { ...m, isDeleted: true, content: 'This message has been deleted.' } : m));
        });

        return () => {
            socket.off('receive_message');
            socket.off('message_deleted');
        };
    }, [currentRoom, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e?: React.FormEvent, extraData: any = {}) => {
        if (e) e.preventDefault();
        if ((message.trim() || extraData.fileUrl) && user) {
            socket.emit('send_message', {
                content: message,
                room: currentRoom,
                senderId: user.id,
                type: extraData.type || 'TEXT',
                fileUrl: extraData.fileUrl,
                duration: extraData.duration
            });
            setMessage('');
        }
    };

    const uploadFile = async (file: Blob | File, type: string, duration?: number) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('chatAttachment', file, file instanceof File ? file.name : `recording-${Date.now()}.webm`);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/chat/upload`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            sendMessage(undefined, {
                type,
                fileUrl: res.data.fileUrl,
                duration
            });
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const type = file.type.startsWith('video/') ? 'VIDEO' :
                file.type.startsWith('image/') ? 'IMAGE' : 'FILE';
            uploadFile(file, type);
        }
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/chat/rooms`, { name: newRoomName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewRoomName('');
            setShowNewRoomModal(false);
            fetchRooms();
        } catch (err) {
            alert('Failed to create room');
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (!window.confirm('Are you sure you want to delete this group? All messages will be lost.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/chat/rooms/${roomId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (currentRoom === roomId) setCurrentRoom('room_global');
            fetchRooms();
        } catch (err) {
            alert('Failed to delete room');
        }
    };

    const renderMessageContent = (msg: any) => {
        if (msg.isDeleted) return <p className="text-sm italic opacity-50">This message has been deleted.</p>;

        switch (msg.type) {
            case 'AUDIO':
                return (
                    <div className="flex items-center space-x-2 min-w-[200px] py-1">
                        <div className="h-8 w-8 rounded-full bg-[#004b87] flex items-center justify-center text-white">
                            <Volume2 size={16} />
                        </div>
                        <audio src={`http://localhost:3000${msg.fileUrl}`} controls className="h-8 max-w-full" />
                        <span className="text-[10px] font-bold text-[#666666]">{msg.duration}s</span>
                    </div>
                );
            case 'VIDEO':
                return (
                    <div className="rounded-lg overflow-hidden border border-[#e0e0e0] mt-1">
                        <video src={`http://localhost:3000${msg.fileUrl}`} controls className="max-w-full max-h-[300px]" />
                    </div>
                );
            case 'IMAGE':
                return (
                    <img src={`http://localhost:3000${msg.fileUrl}`} className="max-w-full rounded-lg mt-1 cursor-pointer hover:opacity-90" alt="Image" />
                );
            default:
                return <p className="text-sm">{msg.content}</p>;
        }
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-xl shadow-sm overflow-hidden border border-[#e0e0e0] animate-in fade-in duration-500">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-[#e0e0e0] flex flex-col">
                <div className="p-6 border-b border-[#f3f2f0]">
                    <h2 className="text-xl font-bold text-[#191919] tracking-tight">Messaging</h2>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] group-focus-within:text-[#004b87] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search messages"
                                className="w-full pl-10 pr-4 py-2 bg-[#eef3f8] border border-transparent rounded-lg text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                            />
                        </div>
                        {user?.role === 'ADMIN' && (
                            <button
                                onClick={() => setShowNewRoomModal(true)}
                                className="p-2 bg-[#004b87] text-white rounded-lg hover:bg-[#003662] transition-colors shadow-sm"
                                title="New Group"
                            >
                                <Plus size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => {
                                setCurrentRoom(room.id);
                                setMessages([]);
                            }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${currentRoom === room.id
                                ? 'bg-slate-100 border-r-4 border-[#004b87]'
                                : 'hover:bg-[#f3f2f0]'
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#666666]">
                                {room.icon}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <span className="block font-bold text-sm text-[#191919] truncate">{room.name}</span>
                                    <span className="text-[10px] text-[#666666]">Live</span>
                                </div>
                                <span className="text-xs text-[#666666] truncate block">Group conversation</span>
                            </div>
                            {user?.role === 'ADMIN' && !['GLOBAL', 'MAJOR'].includes(room.type) && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteRoom(room.id);
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Header */}
                <div className="h-16 px-6 border-b border-[#e0e0e0] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-[#666666] font-bold text-sm">
                            {rooms.find(r => r.id === currentRoom)?.icon || 'CH'}
                        </div>
                        <div>
                            <h3 className="font-bold text-[#191919] text-sm">{rooms.find(r => r.id === currentRoom)?.name || 'Chat Room'}</h3>
                            <div className="flex items-center">
                                <span className="text-[10px] text-[#057642] font-bold">Active Now</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <MessageSquare className="w-12 h-12 text-[#666666] mb-2" />
                            <p className="text-sm font-medium text-[#666666]">Start the conversation</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg?.senderId === user?.id ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1 duration-200`}>
                            {msg?.senderId !== user?.id && (
                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold mr-2 mt-auto">
                                    {msg?.sender?.name ? msg.sender.name.charAt(0) : 'U'}
                                </div>
                            )}
                            <div className={`max-w-[70%] group relative ${msg?.senderId === user?.id
                                ? 'bg-[#eef3f8] text-[#191919]'
                                : 'bg-white border border-[#e0e0e0] text-[#191919]'
                                } p-3 rounded-lg shadow-sm`}>
                                {msg?.senderId !== user?.id && (
                                    <p className="text-[10px] font-bold text-[#191919] mb-1">{msg?.sender?.name || 'User'}</p>
                                )}
                                {renderMessageContent(msg)}
                                <p className="text-[9px] text-right mt-1 text-[#666666]">
                                    {msg?.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={sendMessage} className="p-4 border-t border-[#e0e0e0]">
                    <div className="bg-[#f3f2f0] rounded-xl p-2 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#004b87] transition-all">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={isRecording ? `Recording... ${recordingDuration}s` : "Write a message..."}
                            rows={1}
                            disabled={isRecording || uploading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(e as any);
                                }
                            }}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none text-[#191919]"
                        />
                        <div className="flex justify-between items-center mt-2 px-2">
                            <div className="flex space-x-2">
                                <label className="text-[#666666] hover:text-[#004b87] p-1.5 cursor-pointer rounded-lg hover:bg-slate-100 transition-all">
                                    <Paperclip size={18} />
                                    <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*,video/*" />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowVideoRecorder(true)}
                                    className="text-[#666666] hover:text-[#004b87] p-1.5 rounded-lg hover:bg-slate-100 transition-all"
                                >
                                    <Camera size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAudioRecorder(true)}
                                    className={`p-1.5 rounded-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-[#666666] hover:text-[#004b87] hover:bg-slate-100'}`}
                                >
                                    <Mic size={18} />
                                </button>
                                {showAudioRecorder && (
                                    <div className="absolute bottom-16 left-4 z-20">
                                        <AudioRecorder
                                            onStop={(blob, duration) => {
                                                uploadFile(blob, 'AUDIO', duration);
                                                setShowAudioRecorder(false);
                                            }}
                                            onCancel={() => setShowAudioRecorder(false)}
                                        />
                                    </div>
                                )}
                                {showVideoRecorder && (
                                    <VideoRecorder
                                        onStop={(blob) => {
                                            uploadFile(blob, 'VIDEO');
                                            setShowVideoRecorder(false);
                                        }}
                                        onCancel={() => setShowVideoRecorder(false)}
                                    />
                                )}
                                {uploading && (
                                    <div className="flex items-center text-[10px] font-bold text-[#004b87] animate-pulse">
                                        Uploading...
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={(!message.trim() && !isRecording) || uploading}
                                className="bg-[#004b87] text-white p-2 rounded-full font-bold hover:bg-[#003662] transition-colors disabled:opacity-50"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {/* New Room Modal */}
            {showNewRoomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#191919]">Create New Group</h3>
                            <button onClick={() => setShowNewRoomModal(false)} className="text-[#666666] hover:text-[#191919]">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#666666]">Group Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    placeholder="e.g. Project Team A"
                                    className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#004b87] text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-[#003662] transition-all mt-4"
                            >
                                Create Group
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
