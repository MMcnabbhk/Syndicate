
import React from 'react';
import { useNovels } from '../hooks/useData';
import BookCard from '../components/BookCard';
import { Sparkles, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { data: novels, loading, error } = useNovels();

    if (novels && novels.length > 0) {
        console.log('HomePage First Book:', JSON.stringify(novels[0], null, 2));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-20 text-center">
                <p className="text-red-500">Error loading books: {error}</p>
            </div>
        );
    }

    // Data is already adapted by the hook
    const featuredBook = novels?.[0];
    const trendingBooks = Array(4).fill(novels || []).flat().slice(0, 8);
    const newArrivalsBooks = Array(4).fill(novels || []).flat().slice(0, 8);

    if (!featuredBook) {
        return (
            <div className="container py-20 text-center">
                <p className="text-zinc-400">No books available</p>
            </div>
        );
    }

    return (
        <div className="pb-20 min-h-screen">
            {/* 30px space bar under navigation */}
            <div className="h-[30px] w-full"></div>
            {/* Hero Section */}
            <section className="relative w-full pt-10 pb-20">
                {/* ... existing hero content ... */}
                <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text */}
                    <div className="max-w-2xl">
                        {/* ... */}
                        <div className="inline-flex items-center gap-1 bg-violet-500/20 border border-violet-500/30 text-violet-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={12} /> Featured Series
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                            {featuredBook.title}
                        </h1>
                        <p className="text-xl text-zinc-300 mb-8 font-light max-w-lg leading-relaxed">
                            {featuredBook.blurb}
                        </p>
                        <div className="flex justify-start">
                            <Link to={`/book/${featuredBook.id}`} className="text-white hover:text-violet-400 font-bold text-lg underline decoration-violet-500 underline-offset-4 transition-colors">
                                Start Reading
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Feature Image */}
                    <div className="relative">
                        <div className="translate-x-[20px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative z-10 w-full max-w-[320px] mx-auto rotate-3 hover:rotate-0 transition-all duration-500">
                            <img src={featuredBook.coverImage} className="w-full h-full object-cover" alt={featuredBook.title} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Spacer for visual separation */}
            <div className="h-20 w-full"></div>

            {/* Trending Section (Rows 1 & 2) */}
            <section className="container">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                    <TrendingUp className="text-violet-500" />
                </div>

                <div className="h-8 w-full"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-10">
                    {trendingBooks.map((book, index) => (
                        <BookCard key={`${book.id}-${index}`} book={book} />
                    ))}
                </div>
            </section>

            {/* Spacer between sections */}
            <div className="h-20 w-full"></div>

            {/* New Arrivals Section (Rows 3 & 4) */}
            <section className="container">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">New Arrivals</h2>
                    <Calendar className="text-amber-500" />
                </div>

                <div className="h-8 w-full"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-10">
                    {newArrivalsBooks.map((book, index) => (
                        <BookCard key={`new-${book.id}-${index}`} book={book} />
                    ))}
                </div>
            </section>

            {/* Spacer before footer */}
            <div className="h-32 w-full"></div>
        </div>
    );
};

export default HomePage;
