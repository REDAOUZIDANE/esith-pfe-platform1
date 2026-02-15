import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Shield, User as UserIcon, AlertCircle, Search } from 'lucide-react';
import { API_URL } from '../../config';

const UserList = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/auth/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePromote = async (userId: number) => {
        if (!window.confirm('Are you sure you want to promote this user to Admin?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/auth/users/${userId}/role`, { role: 'ADMIN' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert('Failed to promote user');
        }
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004b87]"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-slate-900 rounded-lg text-white">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#191919]">Admin Management</h1>
                            <p className="text-sm text-[#666666]">Track and manage platform users</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#f3f2f0] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#004b87] transition-all"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center space-x-3 text-red-700">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            <div className="bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-[#e0e0e0]">
                                <th className="px-6 py-4 text-[10px] font-bold text-[#666666] uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#666666] uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-[#666666] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f3f2f0]">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#191919] overflow-hidden">
                                                {user.profileImage ? (
                                                    <img src={`http://localhost:3000${user.profileImage}`} className="h-full w-full object-cover" alt="" />
                                                ) : (
                                                    <UserIcon size={20} className="text-[#666666]" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#191919]">{user.name}</p>
                                                <p className="text-xs text-[#666666]">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#191919]">
                                        {user.major || 'Not specified'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.role === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-[#9fdf00]/20 text-[#057642]'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-[#666666]">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            {user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handlePromote(user.id)}
                                                    className="p-2 text-[#004b87] hover:bg-slate-50 rounded-lg transition-colors"
                                                    title="Promote to Admin"
                                                >
                                                    <Shield size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                disabled={user.role === 'ADMIN'}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
