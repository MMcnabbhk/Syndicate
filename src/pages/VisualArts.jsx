import React from 'react';
import { Palette } from 'lucide-react';

const VisualArts = () => {
    return (
        <div className="min-h-screen bg-[#111111] text-white">
            <div className="container mx-auto px-4 py-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Palette size={48} className="text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Arts</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Discover visual artwork from independent creators.
                    </p>
                </div>

                {/* Coming Soon Message */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-12 backdrop-blur-sm text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We're building a space for visual artists to share their work directly with their audience.
                            Stay tuned for illustrations, digital art, photography, and more.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualArts;
