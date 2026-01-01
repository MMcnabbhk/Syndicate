import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Undo2, Redo2, Bold, Italic, Strikethrough, Code, Link,
    Image as ImageIcon,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, ChevronDown, Settings, X, PlusCircle, Cloud
} from 'lucide-react';

const NewWork = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [alignment, setAlignment] = useState('left');
    const [showAlignDropdown, setShowAlignDropdown] = useState(false);
    const [workType, setWorkType] = useState('');
    const [genre, setGenre] = useState('');
    const [syndicationCadence, setSyndicationCadence] = useState('');
    const [fullDownload, setFullDownload] = useState('');
    const [description, setDescription] = useState('');
    const [goodreadsLink, setGoodreadsLink] = useState('');
    const [amazonLink, setAmazonLink] = useState('');
    const [spotifyLink, setSpotifyLink] = useState('');
    const [images, setImages] = useState([
        { url: '', file: null, caption: '' },
        { url: '', file: null, caption: '' },
        { url: '', file: null, caption: '' }
    ]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [sequence, setSequence] = useState('');

    // Load saved draft on mount
    useEffect(() => {
        const savedData = localStorage.getItem('newWorkDraft');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.title) setTitle(parsed.title);
                if (parsed.content) setContent(parsed.content);
                if (parsed.alignment) setAlignment(parsed.alignment);
                if (parsed.workType) setWorkType(parsed.workType);
                if (parsed.genre) setGenre(parsed.genre);
                if (parsed.syndicationCadence) setSyndicationCadence(parsed.syndicationCadence);
                if (parsed.fullDownload) setFullDownload(parsed.fullDownload);
                if (parsed.description) setDescription(parsed.description);
                if (parsed.goodreadsLink) setGoodreadsLink(parsed.goodreadsLink);
                if (parsed.amazonLink) setAmazonLink(parsed.amazonLink);
                if (parsed.spotifyLink) setSpotifyLink(parsed.spotifyLink);
                if (parsed.selectedVideo) setSelectedVideo(parsed.selectedVideo);
                if (parsed.chapterTitle) setChapterTitle(parsed.chapterTitle);
                if (parsed.sequence) setSequence(parsed.sequence);
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    // Auto-save draft on changes
    useEffect(() => {
        const timer = setTimeout(() => {
            const dataToSave = {
                title, content, alignment, workType, genre,
                syndicationCadence, fullDownload, description,
                goodreadsLink, amazonLink, spotifyLink,
                selectedVideo, chapterTitle, sequence
            };
            localStorage.setItem('newWorkDraft', JSON.stringify(dataToSave));
        }, 1000); // Auto-save after 1 second of inactivity

        return () => clearTimeout(timer);
    }, [title, content, alignment, workType, genre,
        syndicationCadence, fullDownload, description,
        goodreadsLink, amazonLink, spotifyLink,
        selectedVideo, chapterTitle, sequence]);

    const saveToLocalStorage = () => {
        // Generate ID if new
        const currentId = localStorage.getItem('currentWorkId') || crypto.randomUUID();
        localStorage.setItem('currentWorkId', currentId);

        const workData = {
            id: currentId,
            title: title || 'Untitled Work',
            status: 'Draft',
            genre: genre || 'Unspecified',
            subscribers: 0,
            rating: 0,
            lifetimeEarnings: '0.00',
            color: 'text-violet-500',
            lastUpdated: new Date().toISOString(),
            type: workType || 'novel',
            // Save all other metadata
            description,
            syndicationCadence,
            fullDownload,
            externalLinks: { goodreadsLink, amazonLink, spotifyLink },
            images,
            videos: [selectedVideo]
        };

        const chapterData = {
            id: crypto.randomUUID(),
            workId: currentId,
            title: chapterTitle || 'Untitled Chapter',
            sequence: sequence || 1,
            content: content,
            savedAt: new Date().toISOString()
        };

        // Save Work
        const existingWorks = JSON.parse(localStorage.getItem('myWorks') || '[]');
        const workIndex = existingWorks.findIndex(w => w.id === currentId);
        if (workIndex >= 0) {
            existingWorks[workIndex] = workData;
        } else {
            existingWorks.push(workData);
        }
        localStorage.setItem('myWorks', JSON.stringify(existingWorks));

        // Save Chapter
        const existingChapters = JSON.parse(localStorage.getItem('myChapters') || '[]');
        const filteredChapters = existingChapters.filter(c => !(c.workId === currentId && c.sequence === sequence));
        filteredChapters.push(chapterData);
        localStorage.setItem('myChapters', JSON.stringify(filteredChapters));

        return currentId;
    };

    const handleSaveWork = () => {
        saveToLocalStorage();
        // Clear draft
        localStorage.removeItem('newWorkDraft');
        localStorage.removeItem('currentWorkId'); // Reset current work context
        navigate('/manage-works');
    };

    const handleAddNextChapter = () => {
        saveToLocalStorage();
        // Reset chapter fields for next chapter
        setChapterTitle('');
        setContent('');
        setSequence(prev => Number(prev) + 1);
        // Keep work metadata (title, genre, etc)
        // Scroll to top of editor
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAlign = (align) => {
        setAlignment(align);
        setShowAlignDropdown(false);
    };

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            const newImages = [...images];
            newImages[index] = { ...newImages[index], url: newUrl, file };
            setImages(newImages);
        }
    };

    const handleImageCaptionChange = (index, value) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], caption: value };
        setImages(newImages);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages[index] = { url: '', file: null, caption: '' };
        setImages(newImages);
    };

    // Toolbar Handlers
    const handleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        // Sync content changes manually if needed, but onInput handles typing.
        // For buttons, we might need to trigger an update if we want state to match exactly immediately,
        // but the onInput of the div will catch subsequent edits. To be safe:
        const editor = document.querySelector('[contentEditable]');
        if (editor) setContent(editor.innerHTML);
    };

    const handleLink = () => {
        const url = prompt('Enter URL:');
        if (url) handleFormat('createLink', url);
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans relative">




            {/* Page Header Title */}
            <div className="pt-[40px] pb-4">
                <header className="container text-center mx-auto px-4 mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">New Work</span>
                    </h1>
                    <p className="text-zinc-400 mt-4 text-sm">Add new Work to your <span style={{ color: '#cc5500' }}>Syndicate</span> profile.</p>
                </header>
            </div>

            {/* 40px space bar below tagline */}
            <div className="h-[40px] w-full"></div>

            {/* Editor Area */}
            <main className="flex-1 flex flex-col items-center py-12 px-6 overflow-y-auto">
                <div className="w-full max-w-[864px] space-y-4">
                    {/* Metadata Fields */}
                    <div className="mb-8">
                        {/* Type Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Type</label>
                            <select
                                value={workType}
                                onChange={(e) => setWorkType(e.target.value)}
                                className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none"
                            >
                                <option value="">Select type...</option>
                                <option value="novel">Novel</option>
                                <option value="short-story">Short Story</option>
                                <option value="poem">Poem</option>
                                <option value="audiobook">Audiobook</option>
                            </select>
                        </div>

                        {/* Title Input */}
                        <div className="mt-[10px]">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter title..."
                                className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                            />
                        </div>

                        {/* Genre Input */}
                        <div className="mt-[10px]">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Genre</label>
                            <input
                                type="text"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                placeholder="Enter genre..."
                                className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                            />
                        </div>

                        {/* Syndication Cadence */}
                        <div style={{ marginTop: '20px' }}>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Syndication Cadence</label>
                            <p className="text-sm text-zinc-500" style={{ marginBottom: '10px' }}>How often do you want your subscribers to receive your Work?</p>
                            <div className="flex gap-6" style={{ marginTop: '10px' }}>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cadence"
                                        value="1"
                                        checked={syndicationCadence === '1'}
                                        onChange={(e) => setSyndicationCadence(e.target.value)}
                                        className="w-4 h-4 text-violet-500 bg-[#1a1a1a] border-white/20 focus:ring-violet-500/50"
                                    />
                                    <span className="text-white">1 day</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cadence"
                                        value="3"
                                        checked={syndicationCadence === '3'}
                                        onChange={(e) => setSyndicationCadence(e.target.value)}
                                        className="w-4 h-4 text-violet-500 bg-[#1a1a1a] border-white/20 focus:ring-violet-500/50"
                                    />
                                    <span className="text-white">3 days</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="cadence"
                                        value="7"
                                        checked={syndicationCadence === '7'}
                                        onChange={(e) => setSyndicationCadence(e.target.value)}
                                        className="w-4 h-4 text-violet-500 bg-[#1a1a1a] border-white/20 focus:ring-violet-500/50"
                                    />
                                    <span className="text-white">7 days</span>
                                </label>
                            </div>

                            {/* Full Download Label */}
                            <div style={{ marginTop: '10px' }}>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Full Download</label>
                                <p className="text-sm text-zinc-500" style={{ marginBottom: '5px' }}>Do you want to allow full digital downloads of this Work?</p>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="fullDownload"
                                            value="yes"
                                            checked={fullDownload === 'yes'}
                                            onChange={(e) => setFullDownload(e.target.value)}
                                            className="w-4 h-4 text-violet-500 bg-[#1a1a1a] border-white/20 focus:ring-violet-500/50"
                                        />
                                        <span className="text-white">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="fullDownload"
                                            value="no"
                                            checked={fullDownload === 'no'}
                                            onChange={(e) => setFullDownload(e.target.value)}
                                            className="w-4 h-4 text-violet-500 bg-[#1a1a1a] border-white/20 focus:ring-violet-500/50"
                                        />
                                        <span className="text-white">No</span>
                                    </label>
                                </div>
                            </div>

                            {/* Book Description */}
                            <div style={{ marginTop: '10px' }}>
                                <label className="block text-sm font-medium text-zinc-400" style={{ marginBottom: '5px' }}>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your Work for your audience."
                                    className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500 resize-none"
                                    rows={12}
                                />
                                <div className="text-right mt-1">
                                    <span className="text-xs text-zinc-500">
                                        {description.trim().split(/\s+/).filter(word => word.length > 0).length} / 500 words
                                    </span>
                                </div>
                            </div>

                            {/* External Links */}
                            <div style={{ marginTop: '10px' }}>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">External Links</label>
                                <p className="text-sm text-zinc-500" style={{ marginBottom: '10px' }}>These are links for this specific Work and will display on the Work's page.</p>

                                {/* Goodreads */}
                                <div className="mb-3">
                                    <label className="block text-xs text-zinc-500 mb-1">Goodreads</label>
                                    <input
                                        type="url"
                                        value={goodreadsLink}
                                        onChange={(e) => setGoodreadsLink(e.target.value)}
                                        placeholder="https://www.goodreads.com/..."
                                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                                    />
                                </div>

                                {/* Amazon */}
                                <div className="mb-3">
                                    <label className="block text-xs text-zinc-500 mb-1">Amazon</label>
                                    <input
                                        type="url"
                                        value={amazonLink}
                                        onChange={(e) => setAmazonLink(e.target.value)}
                                        placeholder="https://www.amazon.com/..."
                                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                                    />
                                </div>

                                {/* Spotify */}
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-1">Spotify</label>
                                    <input
                                        type="url"
                                        value={spotifyLink}
                                        onChange={(e) => setSpotifyLink(e.target.value)}
                                        placeholder="https://open.spotify.com/..."
                                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                                    />
                                </div>
                            </div>

                            {/* Images */}
                            <div style={{ marginTop: '10px' }}>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Images</label>
                                <p className="text-sm text-zinc-500" style={{ marginBottom: '10px' }}>Upload the image for your book, short fiction, collection or exhibit. Image 1 is the hero image that will appear on the Work page.</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {images.map((img, index) => (
                                        <div key={index} className="flex flex-col">
                                            <label style={{ marginBottom: '5px', display: 'block' }} className="text-xs font-bold text-zinc-500">
                                                Image {index + 1}
                                            </label>

                                            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-800 border border-white/20 shadow-2xl group transition-all hover:border-violet-500/50">
                                                {img.url ? (
                                                    <>
                                                        <img src={img.url} className="w-full h-full object-cover" alt={`Work Image ${index + 1}`} />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group/label">
                                                        <div className="p-4 rounded-full bg-white/5 group-hover/label:bg-white/10 mb-2 transition-colors">
                                                            <Cloud size={24} className="text-zinc-500 group-hover/label:text-violet-500" />
                                                        </div>
                                                        <span className="text-xs text-zinc-500 font-medium">Upload</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleImageUpload(index, e)}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Videos */}
                            <div style={{ marginTop: '20px' }}>
                                <label className="block text-sm font-medium text-zinc-400 mb-2">Videos</label>
                                <p className="text-sm text-zinc-500" style={{ marginBottom: '10px' }}>Select a video to promote this Work.</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[1, 2, 3, 4].map((videoNum) => (
                                        <div key={videoNum} className="flex flex-col">
                                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-800 border border-white/20 shadow-xl">
                                                <div className="w-full h-full flex items-center justify-center text-zinc-500">
                                                    <span className="text-sm">Video {videoNum} Placeholder</span>
                                                </div>
                                            </div>

                                            <label className="flex items-center gap-2 cursor-pointer mt-3">
                                                <input
                                                    type="radio"
                                                    name="selectedVideo"
                                                    value={`video${videoNum}`}
                                                    checked={selectedVideo === `video${videoNum}`}
                                                    onChange={(e) => setSelectedVideo(e.target.value)}
                                                    className="w-4 h-4 text-violet-500 bg-[#1a1a1a] border-white/20 focus:ring-violet-500/50"
                                                />
                                                <span className="text-sm text-zinc-400">Display This Video</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 50px space bar below Videos */}
                    <div className="h-[50px] w-full"></div>

                    {/* Toolbar */}
                    <div className="sticky top-0 z-40 bg-[#333333]/95 backdrop-blur-sm border-b border-zinc-800 px-6 py-3 flex items-center justify-center gap-2 overflow-x-auto">

                        <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('undo')} className="p-2 hover:bg-zinc-800 rounded text-white"><Undo2 size={27} /></button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('redo')} className="p-2 hover:bg-zinc-800 rounded text-white"><Redo2 size={27} /></button>
                        </div>

                        <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('bold')} className="p-2 hover:bg-zinc-800 rounded text-white"><Bold size={27} /></button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('italic')} className="p-2 hover:bg-zinc-800 rounded text-white"><Italic size={27} /></button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('strikeThrough')} className="p-2 hover:bg-zinc-800 rounded text-white"><Strikethrough size={27} /></button>
                        </div>

                        <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                            <button onMouseDown={(e) => e.preventDefault()} onClick={handleLink} className="p-2 hover:bg-zinc-800 rounded text-white"><Link size={27} /></button>
                            {/* Image button intentionally disabled for inline images to encourage using the main Image Upload section, but could be enabled if requested */}
                            <button className="p-2 hover:bg-zinc-800 rounded text-zinc-600 cursor-not-allowed" title="Use Image Upload section above"><ImageIcon size={27} /></button>
                        </div>

                        <div className="flex items-center gap-1.5 border-r border-zinc-800 pr-2 mr-2">
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('insertUnorderedList')} className="p-2 hover:bg-zinc-800 rounded text-white"><List size={27} /></button>
                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleFormat('insertOrderedList')} className="p-2 hover:bg-zinc-800 rounded text-white"><ListOrdered size={27} /></button>

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
                                        <button onClick={() => { handleFormat('justifyLeft'); handleAlign('left'); }} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded text-sm text-zinc-300 hover:text-white text-left">
                                            <AlignLeft size={18} /> Align Left
                                        </button>
                                        <button onClick={() => { handleFormat('justifyCenter'); handleAlign('center'); }} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded text-sm text-zinc-300 hover:text-white text-left">
                                            <AlignCenter size={18} /> Align Center
                                        </button>
                                        <button onClick={() => { handleFormat('justifyRight'); handleAlign('right'); }} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded text-sm text-zinc-300 hover:text-white text-left">
                                            <AlignRight size={18} /> Align Right
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Chapter Title */}
                    <div style={{ marginTop: '10px' }} className="w-full">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Chapter Title</label>
                        <input
                            type="text"
                            value={chapterTitle}
                            onChange={(e) => setChapterTitle(e.target.value)}
                            className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none"
                        />
                    </div>

                    {/* Sequence */}
                    <div style={{ marginTop: '10px' }} className="w-full">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Chapter Sequence</label>
                        <select
                            value={sequence}
                            onChange={(e) => setSequence(e.target.value)}
                            className={`w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none appearance-none ${sequence ? 'text-white' : 'text-zinc-500'}`}
                        >
                            <option value="" disabled>Select sequence number</option>
                            {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                <option key={num} value={num} className="text-black">{num}</option>
                            ))}
                        </select>
                    </div>

                    {/* Text Input Section */}
                    <div style={{ marginTop: '10px' }} className="w-full">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Text Input</label>
                        <div className="flex justify-between items-center mb-0">
                            <p className="text-sm text-zinc-500">Select the Font in Word or your word processing software before pasting your text. We will present the Work in your chosen font in 12 points.</p>
                        </div>

                        <div className="h-[10px]"></div>

                        {/* Writing Area */}
                        {/* Writing Area - Content Editable to capture font styles */}
                        <div
                            contentEditable
                            onInput={(e) => setContent(e.currentTarget.innerHTML)}
                            className="w-full text-white placeholder-zinc-500 border border-white/20 rounded-lg p-4 focus:ring-1 focus:ring-violet-500/50 resize-none leading-relaxed min-h-[600px] bg-transparent outline-none overflow-y-auto"
                            style={{
                                fontSize: '19px', // Default size if not specified in paste
                            }}
                            dangerouslySetInnerHTML={{ __html: content }}
                            data-placeholder="Paste your text here"
                            onBlur={(e) => {
                                if (e.currentTarget.innerHTML === '<br>') {
                                    e.currentTarget.innerHTML = '';
                                    setContent('');
                                }
                            }}
                        />
                        <style jsx>{`
                            [contentEditable]:empty:before {
                                content: attr(data-placeholder);
                                color: #71717a;
                                font-family: var(--font-sans);
                                pointer-events: none;
                                display: block; /* For Firefox */
                            }
                        `}</style>
                    </div>
                </div>

                {/* 30px space before button */}
                <div className="h-[30px]"></div>

                {/* Save & Continue Buttons */}
                <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-2xl mx-auto">
                    <button
                        onClick={handleAddNextChapter}
                        style={{ backgroundColor: '#cc5500', borderColor: '#cc5500' }}
                        className="flex-1 text-white hover:opacity-90 font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
                    >
                        <PlusCircle size={20} />
                        Save & Add Next Chapter
                    </button>
                    <button
                        onClick={handleSaveWork}
                        style={{ backgroundColor: '#cc5500', borderColor: '#cc5500' }}
                        className="flex-1 text-white hover:opacity-90 font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-orange-900/20"
                    >
                        Save Work (Draft)
                    </button>
                </div>

                {/* 20px spacer */}
                <div className="h-[20px]"></div>

                {/* Helper Text */}
                <p className="text-violet-500 text-sm text-center">
                    Preview your Work on the Manage Works page.
                </p>

                {/* 100px space between input and footer */}
                <div className="h-[100px]"></div>
            </main>
        </div>
    );
};

export default NewWork;
