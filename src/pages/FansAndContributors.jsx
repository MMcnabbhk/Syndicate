import React, { useState } from 'react';
import { Users, Search, MessageCircle, Star, Heart, TrendingUp } from 'lucide-react';

const FansAndContributors = () => {
    const [activeTab, setActiveTab] = useState('fans');

    // Mock Data
    const fans = [
        { id: 1, name: 'Alice Walker', handle: '@alicereads', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', joined: '2 months ago', status: 'Super Fan' },
        { id: 2, name: 'Bob Smith', handle: '@bobby_books', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150', joined: '1 week ago', status: 'Fan' },
        { id: 3, name: 'Charlie Day', handle: '@charlie_d', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', joined: '3 days ago', status: 'Fan' },
    ];

    const contributors = [
        { id: 4, name: 'Sarah Jones', role: 'Editor', handle: '@sarah_edits', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', works: 3 },
        { id: 5, name: 'Mike Brown', role: 'Illustrator', handle: '@mike_art', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150', works: 1 },
    ];

    const UserCard = ({ user, type }) => (
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-white/5 rounded-xl hover:border-violet-500/30 transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-white group-hover:text-violet-200 transition-colors">{user.name}</h3>
                    <p className="text-sm text-zinc-400">{user.handle} • {type === 'fans' ? user.joined : `${user.works} works`}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {user.status === 'Super Fan' && (
                    <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Super Fan
                    </span>
                )}
                {type === 'contributors' && (
                    <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20">
                        {user.role}
                    </span>
                )}
                <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                    <MessageCircle size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Community</h1>
                        <p className="text-zinc-400 mt-1">Manage your fans and creative partners.</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-[#1a1a1a] border border-white/5 px-4 py-2 rounded-lg flex items-center gap-3">
                            <div className="p-1.5 bg-pink-500/10 rounded-md text-pink-400"><Heart size={16} /></div>
                            <div>
                                <div className="text-xs text-zinc-400">Total Fans</div>
                                <div className="font-bold">1,204</div>
                            </div>
                        </div>
                        <div className="bg-[#1a1a1a] border border-white/5 px-4 py-2 rounded-lg flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-400"><TrendingUp size={16} /></div>
                            <div>
                                <div className="text-xs text-zinc-400">Growth (7d)</div>
                                <div className="font-bold text-green-400">+5.2%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-white/10 mb-8">
                    <button
                        onClick={() => setActiveTab('fans')}
                        className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'fans' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                        Fans & Followers
                        {activeTab === 'fans' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-t-full" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('contributors')}
                        className={`pb-4 text-sm font-medium transition-all relative ${activeTab === 'contributors' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                    >
                        Contributors
                        {activeTab === 'contributors' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-600 rounded-t-full" />}
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                </div>

                {/* List */}
                <div className="space-y-4">
                    {activeTab === 'fans' ? (
                        fans.map(fan => <UserCard key={fan.id} user={fan} type="fans" />)
                    ) : (
                        contributors.map(contributor => <UserCard key={contributor.id} user={contributor} type="contributors" />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default FansAndContributors;
