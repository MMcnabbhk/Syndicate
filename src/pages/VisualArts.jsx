import React, { useState } from 'react';
import { Palette, Camera, Monitor, Brush, PenTool, Printer } from 'lucide-react';
import Image from '../components/Image';

const VisualArts = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        { id: 'photography', label: 'Photography', icon: Camera },
        { id: 'digital-art', label: 'Digital Art', icon: Monitor },
        { id: 'painting', label: 'Painting', icon: Brush },
        { id: 'drawing', label: 'Drawing', icon: PenTool },
        { id: 'printmaking', label: 'Printmaking', icon: Printer },
    ];

    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchWorks = async () => {
            try {
                const response = await fetch('/api/visual-arts');
                if (response.ok) {
                    const data = await response.json();
                    setWorks(data);
                }
            } catch (error) {
                console.error("Failed to fetch visual arts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, []);

    // Helper to normalize category strings for comparison
    const normalize = (str) => str.toLowerCase().replace(/-/g, ' ');

    const filteredWorks = works.filter(work => {
        if (activeCategory === 'All') return true;
        // Check fuzzy match on genre/category if the backend schema uses 'genre' for art type
        // The API schema for VisualArt likely has 'genre' or similar. 
        // Based on other files, visual arts might reuse 'genre' or have specific fields.
        // Assuming 'genre' holds values like 'Photography', 'Digital Art' etc.
        const workType = work.genre || work.type || '';
        // Mapping category IDs to expected values
        const categoryMap = {
            'photography': 'photography',
            'digital-art': 'digital art',
            'painting': 'painting',
            'drawing': 'drawing',
            'printmaking': 'printmaking'
        };
        const target = categoryMap[activeCategory];
        return normalize(workType).includes(target);
    });

    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="container mx-auto px-4 py-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Palette size={48} className="text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Arts</span>
                    </h1>
                    <p className="text-xl text-zinc-400" style={{ marginBottom: '20px', textAlign: 'center' }}>
                        Raw visions. No filters.
                    </p>

                    {/* Submenu */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setActiveCategory('All')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${activeCategory === 'All'
                                ? 'bg-violet-600 text-white border-violet-500'
                                : 'bg-[#1a1a1a] text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${activeCategory === cat.id
                                    ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-900/40'
                                    : 'bg-[#1a1a1a] text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                <cat.icon size={16} />
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="mt-12">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                        </div>
                    ) : filteredWorks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredWorks.map((work) => (
                                <div key={work.id} className="group relative break-inside-avoid">
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#1a1a1a] border border-white/5">
                                        <Image
                                            src={work.cover_image_url || 'https://via.placeholder.com/400x600?text=No+Image'}
                                            alt={work.title}
                                            width={400} // Request optimized width
                                            quality={90}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <h3 className="text-xl font-bold text-white mb-1">{work.title}</h3>
                                            <p className="text-sm text-zinc-300 font-medium">By Author {work.author_id}</p> {/* Ideally fetch author name or join */}
                                            <span className="text-xs text-violet-400 mt-2 uppercase tracking-wider font-bold">{work.genre}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-zinc-900/20 rounded-2xl border border-white/5 border-dashed">
                            <Palette size={48} className="mx-auto text-zinc-700 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No art found</h3>
                            <p className="text-zinc-500">
                                No visual arts found for <span className="text-violet-400">{activeCategory === 'All' ? 'any category' : activeCategory}</span> yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualArts;
