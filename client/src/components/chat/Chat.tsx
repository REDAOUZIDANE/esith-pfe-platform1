import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { MessageSquare, Search } from 'lucide-react';

const socket = io('http://localhost:3000');

const Chat = () => {
    const [user, setUser] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [currentRoom, setCurrentRoom] = useState('room_global');
    const [rooms, setRooms] = useState([
        { id: 'room_global', name: 'Global Chat', icon: 'GL' },
    ]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);

            // Join major room automatically
            if (parsed.major) {
                const majorRoom = `room_major_${parsed.major.replace(/\s+/g, '_').toLowerCase()}`;
                setRooms(prev => [...prev, { id: majorRoom, name: `${parsed.major} Group`, icon: 'MA' }]);
            }
        }
    }, []);

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

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && user) {
            socket.emit('send_message', {
                content: message,
                room: currentRoom,
                senderId: user.id
            });
            setMessage('');
        }
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-white rounded-xl shadow-sm overflow-hidden border border-[#e0e0e0] animate-in fade-in duration-500">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-[#e0e0e0] flex flex-col">
                <div className="p-6 border-b border-[#f3f2f0]">
                    <h2 className="text-xl font-bold text-[#191919] tracking-tight">Messaging</h2>
                    <div className="mt-4 relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] group-focus-within:text-[#004b87] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full pl-10 pr-4 py-2 bg-[#eef3f8] border border-transparent rounded-lg text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                        />
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
                                <p className={`text-sm ${msg?.isDeleted ? 'italic opacity-50' : ''}`}>{msg?.content}</p>
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
                            placeholder="Write a message..."
                            rows={1}
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
                                {/* Placeholders for formatting icons */}
                                <button type="button" className="text-[#666666] hover:text-[#191919] p-1">🖼️</button>
                                <button type="button" className="text-[#666666] hover:text-[#191919] p-1">📎</button>
                            </div>
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="bg-[#004b87] text-white px-4 py-1.5 rounded-full font-bold text-sm hover:bg-[#003662] transition-colors disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
