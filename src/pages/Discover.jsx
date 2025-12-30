import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Facebook, Instagram, Twitter, Music, Filter } from 'lucide-react';

const CATEGORIES = [
    "All",
    "Literature & Fiction",
    "Biography & Memoirs",
    "Thriller & Suspense",
    "Romance",
    "Fantasy",
    "Horror",
    "Sci-fi",
    "Adult"
];

const CONTENT_TYPES = [
    "All",
    "Novels",
    "Poetry",
    "Short Fiction",
    "Audiobooks"
];

const Discover = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('/api/authors')
            .then(res => res.json())
            .then(data => {
                setAuthors(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Fetch works for all authors to enable filtering (in real app, use a server-side filter endpoint)
    // For this prototype, if authors is empty, we'll try to show something or handle loading
    const filteredAuthors = authors.filter(author => {
        let passesCategory = activeCategory === "All";
        if (!passesCategory && author.genre) {
            passesCategory = author.genre.toLowerCase().includes(activeCategory.toLowerCase());
        }

        let passesType = activeType === "All";
        if (!passesType && passesCategory) {
            const type = activeType.toLowerCase();
            if (type === 'novels') passesType = author.novel_count > 0;
            else if (type === 'poetry') passesType = author.poem_count > 0 || author.collection_count > 0;
            else if (type === 'short fiction') passesType = author.story_count > 0;
            else if (type === 'audiobooks') passesType = author.audiobook_count > 0;
        }

        return passesCategory && passesType;
    });

    if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse font-bold tracking-widest uppercase">Initializing Discovery Layer...</div>;

    return (
        <div className="pb-20 pt-10 animate-fade-in">
            <section className="container mb-20 space-y-6">
                <div className="flex flex-col items-center gap-6">
                    {/* Content Type Submenu */}
                    <div className="flex flex-wrap gap-2 items-center justify-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mr-2">Type:</span>
                        {CONTENT_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border ${activeType === type
                                    ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                                    : 'bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Genre Submenu */}
                    <div className="flex flex-wrap gap-3 items-center justify-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mr-2">Genre:</span>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container">
                <header className="mb-0 text-center max-w-2xl mx-auto">
                    {/* Explicit Spacer Block Above */}
                    <div className="h-10"></div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Discover Your Next Obsession</h1>

                    {/* Explicit Spacer Block Below */}
                    <div className="h-[10px]"></div>

                    <p className="text-zinc-400 text-lg text-left">
                        Explore the minds behind the stories. From time-bending thrillers to neon-soaked cyberpunk, find the authors defining the new age of serialization.
                    </p>
                </header>

                <div className="h-[40px]"></div>

                <div className="flex flex-col gap-24">
                    {filteredAuthors.map((author, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <div key={author.id} className={`flex flex-col md:flex-row gap-10 md:gap-16 items-start ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                                {/* Author Image (Left or Right) */}
                                <div className="w-full md:w-1/3 max-w-[250px] shrink-0 mx-auto md:mx-0">
                                    <Link to={`/author/${author.id}`} className="block aspect-[3/4] bg-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer ring-1 ring-white/5 hover:ring-violet-500/50 transition-all duration-700">
                                        {author.profile_image_url ? (
                                            <img src={author.profile_image_url} alt={author.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                                                <span className="text-8xl font-black text-white/5">{author.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute bottom-6 left-6 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <span className="text-white text-xs font-black tracking-[0.3em] uppercase">Enter Profile</span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Author Details */}
                                <div className="flex-1 pt-2">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                                        {/* Name as Headline Link */}
                                        <Link to={`/author/${author.id}`} className="inline-block group">
                                            <h3 className="text-2xl md:text-4xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-400 transition-all duration-300 leading-tight">
                                                {author.name}
                                            </h3>
                                        </Link>

                                        {/* Genre Badge */}
                                        {author.genre && (
                                            <span className="px-3 py-1 bg-white/10 text-violet-300 text-sm font-bold uppercase tracking-wider rounded-full backdrop-blur-sm self-start md:self-auto mb-2 md:mb-4 whitespace-nowrap border border-white/5">
                                                {author.genre}
                                            </span>
                                        )}
                                    </div>

                                    {/* Social Links */}
                                    {author.socials && (
                                        <div className="flex items-center gap-3 mb-6">
                                            {author.socials.facebook && (
                                                <a href={author.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                                    <Facebook size={18} />
                                                </a>
                                            )}
                                            {author.socials.x && (
                                                <a href={author.socials.x} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                                    {/* Custom X Icon */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                                    </svg>
                                                </a>
                                            )}
                                            {author.socials.instagram && (
                                                <a href={author.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                                    <Instagram size={18} />
                                                </a>
                                            )}
                                            {author.socials.tiktok && (
                                                <a href={author.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                                    <Music size={18} />
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="text-xl text-zinc-300 mb-10 leading-relaxed max-w-2xl font-light">
                                        {author.bio || author.description}
                                    </p>

                                    <Link to={`/author/${author.id}`} className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-violet-600/20 text-white font-bold rounded-full border border-white/5 hover:border-violet-500/30 transition-all">
                                        Explore Creator Works <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Discover;
