import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, BookOpen, Building2, FileText, Presentation, Plus, Trash2 } from 'lucide-react';
import { API_URL, BASE_URL } from '../../config';

const PFEList = () => {
    const [pfes, setPfes] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        const fetchPFEs = async () => {
            const res = await axios.get(`${API_URL}/pfes`);
            setPfes(res.data);
        };
        fetchPFEs();
    }, []);

    const filteredPFEs = pfes.filter(pfe =>
        (pfe.title.toLowerCase().includes(search.toLowerCase()) ||
            pfe.studentNames.toLowerCase().includes(search.toLowerCase())) &&
        (filter === 'All' || pfe.major.includes(filter))
    );

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/pfes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPfes(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete project');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="bg-white border border-[#e0e0e0] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#191919]">Project Hub</h1>
                        <p className="text-sm text-[#666666] mt-1">ESITH Academic Repository & Professional Innovations</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative group max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
                            <input
                                type="text"
                                placeholder="Search projects or students"
                                className="bg-[#eef3f8] border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all w-64"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" />
                            <select
                                className="bg-[#eef3f8] border border-transparent rounded-lg pl-10 pr-8 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] appearance-none"
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="All">All Majors</option>
                                <option>Ingénieur Industriel</option>
                                <option>Ingénieur IMS</option>
                                <option>Textile</option>
                                <option>Chimie</option>
                                <option>Génie Informatique</option>
                            </select>
                        </div>
                        <button
                            onClick={() => window.location.href = '/pfes/new'}
                            className="bg-[#004b87] text-white p-2 rounded-lg hover:bg-[#003662] transition-colors shadow-sm flex items-center justify-center whitespace-nowrap px-4"
                        >
                            <Plus size={16} className="mr-1" />
                            <span className="text-sm font-bold">New Project</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPFEs.map((pfe) => (
                    <div key={pfe.id} className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group">
                        <div className="h-32 bg-slate-50 p-6 flex flex-col justify-between border-b border-[#f3f2f0] relative">
                            <div className="flex justify-between items-start">
                                <span className="bg-white border border-[#e0e0e0] px-2 py-0.5 rounded text-[10px] font-bold text-[#666666]">
                                    {pfe.academicYear}
                                </span>
                                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-[#666666] border border-[#e0e0e0] group-hover:text-[#004b87] group-hover:border-[#004b87] transition-colors">
                                    <BookOpen className="h-4 w-4" />
                                </div>
                            </div>
                            <h3 className="text-sm font-bold text-[#191919] line-clamp-2 leading-snug group-hover:text-[#004b87] transition-colors">
                                {pfe.title}
                            </h3>
                            {user?.role === 'ADMIN' && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(pfe.id); }}
                                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[#666666] font-bold text-xs ring-2 ring-white">
                                    {pfe.studentNames.charAt(0)}
                                </div>
                                <p className="text-xs font-semibold text-[#191919]">{pfe.studentNames}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="text-[10px] font-bold text-[#004b87] bg-[#004b87]/5 px-2 py-0.5 rounded-full">
                                    {pfe.major}
                                </span>
                                {pfe.company && (
                                    <span className="text-[10px] font-bold text-[#057642] bg-[#057642]/5 px-2 py-0.5 rounded-full flex items-center">
                                        <Building2 className="h-3 w-3 mr-1" /> {pfe.company.name}
                                    </span>
                                )}
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-3 mt-auto border-t border-[#f3f2f0]">
                                <a
                                    href={`${BASE_URL}${pfe.reportUrl}`}
                                    target="_blank"
                                    className={`flex items-center justify-center space-x-2 py-1.5 rounded-full text-xs font-bold transition-all ${pfe.reportUrl
                                        ? 'bg-white border border-[#004b87] text-[#004b87] hover:bg-slate-50'
                                        : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>Report</span>
                                </a>
                                <a
                                    href={`${BASE_URL}${pfe.presentationUrl}`}
                                    target="_blank"
                                    className={`flex items-center justify-center space-x-2 py-1.5 rounded-full text-xs font-bold transition-all ${pfe.presentationUrl
                                        ? 'bg-[#004b87] text-white hover:bg-[#003662]'
                                        : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Presentation className="h-3.5 w-3.5" />
                                    <span>Brief</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPFEs.length === 0 && (
                <div className="text-center py-20 bg-white border border-[#e0e0e0] rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-[#191919]">No projects found</h3>
                    <p className="text-sm text-[#666666] mt-2">Try adjusting your filters or search terms</p>
                </div>
            )}
        </div>
    );
};

export default PFEList;
