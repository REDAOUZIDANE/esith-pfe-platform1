import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Building2, MapPin, Mail, ExternalLink, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const CompanyList = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        const fetchCompanies = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/companies`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompanies(res.data);
        };
        fetchCompanies();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to remove this partner from the network?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/companies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompanies(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error removing partner');
        }
    };

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.sector.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#191919]">Partner Network</h1>
                        <p className="text-sm text-[#666666] mt-1">ESITH Industrial Ecosystem & Corporate Collaborators</p>
                    </div>
                    <div className="flex items-center gap-4 max-w-sm w-full">
                        <div className="relative group flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
                            <input
                                type="text"
                                placeholder="Search partners"
                                className="bg-[#eef3f8] border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all w-full"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {user?.role === 'ADMIN' && (
                            <button
                                onClick={() => navigate('/companies/new')}
                                className="bg-[#004b87] text-white p-2 rounded-lg hover:bg-[#003662] transition-colors shadow-sm flex items-center justify-center whitespace-nowrap px-4"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                <span className="text-sm font-bold">New</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((company) => (
                    <div key={company.id} className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                        <div className="h-20 bg-slate-100 flex items-center justify-center border-b border-[#f3f2f0]">
                            <Building2 className="h-10 w-10 text-slate-400" />
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-[#191919] hover:text-[#004b87] hover:underline cursor-pointer transition-colors">{company.name}</h3>
                                <p className="text-xs font-semibold text-[#666666] mt-1">{company.sector}</p>
                            </div>

                            <div className="space-y-3 flex-1">
                                <div className="flex items-center space-x-2 text-sm text-[#666666]">
                                    <MapPin className="h-4 w-4" />
                                    <span>{company.city}</span>
                                </div>
                                {company.email && (
                                    <div className="flex items-center space-x-2 text-sm text-[#666666] truncate">
                                        <Mail className="h-4 w-4" />
                                        <span>{company.email}</span>
                                    </div>
                                )}
                                {company.website && (
                                    <div className="flex items-center space-x-2 text-sm text-[#004b87] font-medium">
                                        <ExternalLink className="h-4 w-4" />
                                        <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-[#f3f2f0] flex justify-between items-center">
                                <div className="text-xs font-bold text-[#666666]">
                                    {company.pfes?.length || 0} Projects
                                </div>
                                <div className="flex space-x-2">
                                    {user?.role === 'ADMIN' && (
                                        <button
                                            onClick={() => handleDelete(company.id)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-xs font-bold"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    <button className="text-[#004b87] hover:bg-slate-50 border border-[#004b87] px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 bg-white border border-[#e0e0e0] rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-[#191919]">No partners found</h3>
                    <p className="text-sm text-[#666666] mt-2">Try adjusting your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default CompanyList;
