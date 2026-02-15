import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/login`, formData);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f3f2f0]">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#004b87] rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9fdf00] rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full bg-white p-10 rounded-xl relative z-10 border border-[#e0e0e0] shadow-sm animate-in fade-in zoom-in duration-700">
                <div className="text-center mb-8">
                    <div className="relative inline-block group">
                        <img src="/logo.png" alt="ESITH" className="h-24 w-auto mx-auto relative z-10" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-[#191919]">Portail Carrière</h2>
                    <p className="mt-1 text-sm text-[#666666]">Connectez-vous à l'excellence ESITH</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 p-3 text-red-600 text-xs font-bold rounded-lg mb-6 flex items-center">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-xs font-semibold text-[#666666] mb-1 ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                onChange={handleChange}
                                className="w-full bg-white border border-[#666666] rounded px-3 py-2 text-[#191919] focus:outline-none focus:border-[#004b87] focus:ring-1 focus:ring-[#004b87] transition-all placeholder-[#b0b0b0]"
                                placeholder="Email"
                            />
                        </div>
                        <div className="group relative">
                            <label className="block text-xs font-semibold text-[#666666] mb-1 ml-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
                                className="w-full bg-white border border-[#666666] rounded px-3 py-2 text-[#191919] focus:outline-none focus:border-[#004b87] focus:ring-1 focus:ring-[#004b87] transition-all placeholder-[#b0b0b0]"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Link to="/forgot-password" className="text-sm font-semibold text-[#004b87] hover:underline">Forgot password?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004b87] text-white py-3 rounded-full font-bold hover:bg-[#003662] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e0e0e0]"></div></div>
                        <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-[#666666]">or</span></div>
                    </div>

                    <div className="text-center">
                        <Link to="/register" className="w-full inline-block border border-[#004b87] text-[#004b87] py-2 rounded-full font-bold hover:bg-slate-50 transition-colors">
                            Join now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
