
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';

const getWorkLink = (type, id) => {
    switch (type) {
        case 'Novel': return `/book/${id}`;
        case 'Audiobook': return `/audiobooks`; // Fallback until AudiobookProfile exists
        case 'Short Story': return `/stories`; // Fallback
        case 'Poem': return `/poetry`; // Fallback
        case 'Visual Art': return `/visual-arts`; // Fallback
        default: return `/`;
    }
};

// Function to deterministically generate grid classes based on index to ensure "Mondrian" feel
// but consistent render. Randomness can be seeded or just index-based pattern.
const getGridClass = (index) => {
    // Pattern: Big Square, Tall, Wide, Small, Small, Wide, Big...
    // 0: Big (2x2)
    // 1: Tall (1x2)
    // 2: Small (1x1)
    // 3: Wide (2x1)
    // 4: Small (1x1)
    // etc.
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

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await fetch('/api/feed');
                const data = await res.json();
                setWorks(data);
            } catch (err) {
                console.error("Failed to fetch feed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (loading) return <div className="text-white text-center mt-20">Loading Feed...</div>;

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
                author_name: '', // No author name for message
                color: '#F97316' // Orange
            });
        }
    });

    return (
        <div className="min-h-screen bg-black text-white">
            <Marquee items={marqueeItems} style={{ marginBottom: '30px' }} />

            {/* Mondrian Grid */}
            <div
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[200px] gap-4"
                style={{ paddingLeft: '50px', paddingRight: '50px', paddingTop: '20px', paddingBottom: '20px' }}
            >
                {works.map((work, index) => (
                    <Link
                        to={getWorkLink(work.type, work.id)}
                        key={`${work.type}-${work.id}`}
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

            {works.length === 0 && (
                <div className="text-center text-gray-500 mt-20">No works found in the feed.</div>
            )}
        </div>
    );
};

export default HomePage;
