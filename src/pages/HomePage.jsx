
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';

const getWorkLink = (type, id) => {
    switch (type) {
        case 'Novel': return `/book/${id}`;
        case 'Audiobook': return `/audiobooks`;
        case 'Short Story': return `/stories`;
        case 'Poem': return `/poetry`;
        case 'Visual Art': return `/visual-arts`;
        default: return `/`;
    }
};

const getGridClass = (index) => {
    const pattern = [
        'col-span-2 row-span-2', // Big
        'col-span-1 row-span-2', // Tall
        'col-span-1 row-span-1', // Small
        'col-span-2 row-span-1', // Wide
        'col-span-1 row-span-1', // Small
        'col-span-1 row-span-2', // Tall
        'col-span-2 row-span-2', // Big
        'col-span-1 row-span-1', // Small
        'col-span-1 row-span-1', // Small
    ];
    return pattern[index % pattern.length];
};

const HomePage = () => {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeed = async (pageNum) => {
        try {
            const res = await fetch(`/api/feed?page=${pageNum}&limit=20`);
            const data = await res.json();

            if (Array.isArray(data)) {
                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setWorks(prev => pageNum === 1 ? data : [...prev, ...data]);
                }
            } else {
                setWorks(pageNum === 1 ? [] : works);
                setHasMore(false);
            }
        } catch (err) {
            console.error("Failed to fetch feed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed(1);
    }, []);

    // Infinite scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore && !loading) {
                setLoading(true);
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    // Fetch more when page changes
    useEffect(() => {
        if (page > 1) {
            fetchFeed(page);
        }
    }, [page]);

    if (loading && works.length === 0) {
        return <div className="text-white text-center mt-20">Loading Feed...</div>;
    }

    // Prepare Marquee Items with Special Messages
    const marqueeItems = [];
    works.slice(0, 15).forEach((work, index) => {
        marqueeItems.push(work);
        // Insert message every 3 works
        if ((index + 1) % 3 === 0) {
            marqueeItems.push({
                id: `msg-${index}`,
                title: Math.floor(index / 3) % 2 === 0
                    ? " • Hey Zuck - Tear down the wall. • "
                    : " • Why are you paying Mr. Zuckerberg to reach your own friends? • ",
                author_name: '',
                color: '#F97316'
            });
        }
    });

    return (
        <div className="min-h-screen bg-black text-white" style={{ paddingTop: '20px' }}>
            {/* Marquee with left/right padding to align with grid */}
            <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                <Marquee items={marqueeItems} style={{ marginBottom: '30px' }} />
            </div>

            {/* Mondrian Grid */}
            <div
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[200px] gap-4"
                style={{ paddingLeft: '50px', paddingRight: '50px', paddingBottom: '20px' }}
            >
                {works.map((work, index) => (
                    <Link
                        to={getWorkLink(work.type, work.id)}
                        key={`${work.type}-${work.id}-${index}`}
                        className={`relative group overflow-hidden border border-gray-800 bg-gray-900 ${getGridClass(index)}`}
                    >
                        {work.cover_image_url ? (
                            <img
                                src={work.cover_image_url}
                                alt={work.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                                No Image
                            </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-orange-500 font-bold text-lg leading-tight mb-1">{work.title}</h3>
                            <p className="text-white text-sm">{work.author_name}</p>
                            <span className="text-xs text-gray-400 mt-2 uppercase tracking-wide border border-gray-600 px-2 py-0.5 rounded-full w-fit">
                                {work.type}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {loading && works.length > 0 && (
                <div className="text-white text-center py-8">Loading more...</div>
            )}

            {/* End of content indicator */}
            {!hasMore && works.length > 0 && (
                <div className="text-center text-gray-500 py-8">No more works to load</div>
            )}

            {/* Empty state */}
            {works.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-20">No works found in the feed.</div>
            )}
        </div>
    );
};

export default HomePage;
