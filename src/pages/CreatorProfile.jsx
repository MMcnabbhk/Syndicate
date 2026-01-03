import React, { useState } from 'react';
import { User, Save, MapPin, Link as LinkIcon, Twitter, Instagram, Globe, Video, BookOpen, Music, ShoppingBag, Book, Linkedin, Cloud, Send, Facebook, AtSign, X, MessageSquare, Users, BarChart, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';

const CreatorProfile = () => {
    const { userState } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ type: '', message: '' }); // type: 'success' | 'error' | ''
    const [adminVideoActive, setAdminVideoActive] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [errors, setErrors] = useState({});

    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        handle: '',
        genre: '',
        bio: '',
        about: '',
        location: '',
        amazonUrl: '',
        goodreadsUrl: '',
        spotifyUrl: '',
        website: '',
        twitter: '',
        instagram: '',
        facebook: '',
        threads: '',
        tiktok: '',
        bluesky: '',
        dispatch: '',
        linkedin: '',
        profileImages: [
            { id: 1, url: '', caption: '' },
            { id: 2, url: '', caption: '' },
            { id: 3, url: '', caption: '' }
        ],
        videoIntroductions: [
            { id: 1, url: '', title: '' },
            { id: 2, url: '', title: '' },
            { id: 3, url: '', title: '' },
            { id: 4, url: '', title: '' }
        ],
        autoResponderContributor: '',
        autoResponderFan: '',
        targetGender: [],
        targetAge: [],
        targetIncome: [],
        targetEducation: [],
        meta_pixel_id: '',
        ga_measurement_id: '',
    });

    // Fetch profile data on mount
    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/authors/me', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();

                    // Map socials back to top level
                    const socials = data.socials || {};

                    setFormData(prev => ({
                        ...prev,
                        name: data.name || '',
                        handle: data.handle || '',
                        genre: data.genre || '',
                        bio: data.bio || '',
                        about: data.about || '',
                        amazonUrl: data.amazonUrl || '',
                        goodreadsUrl: data.goodreadsUrl || '',
                        spotifyUrl: data.spotifyUrl || '',
                        profileImages: data.profileImages && data.profileImages.length ? data.profileImages : prev.profileImages,
                        videoIntroductions: data.videoIntroductions && data.videoIntroductions.length ? data.videoIntroductions : prev.videoIntroductions,
                        autoResponderContributor: data.autoResponderContributor || '',
                        autoResponderFan: data.autoResponderFan || '',
                        targetGender: data.targetGender || [],
                        targetAge: data.targetAge || [],
                        targetIncome: data.targetIncome || [],
                        targetEducation: data.targetEducation || [],
                        meta_pixel_id: data.meta_pixel_id || '',
                        ga_measurement_id: data.ga_measurement_id || '',
                        ...socials
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setIsFetching(false);
            }
        };

        if (userState.isAuthenticated) {
            fetchProfile();
        }
    }, [userState.isAuthenticated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user changes field
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleCheckboxChange = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || [];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [field]: updated };
        });
    };

    const handleImageUpload = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            setFormData(prev => {
                const newImages = [...prev.profileImages];
                newImages[index] = { ...newImages[index], url: newUrl, file }; // Store file for real upload
                // If index is 0, also update legacy profileImage for preview consistency elsewhere
                const updates = { profileImages: newImages };
                if (index === 0) updates.profileImage = newUrl;
                return { ...prev, ...updates };
            });
            // Clear error for Image 1
            if (index === 0 && errors.image1) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.image1;
                    return newErrors;
                });
            }
        }
    };

    const handleImageCaptionChange = (index, value) => {
        setFormData(prev => {
            const newImages = [...prev.profileImages];
            newImages[index] = { ...newImages[index], caption: value };
            return { ...prev, profileImages: newImages };
        });
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = [...prev.profileImages];
            newImages[index] = { ...newImages[index], url: '', file: null, caption: '' };
            // If index is 0, also clear legacy profileImage
            const updates = { profileImages: newImages };
            if (index === 0) updates.profileImage = '';
            return { ...prev, ...updates };
        });
        // Clear error for Image 1
        if (index === 0 && errors.image1) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.image1;
                return newErrors;
            });
        }
    };

    const handleVideoChange = (index, field, value) => {
        setFormData(prev => {
            const newVideos = [...prev.videoIntroductions];
            newVideos[index] = { ...newVideos[index], [field]: value };
            return { ...prev, videoIntroductions: newVideos };
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Required Fields
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.handle?.trim()) newErrors.handle = 'Handle is required';
        if (!formData.genre?.trim()) newErrors.genre = 'Genre is required';

        // Short Description (Bio) - Min 50, Max 60
        const bioWords = formData.bio?.split(/\s+/).filter(Boolean).length || 0;
        if (bioWords < 10) newErrors.bio = `Minimum 10 words required (current: ${bioWords})`;
        else if (bioWords > 60) newErrors.bio = `Maximum 60 words allowed (current: ${bioWords})`;

        // About You - Min 100
        const aboutWords = formData.about?.split(/\s+/).filter(Boolean).length || 0;
        if (aboutWords < 100) newErrors.about = `Minimum 100 words required (current: ${aboutWords})`;

        // Image 1 Required
        if (!formData.profileImages[0]?.url) {
            newErrors.image1 = 'Primary profile image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            alert('Please fix the errors before saving.');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare payload
            const socials = {
                website: formData.website,
                twitter: formData.twitter,
                instagram: formData.instagram,
                facebook: formData.facebook,
                threads: formData.threads,
                tiktok: formData.tiktok,
                bluesky: formData.bluesky,
                dispatch: formData.dispatch,
                linkedin: formData.linkedin
            };

            const payload = {
                ...formData,
                socials,
                profile_image_url: formData.profileImages[0]?.url || ''
            };

            const response = await fetch('http://localhost:4000/api/authors/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
                // Clear success message after 3 seconds
                setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
            } else {
                const errorData = await response.json();
                setSaveStatus({ type: 'error', message: `Update failed: ${errorData.error || 'Unknown error'}` });
            }
        } catch (error) {
            console.error("Save error:", error);
            setSaveStatus({ type: 'error', message: 'A network error occurred while saving.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="min-h-screen bg-[#111111] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Loading Profile...</p>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#111111] pb-20 pt-10">
            {/* Page Header (Matches Books/Library Page) */}
            <header className="container mx-auto px-4 mb-8 relative">
                <div className="text-center">
                    <h1
                        className="text-4xl md:text-5xl font-black text-white tracking-tight"
                        style={{ paddingTop: '20px', paddingBottom: '10px' }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Creator Profile</span>
                    </h1>
                    <p className="text-zinc-400 text-sm mx-auto" style={{ color: '#a1a1aa' }}>
                        This information appears on your Profile, Discover and Works pages.
                    </p>
                    <div style={{ height: '40px' }}></div>
                </div>

                <div style={{ position: 'absolute', right: '220px', top: '45px', display: 'block' }}>
                    {userState.authorId && (
                        <Link to={`/author/${userState.authorId}`} className="transition-colors" style={{ color: '#a855f7', fontSize: '1.25rem', textDecoration: 'none' }}>
                            Preview
                        </Link>
                    )}
                </div>
                <div style={{ height: '40px' }} />
            </header>

            <div className="container mx-auto px-4 max-w-5xl">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Granular Grid Rows for Precise Alignment */}

                    {/* ROW 1: Identity & Branding + External Platforms */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 space-y-6 h-full">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ marginBottom: '10px' }}>
                                    <User size={20} className="text-violet-500" />
                                    Identity & Branding
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">
                                            Display Name <span className="text-red-500">*</span>
                                            {errors.name && <span className="text-red-500 text-xs ml-3 font-medium">{errors.name}</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                        />
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">
                                            Handle <span className="text-red-500">*</span>
                                            {errors.handle && <span className="text-red-500 text-xs ml-3 font-medium">{errors.handle}</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="handle"
                                            value={formData.handle}
                                            onChange={handleChange}
                                            placeholder="@uniquehandle"
                                            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                                        />
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">
                                            Primary Genre <span className="text-red-500">*</span>
                                            {errors.genre && <span className="text-red-500 text-xs ml-3 font-medium">{errors.genre}</span>}
                                        </label>
                                        <input
                                            type="text"
                                            name="genre"
                                            value={formData.genre}
                                            onChange={handleChange}
                                            placeholder="e.g. Sci-Fi, Romance..."
                                            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <div className="flex justify-between items-center" style={{ marginBottom: '5px' }}>
                                        <label style={{ display: 'block' }} className="text-sm font-bold text-zinc-400">
                                            Short Description <span className="text-red-500">*</span>
                                            {errors.bio && <span className="text-red-500 text-xs ml-3 font-medium">{errors.bio}</span>}
                                        </label>
                                        <span className={`text-xs ${formData.bio.split(/\s+/).filter(Boolean).length > 60 ? 'text-red-500' : 'text-zinc-600'}`}>
                                            {formData.bio.split(/\s+/).filter(Boolean).length} / 60 words
                                        </span>
                                    </div>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        rows={6}
                                        placeholder="This description presents on the Discover page. It needs a good Hook."
                                        className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none leading-relaxed"
                                    />
                                    <p className="text-right text-xs text-zinc-600 mt-2">Markdown supported.</p>
                                </div>

                                <div style={{ height: '20px' }} />

                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">
                                        About You <span className="text-red-500">*</span>
                                        {errors.about && <span className="text-red-500 text-xs ml-3 font-medium">{errors.about}</span>}
                                    </label>
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        rows={15}
                                        placeholder="This description presents on your Author Profile Page and on your Works pages."
                                        className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none leading-relaxed overflow-y-auto"
                                    />
                                    <p className="text-right text-xs text-zinc-600 mt-2">Markdown supported. No word limit.</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1" style={{ paddingLeft: '20px' }}>
                            {/* External Platforms (Aligned with Identity & Branding top) */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                                    <ShoppingBag size={18} className="text-violet-500" />
                                    External Platforms
                                </h2>

                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Amazon Author Page</label>
                                        <div className="relative">
                                            <ShoppingBag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            <input
                                                type="text"
                                                name="amazonUrl"
                                                value={formData.amazonUrl}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Goodreads URL</label>
                                        <div className="relative">
                                            <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            <input
                                                type="text"
                                                name="goodreadsUrl"
                                                value={formData.goodreadsUrl}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Spotify / Podcasts</label>
                                        <div className="relative">
                                            <Music size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                            <input
                                                type="text"
                                                name="spotifyUrl"
                                                value={formData.spotifyUrl}
                                                onChange={handleChange}
                                                className="w-full bg-black/40 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Presence (Moved back below External Platforms) */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4" style={{ marginTop: '20px' }}>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                                    <LinkIcon size={18} className="text-violet-500" />
                                    Social Presence
                                </h2>
                                <div>
                                    {[
                                        { key: 'website', label: 'Website', icon: Globe },
                                        { key: 'twitter', label: 'Twitter / X', icon: Twitter },
                                        { key: 'instagram', label: 'Instagram', icon: Instagram },
                                        { key: 'facebook', label: 'Facebook', icon: Facebook },
                                        { key: 'threads', label: 'Threads', icon: AtSign },
                                        { key: 'tiktok', label: 'TikTok', icon: Music },
                                        { key: 'bluesky', label: 'Bluesky', icon: Cloud },
                                        { key: 'dispatch', label: 'Dispatch', icon: Send },
                                        { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                                    ].map(({ key, label, icon: Icon }) => (
                                        <div key={key} style={{ marginBottom: '10px' }}>
                                            <label style={{ marginBottom: '5px', display: 'block' }} className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
                                            <div className="relative">
                                                <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                                <input
                                                    type="text"
                                                    name={key}
                                                    value={formData[key]}
                                                    onChange={handleChange}
                                                    className="w-full bg-black/40 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ROW 2: Profile Images + Image Tips */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ marginBottom: '20px' }}>
                                    <User size={20} className="text-violet-500" />
                                    Profile Images
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {formData.profileImages.map((img, index) => (
                                        <div key={index} className="flex flex-col">
                                            <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">
                                                Image {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                                                {index === 0 && errors.image1 && <span className="text-red-500 text-xs ml-3 font-medium">{errors.image1}</span>}
                                            </label>

                                            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-800 border border-white/20 shadow-2xl group transition-all hover:border-violet-500/50">
                                                {img.url ? (
                                                    <>
                                                        <img src={img.url} className="w-full h-full object-cover" alt={`Profile ${index + 1}`} />
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

                                            <input
                                                type="text"
                                                placeholder="Add a small description..."
                                                value={img.caption}
                                                onChange={(e) => handleImageCaptionChange(index, e.target.value)}
                                                className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1" style={{ paddingLeft: '20px' }}>
                            {/* How It Works - Image Tips (Aligned with Profile Images section content) */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4 h-fit" style={{ marginTop: '88px' }}>
                                <h3 className="text-lg font-bold text-violet-500">How It Works</h3>
                                <p className="text-sm leading-relaxed text-zinc-400">
                                    Image 1 is your Profile image and presents on the Discover page and Profile Page. The additional images may be used on specific Works pages.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '20px' }} aria-hidden="true" />

                    {/* ROW 3: Video Introductions + Video Tips */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ marginTop: '10px', marginBottom: '20px' }}>
                                    <Video size={20} className="text-violet-500" />
                                    Video Introductions
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {formData.videoIntroductions.map((video, index) => (
                                        <div key={index} className="flex flex-col">
                                            <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">Video {index + 1}</label>
                                            <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800 border border-white/20 shadow-lg flex items-center justify-center group" style={{ marginBottom: '10px' }}>
                                                {video.url ? (
                                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                                        <Video size={32} className="text-green-500" />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center opacity-40">
                                                        <Video size={24} className="mb-2" />
                                                        <span className="text-[10px] uppercase tracking-wider">Empty</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-[10px]">
                                                <input
                                                    type="text"
                                                    placeholder="YouTube / Vimeo URL"
                                                    value={video.url}
                                                    onChange={(e) => handleVideoChange(index, 'url', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Video Title"
                                                    value={video.title}
                                                    onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                                                    className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1" style={{ paddingLeft: '20px' }}>
                            {/* How It Works - Video Tips (Aligned with Video Introductions boxes top) */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4 h-fit" style={{ marginTop: '82px' }}>
                                <h3 className="text-lg font-bold text-violet-500">How It Works</h3>
                                <p className="text-sm leading-relaxed text-zinc-400">
                                    Video 1 presents on the Profile Page. The additional videos may be used on specific Works pages.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* ROW 4: Auto Responders + Social Presence */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Auto Responders */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ marginTop: '30px', marginBottom: '20px' }}>
                                    <MessageSquare size={20} className="text-violet-500" />
                                    Auto Responders
                                </h2>

                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">Contributors</label>
                                        <textarea
                                            name="autoResponderContributor"
                                            value={formData.autoResponderContributor}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Thank your contributor for their support."
                                            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none leading-relaxed"
                                        />
                                        <p className="text-right text-xs text-zinc-600 mt-2">Sent automatically when a user contributes to your work.</p>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400">Fans</label>
                                        <textarea
                                            name="autoResponderFan"
                                            value={formData.autoResponderFan}
                                            onChange={handleChange}
                                            rows={6}
                                            placeholder="Recognize your fans for subscribing to your work."
                                            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none leading-relaxed"
                                        />
                                        <p className="text-right text-xs text-zinc-600 mt-2">Sent automatically when a fan subscribes to your work.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Audience */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ marginTop: '30px', marginBottom: '20px' }}>
                                    <Users size={20} className="text-violet-500" />
                                    Audience
                                </h2>
                                <p className="text-sm text-zinc-400" style={{ marginBottom: '20px' }}>Help Syndicate put you in front of the right people.</p>

                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-xs">Gender</label>
                                        <div className="flex flex-wrap gap-6">
                                            {['Men', 'Women', 'All'].map(option => (
                                                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targetGender.includes(option)}
                                                            onChange={() => handleCheckboxChange('targetGender', option)}
                                                            className="w-5 h-5 rounded border-white/20 bg-black/40 text-violet-500 focus:ring-violet-500/50 appearance-none border-2 checked:bg-violet-500 checked:border-violet-500 transition-all"
                                                        />
                                                        {formData.targetGender.includes(option) && (
                                                            <svg className="absolute w-3 h-3 text-white pointer-events-none left-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-xs">Age</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'All'].map(option => (
                                                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targetAge.includes(option)}
                                                            onChange={() => handleCheckboxChange('targetAge', option)}
                                                            className="w-5 h-5 rounded border-white/20 bg-black/40 text-violet-500 focus:ring-violet-500/50 appearance-none border-2 checked:bg-violet-500 checked:border-violet-500 transition-all"
                                                        />
                                                        {formData.targetAge.includes(option) && (
                                                            <svg className="absolute w-3 h-3 text-white pointer-events-none left-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-xs">Household Income</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {['Top 5%', 'Top 10%', 'Top 25%', 'Top 50%', 'All'].map(option => (
                                                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targetIncome.includes(option)}
                                                            onChange={() => handleCheckboxChange('targetIncome', option)}
                                                            className="w-5 h-5 rounded border-white/20 bg-black/40 text-violet-500 focus:ring-violet-500/50 appearance-none border-2 checked:bg-violet-500 checked:border-violet-500 transition-all"
                                                        />
                                                        {formData.targetIncome.includes(option) && (
                                                            <svg className="absolute w-3 h-3 text-white pointer-events-none left-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-xs">Education</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {['High School graduate', 'Associate degree', 'Bachelor\'s degree', 'Master\'s degree', 'Professional degree', 'Doctorate', 'All'].map(option => (
                                                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targetEducation.includes(option)}
                                                            onChange={() => handleCheckboxChange('targetEducation', option)}
                                                            className="w-5 h-5 rounded border-white/20 bg-black/40 text-violet-500 focus:ring-violet-500/50 appearance-none border-2 checked:bg-violet-500 checked:border-violet-500 transition-all"
                                                        />
                                                        {formData.targetEducation.includes(option) && (
                                                            <svg className="absolute w-3 h-3 text-white pointer-events-none left-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1" style={{ paddingLeft: '20px' }}>
                            {/* How It Works - Auto Responder Tips (Aligned with Auto Responders top content) */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4 h-fit" style={{ marginTop: '62px' }}>
                                <h3 className="text-lg font-bold text-violet-500">How It Works</h3>
                                <p className="text-sm leading-relaxed text-zinc-400">
                                    The messages will be sent to Fans when they subscribe to your content and to Contributors at the time of their contribution.
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* ROW 5: Analytics & How This Works Video */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-8 space-y-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2" style={{ marginTop: '40px', marginBottom: '20px', whiteSpace: 'nowrap' }}>
                                    <BarChart size={20} className="text-violet-500" />
                                    Meta / Google Analytics
                                </h2>
                                <p className="text-sm text-zinc-400" style={{ marginBottom: '20px' }}>Track activity on your Syndicate pages using your Meta™ Pixel or Google Analytics™ Tag.</p>

                                <div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-xs">Meta Pixel ID</label>
                                        <input
                                            type="text"
                                            name="meta_pixel_id"
                                            value={formData.meta_pixel_id}
                                            onChange={handleChange}
                                            placeholder="e.g. 123456789012345"
                                            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                        />
                                    </div>
                                    <div style={{ marginBottom: '10px' }}>
                                        <label style={{ marginBottom: '5px', display: 'block' }} className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-xs">GA4 Measurement ID</label>
                                        <input
                                            type="text"
                                            name="ga_measurement_id"
                                            value={formData.ga_measurement_id}
                                            onChange={handleChange}
                                            placeholder="e.g. G-XXXXXXXXXX"
                                            className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <p className="text-[10px] text-zinc-600 italic">IDs should be alphanumeric and may contain dashes.</p>
                            </div>
                        </div>
                        <div className="lg:col-span-1" style={{ paddingLeft: '20px' }}>
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-4 h-full" style={{ marginTop: '108px' }}>
                                <div className="flex flex-col">
                                    <label className="text-lg font-bold text-violet-500 mb-1">How This Works</label>
                                    <p className="text-xs mb-4 text-zinc-400">Use social posts or paid ads to drive traffic to your works pages.</p>
                                </div>
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center group cursor-pointer hover:border-violet-500/30 transition-all" onClick={() => setAdminVideoActive(true)}>
                                    {!adminVideoActive ? (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-500/30 transition-all">
                                                    <Video size={24} />
                                                </div>
                                                <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Watch Tutorial</span>
                                            </div>
                                        </>
                                    ) : (
                                        <iframe
                                            src="https://player.vimeo.com/video/1040398226?autoplay=1"
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ height: '20px' }} aria-hidden="true" />
                    {/* Bottom Action Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ backgroundColor: '#cc5500', color: 'white' }}
                            className="w-full md:w-auto min-w-[240px] px-12 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            <span>Save</span>
                        </button>
                        {Object.keys(errors).length > 0 && (
                            <p className="text-red-500 text-sm mt-4 font-bold">Check the required fields above.</p>
                        )}
                        {saveStatus.message && (
                            <div className={`mt-4 px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 ${saveStatus.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {saveStatus.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
                                {saveStatus.message}
                            </div>
                        )}
                    </div>
                    <div style={{ height: '50px' }} aria-hidden="true" />
                </form>
            </div >
        </div >
    );
};

export default CreatorProfile;
