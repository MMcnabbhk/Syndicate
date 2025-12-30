import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, BookOpen, PenTool, ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const FORMATS = ['Books', 'Audiobooks', 'Stories', 'Poetry'];
const GENRES = [
    'Sci-Fi', 'Fantasy', 'Romance', 'Mystery',
    'Thriller', 'Horror', 'Suspense', 'Adult',
    'Non-Fiction', 'Literary Fiction', 'Free Verse', 'Haiku',
    'Sonnet', 'Limerick', 'Villanelle', 'Epics', 'Micro'
];

const CreateAccountModal = () => {
    const { isCreateAccountModalOpen, closeCreateAccountModal, openLoginModal, login } = useStore();
    const navigate = useNavigate();

    // State for multi-step flow
    const [step, setStep] = useState('selection'); // 'selection', 'reader-signup', 'creator-signup'

    // Form State
    const [email, setEmail] = useState('');
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);

    if (!isCreateAccountModalOpen) return null;

    const resetAndClose = () => {
        setStep('selection');
        setEmail('');
        setSelectedFormats([]);
        setSelectedGenres([]);
        closeCreateAccountModal();
    };

    const handleLoginClick = () => {
        resetAndClose();
        openLoginModal();
    };

    const handleOptionSelect = (type) => {
        if (type === 'reader') {
            setStep('reader-signup');
        } else {
            // For Creator, just log or show pending state for now as requested task is only Reader form
            setStep('creator-signup');
        }
    };

    const toggleSelection = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleCreateAccount = (e) => {
        e.preventDefault();
        console.log("Creating Account:", { email, selectedFormats, selectedGenres, type: step });

        const isCreator = step === 'creator-signup';
        const role = isCreator ? 'creator' : 'reader';

        // Log in the user
        login(role);

        // Reset and close modal
        resetAndClose();

        // Navigate to appropriate setup page
        if (isCreator) {
            navigate('/creator-setup');
        } else {
            navigate('/setup-profile');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm transition-opacity"
                onClick={resetAndClose}
            ></div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[600px] flex flex-col items-center">

                {/* Logo & Header (Shared) */}
                <div className="mb-0 text-center">
                    <span className="font-bold text-[31px] tracking-tight" style={{ color: '#cc5500' }}>
                        Syndicate.direct
                    </span>
                </div>

                <div className="h-[20px]"></div>

                {/* --- ALL SHARED WRAPPER ABOVE --- */}

                {step === 'selection' && (
                    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <h2 className="text-[28px] font-semibold text-white mb-2">Join Syndicate</h2>
                        <p className="text-zinc-400 text-sm mb-8">Choose your account type to get started</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
                            {/* Reader Card */}
                            <button
                                onClick={() => handleOptionSelect('reader')}
                                className="group relative bg-[#111111] border border-zinc-800 hover:border-zinc-600 rounded-xl p-6 flex flex-col items-center text-center transition-all hover:bg-[#1a1a1a]"
                            >
                                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-[#cc5500]/10 transition-colors">
                                    <BookOpen className="w-8 h-8 text-zinc-400 group-hover:text-[#cc5500] transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Reader</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    Discover stories, follow authors, and build your library.
                                </p>
                            </button>

                            {/* Creator Card */}
                            <button
                                onClick={() => handleOptionSelect('creator')}
                                className="group relative bg-[#111111] border border-zinc-800 hover:border-zinc-600 rounded-xl p-6 flex flex-col items-center text-center transition-all hover:bg-[#1a1a1a]"
                            >
                                <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 group-hover:bg-violet-500/10 transition-colors">
                                    <PenTool className="w-8 h-8 text-zinc-400 group-hover:text-violet-500 transition-colors" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Creator</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    Publish your work, grow your audience, and earn revenue.
                                </p>
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="mt-8 text-center bg-[#111111] border border-zinc-800/50 rounded-full px-6 py-2">
                            <p className="text-zinc-500 text-[14px]">
                                Already have an account? <button onClick={handleLoginClick} className="text-white hover:text-zinc-300 font-medium transition-colors ml-1">Log in</button>
                            </p>
                        </div>
                    </div>
                )}

                {step === 'reader-signup' && (
                    <div className="w-full bg-[#111111] border border-zinc-800 rounded-xl p-6 md:p-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="relative flex items-center justify-center mb-6">
                            <button
                                onClick={() => setStep('selection')}
                                className="absolute left-0 p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-white">Create Reader Account</h2>
                        </div>
                        <div className="h-[40px]"></div>

                        <form onSubmit={handleCreateAccount} className="flex flex-col">

                            {/* Email */}
                            <div className="std-form-group">
                                <label className="std-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="std-input placeholder-zinc-600"
                                />
                            </div>
                            <div className="h-[20px]"></div>

                            {/* Formats */}
                            <div className="std-form-group">
                                <label className="std-label mb-[5px]">Which formats do you prefer?</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {FORMATS.map(fmt => (
                                        <div
                                            key={fmt}
                                            onClick={() => toggleSelection(fmt, selectedFormats, setSelectedFormats)}
                                            className="cursor-pointer flex items-center gap-2 group select-none"
                                        >
                                            <span className={`text-sm font-medium truncate transition-colors ${selectedFormats.includes(fmt) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                                {fmt}
                                            </span>
                                            <div className={`
                                                w-4 h-4 min-w-[16px] rounded border flex items-center justify-center transition-all ml-auto
                                                ${selectedFormats.includes(fmt)
                                                    ? 'bg-[#cc5500] border-[#cc5500]'
                                                    : 'bg-transparent border-zinc-600 group-hover:border-zinc-500'}
                                            `}>
                                                {selectedFormats.includes(fmt) && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[20px]"></div>

                            {/* Genres */}
                            <div>
                                <label className="block text-white text-[13px] font-medium mb-3">Favorite genres (Select all that apply)</label>
                                <div className="h-[10px]"></div>
                                <div className="grid grid-cols-4 gap-4">
                                    {GENRES.map(genre => (
                                        <div
                                            key={genre}
                                            onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                                            className="cursor-pointer flex items-center gap-2 group select-none"
                                        >
                                            <span className={`text-xs font-medium truncate transition-colors ${selectedGenres.includes(genre) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                                {genre}
                                            </span>
                                            <div className={`
                                                w-3.5 h-3.5 min-w-[14px] rounded border flex items-center justify-center transition-all ml-auto
                                                ${selectedGenres.includes(genre)
                                                    ? 'bg-white border-white'
                                                    : 'bg-transparent border-zinc-700 group-hover:border-zinc-500'}
                                            `}>
                                                {selectedGenres.includes(genre) && <Check size={10} className="text-black" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[20px]"></div>

                            <button
                                type="submit"
                                className="w-full h-[48px] bg-transparent border border-[#cc5500] text-[#cc5500] hover:bg-[#cc5500] hover:text-white text-[15px] font-bold rounded-lg transition-colors mt-4"
                            >
                                Create Account
                            </button>

                        </form>
                    </div>
                )}

                {step === 'creator-signup' && (
                    <div className="w-full bg-[#111111] border border-zinc-800 rounded-xl p-6 md:p-8 animate-in slide-in-from-right-8 duration-300">
                        <div className="relative flex items-center justify-center mb-6">
                            <button
                                onClick={() => setStep('selection')}
                                className="absolute left-0 p-2 -ml-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-white">Create Creator Account</h2>
                        </div>
                        <div className="h-[40px]"></div>

                        <form onSubmit={handleCreateAccount} className="flex flex-col">

                            {/* Email */}
                            <div className="std-form-group">
                                <label className="std-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="std-input placeholder-zinc-600"
                                />
                            </div>
                            <div className="h-[20px]"></div>

                            {/* Formats */}
                            <div className="std-form-group">
                                <label className="std-label mb-[5px]">Which formats do you create?</label>
                                <div className="grid grid-cols-4 gap-4">
                                    {FORMATS.map(fmt => (
                                        <div
                                            key={fmt}
                                            onClick={() => toggleSelection(fmt, selectedFormats, setSelectedFormats)}
                                            className="cursor-pointer flex items-center gap-2 group select-none"
                                        >
                                            <span className={`text-sm font-medium truncate transition-colors ${selectedFormats.includes(fmt) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                                {fmt}
                                            </span>
                                            <div className={`
                                                w-4 h-4 min-w-[16px] rounded border flex items-center justify-center transition-all ml-auto
                                                ${selectedFormats.includes(fmt)
                                                    ? 'bg-[#cc5500] border-[#cc5500]'
                                                    : 'bg-transparent border-zinc-600 group-hover:border-zinc-500'}
                                            `}>
                                                {selectedFormats.includes(fmt) && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[20px]"></div>

                            {/* Genres */}
                            <div className="std-form-group">
                                <label className="std-label">Favorite genres (Select all that apply)</label>
                                <div className="h-[10px]"></div>
                                <div className="grid grid-cols-4 gap-4">
                                    {GENRES.map(genre => (
                                        <div
                                            key={genre}
                                            onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                                            className="cursor-pointer flex items-center gap-2 group select-none"
                                        >
                                            <span className={`text-xs font-medium truncate transition-colors ${selectedGenres.includes(genre) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                                {genre}
                                            </span>
                                            <div className={`
                                                w-3.5 h-3.5 min-w-[14px] rounded border flex items-center justify-center transition-all ml-auto
                                                ${selectedGenres.includes(genre)
                                                    ? 'bg-white border-white'
                                                    : 'bg-transparent border-zinc-700 group-hover:border-zinc-500'}
                                            `}>
                                                {selectedGenres.includes(genre) && <Check size={10} className="text-black" />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[20px]"></div>

                            <button
                                type="submit"
                                className="w-full h-[48px] bg-transparent border border-[#cc5500] text-[#cc5500] hover:bg-[#cc5500] hover:text-white text-[15px] font-bold rounded-lg transition-colors mt-4"
                            >
                                Create Account
                            </button>

                        </form>
                    </div>
                )}

                {/* Close Button (Global) */}
                <button
                    onClick={resetAndClose}
                    className="absolute -top-2 -right-4 md:-right-16 text-zinc-600 hover:text-white transition-colors p-2"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default CreateAccountModal;
