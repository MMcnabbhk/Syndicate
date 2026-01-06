import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Undo2, Redo2, Bold, Italic, Strikethrough, Link as LinkIcon,
    ImageIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
    ChevronDown, Save, ArrowLeft
} from 'lucide-react';
import DOMPurify from 'dompurify';

const EditChapter = () => {
    const { authorId, workId, chapterId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [chapters, setChapters] = useState([]);
    const [title, setTitle] = useState('');
    const [workTitle, setWorkTitle] = useState('');
    const [chapterNumber, setChapterNumber] = useState(1);
    const [content, setContent] = useState('');

    // Toolbar state
    const [showAlignDropdown, setShowAlignDropdown] = useState(false);
    const [alignment, setAlignment] = useState('left');

    // Fetch all chapters for the sidebar
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await fetch(`/api/novels/${workId}/chapters`);
                if (!res.ok) throw new Error('Failed to fetch chapters');
                const data = await res.json();
                setChapters(data || []);
            } catch (err) {
                console.error("Error fetching chapters list:", err);
            }
        };

        const fetchWork = async () => {
            try {
                const res = await fetch(`/api/novels/${workId}`);
                if (!res.ok) throw new Error('Failed to fetch work');
                const data = await res.json();
                setWorkTitle(data.title);
            } catch (err) {
                console.error("Error fetching work details:", err);
            }
        };

        fetchChapters();
        fetchWork();
    }, [workId]);

    // Fetch specific chapter details when selected
    useEffect(() => {
        const fetchChapter = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/chapters/${chapterId}`);
                if (!res.ok) throw new Error('Failed to fetch chapter');
                const data = await res.json();
                setTitle(data.title);
                setChapterNumber(data.chapter_number);
                setContent(data.content_html || '');
            } catch (err) {
                console.error("Error fetching chapter:", err);
                alert("Failed to load chapter.");
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [chapterId]);

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/chapters/${chapterId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    chapter_number: chapterNumber,
                    content_html: content,
                })
            });

            if (!res.ok) throw new Error('Failed to update chapter');
            alert('Chapter updated successfully');

            // Refresh chapters list to reflect title/number changes
            const chaptersRes = await fetch(`/api/novels/${workId}/chapters`);
            const chaptersData = await chaptersRes.json();
            setChapters(chaptersData || []);

        } catch (err) {
            console.error("Error saving chapter:", err);
            alert("Failed to save changes.");
        }
    };

    // Toolbar Handlers
    const handleFormat = (command) => {
        document.execCommand(command, false, null);
    };

    const handleLink = () => {
        const url = prompt("Enter link URL:");
        if (url) {
            document.execCommand('createLink', false, url);
        }
    };

    const handleAlign = (align) => {
        setAlignment(align);
        setShowAlignDropdown(false);
    };

    const handleChapterClick = (id) => {
        navigate(`/author/${authorId}/work/${workId}/chapter/${id}/edit`);
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white flex flex-col">
            <style>{`
                #chapter-editor * {
                    color: white !important;
                    background-color: transparent !important;
                }
            `}</style>
            {/* Header */}
            <div className="border-b border-white/5 bg-[#1a1a1a] sticky top-0 z-50 shrink-0">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/author/${authorId}/manage-works`)}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to Manage Works
                    </button>

                    <button
                        onClick={handleSave}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="h-[20px]"></div>

            <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Chapter List */}
                <div className="lg:col-span-1 border-r border-white/5 pr-6 h-[calc(100vh-120px)] overflow-y-auto">
                    <h3 className="font-bold text-lg text-white mb-[10px]">Chapters</h3>
                    <div className="space-y-2">
                        {chapters.sort((a, b) => a.chapter_number - b.chapter_number).map((chapter) => (
                            <div
                                key={chapter.id}
                                onClick={() => handleChapterClick(chapter.id)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${String(chapter.id) === String(chapterId)
                                    ? 'bg-violet-600/20 border border-violet-500/50 text-white'
                                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                <div className="text-sm font-medium">
                                    <span className="opacity-50 mr-2">{chapter.chapter_number}.</span>
                                    {chapter.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Editor */}
                <div className="lg:col-span-3 h-[calc(100vh-120px)] overflow-y-auto pb-20">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col items-center mb-8">
                                <h1 className="text-2xl font-bold">Edit Chapter</h1>
                                {workTitle && <span className="text-sm text-zinc-400 mt-[10px]">{workTitle}</span>}
                            </div>
                            {/* Inputs */}
                            <div className="mb-8">
                                <div className="mb-[10px]">
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Sequence</label>
                                    <input
                                        type="number"
                                        value={chapterNumber}
                                        onChange={(e) => setChapterNumber(parseInt(e.target.value))}
                                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Chapter Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Toolbar */}
                            <div className="h-[20px]"></div>

                            <div className="flex justify-center mb-0">
                                <div className="bg-[#222] border border-white/10 rounded-lg px-4 py-3 flex items-center gap-2 overflow-x-auto">
                                    <div className="flex items-center gap-1.5 border-r border-white/10 pr-2 mr-2">
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('undo')} className="p-2 hover:bg-white/10 rounded text-white"><Undo2 size={27} /></button>
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('redo')} className="p-2 hover:bg-white/10 rounded text-white"><Redo2 size={27} /></button>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-r border-white/10 pr-2 mr-2">
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('bold')} className="p-2 hover:bg-white/10 rounded text-white"><Bold size={27} /></button>
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('italic')} className="p-2 hover:bg-white/10 rounded text-white"><Italic size={27} /></button>
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('strikeThrough')} className="p-2 hover:bg-white/10 rounded text-white"><Strikethrough size={27} /></button>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-r border-white/10 pr-2 mr-2">
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={handleLink} className="p-2 hover:bg-white/10 rounded text-white"><LinkIcon size={27} /></button>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-r border-white/10 pr-2 mr-2">
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('insertUnorderedList')} className="p-2 hover:bg-white/10 rounded text-white"><List size={27} /></button>
                                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('insertOrderedList')} className="p-2 hover:bg-white/10 rounded text-white"><ListOrdered size={27} /></button>

                                        <div className="relative">
                                            <button
                                                onClick={() => setShowAlignDropdown(!showAlignDropdown)}
                                                className="p-2 hover:bg-white/10 rounded text-white flex items-center gap-1"
                                            >
                                                {alignment === 'left' && <AlignLeft size={27} />}
                                                {alignment === 'center' && <AlignCenter size={27} />}
                                                {alignment === 'right' && <AlignRight size={27} />}
                                                <ChevronDown size={14} className="text-zinc-400" />
                                            </button>

                                            {showAlignDropdown && (
                                                <div className="absolute top-full left-0 mt-1 bg-[#333] border border-white/10 rounded-lg shadow-xl z-50 flex flex-col p-1 min-w-[150px]">
                                                    <button onClick={() => { handleFormat('justifyLeft'); handleAlign('left'); }} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded text-sm text-zinc-300 hover:text-white text-left">
                                                        <AlignLeft size={18} /> Align Left
                                                    </button>
                                                    <button onClick={() => { handleFormat('justifyCenter'); handleAlign('center'); }} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded text-sm text-zinc-300 hover:text-white text-left">
                                                        <AlignCenter size={18} /> Align Center
                                                    </button>
                                                    <button onClick={() => { handleFormat('justifyRight'); handleAlign('right'); }} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded text-sm text-zinc-300 hover:text-white text-left">
                                                        <AlignRight size={18} /> Align Right
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[20px]"></div>

                            {/* Editor Container */}
                            <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
                                {/* Editor Area */}
                                <div
                                    id="chapter-editor"
                                    contentEditable
                                    onInput={(e) => setContent(e.currentTarget.innerHTML)}
                                    className="w-full text-white placeholder-zinc-500 p-8 focus:outline-none min-h-[600px] leading-relaxed"
                                    style={{
                                        fontSize: '18px',
                                        caretColor: 'white'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditChapter;
