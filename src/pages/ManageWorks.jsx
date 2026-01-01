import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, PenTool, Headphones, Library, Users, DollarSign, Star, Eye, CheckCircle2, FileText, Archive } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const ManageWorks = () => {
    const { userState } = useStore();
    const [works, setWorks] = useState({
        novels: [],
        stories: [],
        poems: [],
        audiobooks: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Get local saved works
                const savedWorksRaw = localStorage.getItem('myWorks');
                const savedWorks = savedWorksRaw ? JSON.parse(savedWorksRaw) : [];

                const localNovels = [];
                const localStories = [];
                const localPoems = [];
                const localAudiobooks = [];

                savedWorks.forEach(work => {
                    const mappedWork = {
                        id: work.id,
                        title: work.title,
                        status: work.status, // Should be 'Draft'
                        genre: work.genre,
                        subscribers: work.subscribers || 0,
                        rating: work.rating || 0,
                        lifetimeEarnings: work.lifetimeEarnings || '0.00',
                        color: work.color || 'text-violet-500',
                        isLocal: true // Flag to identify local works
                    };

                    // Categorize based on type
                    if (work.type === 'short-story') localStories.push(mappedWork);
                    else if (work.type === 'poem') localPoems.push(mappedWork);
                    else if (work.type === 'audiobook') localAudiobooks.push(mappedWork);
                    else localNovels.push(mappedWork); // Default to novel
                });

                setWorks({
                    novels: [
                        ...localNovels,
                        { id: 101, title: 'The Silent Echo', status: 'Published', genre: 'Thriller', subscribers: 124, rating: 4.8, lifetimeEarnings: '1,240.00', color: 'text-violet-500' },
                        { id: 102, title: 'Midnight Whispers', status: 'Draft', genre: 'Mystery', subscribers: 0, rating: 0, lifetimeEarnings: '0.00', color: 'text-violet-500' }
                    ],
                    stories: [
                        ...localStories,
                        { id: 103, title: 'A Coffee Shop Romance', status: 'Published', genre: 'Romance', subscribers: 85, rating: 4.5, lifetimeEarnings: '425.50', color: 'text-violet-500' }
                    ],
                    poems: [
                        ...localPoems,
                        { id: 104, title: 'Winter Solitude', status: 'Archived', genre: 'Nature', subscribers: 12, rating: 4.2, lifetimeEarnings: '45.00', color: 'text-violet-500' }
                    ],
                    audiobooks: [
                        ...localAudiobooks
                    ]
                });
            } catch (err) {
                console.error("Failed to fetch works", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, [userState]);

    const WorkCard = ({ work, icon: Icon }) => (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 group hover:border-violet-500/30 transition-all">
            <div className="flex items-center gap-2.5 mb-3">
                <h3 className="font-bold text-lg text-white group-hover:text-violet-200 transition-colors">{work.title}</h3>
                <div className={`p-1.5 rounded-lg bg-white/5 ${work.color || 'text-zinc-500'} group-hover:bg-white/10 transition-all shrink-0`}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {/* Status */}
                <span className={`font-medium ${work.status === 'Published' ? 'text-green-400' :
                    work.status === 'Archived' ? 'text-red-400' :
                        'text-zinc-500'
                    }`}>
                    {work.status}
                </span>

                {/* Genre */}
                {work.genre && <span className="text-zinc-400">{work.genre}</span>}

                {/* Subscribers */}
                <span className="text-zinc-400">{work.subscribers} Subscribers</span>

                {/* Rating */}
                <span className="text-zinc-400">{work.rating} ★</span>

                {/* Earnings */}
                <span className="text-violet-400 font-medium">${work.lifetimeEarnings}</span>
            </div>

            <div className="flex items-center gap-6 pt-4 mt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                    <Edit2 size={14} /> EDIT
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors">
                    <Trash2 size={14} /> DELETE
                </button>
            </div>
        </div>
    );

    // Flatten all works into a single list
    const allWorks = [
        ...works.novels.map(w => ({ ...w, icon: Library })),
        ...works.stories.map(w => ({ ...w, icon: BookOpen })),
        ...works.poems.map(w => ({ ...w, icon: PenTool })),
        ...works.audiobooks.map(w => ({ ...w, icon: Headphones }))
    ];

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <header className="container mx-auto px-4 mb-12 flex flex-col items-center text-center">
                <h1
                    className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    style={{ paddingBottom: '20px', paddingTop: '20px' }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Manage Works</span>
                </h1>
                <p className="text-zinc-400 max-w-2xl text-sm" style={{ textAlign: 'center' }}>
                    Create, edit, and manage your content library.
                </p>
                <div style={{ height: '40px' }} aria-hidden="true" />
                <Link
                    to="/new-work"
                    style={{ backgroundColor: '#cc5500', color: 'white' }}
                    className="w-full md:w-auto min-w-[240px] px-12 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 hover:opacity-90"
                >
                    <Plus size={20} />
                    <span>New Work</span>
                </Link>
            </header>

            <div style={{ height: '40px' }} aria-hidden="true" />

            <div className="container mx-auto px-4 max-w-5xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    /* Left Column Layout */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-4">
                            {allWorks.length > 0 ? (
                                allWorks.map((work, idx) => (
                                    <WorkCard key={`${work.id}-${idx}`} work={work} icon={work.icon} />
                                ))
                            ) : (
                                <div className="text-zinc-500 italic py-8 text-center bg-[#1a1a1a] rounded-xl border border-white/5">
                                    No works found. Click "New Work" to get started.
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1">
                            {/* Empty right column or for future stats/filters */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageWorks;
