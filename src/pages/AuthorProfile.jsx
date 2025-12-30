import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Facebook, Instagram, Twitter, Music, Book, PenTool, Headphones, Library } from 'lucide-react';

const AuthorProfile = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/authors/${id}/profile`)
            .then(res => res.json())
            .then(profileData => {
                setData(profileData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-20 text-center text-zinc-500 animate-pulse font-bold tracking-widest uppercase">Loading Creator Profile...</div>;

    if (!data || !data.author) {
        return (
            <div className="p-20 text-center text-white">
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

    return (
        <div className="container py-20 pb-40">
            <Link to="/discover" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
                <ChevronLeft size={20} /> Back to Discover
            </Link>

            <div className="max-w-4xl mx-auto text-center mb-16">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-8 shadow-2xl shadow-violet-500/10 border-4 border-white/5`}>
                    {author.profile_image_url ? (
                        <img src={author.profile_image_url} alt={author.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        <span className="text-4xl font-bold text-white">{author.name.charAt(0)}</span>
                    )}
                </div>

                <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">{author.name}</h1>

                {/* Social Links */}
                {author.socials && (
                    <div className="flex items-center justify-center gap-4 mb-6">
                        {author.socials.facebook && (
                            <a href={author.socials.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                <Facebook size={20} />
                            </a>
                        )}
                        {author.socials.x && (
                            <a href={author.socials.x} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                {/* Custom X Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </a>
                        )}
                        {author.socials.instagram && (
                            <a href={author.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                <Instagram size={20} />
                            </a>
                        )}
                        {author.socials.tiktok && (
                            <a href={author.socials.tiktok} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                <Music size={20} />
                            </a>
                        )}
                    </div>
                )}

                <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto">{author.bio || author.description}</p>
            </div>

            {/* Works Section */}
            <div className="max-w-4xl mx-auto mb-20">
                <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Published Works</h2>

                {allWorks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {allWorks.map((work, idx) => (
                            <Link
                                key={idx}
                                to={work.type === 'Audiobook' ? `/audiobook/${work.id}` : `/book/${work.id}`}
                                className="group block p-6 bg-zinc-900/40 backdrop-blur rounded-2xl border border-white/5 hover:border-violet-500/30 hover:bg-zinc-800/60 transition-all duration-500"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-zinc-500 group-hover:text-violet-400 group-hover:bg-violet-500/10 transition-all">
                                        <work.icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-violet-500 transition-colors">{work.type}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors mb-2">
                                    {work.title}
                                </h3>
                                <p className="text-sm text-zinc-500 line-clamp-2">{work.description || work.summary}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-zinc-500 italic text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/5">No published works listed yet.</div>
                )}
            </div>

            {/* Recommended Authors Section */}
            {author.recommended_author_ids && author.recommended_author_ids.length > 0 && (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">Recommended Authors</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {author.recommended_author_ids.map(recId => (
                            <Link key={recId} to={`/author/${recId}`} className="flex items-center gap-4 p-4 bg-zinc-900/30 rounded-xl border border-white/5 hover:bg-zinc-800 transition-all group">
                                <div className="w-12 h-12 rounded-full shrink-0 bg-violet-600/20 flex items-center justify-center border border-violet-500/20">
                                    <span className="text-lg font-bold text-violet-400">?</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold group-hover:text-violet-400 transition-colors">Creator #{recId}</h4>
                                    <span className="text-xs text-zinc-500">View Inspo Profile</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthorProfile;
