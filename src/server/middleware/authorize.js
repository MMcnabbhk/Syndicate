import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import Author from '../models/Author.js';

/**
 * Middleware to verify if the authenticated user owns the author record.
 */
export const isAuthorOwner = async (req, res, next) => {
    try {
        const authorId = req.params.authorId || req.params.id; // Handles both /authors/:id and /authors/:authorId/...
        if (!authorId) return res.status(400).json({ error: 'Author ID missing in request' });

        const author = await Author.findById(authorId);
        if (!author) return res.status(404).json({ error: 'Author not found' });

        if (author.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: You do not own this author profile' });
        }

        req.author = author; // Attach for potential reuse
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization error: ' + error.message });
    }
};

/**
 * Middleware to verify if the authenticated user owns the novel.
 */
export const isNovelOwner = async (req, res, next) => {
    try {
        const novelId = req.params.novelId || req.params.id;
        if (!novelId) return res.status(400).json({ error: 'Novel ID missing in request' });

        const novel = await Novel.findById(novelId);
        if (!novel) return res.status(404).json({ error: 'Novel not found' });

        const author = await Author.findById(novel.author_id);
        if (!author || author.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: You do not own this work' });
        }

        req.novel = novel;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization error: ' + error.message });
    }
};

/**
 * Middleware to verify if the authenticated user owns the chapter (via its novel).
 */
export const isChapterOwner = async (req, res, next) => {
    try {
        const chapterId = req.params.chapterId || req.params.id;
        if (!chapterId) return res.status(400).json({ error: 'Chapter ID missing in request' });

        const chapter = await Chapter.findById(chapterId);
        if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

        const novel = await Novel.findById(chapter.novel_id);
        const author = await Author.findById(novel.author_id);

        if (!author || author.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: You do not own this chapter' });
        }

        req.chapter = chapter;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authorization error: ' + error.message });
    }
};
