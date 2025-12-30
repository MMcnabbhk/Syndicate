import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, ChevronDown, X } from 'lucide-react';

const SyndicateWorkSetup = () => {
    const navigate = useNavigate();

    // Form State
    const [title, setTitle] = useState('');
    const [format, setFormat] = useState('Novel'); // Default or empty
    const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);
    const [genre, setGenre] = useState('');
    const [summary, setSummary] = useState('');
    const [image, setImage] = useState(null); // Placeholder for image file
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    const [syndicationFrequency, setSyndicationFrequency] = useState('Daily');
    const [firstSyndicationDate, setFirstSyndicationDate] = useState('');
    const [isSeries, setIsSeries] = useState(false);
    const [seriesTitle, setSeriesTitle] = useState('');
    const [seriesNumber, setSeriesNumber] = useState('');
    const [goodreadsLink, setGoodreadsLink] = useState('');
    const [amazonLink, setAmazonLink] = useState('');

    const handleSubmit = () => {
        console.log("Saving Work:", {
            title, format, copyrightConfirmed, genre, summary, firstSyndicationDate,
            syndicationFrequency, isSeries, seriesTitle, seriesNumber, goodreadsLink, amazonLink
        });
        // Navigate to next step
        navigate('/syndicate-content');
    };

    // Placeholder Genres based on format (simplified logic)
    const getGenres = () => {
        if (format === 'Poetry') return ['Haiku', 'Free Verse', 'Sonnet', 'Slam'];
        return ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Thriller', 'Horror'];
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white flex justify-center py-10 px-4">
            <div className="w-full max-w-[680px]">

                <div className="h-[40px]"></div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Syndicate Work</span>
                    </h1>
                    <p className="text-zinc-400">Set up your newest work for syndication.</p>
                    <div className="h-[60px]"></div>
                </div>

                <div className="flex flex-col">

                    {/* Title */}
                    <div className="std-form-group">
                        <label className="std-label">Title of the Work</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="std-input"
                            placeholder="Enter title"
                        />
                    </div>

                    {/* Format */}
                    <div className="std-form-group">
                        <label className="std-label">Format</label>
                        <div className="relative">
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="std-input appearance-none pl-4 pr-10"
                            >
                                <option value="Novel">Novel</option>
                                <option value="Novella">Novella</option>
                                <option value="Short Story">Short Story</option>
                                <option value="Poetry">Poetry</option>
                                <option value="Audiobook">Audiobook</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Copyright Confirmation */}
                    <div className="std-form-group mb-8">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={copyrightConfirmed}
                                onChange={(e) => setCopyrightConfirmed(e.target.checked)}
                                className="w-5 h-5 bg-[#1A1A1A] border-zinc-600 rounded focus:ring-violet-500 text-violet-500"
                                id="copyright"
                            />
                            <label htmlFor="copyright" className="text-white text-sm cursor-pointer select-none">
                                I confirm that I own the copyright to this work.
                            </label>
                        </div>
                    </div>

                    {/* Genre */}
                    <div className="std-form-group">
                        <label className="std-label">Genre</label>
                        <div className="relative">
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="std-input appearance-none pl-4 pr-10"
                            >
                                <option value="">Select a genre</option>
                                {getGenres().map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="std-form-group">
                        <label className="std-label">Summary</label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={8}
                            className="std-input resize-none leading-relaxed"
                            placeholder="Enter a brief summary..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="std-form-group">
                        <label className="std-label">Image for the Work</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={triggerFileInput}
                            className="relative border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-lg p-8 flex flex-col items-center justify-center transition-colors cursor-pointer bg-[#1A1A1A]/50 overflow-hidden min-h-[200px]"
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Work cover preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="bg-black/50 p-2 rounded-full mb-2">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Change Image</span>
                                    </div>
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-4 right-4 z-20 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors text-white"
                                        title="Remove image"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-zinc-400 mb-[12px]" />
                                    <span className="text-zinc-400 text-sm">Click to upload cover image</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* First Syndication Date */}
                    <div className="std-form-group">
                        <label className="std-label">First Syndication Date</label>
                        <input
                            type="date"
                            value={firstSyndicationDate}
                            onChange={(e) => setFirstSyndicationDate(e.target.value)}
                            className={`std-input scheme-dark ${firstSyndicationDate ? 'text-white' : 'text-zinc-500'}`}
                        />
                    </div>

                    {/* Syndication Frequency */}
                    <div className="std-form-group">
                        <label className="std-label">Syndication Frequency</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['Daily', 'Every 3 Days', 'Every 7 Days'].map((freq) => (
                                <label key={freq} className={`
                                    cursor-pointer border rounded-lg py-3 px-2 text-center text-sm transition-all
                                    ${syndicationFrequency === freq
                                        ? 'bg-violet-500/10 border-violet-500 text-white'
                                        : 'bg-[#1A1A1A] border-zinc-600 text-zinc-400 hover:border-zinc-500'}
                                `}>
                                    <input
                                        type="radio"
                                        name="syndicationFrequency"
                                        value={freq}
                                        checked={syndicationFrequency === freq}
                                        onChange={() => setSyndicationFrequency(freq)}
                                        className="hidden"
                                    />
                                    {freq}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Series Toggle */}
                    <div className="std-form-group">
                        <div className="flex items-center gap-3 mb-3">
                            <input
                                type="checkbox"
                                checked={isSeries}
                                onChange={(e) => setIsSeries(e.target.checked)}
                                className="w-5 h-5 bg-[#1A1A1A] border-zinc-600 rounded focus:ring-violet-500 text-violet-500"
                                id="isSeries"
                            />
                            <label htmlFor="isSeries" className="text-white text-sm cursor-pointer select-none">
                                Part of a Series or Collection?
                            </label>
                        </div>

                        {/* Conditional Series Fields */}
                        {isSeries && (
                            <div className="pl-8 flex flex-col border-l-2 border-zinc-800 ml-2">
                                <div className="std-form-group">
                                    <label className="std-label">Series or Collection Title</label>
                                    <input
                                        type="text"
                                        value={seriesTitle}
                                        onChange={(e) => setSeriesTitle(e.target.value)}
                                        className="std-input"
                                        placeholder="e.g. The Crystal Chronicles"
                                    />
                                </div>
                                <div className="std-form-group">
                                    <label className="std-label">Number in the Series</label>
                                    <input
                                        type="text"
                                        value={seriesNumber}
                                        onChange={(e) => setSeriesNumber(e.target.value)}
                                        className="std-input"
                                        placeholder="e.g. 1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Goodreads */}
                    <div className="std-form-group">
                        <label className="std-label">Goodreads Page Link</label>
                        <input
                            type="text"
                            value={goodreadsLink}
                            onChange={(e) => setGoodreadsLink(e.target.value)}
                            className="std-input"
                            placeholder="https://goodreads.com/book/..."
                        />
                    </div>

                    {/* Amazon */}
                    <div className="std-form-group">
                        <label className="std-label">Amazon Page Link</label>
                        <input
                            type="text"
                            value={amazonLink}
                            onChange={(e) => setAmazonLink(e.target.value)}
                            className="std-input"
                            placeholder="https://amazon.com/..."
                        />
                    </div>

                </div>

                <div className="h-[40px]"></div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSubmit}
                        className="bg-transparent border border-[#cc5500] text-[#cc5500] hover:bg-[#cc5500] hover:text-white font-semibold py-3 px-10 rounded-lg transition-colors w-full md:w-auto"
                    >
                        Save & Continue
                    </button>
                </div>

                <div className="h-[50px]"></div>
            </div>
        </div>
    );
};

export default SyndicateWorkSetup;
