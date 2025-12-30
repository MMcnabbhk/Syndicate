// src/components/PoetryCollectionView.jsx
import React from 'react';
import PoemViewer from './PoemViewer';

/**
 * PoetryCollectionView displays a collection of poems with a title and description.
 * Props:
 *   - collection: { title, description, poems: [{...poem}] }
 */
const PoetryCollectionView = ({ collection }) => {
    if (!collection) return <div className="text-white">Loading collection…</div>;
    const { title, description, poems } = collection;
    return (
        <div className="p-6 bg-zinc-900 text-white rounded-lg shadow-lg max-w-4xl mx-auto mb-8">
            <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {title}
            </h2>
            <p className="text-center text-zinc-300 mb-6">{description}</p>
            {poems && poems.length > 0 ? (
                poems.map((poem) => (
                    <PoemViewer key={poem.id} poem={poem} showLineNumbers={false} />
                ))
            ) : (
                <div className="text-zinc-400">No poems in this collection.</div>
            )}
        </div>
    );
};

export default PoetryCollectionView;
