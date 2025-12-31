import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Facebook, Instagram, Twitter, Music, Book, PenTool, Headphones, Library, Play, Share2, Star, ChevronRight } from 'lucide-react';

const AuthorProfile = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Use absolute URL to bypass proxy issues
        fetch(`http://localhost:4000/api/authors/${id}/profile`)
            .then(res => res.json())
            .then(profileData => {
                setData(profileData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-500 animate-pulse font-bold tracking-widest uppercase">Loading Creator Profile...</div>;

    if (!data || !data.author) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-4">Author not found</h2>
                <Link to="/discover" className="text-violet-400 hover:underline">Back to Discover</Link>
            </div>
        );
    }

    const { author, works } = data;
    const allWorks = [
        ...(works.poems || []).map(w => ({ ...w, type: 'Poem', icon: PenTool })),
        ...(works.stories || []).map(w => ({ ...w, type: 'Short Fiction', icon: Book })),
        ...(works.audiobooks || []).map(w => ({ ...w, type: 'Audiobook', icon: Headphones })),
        ...(works.collections || []).map(w => ({ ...w, type: 'Poetry Collection', icon: Library })),
        ...(works.novels || []).map(w => ({ ...w, type: 'Novel', icon: Book }))
    ];

    const contributors = [
        'CosmicReader99', 'NeonValkyrie', 'BookWorm_Kai', 'StarDust_Traveler',
        'CyberPunk_Poet', 'LunarEcho', 'SolarFlare_X', 'VoidWalker_01',
        'Chrono_Surfer', 'Nebula_Dreamer'
    ];

    return (
        <div className="bg-[#09090b] min-h-screen pb-40 border-t border-white/5">
            {/* Header / Nav Back */}
            <div className="container pt-8 pb-4">
                <Link to="/discover" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                        <ChevronLeft size={16} />
                    </div>
                    <span className="font-bold text-sm tracking-wide uppercase">Back to Discover</span>
                </Link>
            </div>

            <div style={{ height: '20px' }}></div>

            <div className="container mt-0">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Left Column: Media (Photo & Video) */}
                    <div className="w-full lg:w-52 shrink-0 flex flex-col gap-8">
                        {/* Profile Image - Matches Discover Page Size (w-52) */}
                        <div className="aspect-[2/3] relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
                            {author.profile_image_url ? (
                                <img src={author.profile_image_url} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                                    <span className="text-9xl font-black text-white/5">{author.name.charAt(0)}</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                            {/* Floating Action Button for Share? */}
                            <button className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10">
                                <Share2 size={18} />
                            </button>
                        </div>



                        {/* Contributors Section - Moved to Sidebar */}
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                            <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold" style={{ marginBottom: '26px' }}>Latest Contributors</p>
                            <div className="flex flex-wrap gap-2">
                                {contributors.map((user, i) => (
                                    <div key={i} className="px-3 py-1 bg-black/40 rounded-full border border-white/5 text-zinc-400 text-xs font-medium hover:text-white hover:border-violet-500/50 transition-colors cursor-default">
                                        @{user}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio & Works */}
                    <div className="flex-1">
                        <header className="mb-12">
                            <div className="flex flex-col xl:flex-row gap-6 mb-[20px]">
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">{author.name}</h1>
                                        {author.genre && <span className="text-violet-400 font-bold text-lg tracking-wider uppercase block">{author.genre}</span>}
                                    </div>


                                </div>

                                {/* Moved Video Section */}
                                {author.video_url && (
                                    <div className="w-full xl:w-96 shrink-0">
                                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 h-full">
                                            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Meet the Author</h3>
                                            <div className="relative aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer border border-white/10" onClick={() => setActiveVideo(true)}>
                                                {!activeVideo ? (
                                                    <>
                                                        <img src={author.profile_image_url} className="w-full h-full object-cover opacity-60 blur-sm group-hover:opacity-40 transition-opacity" alt="Video thumbnail" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform">
                                                                <Play fill="white" className="text-white ml-1" size={24} />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <iframe
                                                        src={`https://player.vimeo.com/video/${author.video_url.split('/').pop()}?autoplay=1&title=0&byline=0&portrait=0`}
                                                        className="w-full h-full"
                                                        frameBorder="0"
                                                        allow="autoplay; fullscreen; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bio Box */}
                            <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">About {author.name}</h3>
                                <div className="prose prose-invert prose-lg max-w-none text-zinc-300 font-light leading-relaxed">
                                    <p>{author.bio || author.description}</p>
                                </div>
                            </div>
                        </header>

                        <div className="space-y-16">
                            {/* Works Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                    <span className="w-8 h-[2px] bg-violet-500 block"></span>
                                    Published Works
                                </h2>

                                {allWorks.length > 0 ? (
                                    <div className="space-y-6">
                                        {allWorks.map((work, idx) => (
                                            <div key={idx} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-violet-500/30 hover:bg-zinc-900/50 transition-all duration-300">
                                                {/* Work Image */}
                                                <Link to={work.type === 'Audiobook' ? `/audiobook/${work.id}` : `/book/${work.id}`} className="shrink-0 w-32 aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden shadow-lg group">
                                                    {work.coverImage ? (
                                                        <img src={work.coverImage} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" alt={work.title} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                                            <Book size={20} />
                                                        </div>
                                                    )}
                                                </Link>

                                                <div className="flex-1 flex flex-col">
                                                    {work.genre && (
                                                        <div className="mb-2">
                                                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{work.genre}</span>
                                                        </div>
                                                    )}

                                                    <Link to={work.type === 'Audiobook' ? `/audiobook/${work.id}` : `/book/${work.id}`} className="inline-flex items-center gap-3 group/title">
                                                        <h3 className="text-2xl font-bold text-white group-hover/title:text-violet-400 transition-colors leading-tight">
                                                            {work.title}
                                                        </h3>
                                                        <span className={`p-1.5 rounded-md ${work.type === 'Audiobook' ? 'bg-orange-500/10 text-orange-400' :
                                                            work.type === 'Poem' ? 'bg-pink-500/10 text-pink-400' : 'bg-blue-500/10 text-blue-400'
                                                            }`} title={work.type}>
                                                            {work.type === 'Audiobook' ? <Headphones size={16} /> :
                                                                work.type === 'Poem' ? <PenTool size={16} /> : <Book size={16} />}
                                                        </span>
                                                    </Link>

                                                    <div className="flex items-center gap-1 mb-4 text-yellow-400">
                                                        {work.rating && Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} size={14} className={i < Math.floor(work.rating) ? 'fill-yellow-400' : 'text-zinc-700 fill-zinc-700'} />
                                                        ))}
                                                        <span className="text-zinc-500 text-xs font-bold ml-2">{work.rating} / 5.0</span>
                                                    </div>

                                                    <p className="text-zinc-400 leading-relaxed mb-6 font-light">{work.blurb || work.description || work.shortDescription}</p>

                                                    {/* External Links */}
                                                    {work.externalLinks && work.externalLinks.length > 0 ? (
                                                        <div className="mt-auto flex flex-wrap gap-3">
                                                            {work.externalLinks.map((link, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={link.url}
                                                                    className={`px-4 py-2 border rounded-lg text-xs font-bold text-white uppercase tracking-wider transition-all flex items-center gap-2 ${link.type === 'amazon' ? 'bg-orange-600/20 border-orange-500/30 hover:bg-orange-600/30' :
                                                                        link.type === 'goodreads' ? 'bg-[#372213]/40 border-[#372213] hover:bg-[#372213]/60' :
                                                                            link.type === 'spotify' ? 'bg-green-600/20 border-green-500/30 hover:bg-green-600/30' :
                                                                                'bg-white/5 border-white/10 hover:bg-white/10'
                                                                        }`}
                                                                >
                                                                    {link.type === 'amazon' && 'Amazon'}
                                                                    {link.type === 'goodreads' && 'Goodreads'}
                                                                    {link.type === 'spotify' && 'Spotify'}
                                                                    {link.type === 'audible' && 'Audible'}
                                                                    <Share2 size={12} />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        // Fallback buttons if no external links (mostly for legacy/mock data that wasn't updated)
                                                        <div className="mt-auto flex gap-3 opacity-50">
                                                            <span className="text-xs text-zinc-600">No external links available</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-zinc-500 italic py-8 border-t border-b border-dashed border-zinc-800">No published works listed yet.</div>
                                )}
                            </div>



                            {/* Recommended Authors Section */}
                            {author.recommended_author_ids && author.recommended_author_ids.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                        <span className="w-8 h-[2px] bg-zinc-700 block"></span>
                                        Similar Creators
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {author.recommended_author_ids.map(recId => {
                                            return (
                                                <Link key={recId} to={`/author/${recId}`} className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group">
                                                    <div className="w-12 h-12 rounded-full shrink-0 bg-zinc-800 overflow-hidden flex items-center justify-center border border-white/5">
                                                        <span className="text-lg font-bold text-zinc-500 group-hover:text-white transition-colors">?</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold group-hover:text-violet-400 transition-colors">View Creator</h4>
                                                        <span className="text-xs text-zinc-500">ID: #{recId}</span>
                                                    </div>
                                                    <ChevronRight className="ml-auto text-zinc-600 group-hover:text-white transition-colors" size={16} />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorProfile;
