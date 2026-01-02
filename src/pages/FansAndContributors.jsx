import React, { useState, useEffect } from 'react';
import { Users, Search, MessageCircle, Star, Heart, TrendingUp, DollarSign, Calendar, UserX } from 'lucide-react';

const FansAndContributors = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/community/stats', { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to fetch community stats');
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">Loading Community Data...</div>;
    if (error) return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">Error: {error}</div>;

    const { fansByWork = [], uniqueFans = [], contributions = [] } = data || {};

    const handleDeleteFan = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to remove ${userName} from your followers? This will cancel their active subscriptions to your works.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/community/fan/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to delete fan');

            // Refresh data
            const updatedRes = await fetch('/api/community/stats', { credentials: 'include' });
            if (updatedRes.ok) {
                const updatedData = await updatedRes.json();
                setData(updatedData);
            }
        } catch (err) {
            alert('Error deleting fan: ' + err.message);
        }
    };

    // Calculate totals
    const totalFans = fansByWork.reduce((acc, work) => acc + work.fans.length, 0);
    const totalRevenue = contributions.reduce((acc, c) => acc + parseFloat(c.amount), 0).toFixed(2);

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Fans &</span> Contributors
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#a1a1aa', textAlign: 'center', width: '100%', display: 'block' }}>
                        Manage your fans and financial contributors.
                    </p>
                </div>

                <div style={{ height: '20px' }}></div>


                {/* Contributions Table */}
                <div className="mb-20">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-400" />
                        Contribution History
                    </h2>
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden mb-6">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Contributor</th>
                                    <th className="px-6 py-4 font-medium">Username</th>
                                    <th className="px-6 py-4 font-medium">Work</th>
                                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {contributions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">No contributions yet.</td>
                                    </tr>
                                ) : (
                                    contributions.map((c, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 text-zinc-400">
                                                {new Date(c.created_at).toLocaleDateString()}
                                                <span className="text-zinc-600 ml-2 text-xs">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                                                    {c.user_name ? c.user_name[0] : '?'}
                                                </div>
                                                {c.user_name || 'Anonymous'}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">@{c.user_handle || 'anonymous'}</td>
                                            <td className="px-6 py-4 text-zinc-300">{c.work_title}</td>
                                            <td className="px-6 py-4 text-right font-mono text-green-400">
                                                ${parseFloat(c.amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Revenue Summary below table */}
                    <div className="flex justify-end">
                        <div className="bg-[#1a1a1a] border border-white/5 px-8 py-4 rounded-xl flex items-center gap-4">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><DollarSign size={20} /></div>
                            <div className="text-right">
                                <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Total Revenue</div>
                                <div className="text-3xl font-black text-green-400">${totalRevenue}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Your Fans Table */}
                <div className="space-y-8 mb-12">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Users size={20} className="text-violet-400" />
                        Your Fans
                    </h2>

                    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Fan Name</th>
                                    <th className="px-6 py-4 font-medium">Username</th>
                                    <th className="px-6 py-4 font-medium">Date Joined</th>
                                    <th className="px-6 py-4 font-medium">Recent Work</th>
                                    <th className="px-6 py-4 font-medium">Total Works</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {uniqueFans.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-zinc-500">No active fans found.</td>
                                    </tr>
                                ) : (
                                    uniqueFans.map((fan) => (
                                        <tr key={fan.user_id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs overflow-hidden border border-white/10">
                                                    {fan.avatar ? <img src={fan.avatar} alt={fan.full_name || 'Anonymous'} className="w-full h-full object-cover" /> : (fan.full_name ? fan.full_name[0] : '?')}
                                                </div>
                                                {fan.full_name || 'Anonymous'}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400">@{fan.user_name || 'anonymous'}</td>
                                            <td className="px-6 py-4 text-zinc-400">
                                                {new Date(fan.joined_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-300 italic">{fan.recent_work_title || 'N/A'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-violet-500/10 text-violet-300 text-xs px-2 py-0.5 rounded border border-violet-500/20">
                                                    {fan.total_works}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <button className="text-zinc-600 hover:text-white transition-colors" title="Message"><MessageCircle size={16} /></button>
                                                    <button
                                                        onClick={() => handleDeleteFan(fan.user_id, fan.full_name)}
                                                        className="text-zinc-600 hover:text-red-400 transition-colors"
                                                        title="Delete Fan"
                                                    >
                                                        <UserX size={16} />
                                                        <span className="sr-only">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ height: '24px' }}></div>

                    {/* Stats Bar (Moved below section) */}
                    <div className="flex justify-end">
                        <div className="bg-[#1a1a1a] border border-white/5 px-8 py-4 rounded-xl flex items-center gap-4">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><Heart size={20} /></div>
                            <div className="text-right">
                                <div className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Total Fans</div>
                                <div className="text-3xl font-black text-white">{totalFans}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FansAndContributors;
