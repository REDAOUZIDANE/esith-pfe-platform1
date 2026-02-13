import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

const PFECreate = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        academicYear: '2023-2024',
        major: 'Genie Informatique',
        studentNames: '',
        companyId: ''
    });
    const [report, setReport] = useState<File | null>(null);
    const [presentation, setPresentation] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            const res = await axios.get(`${API_URL}/companies`);
            setCompanies(res.data);
        };
        fetchCompanies();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'report' | 'presentation') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'report') setReport(e.target.files[0]);
            else setPresentation(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, (formData as any)[key]));
        if (report) data.append('report', report);
        if (presentation) data.append('presentation', presentation);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/pfes`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/pfes');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create PFE. Make sure you are logged in as Admin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="mb-8 p-6 bg-white border border-[#e0e0e0] rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold text-[#191919]">Submit Project</h1>
                <p className="text-sm text-[#666666] mt-1">Archiving the next wave of ESITH innovation.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 p-4 text-red-700 text-sm rounded-xl">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white border border-[#e0e0e0] rounded-xl p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#666666]">Project Title *</label>
                        <input
                            name="title"
                            required
                            onChange={handleChange}
                            className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                            placeholder="e.g. AI-Driven Textile Optimization"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#666666]">Students (Full Names) *</label>
                        <input
                            name="studentNames"
                            required
                            onChange={handleChange}
                            className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                            placeholder="e.g. Reda S., Amina B."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#666666]">Major / Field *</label>
                        <select
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                        >
                            <option>Genie Informatique</option>
                            <option>Genie Industriel</option>
                            <option>Genie Textile</option>
                            <option>Management</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#666666]">Academic Year *</label>
                        <input
                            name="academicYear"
                            defaultValue="2023-2024"
                            onChange={handleChange}
                            className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-[#666666]">Abstract / Description *</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            onChange={handleChange}
                            className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all resize-none"
                            placeholder="Briefly describe the project goals and outcomes..."
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-bold text-[#666666]">Host Company</label>
                        <select
                            name="companyId"
                            onChange={handleChange}
                            className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                        >
                            <option value="">Select Company (Optional)</option>
                            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#666666]">Project Report (PDF)</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="report"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => handleFileChange(e, 'report')}
                            />
                            <label
                                htmlFor="report"
                                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-[#e0e0e0] rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-sm font-semibold text-[#666666]"
                            >
                                {report ? report.name : 'Upload Report PDF'}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#666666]">Presentation (PPTX)</label>
                        <div className="relative">
                            <input
                                type="file"
                                id="presentation"
                                className="hidden"
                                accept=".ppt,.pptx"
                                onChange={(e) => handleFileChange(e, 'presentation')}
                            />
                            <label
                                htmlFor="presentation"
                                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-[#e0e0e0] rounded-xl cursor-pointer hover:bg-slate-50 transition-all text-sm font-semibold text-[#666666]"
                            >
                                {presentation ? presentation.name : 'Upload Presentation'}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-between items-center border-t border-[#f3f2f0]">
                    <button
                        type="button"
                        onClick={() => navigate('/pfes')}
                        className="text-sm font-semibold text-[#666666] hover:text-[#191919] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-[#004b87] text-white px-8 py-2 rounded-full text-sm font-bold shadow-sm transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#003662]'}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PFECreate;
