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
