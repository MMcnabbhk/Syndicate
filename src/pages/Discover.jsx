import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Facebook, Instagram, Twitter, Music, Filter, Play, Star, Book, Headphones, PenTool, Loader2 } from 'lucide-react';
import { useAuthors } from '../hooks/useData';
import FollowButton from '../components/FollowButton';

const CONTENT_TYPES = [
    "All",
    "Books",
    "Audiobooks",
    "Visual Arts",
    "Poetry",
    "Shorts"
];

const Discover = () => {
    const [activeType, setActiveType] = useState("All");
    const [authors, setAuthors] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    // Generate a stable seed on mount for random consistent ordering
    const [seed] = useState(() => Math.floor(Math.random() * 1000000));
    const observer = React.useRef();

    const lastAuthorElementRef = React.useCallback(node => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isFetching, hasMore]);

    useEffect(() => {
        setIsFetching(true);
        // Pass seed to API
        fetch(`/api/authors?page=${page}&limit=5&seed=${seed}`)
            .then(res => res.json())
            .then(data => {
                // Client side deduplication just in case
                setAuthors(prev => {
                    const newAuthors = data.filter(a => !prev.some(p => p.id === a.id));
                    return [...prev, ...newAuthors];
                });
                setHasMore(data.length > 0);
                setIsFetching(false);
            })
            .catch(err => {
                console.error("Failed to fetch authors", err);
                setIsFetching(false);
            });
    }, [page, seed]);

    // 1. FILTER: By Content Type
    // 2. EXCLUDE: No Profile Image
    const filteredAuthors = authors.filter(author => {
        // Exclusion: Must have profile image (Raw field check)
        if (!author.profile_image_url) return false;

        // Filter: By Content Type
        let passesType = activeType === "All";
        if (!passesType) {
            const type = activeType.toLowerCase();
            if (type === 'books') passesType = (author.novel_count > 0);
            else if (type === 'poetry') passesType = (author.poem_count > 0);
            else if (type === 'shorts') passesType = (author.story_count > 0);
            else if (type === 'audiobooks') passesType = (author.audiobook_count > 0);
            else if (type === 'visual arts') passesType = (author.collection_count > 0);
        }
        return passesType;
    });

    // Auto-load more if filter results are too few and we have more data
    useEffect(() => {
        if (!isFetching && hasMore && authors.length > 0 && filteredAuthors.length < 3) {
            // If we have rendered fewer than 3 authors after filtering, 
            // and there are more authors to fetch, trigger next page.
            // Timeout to prevent rapid loop
            const timer = setTimeout(() => {
                setPage(prev => prev + 1);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [filteredAuthors.length, isFetching, hasMore]);

    const getAuthorWorks = (author) => {
        return author.works || [];
    };

    return (
        <div className="pb-20 pt-10 animate-fade-in">
            <section className="container mb-20 space-y-6">
                <div className="flex flex-col items-center gap-6">
                    {/* Content Type Submenu */}
                    <div className="flex flex-wrap gap-2 items-center justify-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mr-2">Filter:</span>
                        {CONTENT_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 border ${activeType === type
                                    ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                                    : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container">
                <header className="mb-0 text-center max-w-2xl mx-auto">
                    <div className="h-10"></div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Discover Your Next Obsession</h1>
                    <div className="h-[10px]"></div>
                    <p className="text-zinc-400 text-lg text-left">
                        Explore the minds behind the stories. From time-bending thrillers to neon-soaked cyberpunk, find the authors defining the new age of serialization.
                    </p>
                </header>

                <div className="h-[40px]"></div>

                <div className="flex flex-col gap-24">
                    {filteredAuthors.map((author, index) => {
                        const works = getAuthorWorks(author);
                        const isLast = index === filteredAuthors.length - 1;

                        return (
                            <div
                                key={author.id}
                                ref={isLast ? lastAuthorElementRef : null}
                                className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-zinc-900/60 transition-colors duration-500"
                            >
                                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                                    {/* Left Column: Photo & Video */}
                                    <div className="w-full lg:w-52 shrink-0 flex flex-col gap-6">
                                        {/* Author Photo */}
                                        <Link to={`/author/${author.id}`} className="block aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl relative ring-1 ring-white/10 group cursor-pointer">
                                            <img src={author.profile_image_url} alt={author.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                            <div className="absolute bottom-4 left-4">
                                                <h3 className="text-white text-2xl font-black leading-tight mb-1">{author.name}</h3>
                                                {author.genre && <span className="text-violet-400 font-bold text-sm tracking-wide uppercase">{author.genre}</span>}
                                            </div>
                                        </Link>

                                        {/* Video Intro Thumb */}
                                        {author.videoIntroductions && author.videoIntroductions.length > 0 && (
                                            <button className="w-full aspect-video rounded-xl bg-black/50 border border-white/10 flex items-center justify-center group/video overflow-hidden relative">
                                                <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${author.profile_image_url})` }}></div>
                                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover/video:bg-white/20 transition-all z-10">
                                                    <Play size={16} className="text-white fill-white" />
                                                </div>
                                                <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-widest text-white/80 z-10">Intro</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Right Column: Bio & Works */}
                                    <div className="flex-1 flex flex-col min-w-0">

                                        {/* Header */}
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                            <div>
                                                <Link to={`/author/${author.id}`} className="group/name block">
                                                    <h2 className="text-3xl font-black text-white mb-2 group-hover/name:text-zinc-300 transition-colors uppercase tracking-tight">{author.name}</h2>
                                                </Link>
                                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                                    {/* Genre Pill */}
                                                    {author.genre && (
                                                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                                                            {author.genre}
                                                        </span>
                                                    )}
                                                    <span>•</span>
                                                    <span>{author.novel_count} Books</span>
                                                    <span>•</span>
                                                    <span>{works.length} Recent Works</span>
                                                </div>
                                            </div>

                                            {/* Follow / Socials */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-3">
                                                    <FollowButton authorId={author.id} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <p className="text-zinc-400 leading-relaxed mb-8 line-clamp-3">
                                            {author.bio || author.about || "No biography available."}
                                        </p>

                                        {/* Works Grid */}
                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Recent Works</h3>
                                                <Link to={`/author/${author.id}`} className="text-xs font-bold text-white flex items-center gap-1 hover:gap-2 transition-all">
                                                    View All <ChevronRight size={12} />
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {works.slice(0, 4).map(work => (
                                                    <Link key={work.id} to={`/book/${work.id}`} className="group/work block space-y-2">
                                                        <div className="aspect-[2/3] rounded-lg bg-zinc-800 overflow-hidden relative shadow-lg ring-1 ring-white/5 group-hover/work:ring-white/20 transition-all">
                                                            {work.cover_image_url ? (
                                                                <img src={work.cover_image_url} alt={work.title} className="w-full h-full object-cover group-hover/work:scale-105 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-zinc-600">
                                                                    <Book size={20} className="mb-2 opacity-50" />
                                                                    <span className="text-[10px] uppercase font-bold">No Cover</span>
                                                                </div>
                                                            )}

                                                            {/* Type Badge */}
                                                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-wider text-white">
                                                                {work.type}
                                                            </div>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-zinc-300 leading-tight group-hover/work:text-white transition-colors line-clamp-2">{work.title}</h4>
                                                    </Link>
                                                ))}
                                                {works.length === 0 && (
                                                    <div className="col-span-full py-6 text-center text-zinc-600 text-sm italic border border-white/5 rounded-xl bg-white/5">
                                                        No recent works found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isFetching && (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                        </div>
                    )}

                    {!isFetching && filteredAuthors.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-zinc-400 mb-2">No Authors Found</h3>
                            <p className="text-zinc-600">Try adjusting your filters or check back later.</p>
                        </div>
                    )}
                    {!isFetching && !hasMore && filteredAuthors.length > 0 && (
                        <div className="text-center py-10">
                            <p className="text-zinc-600">You've reached the end of the list.</p>
                        </div>
                    )}
                </div>
            </section >
        </div >
    );
};

export default Discover;
