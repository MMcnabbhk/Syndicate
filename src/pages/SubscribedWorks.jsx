import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, Calendar, Trash2, HeartHandshake } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const SubscribedWorks = () => {
    const { userState } = useStore();
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribedWorks = async () => {
            if (!userState.isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:4000/api/subscriptions', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setWorks(data);
                } else {
                    console.error('Failed to fetch subscriptions');
                }
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribedWorks();
    }, [userState.isAuthenticated]);

    const handleUnsubscribe = async (workId) => {
        if (window.confirm("Are you sure you want to unsubscribe from this work?")) {
            try {
                const response = await fetch(`http://localhost:4000/api/subscriptions/${workId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    setWorks(works.filter(work => work.id !== workId));
                } else {
                    alert('Failed to unsubscribe. Please try again.');
                }
            } catch (error) {
                console.error('Error unsubscribing:', error);
                alert('An error occurred while unsubscribing.');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold text-purple-500 mb-2">Subscribed Works</h1>
            <p className="text-zinc-400">Your world. Your rules. No gatekeepers.</p>
            <div style={{ height: '30px' }}></div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            ) : works.length > 0 ? (
                <div className="grid grid-cols-1 gap-5">
                    {works.map((work) => (
                        <div key={work.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 flex flex-col md:flex-row items-start gap-6 hover:border-violet-500/30 transition-all group">


                            {/* Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 uppercase tracking-wide">
                                                {work.genre}
                                            </span>
                                            <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                <Calendar size={12} />
                                                {work.syndicationCadence}
                                            </span>
                                        </div>
                                        <Link to={`/book/${work.id}`} className="text-xl font-bold text-white hover:text-violet-400 transition-colors mb-1 block">
                                            {work.title}
                                        </Link>
                                        <Link to={`/author/${work.authorId}`} className="text-sm text-zinc-400 hover:text-white transition-colors block mb-2">
                                            {work.author}
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleUnsubscribe(work.id)}
                                            className="text-xs font-medium text-zinc-500 hover:text-red-400 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Unsubscribe
                                        </button>
                                        <Link
                                            to={`/author/${work.authorId}/contribute`}
                                            className="text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-violet-900/20"
                                        >
                                            <HeartHandshake size={14} />
                                            Contribute
                                        </Link>
                                    </div>
                                </div>

                                <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-1">
                                    {work.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-white/5 border-dashed">
                    <BookOpen size={48} className="text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No Subscribed Works</h3>
                    <p className="text-zinc-400 mb-6">You haven't subscribed to any works yet.</p>
                    <div style={{ height: '20px' }}></div>
                    <Link
                        to="/discover"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#cc5500',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '9999px',
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            paddingLeft: '29px',
                            paddingRight: '29px',
                            textDecoration: 'none',
                            transition: 'background-color 200ms'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#aa4400'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#cc5500'}
                    >
                        Discover Works
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SubscribedWorks;
