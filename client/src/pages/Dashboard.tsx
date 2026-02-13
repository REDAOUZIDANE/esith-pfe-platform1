import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Building2, Users, MessageSquare, Plus, ArrowRight, LayoutDashboard } from 'lucide-react';
import { API_URL } from '../config';

const Dashboard = () => {
    const [stats, setStats] = useState({
        pfes: 0,
        companies: 0,
        alumni: 0,
        recentPfes: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pfeRes, companyRes, alumniRes] = await Promise.all([
                    axios.get(`${API_URL}/pfes`),
                    axios.get(`${API_URL}/companies`),
                    axios.get(`${API_URL}/alumni`)
                ]);
                setStats({
                    pfes: pfeRes.data.length,
                    companies: companyRes.data.length,
                    alumni: alumniRes.data.length,
                    recentPfes: pfeRes.data.slice(0, 5)
                });
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { name: 'PFE Repository', value: stats.pfes, icon: BookOpen, color: 'from-blue-600 to-indigo-600', path: '/pfes' },
        { name: 'Partner Companies', value: stats.companies, icon: Building2, color: 'from-emerald-600 to-teal-600', path: '/companies' },
        { name: 'Alumni Network', value: stats.alumni, icon: Users, color: 'from-orange-600 to-amber-600', path: '/alumni' },
        { name: 'Active Chats', value: '24', icon: MessageSquare, color: 'from-purple-600 to-pink-600', path: '/chat' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#e0e0e0] rounded-xl p-6 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-[#191919]">Campus Overview</h1>
                    <p className="text-sm text-[#666666] mt-1">Welcome to the ESITH Academic & Professional Hub.</p>
                </div>
                <div>
                    <Link to="/pfes/new" className="bg-[#004b87] text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-[#003662] transition-all flex items-center group">
                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" /> Submit PFE
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <Link key={i} to={card.path} className="bg-white border border-[#e0e0e0] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                        <div className="flex items-center justify-between mb-2">
                            <div className="h-10 w-10 bg-[#f3f2f0] text-[#004b87] rounded-lg flex items-center justify-center group-hover:bg-[#004b87] group-hover:text-white transition-colors">
                                <card.icon className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#9fdf00]/10 text-[#057642] border border-[#9fdf00]/20 uppercase">Live</span>
                        </div>
                        <h3 className="text-[#666666] font-bold text-xs uppercase tracking-tight">{card.name}</h3>
                        <p className="text-2xl font-bold text-[#191919] mt-1">{card.value}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent PFEs */}
                <div className="lg:col-span-2 bg-white border border-[#e0e0e0] rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-[#f3f2f0] flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <LayoutDashboard className="h-5 w-5 text-[#004b87]" />
                            <h2 className="text-lg font-bold text-[#191919]">Recent Deliverables</h2>
                        </div>
                        <Link to="/pfes" className="text-[#004b87] text-sm font-bold hover:underline flex items-center">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
                    </div>
                    <div className="divide-y divide-[#f3f2f0]">
                        {stats.recentPfes.length > 0 ? stats.recentPfes.map((pfe: any, i) => (
                            <div key={i} className="px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-[#eef3f8] text-[#004b87] rounded-lg flex items-center justify-center font-bold text-sm">
                                        {pfe.major?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#191919] line-clamp-1 text-sm">{pfe.title}</h4>
                                        <p className="text-[10px] text-[#666666] font-medium uppercase mt-0.5">{pfe.academicYear} • {pfe.studentNames}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-bold text-[#004b87] bg-[#004b87]/5 px-2 py-0.5 rounded-full uppercase">{pfe.major}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-10 text-center text-[#666666] text-sm italic">No recent projects found.</div>
                        )}
                    </div>
                </div>

                {/* Side Content */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[#004b87] to-[#003662] text-white shadow-md relative overflow-hidden group">
                        <h2 className="text-xl font-bold mb-2">CampusLink Connect</h2>
                        <p className="text-white/80 text-xs leading-relaxed mb-4">
                            Expand your professional network and discover opportunities within the ESITH ecosystem.
                        </p>
                        <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all">
                            Explore Network
                        </button>
                    </div>

                    <div className="bg-white border border-[#e0e0e0] p-6 rounded-xl shadow-sm">
                        <h2 className="text-sm font-bold text-[#191919] mb-4 flex items-center">
                            <Plus className="mr-2 h-4 w-4 text-[#004b87]" /> Fast Access
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            {['Profile', 'Chat', 'Settings', 'Archive'].map((link) => (
                                <button key={link} className="p-2 text-[10px] font-bold text-[#666666] bg-[#f3f2f0] rounded-lg hover:bg-[#004b87] hover:text-white transition-all text-center uppercase tracking-tight">
                                    {link}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
