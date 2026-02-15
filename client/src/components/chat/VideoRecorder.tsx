import { useState, useRef, useEffect } from 'react';
import { Camera, Square, Send, X } from 'lucide-react';

interface VideoRecorderProps {
    onStop: (blob: Blob) => void;
    onCancel: () => void;
}

const VideoRecorder = ({ onStop, onCancel }: VideoRecorderProps) => {
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(s);
            if (videoRef.current) {
                videoRef.current.srcObject = s;
            }
        } catch (err) {
            console.error('Camera access denied:', err);
            onCancel();
        }
    };

    const startRecording = () => {
        if (!stream) return;

        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setVideoBlob(blob);
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSend = () => {
        if (videoBlob) {
            onStop(videoBlob);
            closeCamera();
        }
    };

    const closeCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        onCancel();
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full relative">
                <button onClick={closeCamera} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all z-10">
                    <X size={20} />
                </button>

                <div className="aspect-video bg-slate-900 relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted={!videoBlob}
                        playsInline
                        src={videoBlob ? URL.createObjectURL(videoBlob) : undefined}
                        controls={!!videoBlob}
                        className="w-full h-full object-cover"
                    />

                    {!videoBlob && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-all"
                                >
                                    <Camera size={18} />
                                    <span>Record</span>
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="flex items-center space-x-2 bg-white text-red-600 px-6 py-2.5 rounded-full font-bold shadow-lg transition-all animate-pulse"
                                >
                                    <Square size={18} />
                                    <span>Stop</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {videoBlob && (
                    <div className="p-4 bg-white flex justify-between items-center">
                        <button onClick={() => setVideoBlob(null)} className="text-[#666666] font-bold text-sm hover:underline">
                            Retake
                        </button>
                        <button
                            onClick={handleSend}
                            className="bg-[#004b87] text-white px-8 py-2 rounded-full font-bold hover:bg-[#003662] transition-all shadow-md flex items-center space-x-2"
                        >
                            <Send size={18} />
                            <span>Send Video</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoRecorder;
