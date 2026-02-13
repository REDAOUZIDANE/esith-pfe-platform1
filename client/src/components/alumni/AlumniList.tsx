import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Building2, Linkedin, Mail, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const AlumniList = () => {
    const navigate = useNavigate();
    const [alumni, setAlumni] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        const fetchAlumni = async () => {
            const res = await axios.get(`${API_URL}/alumni`);
            setAlumni(res.data);
        };
        fetchAlumni();
    }, []);

    const filtered = alumni.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.major.toLowerCase().includes(search.toLowerCase()) ||
        a.currentCompany?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#191919]">Alumni Network</h1>
                        <p className="text-sm text-[#666666] mt-1">ESITH Global Professional Ecosystem & Talent Hub</p>
                    </div>
                    <div className="flex items-center gap-4 max-w-sm w-full">
                        <div className="relative group flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
                            <input
                                type="text"
                                placeholder="Search alumni or companies"
                                className="w-full bg-[#eef3f8] border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {user?.role === 'ADMIN' && (
                            <button
                                onClick={() => navigate('/alumni/new')}
                                className="bg-[#004b87] text-white p-2 rounded-lg hover:bg-[#003662] transition-colors shadow-sm flex items-center justify-center whitespace-nowrap px-4"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                <span className="text-sm font-bold">New</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((person) => (
                    <div key={person.id} className="bg-white border border-[#e0e0e0] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center group">
                        <div className="relative mb-4">
                            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center text-[#666666] font-bold text-2xl border-4 border-white shadow-sm ring-1 ring-[#e0e0e0]">
                                {person.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-[#004b87] px-2 py-0.5 rounded-full border border-white shadow-sm">
                                <span className="text-[10px] font-bold text-white leading-none">'{person.graduationYear.toString().slice(-2)}</span>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-[#191919] hover:text-[#004b87] hover:underline cursor-pointer transition-colors leading-tight">
                            {person.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-[#666666] mt-1">{person.major}</p>

                        <div className="w-full my-4 py-3 border-y border-[#f3f2f0]">
                            <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-[#191919]">
                                <Building2 className="h-3.5 w-3.5 text-[#666666]" />
                                <span className="truncate">{person.currentCompany || 'Independent'}</span>
                            </div>
                        </div>

                        <div className="flex space-x-2 w-full mt-auto">
                            <a
                                href={person.linkedIn ? (person.linkedIn.startsWith('http') ? person.linkedIn : `https://${person.linkedIn}`) : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex-1 py-1.5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${person.linkedIn
                                    ? 'bg-[#004b87] text-white hover:bg-[#003662]'
                                    : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Linkedin className="h-3.5 w-3.5 mr-1" />
                                <span>Profile</span>
                            </a>
                            <a
                                href={`mailto:${person.email}`}
                                className="flex-1 bg-white border border-[#e0e0e0] text-[#666666] py-1.5 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all text-xs font-bold"
                            >
                                <Mail className="h-3.5 w-3.5 mr-1" />
                                <span>Message</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-20 bg-white border border-[#e0e0e0] rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-[#191919]">No alumni found</h3>
                    <p className="text-sm text-[#666666] mt-2">Try adjusting your search terms</p>
                </div>
            )}
        </div>
    );
};

export default AlumniList;
