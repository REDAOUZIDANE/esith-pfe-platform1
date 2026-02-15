import { useState, useRef, useEffect } from 'react';
import { Square, Trash2, Send, Play, Pause } from 'lucide-react';

interface AudioRecorderProps {
    onStop: (blob: Blob, duration: number) => void;
    onCancel: () => void;
}

const AudioRecorder = ({ onStop, onCancel }: AudioRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecording(true);
            setDuration(0);
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error('Microphone access denied:', err);
            onCancel();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const handleSend = () => {
        if (audioBlob) {
            onStop(audioBlob, duration);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        startRecording();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    return (
        <div className="flex items-center space-x-3 bg-white border border-[#004b87]/20 p-2 rounded-xl shadow-sm animate-in slide-in-from-bottom-2">
            <div className="flex items-center space-x-2 px-2">
                <div className={`w-2 h-2 rounded-full bg-red-500 ${isRecording ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-bold text-[#191919] min-w-[40px]">{formatTime(duration)}</span>
            </div>

            {audioBlob ? (
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (isPlaying) audioRef.current?.pause();
                            else {
                                if (!audioRef.current) {
                                    audioRef.current = new Audio(URL.createObjectURL(audioBlob));
                                    audioRef.current.onended = () => setIsPlaying(false);
                                }
                                audioRef.current.play();
                            }
                            setIsPlaying(!isPlaying);
                        }}
                        className="p-1.5 text-[#004b87] hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button onClick={onCancel} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={handleSend} className="bg-[#004b87] text-white p-1.5 rounded-lg hover:bg-[#003662] transition-colors">
                        <Send size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-0.5 items-center px-4">
                        {[1, 2, 3, 4, 5, 2, 4, 3, 1].map((h, i) => (
                            <div
                                key={i}
                                className="w-1 bg-[#004b87]/30 rounded-full animate-bounce"
                                style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                    </div>
                    <button onClick={stopRecording} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm">
                        <Square size={16} />
                    </button>
                    <button onClick={onCancel} className="p-1.5 text-[#666666] hover:bg-slate-100 rounded-lg transition-colors">
                        <Trash2 size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AudioRecorder;
