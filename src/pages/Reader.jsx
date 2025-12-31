
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNovel, useChapters } from '../hooks/useData';
import { useStore } from '../context/StoreContext';
import { useRelativeSchedule } from '../hooks/useRelativeSchedule';
import { ArrowLeft, Settings, Headphones, Star, CheckCircle, Loader2 } from 'lucide-react';

const Reader = () => {
    const { bookId, chapterId } = useParams();
    const navigate = useNavigate();
    const { getSubscription, updateProgress } = useStore();

    const [fontSize, setFontSize] = useState(18);
    const [showSettings, setShowSettings] = useState(false);
    const [rating, setRating] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Fetch data from SQL
    const { data: book, loading: bookLoading } = useNovel(bookId);
    const { data: chapters, loading: chaptersLoading } = useChapters(bookId);

    const isLoading = bookLoading || chaptersLoading;
    const subscription = getSubscription(bookId);
    const schedule = useRelativeSchedule(book, subscription);

    // Find current chapter from fetch data
    const currentChapter = chapters?.find(c => c.id === chapterId);
    const currentChapterIndex = chapters?.findIndex(c => c.id === chapterId);

    // Validation: Is chapter unlocked?
    const isUnlocked = schedule && subscription && currentChapter ? schedule.checkUnlocked(currentChapter.sequence) : false;

    useEffect(() => {
        if (!isLoading && !subscription) {
            navigate(`/book/${bookId}`); // Redirect if not subscribed
        }
    }, [subscription, bookId, navigate, isLoading]);

    const handleComplete = () => {
        if (rating === 0) return; // Must rate
        setIsCompleted(true);
        updateProgress(bookId, currentChapter.sequence);
    };

    const nextChapter = chapters && currentChapterIndex !== -1 ? chapters[currentChapterIndex + 1] : null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#333333]">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (!book || !currentChapter) {
        return <div className="p-10 text-center text-white bg-[#333333] min-h-screen">Chapter not found</div>;
    }

    if (!isUnlocked) {
        return (
            <div className="container py-20 text-center text-white">
                <h1 className="text-3xl mb-4">Content Locked</h1>
                <p>This chapter unlocks in {schedule?.getTimeUntil(currentChapter.sequence)}.</p>
                <Link to={`/book/${bookId}`} className="text-violet-500 mt-4 inline-block">Return to Book Profile</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#333333]">
            {/* Toolbar */}
            <div className="sticky top-0 z-40 bg-[#333333]/90 backdrop-blur border-b border-white/5 px-4 h-14 flex items-center justify-between">
                <Link to={`/book/${bookId}`} className="text-zinc-400 hover:text-white"><ArrowLeft size={20} /></Link>
                <span className="text-sm font-medium text-zinc-300 truncate max-w-[200px]">{currentChapter.title}</span>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowSettings(!showSettings)} className="text-zinc-400 hover:text-white"><Settings size={20} /></button>
                    <button className="text-zinc-400 hover:text-white"><Headphones size={20} /></button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="absolute right-4 top-16 bg-zinc-800 p-4 rounded-lg shadow-xl z-50 w-64 border border-zinc-700">
                    <p className="text-xs text-zinc-500 mb-2 uppercase font-bold">Font Size</p>
                    <input
                        type="range" min="14" max="24"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-violet-500"
                    />
                </div>
            )}

            {/* Content */}
            <div className="container max-w-2xl mx-auto py-10 px-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 font-serif">{currentChapter.title}</h1>

                <div
                    className="text-zinc-300 font-serif leading-relaxed space-y-6"
                    style={{ fontSize: `${fontSize}px` }}
                >
                    {/* Simulated Paragraphs */}
                    {currentChapter.content.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                    <p>
                        [...Rest of chapter content would be here. Lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...]
                    </p>
                    <p>
                        "The relative scheduling engine ensures no spoilers," she said, looking at the time data. "Everyone lives in their own specific moment of the story."
                    </p>
                </div>

                <hr className="my-12 border-zinc-800" />

                {/* Completion / Rating */}
                {!isCompleted ? (
                    <div className="bg-zinc-900 rounded-xl p-8 text-center border border-zinc-800">
                        <h3 className="text-xl text-white font-bold mb-4">Chapter Complete?</h3>
                        <p className="text-zinc-400 mb-6">Rate this session to unlock the Author's Note and proceed.</p>

                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`transition-colors ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`}
                                >
                                    <Star size={32} />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleComplete}
                            disabled={rating === 0}
                            className="bg-violet-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold w-full md:w-auto"
                        >
                            Mark Complete
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-center gap-3 text-green-400">
                            <CheckCircle size={20} /> Chapter Completed.
                        </div>

                        {/* Author Note */}
                        <div className="bg-zinc-800 rounded-xl p-6 border-l-4 border-violet-500">
                            <h4 className="text-white font-bold mb-2">Author's Note</h4>
                            <p className="text-zinc-400 italic">"Thanks for reading this chapter! In the next one, things get really weird with the time loop." - Elena</p>
                        </div>

                        {nextChapter ? (
                            <div className="text-center">
                                <Link
                                    to={`/read/${bookId}/${nextChapter.id}`}
                                    className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200"
                                >
                                    Read Next Chapter
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center text-zinc-500">
                                You have reached the end of the current content.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reader;
