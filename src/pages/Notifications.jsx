import React, { useState, useEffect } from 'react';
import { Bell, Info, CheckCircle2, MessageSquare, Star, Heart, DollarSign, Loader2 } from 'lucide-react';

const Notifications = () => {
    const [filter, setFilter] = useState('all');

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Determine user ID (simplified for demo)
                const userId = 'demo-user-id';
                // In real app, we'd use the auth context or cookie

                const response = await fetch(`http://localhost:4000/api/notifications?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();

                    if (Array.isArray(data) && data.length > 0) {
                        setNotifications(data.map(n => ({
                            ...n,
                            // Ensure boolean false for unread if 0 or false
                            unread: n.is_read === 0 || n.is_read === false || n.is_read === '0',
                            // Safely handle date
                            time: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Just now'
                        })));
                    } else {
                        // Fallback to mock data if DB empty for demo purposes
                        setNotifications([
                            { id: 101, type: 'release', title: 'New Poem Release', message: 'Eldritch Echoes by Lyra Nightshade is now available for you to read.', time: '2m ago', unread: true, date: 'Today' },
                            { id: 108, type: 'money', title: 'New Contribution to You', message: 'You received a $5.00 contribution from @reader123! Note: "Love your work!"', time: '5m ago', unread: true, date: 'Today' },
                            { id: 102, type: 'system', title: 'Account Verified', message: 'Your creator account is now fully active. You can start publishing work.', time: '1h ago', unread: false, date: 'Today' },
                        ]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'unread', label: 'Unread' },
        { id: 'system', label: 'System' },
        { id: 'release', label: 'Releases' }
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'release': return <Star size={18} />;
            case 'system': return <Info size={18} />;
            case 'money': return <DollarSign size={18} />;
            case 'comment': return <MessageSquare size={18} />;
            case 'social': return <Heart size={18} />;
            case 'fan': return <Heart size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'release': return 'bg-violet-500/10 text-violet-400';
            case 'system': return 'bg-blue-500/10 text-blue-400';
            case 'money': return 'bg-emerald-500/10 text-emerald-400';
            case 'comment': return 'bg-amber-500/10 text-amber-400';
            case 'social': return 'bg-pink-500/10 text-pink-400';
            case 'fan': return 'bg-pink-500/10 text-pink-400';
            default: return 'bg-zinc-800 text-zinc-400';
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return n.unread;
        return n.type === filter;
    });

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10" style={{ marginTop: '20px' }}>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ color: '#8b5cf6' }}>
                            Notifications
                        </h1>
                        <p className="text-zinc-400" style={{ marginBottom: '20px' }}>100% Signal. No Noise.</p>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors border border-white/5"
                    >
                        <CheckCircle2 size={18} />
                        Mark all as read
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-zinc-500" size={32} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={`group relative p-6 rounded-2xl border transition-all cursor-pointer ${n.unread
                                        ? 'bg-zinc-900/40 border-violet-500/20 hover:border-violet-500/40'
                                        : 'bg-transparent border-zinc-800/50 hover:bg-zinc-900/20'
                                        }`}
                                >
                                    <div className="flex gap-5 items-start">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getColor(n.type)}`}>
                                            {getIcon(n.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline justify-between gap-4" style={{ marginBottom: '0px' }}>
                                                <h3 className={`text-lg font-bold truncate ${n.unread ? 'text-white' : 'text-zinc-400'}`}>
                                                    {n.title}
                                                </h3>
                                                <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">{n.time}</span>
                                            </div>
                                            <p className={`text-base leading-relaxed ${n.unread ? 'text-zinc-300' : 'text-zinc-500'}`} style={{ marginBottom: '0px' }}>
                                                {n.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Unread Indicator */}
                                    {n.unread && (
                                        <div className="absolute top-6 right-6 w-2 h-2 bg-violet-500 rounded-full" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-white/5">
                                <Bell size={48} className="mx-auto text-zinc-700 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
                                <p className="text-zinc-500">No notifications to display in this view.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Notifications;
