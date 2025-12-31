import React, { useState, useEffect } from 'react';
import { useAudiobooks, useNovels } from '../hooks/useData';
import BookCard from '../components/BookCard';
import { Sparkles, Library } from 'lucide-react';

const CATEGORIES = [
    "Literature & Fiction",
    "Biography & Memoirs",
    "Thriller & Suspense",
    "Romance",
    "Fantasy",
    "Horror",
    "Sci-fi",
    "Adult"
];

const AudioBooks = () => {
    const { data: audiobooks, loading, error } = useAudiobooks();
    const [activeCategory, setActiveCategory] = useState("Literature & Fiction");

    if (loading) return <div className="container py-20 text-center text-zinc-500">Loading audiobooks...</div>;
    if (error) return <div className="container py-20 text-center text-red-500">Error: {error}</div>;

    // Use audiobooks from API
    const allTitles = audiobooks || [];
    const trendingBooks = allTitles.slice(0, 4);

    return (
        <div className="pb-20 pt-10">
            {/* Page Header */}
            <header className="container mb-12 text-center">
                <h1
                    className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    style={{ paddingBottom: '20px', paddingTop: '20px' }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">AudioBooks</span>
                </h1>
            </header>

            <section className="container mb-20">
                <div className="flex items-center justify-center">
                    {/* Centered Submenu */}
                    <div className="flex flex-wrap gap-3 items-center justify-center">
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

            {/* Trending In Category */}
            <section className="container">
                <div className="h-10 w-full"></div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">Trending in {activeCategory}</h2>
                    <Sparkles className="text-amber-400" size={20} />
                </div>
                <div className="h-8 w-full"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-10">
                    {trendingBooks.map((book, index) => (
                        <BookCard key={`trend-${index}`} book={book} variant="audio" />
                    ))}
                </div>
            </section>

            {/* Spacer */}
            <div className="h-20 w-full"></div>

            {/* All Titles */}
            <section className="container">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">All Titles</h2>
                    <Library className="text-violet-500" size={20} />
                </div>
                <div className="h-8 w-full"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-10">
                    {allTitles.map((book, index) => (
                        <BookCard key={`all-${index}`} book={book} variant="audio" />
                    ))}
                </div>
            </section>

            {/* Footer spacer already handled by layout? No, Homepage adds manual spacer before footer. Layout has footer margin. 
               Let's add a spacer here too to match visual weight if needed, or rely on Layout. 
               User asked for "More space between top of footer and bottom of image" in homepage. 
               I'll add a modest spacer here to be safe.
            */}
            <div className="h-32 w-full"></div>
        </div>
    );
};

export default AudioBooks;
