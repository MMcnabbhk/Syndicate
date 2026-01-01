/**
 * Data Adapter - Transforms SQL database schema to UI component format
 * This ensures compatibility between backend SQL data and frontend components
 */

/**
 * Adapt a novel from SQL format to UI format
 * @param {Object} novel - Novel object from SQL database
 * @returns {Object} Novel object formatted for UI components
 */
export const adaptNovelForUI = (novel) => {
    if (!novel) return null;

    return {
        ...novel,
        // Map SQL fields to UI expected fields
        coverImage: novel.cover_image_url || novel.coverImage,
        blurb: novel.description || novel.blurb,
        rating: novel.rating || 4.5,
        author: novel.author || 'Unknown Author',
        genre: novel.genre || 'Literary Fiction',
        // Keep original SQL fields for reference
        cover_image_url: novel.cover_image_url,
        description: novel.description
    };
};

/**
 * Adapt an author from SQL format to UI format
 */
export const adaptAuthorForUI = (author) => {
    if (!author) return null;

    return {
        ...author,
        id: author.id,
        name: author.name,
        handle: author.name ? '@' + author.name.replace(/\s+/g, '').toLowerCase() : '@unknown',
        bio: author.bio || 'No biography available.',
        image: author.profile_image_url || author.image || 'https://via.placeholder.com/150', // Fallback image
        coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=2070", // Default cover
        socials: author.socials || {},
        stats: {
            books: (author.novel_count || 0) + (author.collection_count || 0) + (author.audiobook_count || 0),
            followers: "1.2k", // Mock for now if not in DB
            rating: "4.8" // Mock for now
        },
        joinedDate: author.created_at ? new Date(author.created_at).toLocaleDateString() : 'Unknown'
    };
};

/**
 * Adapt an audiobook from SQL format to UI format
 */
export const adaptAudiobookForUI = (audiobook) => {
    if (!audiobook) return null;

    return {
        ...audiobook,
        coverImage: audiobook.cover_image_url || audiobook.coverImage,
        blurb: audiobook.description || audiobook.blurb,
        rating: audiobook.rating || 4.5,
        author: audiobook.author || 'Unknown Author',
        genre: audiobook.genre || 'Literary Fiction',
        length: audiobook.duration_seconds
            ? formatDuration(audiobook.duration_seconds)
            : audiobook.length
    };
};

/**
 * Adapt a poem from SQL format to UI format
 */
export const adaptPoemForUI = (poem) => {
    if (!poem) return null;

    return {
        ...poem,
        coverImage: poem.cover_image_url || poem.coverImage,
        blurb: poem.description || poem.blurb,
        rating: poem.rating || 4.5,
        author: poem.author || 'Unknown Author',
        genre: poem.genre || 'Poetry'
    };
};

/**
 * Adapt a short story from SQL format to UI format
 */
export const adaptShortStoryForUI = (story) => {
    if (!story) return null;

    return {
        ...story,
        coverImage: story.cover_image_url || story.coverImage,
        blurb: story.description || story.blurb,
        rating: story.rating || 4.5,
        author: story.author || 'Unknown Author',
        genre: story.genre || 'Short Story'
    };
};

/**
 * Adapt a chapter from SQL format to UI format
 */
export const adaptChapterForUI = (chapter) => {
    if (!chapter) return null;

    return {
        ...chapter,
        // SQL usually returns id, novel_id, chapter_number, title, content_html
        // Map to UI expected fields if needed
        sequence: chapter.chapter_number,
        content: chapter.content_html,
        // Ensure id format matches what UI might expect (though usually we use DB id now)
        url: `/read/${chapter.novel_id}/${chapter.id}`
    };
};

/**
 * Helper function to format duration in seconds to readable format
 */
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
};

/**
 * Adapt an array of items using the appropriate adapter
 */
export const adaptArrayForUI = (items, type) => {
    if (!Array.isArray(items)) return [];

    const adapters = {
        novel: adaptNovelForUI,
        audiobook: adaptAudiobookForUI,
        poem: adaptPoemForUI,
        story: adaptShortStoryForUI
    };

    const adapter = adapters[type];
    return adapter ? items.map(adapter) : items;
};
