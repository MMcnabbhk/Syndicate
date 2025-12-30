
import React, { useState, useEffect, useRef } from 'react';
import { Plus, BarChart2, Book, Settings, Save, Upload, User, Globe, MessageSquare } from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('works');
    const [selectedWork, setSelectedWork] = useState(null);

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Author Dashboard</h1>
                <div className="relative group/new">
                    <button className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-violet-500 transition-colors">
                        <Plus size={18} /> New Work
                    </button>
                    {/* Hover menu for work type selection */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl invisible group-hover/new:visible z-50">
                        {['Novel', 'Poetry Collection', 'Short Fiction', 'Audiobook'].map(type => (
                            <button key={type} className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 last:border-0">
                                Create {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <NavButton active={activeTab === 'works'} onClick={() => setActiveTab('works')} icon={Book} label="My Works" />
                    <NavButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')} icon={BarChart2} label="Financials" />
                    <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={Settings} label="Settings" />
                </div>

                {/* Content */}
                <div className="lg:col-span-3 bg-[#18181b] rounded-xl border border-white/5 p-6 min-h-[500px]">
                    {selectedWork ? (
                        <ManagementView work={selectedWork} onBack={() => setSelectedWork(null)} />
                    ) : (
                        <>
                            {activeTab === 'works' && <WorksTab onManage={(work) => setSelectedWork(work)} />}
                            {activeTab === 'financials' && <FinancialsTab />}
                            {activeTab === 'settings' && <SettingsTab />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);

const WorksTab = ({ onManage }) => {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Novels', 'Poetry', 'Short Fiction', 'Audiobooks'];

    const works = [
        { id: 1, title: "The Chronomancer's Debt", type: "Novel", status: "Published", stats: "Daily | 1,240 subscribers" },
        { id: 2, title: "Midnight Sonnets", type: "Poetry", status: "Scheduled", stats: "Weekly | 450 readers" },
        { id: 3, title: "The Last Echo", type: "Audiobook", status: "Published", stats: "3 chapters | 890 listeners" },
        { id: 4, title: "Coffee & Rain", type: "Short Fiction", status: "Draft", stats: "Not Published" },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Your Published Works</h2>
                <div className="flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filter === cat ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {works.map((work) => (
                    <WorkItem key={work.id} {...work} onManage={() => onManage(work)} />
                ))}
            </div>
        </div>
    );
};

const WorkItem = ({ title, type, status, stats, onManage }) => (
    <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-lg border border-white/5 hover:border-violet-500/20 transition-all group">
        <div className="w-12 h-16 bg-zinc-800 rounded flex items-center justify-center text-zinc-600 shrink-0">
            <Book size={20} className="group-hover:text-violet-400 transition-colors" />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-zinc-400 font-black uppercase tracking-widest border border-white/5">{type}</span>
            </div>
            <p className="text-sm text-zinc-500">{stats}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Published' ? 'text-green-500' :
                    status === 'Scheduled' ? 'text-blue-400' : 'text-zinc-500'
                    }`}>{status}</span>
                <button
                    onClick={onManage}
                    className="text-xs bg-white/5 border border-zinc-700 px-3 py-1 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                    Manage
                </button>
            </div>
            <button className="text-xs border border-zinc-700 px-3 py-1 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors">Edit Content</button>
        </div>
    </div>
);

const ManagementView = ({ work, onBack }) => {
    const [subTab, setSubTab] = useState('schedule');

    return (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <button onClick={onBack} className="text-sm text-zinc-500 hover:text-white mb-6 flex items-center gap-2 transition-colors">
                ← Back to Dashboard
            </button>

            <div className="flex items-center gap-6 mb-8">
                <div className="relative group/cover w-20 h-28 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 border border-white/5 shadow-xl overflow-hidden">
                    {work.cover_image_url ? (
                        <img src={work.cover_image_url} className="w-full h-full object-cover" />
                    ) : (
                        <Book size={32} />
                    )}
                    <button className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity">
                        <Upload size={20} className="text-white" />
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">{work.title}</h2>
                    <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">{work.type} Management • {work.price_monthly > 0 ? `$${work.price_monthly}/mo` : 'Free'}</p>
                </div>
            </div>

            <div className="flex gap-6 border-b border-white/5 mb-8">
                <button
                    onClick={() => setSubTab('schedule')}
                    className={`pb-4 text-sm font-bold transition-all border-b-2 ${subTab === 'schedule' ? 'border-violet-600 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
                >
                    Scheduling
                </button>
                <button
                    onClick={() => setSubTab('syndication')}
                    className={`pb-4 text-sm font-bold transition-all border-b-2 ${subTab === 'syndication' ? 'border-violet-600 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
                >
                    Syndication
                </button>
                <button
                    onClick={() => setSubTab('monetization')}
                    className={`pb-4 text-sm font-bold transition-all border-b-2 ${subTab === 'monetization' ? 'border-violet-600 text-white' : 'border-transparent text-zinc-500 hover:text-white'}`}
                >
                    Monetization
                </button>
            </div>

            {subTab === 'schedule' ? (
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                        <h3 className="font-bold text-white mb-4">Relative Release Schedule</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Release Frequency</label>
                                <select className="w-full bg-zinc-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-violet-600 transition-colors">
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Fortnightly</option>
                                    <option>Custom</option>
                                </select>
                            </div>
                            <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Pace Mode</label>
                                <select className="w-full bg-zinc-800 border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-violet-600 transition-colors">
                                    <option>Standard (Sequential)</option>
                                    <option>Binge (Unlock All)</option>
                                    <option>Hybrid (Unlock Batch)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            ) : subTab === 'syndication' ? (
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                        <h3 className="font-bold text-white mb-4">External Storefronts</h3>
                        <p className="text-sm text-zinc-500 mb-6">Link your work to other platforms to drive discovery and sales.</p>
                        <div className="space-y-3 mb-6">
                            <ExternalLinkItem platform="Amazon" icon="🛍️" />
                            <ExternalLinkItem platform="Patreon" icon="🎨" />
                            <ExternalLinkItem platform="Substack" icon="✍️" />
                        </div>
                        <button className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-2">
                            <Plus size={16} /> Add New Link
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                                <Globe size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Series Subscriptions</h3>
                                <p className="text-sm text-zinc-500 font-medium">Earn recurring revenue from your most loyal readers.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest">Monthly Price</label>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1 group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400 group-focus-within:text-violet-400">$</span>
                                        <input
                                            type="number"
                                            defaultValue={work.price_monthly || 0}
                                            className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-8 pr-4 py-3 text-white focus:border-violet-600 outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div className="text-zinc-500 font-medium">/ month</div>
                                </div>
                                <p className="text-[10px] text-zinc-600 font-bold leading-relaxed">
                                    Recommended: $4.99 - $9.99 for weekly serialized novels.
                                </p>
                            </div>

                            <div className="bg-zinc-950/50 p-5 rounded-xl border border-white/5 flex flex-col justify-center">
                                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Estimated Monthly Revenue</h4>
                                <div className="text-2xl font-black text-white">$2,145.00</div>
                                <div className="text-[10px] text-emerald-500 font-bold mt-1">Based on 450 active subscribers</div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-violet-600/20 flex items-center justify-center gap-2">
                                <Save size={18} /> Update Pricing
                            </button>
                            <button className="px-6 bg-zinc-800 hover:bg-zinc-750 text-white font-bold rounded-xl transition-all border border-white/5">
                                Preview Paywall
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ExternalLinkItem = ({ platform, icon }) => (
    <div className="flex items-center gap-4 bg-zinc-900 p-3 rounded-lg border border-white/5 group">
        <span className="text-xl">{icon}</span>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-white">{platform}</h4>
            <input type="text" placeholder="https://..." className="w-full bg-transparent text-xs text-zinc-500 outline-none border-0 p-0" />
        </div>
        <button className="text-[10px] font-black uppercase text-zinc-600 hover:text-red-500 transition-colors">Remove</button>
    </div>
);

const FinancialsTab = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [payoutStatus, setPayoutStatus] = useState(null);
    const THRESHOLD = 50.00;

    const fetchEarnings = () => {
        setLoading(true);
        // Mocking author ID 1 for now
        fetch('/api/authors/1/earnings')
            .then(res => res.json())
            .then(resData => {
                setData(resData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const handlePayout = async () => {
        if (!data || data.balance < THRESHOLD) return;

        setPayoutStatus('processing');
        try {
            const res = await fetch('/api/authors/1/payout', { method: 'POST' });
            const result = await res.json();
            if (result.success) {
                setPayoutStatus('success');
                fetchEarnings(); // Refresh balance
                setTimeout(() => setPayoutStatus(null), 5000);
            } else {
                setPayoutStatus('error');
            }
        } catch (err) {
            setPayoutStatus('error');
        }
    };

    if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse">Calculating balances...</div>;

    const canPayout = data?.balance >= THRESHOLD;


    return (
        <div className="space-y-10 animate-fade-in">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white">Financial Overview</h2>
                    <p className="text-sm text-zinc-500">Track your contributions and available balance.</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl text-right">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Available Balance</span>
                    <span className="text-3xl font-black text-emerald-500">${data?.balance?.toFixed(2) || "0.00"}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Monthly MRR" value={`$${data?.totalRevenue?.toFixed(2) || "0.00"}`} trend="+12%" />
                <StatCard label="Total Subscribers" value={data?.breakdown?.reduce((acc, curr) => acc + curr.subscribers, 0) || 0} trend="+5%" />
                <StatCard label="Payout Status" value="Processing" trend="NET-30" />
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="font-bold text-white">Earnings by Work</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {data?.breakdown && data.breakdown.length > 0 ? data.breakdown.map((item, idx) => (
                        <div key={idx} className="p-6 flex items-center justify-between hover:bg-white/[0.01] transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 border border-white/5">
                                    <Book size={18} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                    <span className="text-xs text-zinc-500">{item.subscribers} active subscribers</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-white">${item.monthlyRevenue.toFixed(2)}</div>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Monthly Share</span>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-zinc-500 italic">No revenue data available for your works yet.</div>
                    )}
                </div>
            </div>

            <div className={`rounded-2xl border p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${canPayout ? 'bg-violet-600/10 border-violet-500/20' : 'bg-zinc-900/50 border-white/5 opacity-80'}`}>
                <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                        {canPayout ? 'Ready to withdraw?' : `Minimum Threshold: $${THRESHOLD.toFixed(2)}`}
                    </h3>
                    <p className="text-sm text-zinc-400">
                        {canPayout
                            ? 'Withdraw your balance to your connected Stripe account.'
                            : `You need $${(THRESHOLD - data.balance).toFixed(2)} more to request a payout.`}
                    </p>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={handlePayout}
                        disabled={!canPayout || payoutStatus === 'processing'}
                        className={`px-8 py-3 font-black rounded-xl transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${canPayout
                                ? 'bg-white text-black hover:bg-zinc-200 shadow-white/10'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {payoutStatus === 'processing' ? 'Processing...' : 'Request Payout'}
                    </button>
                    {payoutStatus === 'success' && <span className="text-xs text-emerald-500 font-bold animate-fade-in">Request Sent Successfully!</span>}
                    {payoutStatus === 'error' && <span className="text-xs text-red-500 font-bold animate-fade-in">Request Failed. Try again later.</span>}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, trend }) => {
    const isPos = trend.startsWith('+');
    return (
        <div className="bg-zinc-900 p-4 rounded-lg border border-white/5">
            <p className="text-zinc-500 text-sm mb-1">{label}</p>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">{value}</span>
                <span className={`text-sm ${isPos ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
            </div>
        </div>
    );
};

const SettingsTab = () => {
    const [author, setAuthor] = useState({
        name: "Michael Sterling",
        bio: "Explorer of digital frontiers and cyberpunk aesthetics.",
        socials: { x: "@sterling", insta: "sterling_pub" }
    });
    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/uploads', { method: 'POST', body: formData });
            const data = await res.json();
            console.log('Uploaded:', data.url);
            // In real app, update user/author profile with data.url
        } catch (err) {
            console.error('Upload failed:', err);
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                <div className="flex items-center gap-8 mb-10">
                    <div className="relative group/avatar">
                        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-white/5 flex items-center justify-center overflow-hidden">
                            <User size={40} className="text-zinc-600" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                        >
                            <Upload size={20} className="text-white" />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-1">Avatar & Identity</h3>
                        <p className="text-sm text-zinc-500">Your public face on the platform.</p>
                    </div>
                </div>

                <div className="space-y-6 max-w-2xl">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Public Name</label>
                        <input
                            type="text"
                            value={author.name}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-4 py-3 text-white focus:border-violet-600 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Bio</label>
                        <textarea
                            rows={4}
                            value={author.bio}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-4 py-3 text-white focus:border-violet-600 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                    <Globe size={14} /> Social Connections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <SocialInput label="X (Twitter)" placeholder="@handle" icon={Globe} />
                    <SocialInput label="Instagram" placeholder="@handle" icon={Globe} />
                    <SocialInput label="Substack" placeholder="yourname.substack.com" icon={Globe} />
                    <SocialInput label="Patreon" placeholder="patreon.com/yourname" icon={Globe} />
                </div>
            </div>

            <div className="pt-6 border-t border-white/5">
                <button className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-500 transition-colors flex items-center gap-2 shadow-xl shadow-violet-600/10">
                    <Save size={18} /> Save All Changes
                </button>
            </div>
        </div>
    );
};

const SocialInput = ({ label, placeholder, icon: Icon }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{label}</label>
        <div className="relative group">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-zinc-900/50 border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-violet-600 outline-none transition-all"
            />
            <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-colors" />
        </div>
    </div>
);

export default Dashboard;
