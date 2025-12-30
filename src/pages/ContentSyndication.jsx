import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Undo2, Redo2, Bold, Italic, Strikethrough, Code, Link,
    Image as ImageIcon,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, ChevronDown, Settings, X, PlusCircle
} from 'lucide-react';

const ContentSyndication = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [alignment, setAlignment] = useState('left');
    const [showAlignDropdown, setShowAlignDropdown] = useState(false);

    const handleSave = () => {
        console.log("Saving Content:", { title, subtitle, content, alignment });
        // Future: navigate('/next-step');
    };

    const handleAlign = (align) => {
        setAlignment(align);
        setShowAlignDropdown(false);
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans relative">




            {/* Page Header Title */}
            <div className="pt-[40px] pb-4">
                <header className="container text-center mx-auto px-4 mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Upload Content</span>
                    </h1>
                </header>
            </div>

            {/* 30px space bar below title */}
            <div className="h-[30px] w-full"></div>

            {/* Toolbar */}
            <div className="sticky top-0 z-40 bg-[#333333]/95 backdrop-blur-sm border-b border-zinc-800 px-6 py-3 flex items-center justify-center gap-2 overflow-x-auto">

                <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><Undo2 size={27} /></button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><Redo2 size={27} /></button>
                </div>

                <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><Bold size={27} /></button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><Italic size={27} /></button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><Strikethrough size={27} /></button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><Code size={27} /></button>
                </div>

                <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><Link size={27} /></button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><ImageIcon size={27} /></button>
                </div>

                <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><List size={27} /></button>
                    <button className="p-2 hover:bg-zinc-800 rounded text-white"><ListOrdered size={27} /></button>

                    {/* Alignment Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowAlignDropdown(!showAlignDropdown)}
                            className="p-2 hover:bg-zinc-800 rounded text-white flex items-center gap-1"
                        >
                            {alignment === 'left' && <AlignLeft size={27} />}
                            {alignment === 'center' && <AlignCenter size={27} />}
                            {alignment === 'right' && <AlignRight size={27} />}
                            <ChevronDown size={14} className="text-zinc-400" />
                        </button>

                        {showAlignDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 flex flex-col p-1 min-w-[150px]">
                                <button onClick={() => handleAlign('left')} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded text-sm text-zinc-300 hover:text-white text-left">
                                    <AlignLeft size={18} /> Align Left
                                </button>
                                <button onClick={() => handleAlign('center')} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded text-sm text-zinc-300 hover:text-white text-left">
                                    <AlignCenter size={18} /> Align Center
                                </button>
                                <button onClick={() => handleAlign('right')} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded text-sm text-zinc-300 hover:text-white text-left">
                                    <AlignRight size={18} /> Align Right
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* 10px space bar below toolbar */}
            <div className="h-[10px] w-full"></div>

            {/* Editor Area */}
            <main className="flex-1 flex flex-col items-center py-12 px-6 overflow-y-auto">
                <div className="w-full max-w-[864px] space-y-4">
                    {/* Preview Link */}
                    <div className="flex justify-end mb-[-6px]">
                        <button className="text-[#cc5500] hover:text-[#ff7a20] text-sm font-medium transition-colors">
                            Preview
                        </button>
                    </div>

                    {/* Title */}
                    <textarea
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-[36px] font-bold text-white placeholder-zinc-400 border border-white/10 rounded-lg p-4 focus:ring-1 focus:ring-violet-500/50 resize-none leading-tight bg-transparent"
                        rows={1}
                        style={{ overflowX: 'hidden', overflowY: 'hidden' }}
                    />
                    {/* Subtitle */}
                    <textarea
                        placeholder="Add a subtitle..."
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full text-[20px] text-zinc-400 placeholder-zinc-400 border border-white/10 rounded-lg p-4 focus:ring-1 focus:ring-violet-500/50 resize-none leading-normal italic font-serif bg-transparent"
                        rows={1}
                    />
                    {/* Writing Area */}
                    <textarea
                        placeholder="Start writing..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full text-[19px] text-zinc-200 placeholder-zinc-400 border border-white/10 rounded-lg p-4 focus:ring-1 focus:ring-violet-500/50 resize-none leading-relaxed min-h-[600px] font-serif bg-transparent"
                    />
                </div>

                {/* 30px space before button */}
                <div className="h-[30px]"></div>

                {/* Save & Continue Button */}
                <div className="flex justify-center w-full">
                    <button
                        onClick={handleSave}
                        className="bg-transparent border border-[#cc5500] text-[#cc5500] hover:bg-[#cc5500] hover:text-white font-semibold py-3 px-10 rounded-lg transition-colors w-full md:w-auto"
                    >
                        Save & Continue
                    </button>
                </div>

                {/* 100px space between input and footer */}
                <div className="h-[100px]"></div>
            </main>
        </div>
    );
};

export default ContentSyndication;
