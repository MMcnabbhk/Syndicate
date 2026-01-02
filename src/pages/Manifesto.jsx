import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

const Manifesto = () => {
    const { userState } = useStore();
    const [initials, setInitials] = useState('');
    const [agreed, setAgreed] = useState(false);

    const isCreator = userState.isAuthenticated && userState.role === 'creator';

    const handleAgree = () => {
        if (initials.trim().length >= 2) {
            setAgreed(true);
            // TODO: Store agreement in database
            console.log('Creator agreed to manifesto:', initials);
        }
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white pb-20">
            <div className="container mx-auto px-4 py-10">
                {/* Page Title */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Manifesto</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#a1a1aa', textAlign: 'center', width: '100%', display: 'block' }}>
                        Where the stories are still written by humans.
                    </p>
                </div>

                <div style={{ height: '40px' }}></div>

                {/* Manifesto Content */}
                <div className="max-w-3xl mx-auto space-y-8">
                    {/* Principle 1 */}
                    <article className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-4xl font-black text-violet-400">1.</span>
                            Human Sourced
                        </h2>
                        <p className="text-zinc-300 leading-relaxed" style={{ marginBottom: '10px' }}>
                            Syndicate is a sanctuary for human creativity. If a human didn't create it, it doesn't belong here. We strictly prohibit the use of LLMs, generative AI, or machine-learning tools to draft, finish, or "enhance" your content. This is a platform for those who bleed for their words, not those who prompt a machine.
                        </p>
                    </article>

                    {/* Principle 2 */}
                    <article className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-4xl font-black text-violet-400">2.</span>
                            No Hidden Hand
                        </h2>
                        <p className="text-zinc-300 leading-relaxed" style={{ marginBottom: '10px' }}>
                            We believe in direct affinity, not feed optimization. Your feed is yours. We never "recommend" stories based on a hidden score, a black-box algorithm, or corporate interests.
                        </p>
                    </article>

                    {/* Principle 3 */}
                    <article className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-4xl font-black text-violet-400">3.</span>
                            The Transparency Pledge
                        </h2>
                        <p className="text-zinc-300 leading-relaxed" style={{ marginBottom: '10px' }}>
                            The "pay-to-play" era is over. You will always know exactly how many people your work is reaching. We promise no shadow-banning, no throttled views, and no hiding your creations from the friends and fans who chose to follow you.
                        </p>
                    </article>

                    {/* Principle 4 */}
                    <article className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-4xl font-black text-violet-400">4.</span>
                            Protection from the Machines
                        </h2>
                        <p className="text-zinc-300 leading-relaxed" style={{ marginBottom: '10px' }}>
                            Your stories belong to you, not a training database. Syndicate employs technical barriers to prevent AI crawlers from "scraping" your work to train machine-learning models. We protect your intellectual property from being used to build its own replacement.
                        </p>
                    </article>

                    {/* Principle 5 */}
                    <article className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="text-4xl font-black text-violet-400">5.</span>
                            The "Slop" Clause
                        </h2>
                        <p className="text-zinc-300 leading-relaxed" style={{ marginBottom: '10px' }}>
                            To keep our community pure, we reserve the right to remove any content identified as machine-generated. We are the immune system against the flood of AI slop. If it doesn't have a human heartbeat, it has no place on Syndicate.
                        </p>
                    </article>

                    {/* Creator Agreement Box */}
                    {isCreator && (
                        <div className="mt-12 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/20 border border-violet-500/30 rounded-2xl p-8">
                            {!agreed ? (
                                <>
                                    <h3 className="text-xl font-bold text-white mb-4">Creator Agreement</h3>
                                    <p className="text-zinc-300 mb-6 leading-relaxed" style={{ marginBottom: '10px' }}>
                                        By signing below, I affirm that I have read and agree to uphold the principles of the Syndicate Manifesto. I commit to creating human-generated content and respecting the community standards outlined above.
                                    </p>
                                    <div className="flex gap-4 items-end">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                                                Enter Your Initials
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={4}
                                                value={initials}
                                                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                                                placeholder="e.g., MJ"
                                                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAgree}
                                            disabled={initials.trim().length < 2}
                                            className="px-8 py-3 bg-violet-600 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-bold rounded-lg hover:bg-violet-700 transition-colors"
                                        >
                                            Sign Manifesto
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="inline-flex items-center gap-3 text-green-400 mb-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="font-bold text-lg">Manifesto Signed</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">
                                        You have agreed to uphold the principles of Syndicate. Initials: <span className="font-mono text-white">{initials}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 40px spacer below the initial box */}
                    {isCreator && <div style={{ height: '40px' }}></div>}

                    {!isCreator && userState.isAuthenticated && (
                        <div className="mt-12 bg-zinc-900/30 border border-white/5 rounded-2xl p-8 text-center">
                            <p className="text-zinc-400">
                                The creator agreement is only available to users with a creator account.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Manifesto;
