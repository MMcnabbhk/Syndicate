import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, DollarSign, Mail, LayoutDashboard, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCreators: 0,
        pendingPayouts: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data fetch
        setTimeout(() => {
            setStats({
                totalUsers: 1250,
                totalCreators: 85,
                pendingPayouts: 12, // Count of creators needing payout
                totalRevenue: 45200.00
            });
            setLoading(false);
        }, 600);
    }, []);

    const statCards = [
        { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Total Creators', value: stats.totalCreators.toLocaleString(), icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        { title: 'Pending Payouts', value: stats.pendingPayouts, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10', link: '/admin/financials' },
        { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <LayoutDashboard className="text-red-500" />
                Admin Dashboard
            </h1>

            {/* Stats Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}
            >
                {statCards.map((stat, index) => (
                    stat.link ? (
                        <Link to={stat.link} key={index} className="block">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-red-500/30 transition-all cursor-pointer h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-zinc-400 font-medium">{stat.title}</h3>
                                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-white" style={{ marginBottom: '30px' }}>{stat.value}</div>
                            </div>
                        </Link>
                    ) : (
                        <div key={index} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 h-full">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-zinc-400 font-medium">{stat.title}</h3>
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white" style={{ marginBottom: '30px' }}>{stat.value}</div>
                        </div>
                    )
                ))}
            </div>

            {/* Quick Actions */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}
            >
                <Link to="/admin/users" className="bg-[#1a1a1a] border border-white/5 hover:border-red-500/30 p-6 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <Users className="text-red-500" size={24} />
                        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Manage Users</h3>
                    </div>
                    <p className="text-zinc-500 text-sm">Suspend accounts, delete users, and manage creator profiles.</p>
                </Link>

                <Link to="/admin/messages" className="bg-[#1a1a1a] border border-white/5 hover:border-red-500/30 p-6 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <Mail className="text-red-500" size={24} />
                        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Send Messages</h3>
                    </div>
                    <p className="text-zinc-500 text-sm">Broadcast updates to all users, creators, or specific groups.</p>
                </Link>

                <Link to="/admin/financials" className="bg-[#1a1a1a] border border-white/5 hover:border-red-500/30 p-6 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="text-red-500" size={24} />
                        <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">Process Payouts</h3>
                    </div>
                    <p className="text-zinc-500 text-sm">Review creator balances and record external payouts.</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
