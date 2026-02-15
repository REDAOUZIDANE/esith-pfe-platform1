import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            setMessage(res.data.message);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f3f2f0]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#004b87] rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9fdf00] rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full bg-white p-10 rounded-xl relative z-10 border border-[#e0e0e0] shadow-sm animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="WladEsith" className="h-16 w-auto mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-[#191919]">Reset Password</h2>
                    <p className="mt-1 text-sm text-[#666666]">Enter your email to receive a reset link</p>
                </div>

                {message && <div className="bg-green-50 border border-green-200 p-3 text-green-600 text-xs font-bold rounded-lg mb-6">{message}</div>}
                {error && <div className="bg-red-50 border border-red-200 p-3 text-red-600 text-xs font-bold rounded-lg mb-6">{error}</div>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="group">
                        <label className="block text-xs font-semibold text-[#666666] mb-1 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-[#666666] rounded px-3 py-2 text-[#191919] focus:outline-none focus:border-[#004b87] focus:ring-1 focus:ring-[#004b87] transition-all"
                            placeholder="Email"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004b87] text-white py-3 rounded-full font-bold hover:bg-[#003662] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Send Reset Link'}
                    </button>

                    <div className="text-center pt-2">
                        <Link to="/login" className="text-sm font-semibold text-[#004b87] hover:underline">
                            Back to sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
