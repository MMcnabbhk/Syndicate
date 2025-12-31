import React, { useState } from 'react';
import { useNovels } from '../hooks/useData';
import BookCard from '../components/BookCard';
import { Sparkles, Library as LibraryIcon, Loader2 } from 'lucide-react';

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

const Library = () => {
    const [activeCategory, setActiveCategory] = useState("Literature & Fiction");
    const { data: novels, loading, error } = useNovels();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    // Filter books by category (loose matching) or show all if category not found? 
    // Ideally we match genre. For now, since genres might vary, let's try to filter.
    const filteredBooks = novels ? novels.filter(book =>
        book.genre && book.genre.toLowerCase().includes(activeCategory.split(' ')[0].toLowerCase())
    ) : [];

    // Fallback: If no books match perfectly (e.g. data hasn't been tagged), show all or random
    const displayBooks = filteredBooks.length > 0 ? filteredBooks : (novels || []);

    const trendingBooks = displayBooks.slice(0, 4);
    const allTitles = displayBooks;

    return (
        <div className="pb-20 pt-10">
            {/* Page Header */}
            <header className="container mb-12 text-center">
                <h1
                    className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    style={{ paddingBottom: '20px', paddingTop: '20px' }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Books</span>
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
                <div className="w-full" style={{ height: '60px' }}></div>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">Trending in {activeCategory}</h2>
                    <Sparkles className="text-amber-400" size={20} />
                </div>
                <div className="h-8 w-full"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-10">
                    {trendingBooks.map((book, index) => (
                        <BookCard key={`trend-${index}`} book={book} />
                    ))}
                </div>
            </section>

            {/* Spacer */}
            <div className="h-20 w-full"></div>

            {/* All Titles */}
            <section className="container">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">All Titles</h2>
                    <LibraryIcon className="text-violet-500" size={20} />
                </div>
                <div className="h-8 w-full"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-10">
                    {allTitles.map((book, index) => (
                        <BookCard key={`all-${index}`} book={book} />
                    ))}
                </div>
            </section>

            <div className="h-32 w-full"></div>
        </div>
    );
};

export default Library;
