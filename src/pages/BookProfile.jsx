
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BOOKS, CHAPTERS, ALL_DATA } from '../data/mockData'; // In real app, fetch from API
import { useStore } from '../context/StoreContext';
import { useRelativeSchedule } from '../hooks/useRelativeSchedule';
import { Calendar, Clock, Star, PlayCircle, Lock, BookOpen, Heart, Headphones, Radio } from 'lucide-react';
import { format } from 'date-fns';

const BookProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { subscribeToBook, getSubscription } = useStore();

    const book = ALL_DATA.find(b => b.id === id);
    const chapters = CHAPTERS[id] || [];
    const subscription = getSubscription(id);

    // Use our custom hook to calculate unlock statuses
    const schedule = useRelativeSchedule(book, subscription);

    if (!book) return <div className="container py-20 text-center">Book not found</div>;

    const isAudiobook = !!book.narrator;

    const handleStartReading = () => {
        if (subscription) {
            // Already subscribed/reading -> Go to Contribution
            navigate(`/book/${book.id}/contribute`);
        } else {
            // Not subscribed -> Subscribe and start reading
            subscribeToBook(book.id);
            navigate(`/read/${book.id}/${chapters[0]?.id}`);
        }
    };

    return (
        <div className="pb-20">
            {/* Header / Cover */}
            <div className="relative">
                <div className="absolute inset-0 h-full overflow-hidden">
                    <img src={book.coverImage} className="w-full h-full object-cover blur-3xl opacity-30" alt="Background" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/20 to-[#09090b]" />
                </div>

                <div className="container relative pt-20 flex flex-col md:flex-row gap-10">
                    {/* Cover Image */}
                    {/* Left Column: Cover + Reviews */}
                    <div className="flex flex-col shrink-0 w-64 mx-auto md:mx-0 relative z-10" style={{ marginTop: '20px' }}>
                        {/* Cover Image */}
                        <div className="w-full h-[269px] rounded-xl overflow-hidden shadow-2xl relative">
                            <img src={book.coverImage} className="w-full h-full object-cover" alt={book.title} />
                        </div>

                        {/* Spacer */}
                        <div style={{ height: '40px' }}></div>

                        {/* Reader Reviews */}
                        {/* Reader Reviews */}
                        <div>
                            {[
                                { user: "SciFiFan88", text: "This book completely blew my mind. The concept of time as currency is handled so realistically it's terrifying. I couldn't put it down!" },
                                { user: "BookWorm_Jade", text: "Incredible world building. Kaelen is such a complex character. The narration adds so much depth to the experience. Highly recommend!" },
                                { user: "TimeTraveler0", text: "Best sci-fi I've read in years. The pacing is intense and the ending left me speechless. Can't wait for the next series!" }
                            ].map((review, i) => (
                                <div key={i} style={{ marginTop: i === 0 ? '0px' : '15px' }}>
                                    <div className="text-white font-bold text-xs mb-1">{review.user}</div>
                                    <p className="text-white italic text-sm line-clamp-4 opacity-80">"{review.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="mt-4 flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{book.title}</h1>
                        <p className="text-xl text-zinc-400 mb-6">
                            by <span className="text-white font-medium">{book.author}</span>
                            {book.narrator && (
                                <span className="block text-lg text-zinc-500 mt-1">Narrated by <span className="text-zinc-300">{book.narrator}</span></span>
                            )}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-zinc-400 text-sm" style={{ marginBottom: '36px' }}>
                            <span className="flex items-center gap-1 bg-zinc-800 px-3 py-1 rounded-full"><Star size={14} className="text-yellow-500" /> {book.rating}</span>
                            <span className="flex items-center gap-1 px-3 py-1 border border-zinc-700 rounded-full"><Clock size={14} /> {book.length}</span>
                            <span className="flex items-center gap-1 px-3 py-1 border border-zinc-700 rounded-full">Freq: {book.frequencyInterval} Days</span>
                        </div>



                        {book.shortDescription && (
                            <p className="text-lg text-zinc-300 italic mb-6">{book.shortDescription}</p>
                        )}

                        <p className="text-zinc-300 leading-relaxed max-w-2xl mb-8 mx-auto md:mx-0">
                            {book.blurb}
                        </p>

                        <div style={{ height: '15px' }} />

                        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
                            <button
                                onClick={handleStartReading}
                                className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg shadow-violet-600/20 flex items-center gap-2"
                            >
                                {subscription ? (
                                    <><Heart size={20} className="text-orange-500 fill-orange-500" /> Show Appreciation</>
                                ) : (
                                    isAudiobook ? <><Headphones size={20} /> Start Listening</> : <><PlayCircle size={20} /> Start Reading</>
                                )}
                            </button>

                            {book.externalLinks.map(link => (
                                <a key={link.platform} href={link.url} className="px-6 py-3 rounded-full border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-colors flex items-center gap-2">
                                    {link.platform === 'Spotify' ? (
                                        <><Radio size={18} /> Listen on {link.platform}</>
                                    ) : (
                                        <>Buy on {link.platform}</>
                                    )}
                                </a>
                            ))}
                        </div>

                        {/* Chapter List - Moved */}
                        <div>
                            <div style={{ height: '30px' }} />
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2" style={{ marginBottom: '30px' }}>
                                {isAudiobook ? <><Headphones size={28} /> Start Listening</> : "Contents"}
                            </h3>

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

                                    // Color Logic
                                    let titleColor = 'text-white'; // Default / Future
                                    if (subscription) {
                                        const currentIndex = subscription.lastReadChapterIndex || 0;
                                        if (index < currentIndex) {
                                            titleColor = 'text-zinc-500'; // Finished
                                        } else if (index === currentIndex) {
                                            titleColor = 'text-orange-500'; // Current
                                        }
                                    } else {
                                        if (index === 0) titleColor = 'text-orange-500'; // Preview as current
                                    }

                                    return (
                                        <div key={chapter.id}
                                            onClick={() => {
                                                if (status === 'unlocked') {
                                                    navigate(`/read/${book.id}/${chapter.id}`);
                                                }
                                            }}
                                            className={`p-4 rounded-lg flex items-center justify-between transition-colors ${status === 'unlocked' ? 'bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer' : 'bg-zinc-900/50 opacity-70'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${status === 'unlocked' ? 'bg-violet-500/20 text-violet-300' : 'bg-zinc-800 text-zinc-600'}`}>
                                                    {chapter.sequence}
                                                </div>
                                                <div>
                                                    <h4 className={`font-medium ${titleColor}`}>{chapter.title}</h4>
                                                    <span className="text-xs text-zinc-500">{unlockText}</span>
                                                </div>
                                            </div>
                                            <div>
                                                {status === 'locked' ? <Lock size={18} className="text-zinc-600" /> : (
                                                    isAudiobook ? <Headphones size={18} className="text-violet-500" /> : <PlayCircle size={18} className="text-violet-500" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ height: '50px' }} />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default BookProfile;
