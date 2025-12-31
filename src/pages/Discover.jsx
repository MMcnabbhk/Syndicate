import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Facebook, Instagram, Twitter, Music, Filter, Play, Star, Book, Headphones, PenTool, Loader2 } from 'lucide-react';
import { useAuthors } from '../hooks/useData';

const CONTENT_TYPES = [
    "All",
    "Novels",
    "Poetry",
    "Short Fiction",
    "Audiobooks"
];

const Discover = () => {
    const [activeType, setActiveType] = useState("All");
    const { data: authors, loading, error } = useAuthors();

    // 1. FILTER: By Content Type
    // 2. EXCLUDE: No Profile Image
    // 3. SORT: Alphabetical by Last Name
    const filteredSortedAuthors = (authors || [])
        .filter(author => {
            // Exclusion: Must have profile image
            if (!author.profile_image_url) return false;

            // Filter: By Content Type
            let passesType = activeType === "All";
            if (!passesType) {
                const type = activeType.toLowerCase();
                // This logic might need adjustment based on real SQL data fields
                // SQL should return counts or we might need to fetch works for each author?
                // For now, assume simpler filtering or we rely on explicit counts if available.
                // Since our adapter passes everything through, let's check for counts.
                if (type === 'novels') passesType = (author.novel_count > 0);
                else if (type === 'poetry') passesType = (author.poem_count > 0 || author.collection_count > 0);
                else if (type === 'short fiction') passesType = (author.story_count > 0);
                else if (type === 'audiobooks') passesType = (author.audiobook_count > 0);
            }
            return passesType;
        })
        .sort((a, b) => {
            // Sort: Alphabetical by Last Name
            const lastNameA = a.name.split(' ').pop();
            const lastNameB = b.name.split(' ').pop();
            return lastNameA.localeCompare(lastNameB);
        });

    const getAuthorWorks = (author) => {
        // If author has works attached (which useAuthors/DB might not provide by default for list),
        // we might leave this empty or update backend to include recent works.
        // For now, let's return empty if not present to avoid crashes.
        return [];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

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
                    {filteredSortedAuthors.map((author, index) => {
                        const works = getAuthorWorks(author);

                        return (
                            <div key={author.id} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-zinc-900/60 transition-colors duration-500">
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


                                    </div>

                                    {/* Right Column: Bio & Works */}
                                    <div className="flex-1 flex flex-col">

                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <Link to={`/author/${author.id}`} className="group inline-block">
                                                    <h2 className="text-3xl font-bold text-white group-hover:text-violet-400 transition-colors hidden lg:block">{author.name}</h2>
                                                </Link>
                                                {author.genre && <span className="text-violet-400 font-bold text-sm tracking-wide uppercase block mt-1">{author.genre}</span>}
                                            </div>
                                            <div className="flex gap-2">
                                                {/* Socials */}
                                                {author.socials && Object.entries(author.socials).map(([platform, url]) => (
                                                    url && (
                                                        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                                                            {platform === 'x' ? <span className="font-bold text-xs">𝕏</span> :
                                                                platform === 'instagram' ? <Instagram size={16} /> :
                                                                    platform === 'facebook' ? <Facebook size={16} /> : <Music size={16} />}
                                                        </a>
                                                    )
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <div className="prose prose-invert max-w-none text-zinc-300 mb-10 leading-relaxed font-light min-h-[150px]">
                                            <p className="line-clamp-6">{author.bio || author.description}</p>
                                        </div>

                                        {/* Last 4 Works */}
                                        <div className="mt-auto">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Recent Works</h4>

                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {works.map(work => (
                                                    <Link key={work.id} to={`/book/${work.id}`} className="group flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-white/5 hover:bg-zinc-800 hover:border-violet-500/30 transition-all">
                                                        <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{work.title}</span>
                                                        <div className="flex items-center gap-3">
                                                            {/* Type Icon */}
                                                            <span className={`p-1.5 rounded-md ${(work.id.startsWith('ab') || work.type === 'Audiobook') ? 'bg-orange-500/10 text-orange-400' :
                                                                (work.id.startsWith('pm') || work.type === 'Poem') ? 'bg-pink-500/10 text-pink-400' :
                                                                    'bg-blue-500/10 text-blue-400'
                                                                }`}>
                                                                {(work.id.startsWith('ab') || work.type === 'Audiobook') ? <Headphones size={14} /> :
                                                                    (work.id.startsWith('pm') || work.type === 'Poem') ? <PenTool size={14} /> :
                                                                        <Book size={14} />}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                                {works.length === 0 && (
                                                    <div className="text-center py-4 border border-dashed border-zinc-800 rounded-lg">
                                                        <span className="text-zinc-600 text-sm">No recent works listed.</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredSortedAuthors.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-zinc-400 mb-2">No Authors Found</h3>
                            <p className="text-zinc-600">Try adjusting your filters or check back later.</p>
                        </div>
                    )}
                </div>
            </section>
        </div >
    );
};

export default Discover;
