import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import WorkForm from '../components/WorkForm';

const NewWork = () => {
    const navigate = useNavigate();
    const { userState } = useStore();

    // Security Redirect
    useEffect(() => {
        if (!userState.isAuthenticated || userState.role !== 'creator') {
            // Optional: You could show a specialized access denied UI here instead of immediate redirect
            // navigate('/'); 
        }
    }, [userState, navigate]);

    // Track the current Work ID if we've already created it in this session
    const [currentWorkId, setCurrentWorkId] = useState(null);

    // Initial Data from Local Storage (Draft)
    const [initialData, setInitialData] = useState(() => {
        const saved = localStorage.getItem('newWorkDraft');
        return saved ? JSON.parse(saved) : {};
    });

    const saveWorkToBackend = async (formData) => {
        if (!userState.authorId) {
            alert("Author profile not found. Please log in as a creator.");
            return null;
        }

        const endpoint = formData.workType === 'Poem' ? '/api/poems' :
            formData.workType === 'Short Story' ? '/api/short-fiction' :
                formData.workType === 'Audiobook' ? '/api/audiobooks' :
                    formData.workType === 'Visual Arts' ? '/api/visual-arts' :
                        '/api/novels'; // Default/Novel

        const payload = {
            author_id: userState.authorId,
            title: formData.title || 'Untitled Work',
            description: formData.description,
            status: 'Draft',
            genre: formData.genre,
            collection_title: formData.collectionTitle,
            // Audiobook specific fields (used as cover image for all types in this simplified backend)
            cover_image_url: formData.workType === 'Visual Arts'
                ? (formData.folioImage?.url || null)
                : (formData.images && formData.images[0] ? formData.images[0].url : null),
            narrator: userState.name || 'Author', // Placeholder
        };

        try {
            let workId = currentWorkId;

            // If we haven't created the work yet in this session, create it
            if (!workId) {
                const res = await fetch(`${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!res.ok) throw new Error('Failed to create work');
                const pData = await res.json();
                workId = pData.id;
                setCurrentWorkId(workId); // Save for subsequent chapters
            } else {
                // Update existing work
                await fetch(`${endpoint}/${workId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            return workId;
        } catch (err) {
            console.error(err);
            alert("Failed to save work details");
            return null;
        }
    };

    const saveChapterToBackend = async (workId, formData) => {
        if (!workId) return false;

        try {
            const isAudiobook = formData.workType === 'Audiobook';
            const isVisualArt = formData.workType === 'Visual Arts';
            const endpoint = isAudiobook ? '/api/audiobook-chapters' :
                isVisualArt ? '/api/visual-art-folios' :
                    '/api/chapters';

            let payload;
            if (isAudiobook) {
                payload = {
                    audiobook_id: workId,
                    title: formData.chapterTitle || `Chapter ${formData.sequence}`,
                    chapter_number: formData.sequence,
                    audio_url: formData.chapterSpotifyLink,
                    duration_seconds: 0
                };
            } else if (isVisualArt) {
                payload = {
                    visual_art_id: workId,
                    chapter_number: formData.sequence,
                    title: formData.chapterTitle || `Folio ${formData.sequence}`,
                    image_url: formData.folioImage?.url || '',
                    description: formData.chapterDescription || ''
                };
            } else {
                payload = {
                    novel_id: workId,
                    title: formData.chapterTitle || `Chapter ${formData.sequence}`,
                    chapter_number: formData.sequence,
                    content_html: formData.content,
                    status: 'Published' // Or Draft
                };
            }

            const res = await fetch(`${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return res.ok;
        } catch (err) {
            console.error("Chapter save failed", err);
            return false;
        }
    };

    const handleSaveWork = async (formData) => {
        const workId = await saveWorkToBackend(formData);
        if (workId) {
            const chapterSaved = await saveChapterToBackend(workId, formData);
            if (chapterSaved) {
                // Clear draft
                localStorage.removeItem('newWorkDraft');
                navigate(`/author/${userState.authorId}/manage-works`);
            } else {
                alert("Work created but chapter failed to save.");
            }
        }
    };

    const handleAddNextChapter = async (formData) => {
        const workId = await saveWorkToBackend(formData);
        if (workId) {
            const chapterSaved = await saveChapterToBackend(workId, formData);
            if (chapterSaved) {
                alert("Chapter saved! Ready for next.");
                // Reset chapter fields for next chapter
                setInitialData(prev => ({
                    ...prev,
                    chapterTitle: '',
                    content: '',
                    sequence: Number(formData.sequence) + 1
                }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    // Security Guard UI
    if (userState.role !== 'creator') {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
                <div className="text-center max-w-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Creator Access Required</h2>
                    <p className="text-zinc-400 mb-6">This page is exclusive to creators. Please log in with a creator account to publish new works.</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-violet-600 rounded-lg font-semibold hover:bg-violet-700">Return Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans relative">
            <div className="pt-[40px] pb-4">
                <header className="container text-center mx-auto px-4 mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">New Work</span>
                    </h1>
                    <p className="text-zinc-400 mt-4 text-sm">Add new Work to your <span style={{ color: '#cc5500' }}>Syndicate</span> profile.</p>
                </header>
            </div>

            <div className="h-[40px] w-full"></div>

            <main className="flex-1 flex flex-col items-center py-12 px-6 overflow-y-auto">
                <WorkForm
                    initialData={initialData}
                    onSave={handleSaveWork}
                    onAddNextChapter={handleAddNextChapter}
                />

                <div className="h-[20px]"></div>

                <p className="text-violet-500 text-sm text-center">
                    Preview your Work on the Manage Works page.
                </p>

                <div className="h-[100px]"></div>
            </main >
        </div >
    );
};

export default NewWork;
