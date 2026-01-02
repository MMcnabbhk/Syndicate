import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, PenTool, Headphones, Library, Users, DollarSign, Star, Eye, CheckCircle2, FileText, Archive, Lock, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import WorkForm from '../components/WorkForm';

const ManageWorks = () => {
    const { id } = useParams();
    const { userState } = useStore();
    // Maintain a flat list for sorting simplification, or re-structure to handle categorized sorting if needed. 
    // Given the request "order of your works", implies a single unified list or sorting within categories. 
    // The previous code flattened them for display ("allWorks"), so we will maintain a single unified sorted list in state for DND.
    const [allWorks, setAllWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWork, setSelectedWork] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loadingChapters, setLoadingChapters] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Sensors for DndKit
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Security Check
    if (userState.authorId && String(userState.authorId) !== String(id)) {
        return (
            <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="bg-red-500/10 p-6 rounded-full inline-block mb-4">
                        <Lock size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-zinc-400 mb-6">You are not authorized to manage works for this creator.</p>
                    <Link to="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-bold">Return Home</Link>
                </div>
            </div>
        );
    }

    const fetchWorks = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/api/authors/${id}/profile`);
            const data = await response.json();

            if (data && data.works) {
                const { works: apiWorks } = data;

                // Flatten and Map
                const mappedWorks = [
                    ...(apiWorks.novels || []).map(w => ({ ...w, type: 'Novel', icon: Library })),
                    ...(apiWorks.stories || []).map(w => ({ ...w, type: 'Short Story', icon: BookOpen })), // Normalized type name
                    ...(apiWorks.poems || []).map(w => ({ ...w, type: 'Poem', icon: PenTool })),
                    ...(apiWorks.audiobooks || []).map(w => ({ ...w, type: 'Audiobook', icon: Headphones }))
                ].map(w => ({
                    ...w,
                    status: 'Published',
                    subscribers: Math.floor(Math.random() * 500),
                    rating: 4.5,
                    lifetimeEarnings: (Math.random() * 1000).toFixed(2),
                    color: 'text-violet-500',
                    // Ensure a unique string ID for DnD
                    dndId: `${w.type}-${w.id}`
                }));

                // Sort by display_order if present, else default
                mappedWorks.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

                setAllWorks(mappedWorks);
            }
        } catch (err) {
            console.error("Failed to fetch works", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorks();
    }, [id]);

    const fetchChapters = async (work) => {
        if (work.type !== 'Novel') {
            setChapters([]);
            return;
        }
        setLoadingChapters(true);
        try {
            const response = await fetch(`http://localhost:4000/api/novels/${work.id}/chapters`);
            const data = await response.json();
            setChapters(data || []);
        } catch (err) {
            console.error("Failed to fetch chapters", err);
            setChapters([]);
        } finally {
            setLoadingChapters(false);
        }
    };

    const handleUpdateWork = async (formData) => {
        if (!selectedWork) return;

        const endpoint = formData.workType === 'Poem' ? '/api/poems' :
            formData.workType === 'Short Story' ? '/api/short-fiction' :
                '/api/novels';

        const payload = {
            title: formData.title,
            description: formData.description,
            genre: formData.genre,
            status: selectedWork.status || 'Draft', // Preserve status
            // Add other fields as necessary
        };

        try {
            const res = await fetch(`http://localhost:4000${endpoint}/${selectedWork.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Work updated successfully!");
                fetchWorks(); // Refresh list to show new title/details
                // setIsEditing(false); // Optional: close form or keep open
            } else {
                alert("Failed to update work.");
            }
        } catch (err) {
            console.error("Update failed", err);
            alert("Error updating work.");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setAllWorks((items) => {
                const oldIndex = items.findIndex(i => i.dndId === active.id);
                const newIndex = items.findIndex(i => i.dndId === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);

                // Prepare backend update
                const updates = newOrder.map((item, index) => ({
                    type: item.type,
                    id: item.id,
                    order: index
                }));

                // Fire and forget update (optimistic)
                fetch('http://localhost:4000/api/works/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ updates })
                }).catch(console.error);

                return newOrder;
            });
        }
    };

    const SortableWorkCard = ({ work }) => {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: work.dndId });
        const [isExpanded, setIsExpanded] = useState(false);

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        const Icon = work.icon;

        return (
            <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 group hover:border-violet-500/30 transition-all cursor-grab active:cursor-grabbing mb-4">
                <div className="flex items-center gap-2.5 mb-3">
                    <h3
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                            setSelectedWork(work);
                            setIsEditing(true);
                            fetchChapters(work);
                        }}
                        className="font-bold text-lg text-white group-hover:text-violet-200 transition-colors cursor-pointer hover:underline"
                    >
                        {work.title}
                    </h3>
                    <div className={`p-1.5 rounded-lg bg-white/5 ${work.color || 'text-zinc-500'} group-hover:bg-white/10 transition-all shrink-0`}>
                        <Icon size={18} />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    {/* Status */}
                    <span className={`font-medium ${work.status === 'Published' ? 'text-green-400' :
                        work.status === 'Archived' ? 'text-red-400' :
                            'text-zinc-500'
                        }`}>
                        {work.status}
                    </span>

                    {/* Genre */}
                    {work.genre && <span className="text-zinc-400">{work.genre}</span>}

                    {/* Subscribers */}
                    <span className="text-zinc-400">{work.subscribers} Subscribers</span>

                    {/* Rating */}
                    <span className="text-zinc-400">{work.rating} ★</span>

                    {/* Earnings */}
                    <span className="text-violet-400 font-medium">${work.lifetimeEarnings}</span>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <>
                        <div style={{ height: '10px' }}></div>
                        <Link
                            to={`/syndicate-work?id=${work.id}`}
                            className="inline-flex items-center text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            Chapter Link &gt;
                        </Link>
                    </>
                )}

                <div className="flex items-center gap-6 pt-4 mt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => {
                            setSelectedWork(work);
                            setIsEditing(true);
                            fetchChapters(work);
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors"
                    >
                        <Edit2 size={14} /> EDIT
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} /> DELETE
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#111111] text-white py-10">
            <header className="container mx-auto px-4 mb-12 flex flex-col items-center text-center">
                <h1
                    className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
                    style={{ paddingBottom: '20px', paddingTop: '20px' }}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Manage Works</span>
                </h1>
                <p className="text-zinc-400 max-w-2xl text-sm" style={{ textAlign: 'center' }}>
                    Click on a title to manage a Work or create a new Work.
                </p>
                <div style={{ height: '40px' }} aria-hidden="true" />
                <Link
                    to="/new-work"
                    style={{ backgroundColor: '#cc5500', color: 'white' }}
                    className="w-full md:w-auto min-w-[240px] px-12 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 hover:opacity-90"
                >
                    <Plus size={20} />
                    <span>New Work</span>
                </Link>
                <div style={{ height: '40px' }}></div>
            </header>

            <div style={{ height: '40px' }} aria-hidden="true" />

            <div className="container mx-auto px-4 max-w-7xl">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    /* Left Column Layout */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1 space-y-4">

                            {/* Drag and Drop Header */}
                            <div className="mb-6">
                                <Menu className="text-zinc-400 mb-2" size={24} />
                                <p className="text-zinc-500 text-sm">Select the order of your works on your Creator Profile by selecting and dragging the Work.</p>
                                <div style={{ height: '20px' }}></div>
                            </div>

                            {allWorks.length > 0 ? (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={allWorks.map(w => w.dndId)} strategy={verticalListSortingStrategy}>
                                        {allWorks.map((work) => (
                                            <SortableWorkCard key={work.dndId} work={work} />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            ) : (
                                <div className="text-zinc-500 italic py-8 text-center bg-[#1a1a1a] rounded-xl border border-white/5">
                                    No works found. Click "New Work" to get started.
                                </div>
                            )}
                        </div>

                        {/* Right Panel - Work Editor */}
                        <div className="lg:col-span-2">
                            {selectedWork ? (
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 sticky top-4">
                                    {chapters.length > 0 && (
                                        <div className="flex justify-center mb-2">
                                            <Link
                                                to={`/author/${id}/work/${selectedWork.id}/chapter/${[...chapters].sort((a, b) => a.chapter_number - b.chapter_number)[0].id}/edit`}
                                                className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-bold translate-x-[100px]"
                                            >
                                                <BookOpen size={20} />
                                                <span>Edit Chapters</span>
                                            </Link>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold text-xl text-white">Edit Work</h3>
                                        <button
                                            onClick={() => setSelectedWork(null)}
                                            className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Work Form Reuse */}
                                    <WorkForm
                                        initialData={{
                                            ...selectedWork,
                                            workType: selectedWork.type,
                                            // Ensure mapping between DB fields and Form fields
                                            // DB: title, description, genre
                                            // Form: title, description, genre
                                        }}
                                        onSave={handleUpdateWork}
                                        isEditing={true}
                                    // Hide chapter creation for now in this view as mostly meta update
                                    // or could implement Add Chapter logic here too
                                    />

                                    {/* Chapter list removed as requested */}
                                </div>
                            ) : (
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-12 text-center text-zinc-500">
                                    <Edit2 size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>Select a work from the list to edit its details.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageWorks;
