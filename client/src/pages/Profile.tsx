import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, GraduationCap, Camera, Lock, Check, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState('');
    const [major, setMajor] = useState('');
    const [about, setAbout] = useState('');
    const [skills, setSkills] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    const MAJORS = [
        "Ingénieur Industriel",
        "Ingénieur IMS",
        "Textile",
        "Chimie",
        "Génie Informatique"
    ];

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setName(parsed.name || '');
            setMajor(parsed.major || '');
            setAbout(parsed.about || '');
            setSkills(parsed.skills || '');
            setImagePreview(parsed.profileImage ? `http://localhost:3000${parsed.profileImage}` : '');
        }
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('major', major);
        formData.append('about', about);
        formData.append('skills', skills);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/auth/profile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Profile updated successfully!');
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            if (res.data.user.profileImage) {
                setImagePreview(`http://localhost:3000${res.data.user.profileImage}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return setError('Passwords do not match');

        setLoading(true);
        setSuccess('');
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/auth/change-password`, {
                currentPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    if (!user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-white border border-[#e0e0e0] rounded-2xl shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-[#004b87] to-[#003662]"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6 flex items-end space-x-6">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-2xl bg-white p-1 shadow-lg overflow-hidden border-2 border-white">
                                {imagePreview ? (
                                    <img src={imagePreview} className="h-full w-full object-cover rounded-xl" alt="Profile" />
                                ) : (
                                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-[#004b87]">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-2 right-2 p-2 bg-white rounded-lg shadow-md border border-[#e0e0e0] cursor-pointer hover:bg-slate-50 transition-colors">
                                <Camera size={16} className="text-[#004b87]" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <div className="pb-2">
                            <h1 className="text-2xl font-bold text-[#191919]">{user.name}</h1>
                            <p className="text-[#666666] flex items-center text-sm">
                                <Mail size={14} className="mr-1.5" /> {user.email}
                            </p>
                        </div>
                    </div>

                    {(success || error) && (
                        <div className={`p-4 rounded-xl flex items-center space-x-3 mb-6 ${success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {success ? <Check size={18} /> : <AlertCircle size={18} />}
                            <p className="text-sm font-bold">{success || error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Profile Details */}
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <h2 className="text-lg font-bold text-[#191919] flex items-center">
                                <User className="mr-2 h-5 w-5 text-[#004b87]" /> Basic Information
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#666666] uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#f3f2f0] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#004b87] transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#666666] uppercase tracking-wider">Major / Department</label>
                                    <div className="relative">
                                        <select
                                            value={major}
                                            onChange={(e) => setMajor(e.target.value)}
                                            className="w-full bg-[#f3f2f0] border-none rounded-lg pl-10 pr-3 py-3 text-sm focus:ring-2 focus:ring-[#004b87] transition-all appearance-none"
                                        >
                                            <option value="">Select Major</option>
                                            {MAJORS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] h-4 w-4" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#666666] uppercase tracking-wider">About Me</label>
                                    <textarea
                                        value={about}
                                        onChange={(e) => setAbout(e.target.value)}
                                        rows={3}
                                        placeholder="Briefly describe your professional background..."
                                        className="w-full bg-[#f3f2f0] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#004b87] transition-all resize-none"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#666666] uppercase tracking-wider">Skills (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        placeholder="React, Node.js, Project Management..."
                                        className="w-full bg-[#f3f2f0] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#004b87] transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#004b87] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#003662] transition-all disabled:opacity-50 shadow-md"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>

                        {/* Security */}
                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <h2 className="text-lg font-bold text-[#191919] flex items-center">
                                <Lock className="mr-2 h-5 w-5 text-[#004b87]" /> Change Password
                            </h2>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#666666] uppercase tracking-wider">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-[#f3f2f0] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#004b87] transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#666666] uppercase tracking-wider">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-[#f3f2f0] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#004b87] transition-all"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#666666] uppercase tracking-wider">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-[#f3f2f0] border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#004b87] transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all disabled:opacity-50 shadow-md"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default Profile;
