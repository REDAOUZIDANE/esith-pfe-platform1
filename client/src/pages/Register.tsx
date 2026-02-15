import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        major: 'Génie Industriel'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!formData.email.trim().toLowerCase().endsWith('@esith.net')) {
            setError('Only @esith.net email addresses are allowed.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/register`, formData);

            // Auto login after registration or redirect to login
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center p-10 glass rounded-3xl border border-white/5 shadow-2xl">
                    <div className="h-16 w-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 font-black">
                        OK
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Welcome Aboard</h2>
                    <p className="text-slate-400 mb-6 font-medium">Your account has been initialized. Redirecting to dashboard...</p>
                    <Link to="/" className="text-indigo-400 font-bold hover:underline uppercase tracking-widest text-xs">Go to Terminal</Link>
                </div>
            </div>
        );
    }

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
                    <h2 className="mt-6 text-2xl font-bold text-[#191919]">Plateforme PFE & Entreprises</h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 p-3 text-red-600 text-xs font-bold rounded-lg mb-6 flex items-center">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-xs font-semibold text-[#666666] mb-1 ml-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                onChange={handleChange}
                                className="w-full bg-white border border-[#666666] rounded px-3 py-2 text-[#191919] focus:outline-none focus:border-[#004b87] focus:ring-1 focus:ring-[#004b87] transition-all"
                                placeholder="Full Name"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold text-[#666666] mb-1 ml-1">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                onChange={handleChange}
                                className="w-full bg-white border border-[#666666] rounded px-3 py-2 text-[#191919] focus:outline-none focus:border-[#004b87] focus:ring-1 focus:ring-[#004b87] transition-all"
                                placeholder="Email"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold text-[#666666] mb-1 ml-1">Major</label>
                            <select
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                className="w-full bg-white border border-[#666666] rounded px-3 py-2 text-[#191919] focus:outline-none focus:border-[#004b87] focus:ring-1 focus:ring-[#004b87] transition-all"
                            >
                                <option value="Génie Industriel">Génie Industriel</option>
                                <option value="Génie Informatique">Génie Informatique</option>
                                <option value="Génie IMS">Génie IMS</option>
                                <option value="Génie Textile">Génie Textile</option>
                                <option value="Génie Chimie">Génie Chimie</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-semibold text-[#666666] mb-1 ml-1">Password (6 or more characters)</label>
                            <input
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
                                className="w-full bg-white border border-[#666666] rounded px-3 py-2 text-[#191919] focus:outline-none focus:border-[#004b87] focus:ring-1 focus:ring-[#004b87] transition-all"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-[#666666] text-center px-4">
                        By clicking Agree & Join, you agree to the LinkedIn <span className="text-[#004b87] font-bold">User Agreement</span>, <span className="text-[#004b87] font-bold">Privacy Policy</span>, and <span className="text-[#004b87] font-bold">Cookie Policy</span>.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#004b87] text-white py-3 rounded-full font-bold hover:bg-[#003662] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Agree & Join'}
                    </button>

                    <div className="text-center pt-2">
                        <Link to="/login" className="text-sm font-semibold text-[#666666] hover:text-[#004b87] transition-colors">
                            Already on LinkedIn? <span className="text-[#004b87] font-bold">Sign in</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
