import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Search, MinusCircle, Library, BookOpen, PenTool, Headphones } from 'lucide-react';

// Mock data
const mockFollowedCreators = [
    {
        id: '1',
        name: 'Elena Fisher',
        bio: 'Sci-Fi author exploring silent worlds.',
        avatar: '', // Placeholder
        followers: 1200,
        worksCount: 3,
        primaryGenre: 'Novel'
    },
    {
        id: '2',
        name: 'Marcus Thorne',
        bio: 'Poet of the urban decay.',
        avatar: '', // Placeholder
        followers: 850,
        worksCount: 5,
        primaryGenre: 'Poetry'
    },
    {
        id: '3',
        name: 'Sarah J. Miller',
        bio: 'Fantasy writer, dragon enthusiast.',
        avatar: '', // Placeholder
        followers: 2300,
        worksCount: 2,
        primaryGenre: 'Short Story'
    }
];

// Helper to get icon by genre
const getGenreIcon = (genre) => {
    switch (genre) {
        case 'Novel': return <Library size={12} />;
        case 'Poetry': return <PenTool size={12} />;
        case 'Short Story': return <BookOpen size={12} />;
        case 'Audiobook': return <Headphones size={12} />;
        case 'Visual Arts': return <PenTool size={12} />;
        default: return <BookOpen size={12} />;
    }
};

const FollowingCreators = () => {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setCreators(mockFollowedCreators);
            setLoading(false);
        }, 600);
    }, []);

    const handleUnfollow = (e, creatorId) => {
        e.preventDefault(); // Prevent navigation
        if (window.confirm('Stop following this creator?')) {
            setCreators(creators.filter(c => c.id !== creatorId));
            // Actual API call would go here
        }
    };

    const filteredCreators = creators.filter(creator =>
        creator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-violet-500 mb-2">Creators</h1>
                    <p className="text-zinc-400">Hear the humans. Tear down the Wall</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Search className="text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 bg-[#1a1a1a] border border-white/10 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Explicit 50px spacer */}
            <div style={{ height: '50px' }}></div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            ) : filteredCreators.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCreators.map((creator) => (
                            <Link
                                key={creator.id}
                                to={`/author/${creator.id}`}
                                className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 hover:border-violet-500/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center border-2 border-[#1a1a1a] shadow-lg group-hover:border-violet-500/50 transition-colors">
                                        {creator.avatar ? (
                                            <img src={creator.avatar} alt={creator.name} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <User size={32} className="text-zinc-500 group-hover:text-violet-400 transition-colors" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white truncate group-hover:text-violet-400 transition-colors">{creator.name}</h3>

                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                                                {getGenreIcon(creator.primaryGenre)}
                                                {creator.primaryGenre}
                                            </span>
                                        </div>

                                        <p className="text-sm text-zinc-500 mb-2 truncate">{creator.bio}</p>
                                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                                            <div className="flex items-center gap-1">
                                                <Users size={12} />
                                                <span>{creator.followers.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                {creator.worksCount} Works
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleUnfollow(e, creator.id)}
                                        className="text-zinc-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                                        title="Unfollow"
                                    >
                                        <MinusCircle size={20} />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* 30px spacing under the row of creators */}
                    <div style={{ height: '30px' }}></div>
                </>
            ) : (
                <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-white/5 border-dashed">
                    <Users size={48} className="text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No creators found</h3>
                    <p className="text-zinc-400 mb-6">
                        {searchTerm ? "No follows match your search." : "You're not following any creators yet."}
                    </p>
                    <Link to="/discover" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors">
                        Find Creators
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FollowingCreators;
