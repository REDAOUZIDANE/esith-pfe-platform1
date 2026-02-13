import React, { useState } from 'react';
import { createCompany } from '../../services/company.service';
import { useNavigate } from 'react-router-dom';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        email: '',
        phone: '',
        city: '',
        website: '',
        contactPerson: '',
        history: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCompany(formData);
            navigate('/companies');
        } catch (error) {
            console.error('Error creating company:', error);
            alert('Failed to create company');
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom duration-500">
            <div className="mb-8 p-6 bg-white border border-[#e0e0e0] rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold text-[#191919]">Add Partner</h1>
                <p className="text-sm text-[#666666] mt-1">Expanding the ESITH Industrial Ecosystem</p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-[#e0e0e0] shadow-sm relative overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#666666]">Company Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. OCP Group"
                                className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#666666]">Industry Sector *</label>
                            <input
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="e.g. Phosphate / Energy"
                                className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#666666]">City *</label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="e.g. Casablanca"
                                className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#666666]">Website</label>
                            <input
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://entity.com"
                                className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#666666]">Contact Person</label>
                            <input
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                placeholder="e.g. John Doe, HR Manager"
                                className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#666666]">Contact Info (Email/Phone)</label>
                            <div className="flex space-x-2">
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@entity.com"
                                    className="flex-1 bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                                />
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+212 ..."
                                    className="flex-1 bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#666666]">Description / Collaboration History</label>
                        <textarea
                            name="history"
                            value={formData.history}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Detail past PFEs or future potential..."
                            className="w-full bg-[#f3f2f0] border border-transparent rounded-lg px-4 py-2 text-sm text-[#191919] focus:outline-none focus:bg-white focus:border-[#004b87] transition-all resize-none"
                        />
                    </div>

                    <div className="pt-6 flex items-center justify-between border-t border-[#f3f2f0]">
                        <button
                            type="button"
                            onClick={() => navigate('/companies')}
                            className="text-sm font-semibold text-[#666666] hover:text-[#191919] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-[#004b87] text-white px-8 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-[#003662] transition-all"
                        >
                            Save Partner
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyCreate;
