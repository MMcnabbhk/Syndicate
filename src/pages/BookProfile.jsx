
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BOOKS, CHAPTERS } from '../data/mockData'; // In real app, fetch from API
import { useStore } from '../context/StoreContext';
import { useRelativeSchedule } from '../hooks/useRelativeSchedule';
import { Calendar, Clock, Star, PlayCircle, Lock, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const BookProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { subscribeToBook, getSubscription } = useStore();

    const book = BOOKS.find(b => b.id === id);
    const chapters = CHAPTERS[id] || [];
    const subscription = getSubscription(id);

    // Use our custom hook to calculate unlock statuses
    const schedule = useRelativeSchedule(book, subscription);

    if (!book) return <div className="container py-20 text-center">Book not found</div>;

    const handleStartReading = () => {
        if (!subscription) {
            subscribeToBook(book.id);
        }
        // Navigate to first chapter (or last read)
        // For now, go to first chapter
        navigate(`/read/${book.id}/${chapters[0]?.id}`);
    };

    return (
        <div className="pb-20">
            {/* Header / Cover */}
            <div className="relative">
                <div className="absolute inset-0 h-[400px] overflow-hidden">
                    <img src={book.coverImage} className="w-full h-full object-cover blur-3xl opacity-30" alt="Background" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/20 to-[#09090b]" />
                </div>

                <div className="container relative pt-20 flex flex-col md:flex-row gap-10">
                    {/* Cover Image */}
                    <div className="shrink-0 w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl relative z-10 mx-auto md:mx-0">
                        <img src={book.coverImage} className="w-full h-full object-cover" alt={book.title} />
                    </div>

                    {/* Info */}
                    <div className="mt-4 flex-1 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-400 text-sm mb-4">
                            <span className="flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-full"><Star size={14} className="text-yellow-500" /> {book.rating}</span>
                            <span className="flex items-center gap-1 px-3 py-1 border border-zinc-700 rounded-full"><Clock size={14} /> {book.length}</span>
                            <span className="flex items-center gap-1 px-3 py-1 border border-zinc-700 rounded-full">Freq: {book.frequencyInterval} Days</span>
                        </div>

                        {book.narrator && (
                            <p className="text-zinc-500 text-sm mb-2">Narrated by <span className="text-zinc-300 font-medium">{book.narrator}</span></p>
                        )}

                        {book.shortDescription && (
                            <p className="text-lg text-zinc-300 italic mb-6">{book.shortDescription}</p>
                        )}

                        <p className="text-zinc-300 leading-relaxed max-w-2xl mb-8 mx-auto md:mx-0">
                            {book.blurb}
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={handleStartReading}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2"
                            >
                                {subscription ? <><BookOpen size={20} /> Continue Reading</> : <><PlayCircle size={20} /> Start Reading</>}
                            </button>

                            {book.externalLinks.map(link => (
                                <a key={link.platform} href={link.url} className="px-6 py-3 rounded-full border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors">
                                    Buy on {link.platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapter List */}
            <div className="container mt-20 max-w-4xl">
                <h3 className="text-2xl font-bold text-white mb-6">Chapter Schedule</h3>

                {!subscription && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 mb-8 text-center">
                        <p className="text-zinc-400">Chapters are released on a <strong className="text-white">Relative Schedule</strong> based on when you start.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {chapters.map((chapter, index) => {
                        let status = 'locked';
                        let unlockText = `Unlocks day ${index * book.frequencyInterval}`; // Approx for preview

                        if (subscription && schedule) {
                            const isUnlocked = schedule.checkUnlocked(chapter.sequence);
                            status = isUnlocked ? 'unlocked' : 'locked';
                            unlockText = schedule.getTimeUntil(chapter.sequence);
                        } else if (index === 0) {
                            // Always allow preview of first chapter conceptually, or just say 'Starts immediately'
                            unlockText = 'Available Immediately';
                            status = 'unlocked'; // Preview
                        }

                        return (
                            <div key={chapter.id} className={`p-4 rounded-lg flex items-center justify-between transition-colors ${status === 'unlocked' ? 'bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer' : 'bg-zinc-900/50 opacity-70'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${status === 'unlocked' ? 'bg-violet-500/20 text-violet-300' : 'bg-zinc-800 text-zinc-600'}`}>
                                        {chapter.sequence}
                                    </div>
                                    <div>
                                        <h4 className={`font-medium ${status === 'unlocked' ? 'text-white' : 'text-zinc-500'}`}>{chapter.title}</h4>
                                        <span className="text-xs text-zinc-500">{unlockText}</span>
                                    </div>
                                </div>
                                <div>
                                    {status === 'locked' ? <Lock size={18} className="text-zinc-600" /> : <PlayCircle size={18} className="text-violet-500" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BookProfile;
