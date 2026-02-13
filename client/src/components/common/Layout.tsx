import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Building2,
    Users,
    MessageSquare,
    LogOut,
    Search,
    Bell
} from 'lucide-react';

import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<any>(null);
    const [onlineCount, setOnlineCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                const parsed = JSON.parse(userData);
                setUser(parsed);
                socket.emit('authenticate', parsed.id);
            } else {
                setUser(null);
                if (location.pathname !== '/login' && location.pathname !== '/register') {
                    navigate('/login');
                }
            }
        };

        checkAuth();

        socket.on('online_users', (users) => {
            setOnlineCount(users.length);
        });

        socket.on('new_pfe', (pfe) => {
            setNotifications(prev => [{ type: 'PFE', title: pfe.title, id: Date.now() }, ...prev]);
        });

        socket.on('new_company', (company) => {
            setNotifications(prev => [{ type: 'Company', title: company.name, id: Date.now() }, ...prev]);
        });

        window.addEventListener('storage', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            socket.off('online_users');
            socket.off('new_pfe');
            socket.off('new_company');
        };
    }, [navigate, location.pathname]);

    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/pfes', label: 'PFE Hub', icon: BookOpen },
        { path: '/companies', label: 'Partners', icon: Building2 },
        { path: '/alumni', label: 'Network', icon: Users },
        { path: '/chat', label: 'Campus Live', icon: MessageSquare },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#f3f2f0] flex-col overflow-hidden text-[#191919]">
            <div className="flex flex-1 overflow-hidden relative">
                {/* Simplified Sidebar */}
                <aside className="w-64 bg-white border-r border-[#e0e0e0] flex flex-col shadow-sm z-30 relative">
                    <div className="p-6 flex flex-col items-center border-b border-[#f3f2f0]">
                        <div className="w-12 h-12 bg-[#004b87] rounded-lg flex items-center justify-center shadow-md overflow-hidden mb-3">
                            <span className="text-xl font-black text-white">E</span>
                        </div>
                        <h1 className="text-lg font-bold text-[#191919] tracking-tight">
                            Campus<span className="text-[#004b87]">Link</span>
                        </h1>
                        <div className="mt-3 flex items-center space-x-2 px-3 py-1 bg-[#9fdf00]/10 rounded-full border border-[#9fdf00]/20">
                            <div className="w-1.5 h-1.5 bg-[#057642] rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-[#057642] uppercase tracking-wider">{onlineCount} connected</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-slate-50 text-[#004b87] border-l-4 border-[#004b87]'
                                        : 'text-[#666666] hover:bg-[#f3f2f0] hover:text-[#191919]'
                                    }`
                                }
                            >
                                <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-[#004b87]' : 'text-[#666666]'}`} />
                                <span className={`text-sm font-semibold ${location.pathname === item.path ? 'text-[#191919]' : ''}`}>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-[#f3f2f0]">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#666666] hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                    <header className="h-16 bg-white border-b border-[#e0e0e0] flex items-center justify-between px-8 relative z-20 shadow-sm">
                        <div className="flex-1 flex items-center bg-[#eef3f8] border border-transparent rounded-lg px-4 py-1.5 max-w-md group focus-within:bg-white focus-within:border-[#004b87] transition-all">
                            <Search className="h-4 w-4 text-[#666666]" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent border-none outline-none text-sm text-[#191919] w-full ml-3 placeholder-[#666666]"
                            />
                        </div>

                        <div className="flex items-center space-x-8 ml-6">
                            <div className="relative">
                                <button className="relative text-[#666666] hover:text-[#191919] transition-colors flex flex-col items-center">
                                    <Bell className="h-6 w-6" />
                                    <span className="text-[10px] mt-0.5 hidden sm:block">Notifications</span>
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {notifications.length > 0 && (
                                    <div className="absolute right-0 mt-4 w-72 bg-white border border-[#e0e0e0] rounded-xl shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-sm font-bold text-[#191919]">Notifications</h4>
                                            <button
                                                onClick={() => setNotifications([])}
                                                className="text-xs font-bold text-[#004b87] hover:underline"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                            {notifications.map(n => (
                                                <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-[#f3f2f0] hover:bg-slate-100 transition-colors">
                                                    <p className="text-xs font-bold text-[#191919]">New {n.type} Signal</p>
                                                    <p className="text-xs text-[#666666] truncate mt-1">{n.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {user && (
                                <div className="flex items-center pl-6 border-l border-[#e0e0e0]">
                                    <div className="flex flex-col items-center cursor-pointer group">
                                        <div className="h-8 w-8 rounded-full bg-[#004b87] flex items-center justify-center text-white font-bold text-xs ring-2 ring-white group-hover:ring-[#004b87]/20 transition-all">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="hidden sm:flex items-center mt-0.5 space-x-1">
                                            <span className="text-[10px] font-bold text-[#666666]">Me</span>
                                            <span className="text-[8px] text-[#666666]">▼</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto custom-scrollbar">
                        <div className="max-w-6xl mx-auto py-8 px-6">
                            {children}
                        </div>

                        <footer className="py-8 px-6 border-t border-[#e0e0e0] bg-white text-[#666666]">
                            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold text-[#004b87]">ESITH</span>
                                    <span>© {new Date().getFullYear()} CampusLink</span>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center space-x-4 font-medium">
                                    <a href="#" className="hover:text-[#004b87] hover:underline">About</a>
                                    <a href="#" className="hover:text-[#004b87] hover:underline">Accessibility</a>
                                    <a href="#" className="hover:text-[#004b87] hover:underline">Help Center</a>
                                    <a href="#" className="hover:text-[#004b87] hover:underline">Privacy & Terms</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
