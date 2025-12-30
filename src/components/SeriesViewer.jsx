import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const SeriesViewer = ({ workId, workType, workTitle }) => {
    const [chapters, setChapters] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchChapters = () => {
        setLoading(true);
        fetch(`/api/syndication/chapters/${workId}`)
            .then(res => res.json())
            .then(data => {
                setChapters(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchChapters();
    }, [workId]);

    const handleSubscribe = async () => {
        try {
            const res = await fetch('/api/billing/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workId,
                    workType,
                    successUrl: window.location.href, // Redirect back here
                    cancelUrl: window.location.href
                })
            });
            const data = await res.json();
            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                console.error('Failed to create checkout session:', data.error);
            }
        } catch (err) {
            console.error('Subscription failed:', err);
        }
    };

    if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse">Loading Series...</div>;
    if (chapters.length === 0) return <div className="p-20 text-center text-zinc-500">No chapters found.</div>;

    const currentChapter = chapters[currentIdx];

    return (
        <div className="max-w-3xl mx-auto py-20 px-6">
            {/* Chapter Navigation Header */}
            <div className="flex items-center justify-between mb-12 bg-zinc-900/80 backdrop-blur p-4 rounded-2xl border border-white/5 sticky top-20 z-40">
                <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-all hover:bg-white/5 rounded-full"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="text-center">
                    <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest block mb-1">
                        Chapter {currentChapter.chapter_number}
                    </span>
                    <h2 className="text-lg font-bold text-white truncate max-w-[200px] md:max-w-md">
                        {currentChapter.title}
                    </h2>
                </div>

                <button
                    disabled={currentIdx === chapters.length - 1}
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="p-2 text-zinc-400 hover:text-white disabled:opacity-20 transition-all hover:bg-white/5 rounded-full"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Content Area */}
            <div className="relative min-h-[400px]">
                {currentChapter.isUnlocked ? (
                    <article
                        className="prose prose-invert prose-zinc max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700"
                        dangerouslySetInnerHTML={{ __html: currentChapter.content_html }}
                    />
                ) : currentChapter.isGated ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-violet-950/10 rounded-3xl border border-violet-500/20 backdrop-blur-sm animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-violet-600/20 rounded-2xl flex items-center justify-center text-violet-400 mb-8 border border-violet-500/30">
                            <Lock size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Premium Content</h3>
                        <p className="text-zinc-400 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
                            To continue reading this series and support the author, please join the subscription for this work.
                        </p>

                        <button
                            onClick={handleSubscribe}
                            className="px-10 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl shadow-2xl shadow-violet-600/40 transition-all active:scale-95 group flex items-center gap-3"
                        >
                            <span>Subscribe to Unlock</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="mt-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Supports Creator Directly</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-600 mb-6 font-bold tracking-widest">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Locked by Schedule</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mb-8 font-medium">
                            This chapter isn't available to you yet. It follows the author's relative release schedule.
                        </p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-zinc-400 rounded-full border border-white/10 text-sm font-bold">
                            Available in {currentChapter.unlockDate ? format(new Date(currentChapter.unlockDate), 'MMMM do, yyyy') : 'a few days'}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div className="mt-20 flex justify-between border-t border-white/5 pt-10 text-zinc-600">
                <div className="text-left">
                    {currentIdx > 0 && (
                        <button onClick={() => setCurrentIdx(currentIdx - 1)} className="group text-left">
                            <span className="text-[10px] uppercase font-black tracking-widest mb-1 block group-hover:text-zinc-400 transition-colors">Previous</span>
                            <span className="font-bold text-sm block group-hover:text-white transition-colors">{chapters[currentIdx - 1].title}</span>
                        </button>
                    )}
                </div>
                <div className="text-right">
                    {currentIdx < chapters.length - 1 && chapters[currentIdx + 1].isUnlocked && (
                        <button onClick={() => setCurrentIdx(currentIdx + 1)} className="group text-right">
                            <span className="text-[10px] uppercase font-black tracking-widest mb-1 block group-hover:text-zinc-400 transition-colors">Next</span>
                            <span className="font-bold text-sm block group-hover:text-white transition-colors">{chapters[currentIdx + 1].title}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeriesViewer;
