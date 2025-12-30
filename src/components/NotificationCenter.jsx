import React, { useState } from 'react';
import { Bell, X, Check, Info } from 'lucide-react';

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'release', title: 'New Poem!', message: 'Eldritch Echoes by Lyra Nightshade is now available.', time: '2m ago', unread: true },
        { id: 2, type: 'system', title: 'Account Verified', message: 'Your creator account is now fully active.', time: '1h ago', unread: false },
        { id: 3, type: 'release', title: 'New Audiobook', message: 'The Chronomancer\'s Debt: Chapter 4 is now playing.', time: '3h ago', unread: true },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full border border-white/5"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#1a1a1a]">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                Notifications
                                {unreadCount > 0 && <span className="bg-violet-600/20 text-violet-400 text-xs px-2 py-0.5 rounded-full">{unreadCount} new</span>}
                            </h3>
                            <button onClick={markAllRead} className="text-xs text-zinc-500 hover:text-violet-400 transition-colors">Mark all read</button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(n => (
                                    <div key={n.id} className={`p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer relative ${n.unread ? 'bg-violet-600/[0.03]' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'release' ? 'bg-violet-600/20 text-violet-400' : 'bg-blue-600/20 text-blue-400'
                                                }`}>
                                                {n.type === 'release' ? <Bell size={14} /> : <Info size={14} />}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className={`text-sm font-bold ${n.unread ? 'text-white' : 'text-zinc-300'}`}>{n.title}</h4>
                                                <p className="text-xs text-zinc-500 leading-relaxed">{n.message}</p>
                                                <span className="text-[10px] text-zinc-600 font-medium">{n.time}</span>
                                            </div>
                                        </div>
                                        {n.unread && (
                                            <div className="absolute top-4 right-4 w-2 h-2 bg-violet-600 rounded-full"></div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center">
                                    <Bell size={40} className="mx-auto text-zinc-800 mb-4" />
                                    <p className="text-zinc-500 text-sm">No new notifications</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-zinc-900/50 border-t border-white/5 text-center">
                            <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors">View All Activity</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
