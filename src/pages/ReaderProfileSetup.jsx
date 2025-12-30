import React, { useState } from 'react';
import { Image, Upload } from 'lucide-react';

const ReaderProfileSetup = () => {
    const [name, setName] = useState('Michael James');
    const [handle, setHandle] = useState('@mjamesauthor');
    const [bio, setBio] = useState('Exploding onto the literary scene in 2024 with his acclaimed novella Tyger, Michael James\'s writing explores identity, memory, and the quiet defiance of those left behind.');

    return (
        <div className="min-h-screen bg-[#111111] text-white flex justify-center py-10 px-4">
            <div className="w-full max-w-[680px]">

                <div className="h-[40px]"></div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Profile</span>
                    </h1>
                    <div className="h-[60px]"></div>
                </div>

                <div>

                    {/* Name Field */}
                    <div className="std-form-group">
                        <label className="std-label">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="std-input"
                        />
                    </div>

                    {/* Handle Field */}
                    <div className="std-form-group">
                        <label className="std-label">Handle</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value)}
                                className="std-input text-zinc-300"
                            />
                            <button className="px-5 py-2 bg-[#222] hover:bg-[#333] border border-zinc-700 rounded-lg text-sm font-medium transition-colors">
                                Edit
                            </button>
                        </div>
                    </div>

                    {/* Bio Field */}
                    <div className="std-form-group">
                        <label className="std-label">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={4}
                            className="std-input text-zinc-300 resize-none leading-relaxed"
                        />
                    </div>

                    <div className="h-[50px]"></div>

                    <hr className="border-zinc-800" />

                    <div className="h-[50px]"></div>

                    {/* Theme Section Header */}
                    <div>
                        <h3 className="text-xl font-semibold mb-1">Theme</h3>
                        <p className="text-zinc-500 text-sm">Customize the look of your profile.</p>
                    </div>

                    <div className="h-[30px]"></div>

                    {/* Cover Image */}
                    <div className="std-form-group">
                        <label className="std-label">Cover image</label>
                        <div className="border border-zinc-800 rounded-xl bg-[#161616] h-[240px] flex flex-col items-center justify-center cursor-pointer hover:bg-[#1c1c1c] transition-colors group">
                            <div className="mb-4 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                <Image size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-zinc-400 text-sm mb-2 font-medium">Drop your cover image here</p>
                            <p className="text-zinc-600 text-xs mb-6">3:1 aspect ratio • At least 1200px wide</p>
                            <button className="bg-[#222] text-white text-xs font-semibold px-4 py-2 rounded-full border border-zinc-700 group-hover:bg-[#333] transition-colors">
                                Select image
                            </button>
                        </div>
                    </div>

                    <div className="h-[50px]"></div>

                    <hr className="border-zinc-800" />

                    <div className="h-[50px]"></div>

                    {/* Social Links */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Social links</h3>
                            <p className="text-zinc-500 text-sm">Connect your other accounts to let people know where to find you.</p>
                        </div>
                        <button className="bg-[#222] text-white text-sm font-medium px-4 py-2 rounded-lg border border-zinc-700 hover:bg-[#333] transition-colors">
                            Get app
                        </button>
                    </div>

                    <div className="h-[50px]"></div>

                    {/* Action Bar (Not strictly in screenshot but usually needed for forms) */}
                    <div className="pt-10 flex justify-end">
                        <button className="bg-[#cc5500] hover:bg-[#b34b00] text-white font-semibold py-2.5 px-8 rounded-lg transition-colors">
                            Continue
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ReaderProfileSetup;
