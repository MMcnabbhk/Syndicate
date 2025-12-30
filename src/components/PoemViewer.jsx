// src/components/PoemViewer.jsx
import React from 'react';

/**
 * PoemViewer renders a poem preserving line breaks and optional line numbers.
 * Props:
 *   - poem: { title, author, content_html, form, tags }
 *   - showLineNumbers: boolean (default true)
 */
const PoemViewer = ({ poem, showLineNumbers = true }) => {
    if (!poem) return <div className="text-white">Loading poem…</div>;

    // Split the HTML content by line breaks for display
    const lines = poem.content_html.split('\n');

    return (
        <div className="p-6 bg-zinc-900 text-white rounded-lg shadow-lg max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
                {poem.title}
            </h1>
            <p className="text-sm text-zinc-400 mb-6 text-center">by {poem.author}</p>
            <div className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
                {lines.map((line, idx) => (
                    <div key={idx} className="flex">
                        {showLineNumbers && (
                            <span className="w-8 text-zinc-600 mr-2 select-none">{idx + 1}</span>
                        )}
                        <span>{line}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PoemViewer;
