import React, { useState, useEffect } from 'react';
import {
    Undo2, Redo2, Bold, Italic, Strikethrough, Code, Link,
    Image as ImageIcon,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, ChevronDown, X, Cloud, PlusCircle
} from 'lucide-react';

const WorkForm = ({ initialData = {}, onSave, onAddNextChapter, isEditing = false }) => {
    // Initialize state from props or defaults
    const [title, setTitle] = useState(initialData.title || '');
    const [content, setContent] = useState(initialData.content || '');
    const [alignment, setAlignment] = useState(initialData.alignment || 'left');
    const [showAlignDropdown, setShowAlignDropdown] = useState(false);
    const [workType, setWorkType] = useState(initialData.workType || 'Novel');
    const [genre, setGenre] = useState(initialData.genre || '');
    const [syndicationCadence, setSyndicationCadence] = useState(initialData.syndicationCadence || '3');
    const [fullDownload, setFullDownload] = useState(initialData.fullDownload || 'no');
    const [description, setDescription] = useState(initialData.description || '');
    const [goodreadsLink, setGoodreadsLink] = useState(initialData.goodreadsLink || '');
    const [amazonLink, setAmazonLink] = useState(initialData.amazonLink || '');
    const [spotifyLink, setSpotifyLink] = useState(initialData.spotifyLink || '');
    const [chapterSpotifyLink, setChapterSpotifyLink] = useState(initialData.chapterSpotifyLink || '');
    const [collectionTitle, setCollectionTitle] = useState(initialData.collectionTitle || '');

    // Handle images array safely for general work covers
    const [images, setImages] = useState(initialData.images || [
        { url: '', file: null, caption: '' },
        { url: '', file: null, caption: '' },
        { url: '', file: null, caption: '' }
    ]);

    // Handle folio image specifically for entries like Visual Arts
    const [folioImage, setFolioImage] = useState(initialData.folioImage || { url: '', file: null, caption: '' });

    const [selectedVideo, setSelectedVideo] = useState(initialData.selectedVideo || '');
    const [chapterTitle, setChapterTitle] = useState(initialData.chapterTitle || '');
    const [chapterDescription, setChapterDescription] = useState(initialData.chapterDescription || '');
    const [sequence, setSequence] = useState(initialData.sequence || 1);

    // Update state when initialData changes (for editing mode switching)
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
            setAlignment(initialData.alignment || 'left');
            setWorkType(initialData.workType || 'Novel');
            setGenre(initialData.genre || '');
            setSyndicationCadence(initialData.syndicationCadence || '3');
            setFullDownload(initialData.fullDownload || 'no');
            setDescription(initialData.description || '');
            setGoodreadsLink(initialData.goodreadsLink || '');
            setAmazonLink(initialData.amazonLink || '');
            setSpotifyLink(initialData.spotifyLink || '');
            setChapterSpotifyLink(initialData.chapterSpotifyLink || '');
            setCollectionTitle(initialData.collectionTitle || '');
            setImages(initialData.images || [
                { url: '', file: null, caption: '' },
                { url: '', file: null, caption: '' },
                { url: '', file: null, caption: '' }
            ]);
            setFolioImage(initialData.folioImage || { url: '', file: null, caption: '' });
            setSelectedVideo(initialData.selectedVideo || '');
            setChapterTitle(initialData.chapterTitle || '');
            setChapterDescription(initialData.chapterDescription || '');
            setSequence(initialData.sequence || 1);
        }
    }, [initialData]);


    const handleAlign = (align) => {
        setAlignment(align);
        setShowAlignDropdown(false);
    };

    const handleGridImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            const newImages = [...images];
            newImages[index] = { ...newImages[index], url: newUrl, file };
            setImages(newImages);
        }
    };

    const removeGridImage = (index) => {
        const newImages = [...images];
        newImages[index] = { url: '', file: null, caption: '' };
        setImages(newImages);
    };

    const handleFolioImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            setFolioImage({ url: newUrl, file, caption: '' });
        }
    };

    const removeFolioImage = () => {
        setFolioImage({ url: '', file: null, caption: '' });
    };

    // Toolbar Handlers
    const handleFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        const editor = document.querySelector('[contentEditable]');
        if (editor) setContent(editor.innerHTML);
    };

    const handleLink = () => {
        const url = prompt('Enter URL:');
        if (url) handleFormat('createLink', url);
    };

    const getFormData = () => ({
        title, content, alignment, workType, genre,
        syndicationCadence, fullDownload, description,
        goodreadsLink, amazonLink, spotifyLink, chapterSpotifyLink, collectionTitle,
        images, folioImage, selectedVideo, chapterTitle, chapterDescription, sequence
    });

    return (
        <div className="w-full max-w-[864px] space-y-4">
            {/* Metadata Fields */}
            <div className="mb-8">
                {/* Type Dropdown */}
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Type <span className="text-red-500">*</span></label>
                    <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none"
                    >
                        <option value="Novel">Novel</option>
                        <option value="Short Story">Short Story</option>
                        <option value="Poem">Poem</option>
                        <option value="Audiobook">Audiobook</option>
                        <option value="Visual Arts">Visual Arts</option>
                    </select>
                </div>

                {/* Title Input */}
                <div className="mt-[10px]">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                        {workType === 'Visual Arts' ? 'Show Title' : 'Title'} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={workType === 'Visual Arts' ? "Enter show title..." : "Enter title..."}
                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                    />
                </div>

                {/* Collection Title Field - Now in Work Metadata section for Poems and Short Stories */}
                {(workType === 'Poem' || workType === 'Short Story') && (
                    <div style={{ marginTop: '10px' }} className="w-full">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Collection Title</label>
                        <input
                            type="text"
                            value={collectionTitle}
                            onChange={(e) => setCollectionTitle(e.target.value)}
                            placeholder="Enter collection title..."
                            className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                        />
                    </div>
                )}

                {/* Genre Input */}
                <div className="mt-[10px]">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                        {workType === 'Visual Arts' ? 'Medium' : 'Genre'} <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder={workType === 'Visual Arts' ? "Enter medium (e.g. Oil on Canvas)..." : "Enter genre..."}
                        className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                    />
                </div>

                {/* Syndication Cadence */}
                <div style={{ marginTop: '20px' }}>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Syndication Cadence <span className="text-red-500">*</span></label>
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
                    <label className="block text-sm font-medium text-zinc-400" style={{ marginBottom: '5px' }}>Description <span className="text-red-500">*</span></label>
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


                {/* Images - Hidden for Visual Arts since it uses per-folio upload */}
                {workType !== 'Visual Arts' && (
                    <div style={{ marginTop: '10px' }}>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Images <span className="text-red-500">*</span></label>
                        <p className="text-sm text-zinc-500" style={{ marginBottom: '10px' }}>Upload the image for your book, short fiction, collection or exhibit. Image 1 is the hero image that will appear on the Work page.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {images.map((img, index) => (
                                <div key={index} className="flex flex-col">
                                    <label style={{ marginBottom: '5px', display: 'block' }} className="text-xs font-bold text-zinc-500">
                                        Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                                    </label>

                                    <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-800 border border-white/20 shadow-2xl group transition-all hover:border-violet-500/50">
                                        {img.url ? (
                                            <>
                                                <img src={img.url} className="w-full h-full object-cover" alt={`Work Image ${index + 1}`} />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGridImage(index)}
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
                                                    onChange={(e) => handleGridImageUpload(index, e)}
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Videos */}
                <div style={{ marginTop: '20px' }}>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Videos</label>
                    <p className="text-sm text-zinc-500" style={{ marginBottom: '10px' }}>
                        Select a video to promote this Work. <span className="text-violet-400">Videos are managed on your Creator Profile Page. Select Manage Profile.</span>
                    </p>

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

            {/* Editor Toolbar */}
            {!isEditing && workType !== 'Audiobook' && workType !== 'Visual Arts' && <div className="h-[40px]"></div>}
            {!isEditing && workType !== 'Audiobook' && workType !== 'Visual Arts' && (
                <div className="sticky top-0 z-40 bg-[#333333]/95 backdrop-blur-sm border-b border-zinc-800 px-6 py-3 flex items-center justify-center gap-2 overflow-x-auto rounded-lg mb-4">
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
            )}


            {!isEditing && (
                <>
                    {/* Chapter Title & Sequence - only if creating new chapters, or needed */}
                    <div style={{ marginTop: '10px' }} className="w-full">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            {workType === 'Poem' ? 'Poem Title' :
                                workType === 'Short Story' ? 'Story Title' :
                                    workType === 'Visual Arts' ? 'Image Title' :
                                        'Chapter Title'}
                        </label>
                        <input
                            type="text"
                            value={chapterTitle}
                            onChange={(e) => setChapterTitle(e.target.value)}
                            className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none"
                        />
                    </div>

                    {workType === 'Visual Arts' && (
                        <div style={{ marginTop: '10px' }} className="w-full">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Image Description</label>
                            <textarea
                                value={chapterDescription}
                                onChange={(e) => setChapterDescription(e.target.value)}
                                placeholder="Describe this image..."
                                className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500 resize-none"
                                rows={4}
                            />
                        </div>
                    )}

                    <div style={{ marginTop: '10px' }} className="w-full">
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                            {workType === 'Poem' ? 'Poem Sequence' :
                                workType === 'Short Story' ? 'Story Sequence' :
                                    workType === 'Visual Arts' ? 'Folio Sequence' :
                                        'Chapter Sequence'}
                        </label>
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

                    {/* Image Upload below sequence - ONLY for Visual Arts */}
                    {workType === 'Visual Arts' && (
                        <div style={{ marginTop: '20px' }}>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Image Upload <span className="text-red-500">*</span></label>
                            <p className="text-sm text-zinc-500" style={{ marginBottom: '10px' }}>Upload the image for this folio. The first image will display as the Hero image for your folio.</p>

                            <div className="max-w-[280px]">
                                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-800 border border-white/20 shadow-2xl group transition-all hover:border-violet-500/50">
                                    {folioImage.url ? (
                                        <>
                                            <img src={folioImage.url} className="w-full h-full object-cover" alt="Folio Image" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={removeFolioImage}
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
                                            <span className="text-xs text-zinc-500 font-medium">Upload Image</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFolioImageUpload}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chapter Spotify Link - Only for Audiobooks */}
                    {workType === 'Audiobook' && (
                        <div style={{ marginTop: '10px' }} className="w-full">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Chapter Spotify Link <span className="text-red-500">*</span></label>
                            <input
                                type="url"
                                value={chapterSpotifyLink}
                                onChange={(e) => setChapterSpotifyLink(e.target.value)}
                                placeholder="https://open.spotify.com/episode/..."
                                className="w-full bg-[#1a1a1a] text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-1 focus:ring-violet-500/50 focus:outline-none placeholder-zinc-500"
                            />
                        </div>
                    )}

                    {/* Writing Area - Hidden for Audiobooks and Visual Arts */}
                    {workType !== 'Audiobook' && workType !== 'Visual Arts' && (
                        <div style={{ marginTop: '10px' }} className="w-full">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Text Input</label>
                            <div className="flex justify-between items-center mb-0">
                                <p className="text-sm text-zinc-500">Select the Font in Word or your word processing software before pasting your text. We will present the Work in your chosen font in 12 points.</p>
                            </div>

                            <div className="h-[10px]"></div>

                            <div
                                contentEditable
                                onInput={(e) => setContent(e.currentTarget.innerHTML)}
                                className="new-work-editor w-full text-white placeholder-zinc-500 border border-white/20 rounded-lg p-4 focus:ring-1 focus:ring-violet-500/50 resize-none leading-relaxed min-h-[600px] bg-transparent outline-none overflow-y-auto"
                                style={{
                                    fontSize: '19px', // Default size if not specified in paste
                                    caretColor: 'white'
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
                        </div>
                    )}
                </>
            )}

            {/* 30px space before button */}
            <div className="h-[30px]"></div>

            {/* Save Buttons */}
            {/* Save Buttons */}
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                {!isEditing && (
                    <button
                        onClick={() => onAddNextChapter && onAddNextChapter(getFormData())}
                        style={{ backgroundColor: '#cc5500', borderColor: '#cc5500' }}
                        className="w-full md:w-auto min-w-[240px] px-12 py-4 text-white hover:opacity-90 font-bold text-lg rounded-lg transition-colors shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                        <PlusCircle size={20} />
                        {workType === 'Poem' ? 'Add Poem' :
                            workType === 'Short Story' ? 'Add Story' :
                                workType === 'Visual Arts' ? 'Add Folio' :
                                    'Add Chapter'}
                    </button>
                )}
                <button
                    onClick={() => onSave(getFormData())}
                    style={{ backgroundColor: '#cc5500', borderColor: '#cc5500' }}
                    className="w-full md:w-auto min-w-[240px] px-12 py-4 text-white hover:opacity-90 font-bold text-lg rounded-lg transition-colors shadow-lg shadow-orange-900/20 uppercase tracking-wide"
                >
                    {isEditing ? 'Save Changes' : 'Save Work (Draft)'}
                </button>
            </div>

            <div className="h-[40px]"></div>
        </div>
    );
};

export default WorkForm;
