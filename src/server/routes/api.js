import { Router } from 'express';

// Placeholder controller functions – to be implemented
import Poem from '../models/Poem.js';
import ShortStory from '../models/ShortStory.js';
import Audiobook from '../models/Audiobook.js';
import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import PoetryCollection from '../models/PoetryCollection.js';
import PoetryCollectionItem from '../models/PoetryCollectionItem.js';
import AudiobookChapter from '../models/AudiobookChapter.js';
import Author from '../models/Author.js';
import User from '../models/User.js';

// Auth middleware
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

import { isAuthorOwner, isNovelOwner, isChapterOwner } from '../middleware/authorize.js';
import { sanitizeHtml, sanitizeText } from '../utils/sanitize.js';

// Validation middleware
const validatePoem = (req, res, next) => {
    const { author_id, title, content_html } = req.body;
    if (!author_id || !title || !content_html) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    req.body.title = sanitizeText(title);
    req.body.content_html = sanitizeHtml(content_html);
    next();
};

const validateShortStory = (req, res, next) => {
    const { author_id, title, content_html } = req.body;
    if (!author_id || !title || !content_html) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    req.body.title = sanitizeText(title);
    req.body.content_html = sanitizeHtml(content_html);
    next();
};

const validateAudiobook = (req, res, next) => {
    const { author_id, title } = req.body;
    if (!author_id || !title) {
        return res.status(400).json({ error: 'Missing required fields: author_id, title' });
    }
    next();
};

const validatePoetryCollection = (req, res, next) => {
    const { author_id, title } = req.body;
    if (!author_id || !title) {
        return res.status(400).json({ error: 'Missing required fields: author_id, title' });
    }
    next();
};

const validatePoetryCollectionItem = (req, res, next) => {
    const { collection_id, poem_id } = req.body;
    if (!collection_id || !poem_id) {
        return res.status(400).json({ error: 'Missing required fields: collection_id, poem_id' });
    }
    next();
};

const validateAudiobookChapter = (req, res, next) => {
    const { audiobook_id, chapter_number, title, audio_url } = req.body;
    if (!audiobook_id || !chapter_number || !title || !audio_url) {
        return res.status(400).json({ error: 'Missing required fields: audiobook_id, chapter_number, title, audio_url' });
    }
    next();
};

const validateNovel = (req, res, next) => {
    const { author_id, title, genre } = req.body;
    if (!author_id || !title || !genre) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    req.body.title = sanitizeText(title);
    if (req.body.description) req.body.description = sanitizeText(req.body.description);
    next();
};
// Generic CRUD handlers (will be bound per content type)
const getAll = (Model) => async (req, res) => {
    const items = await Model.findAll();
    res.json(items);
};
const getOne = (Model) => async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ error: 'Not found' });
};
const create = (Model) => async (req, res) => {
    try {
        const newItem = await Model.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const update = (Model) => async (req, res) => {
    try {
        const item = await Model.update(req.params.id, req.body);
        if (item) res.json(item);
        else res.status(404).json({ error: 'Not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const remove = (Model) => async (req, res) => {
    try {
        await Model.delete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const router = Router();

// Poems endpoints
router.get('/poems', getAll(Poem));
router.get('/poems/:id', getOne(Poem));
router.post('/poems', validatePoem, create(Poem));
router.put('/poems/:id', update(Poem));
router.delete('/poems/:id', remove(Poem));

// Short Fiction endpoints
router.get('/short-fiction', getAll(ShortStory));
router.get('/short-fiction/:id', getOne(ShortStory));
router.post('/short-fiction', validateShortStory, create(ShortStory));
router.put('/short-fiction/:id', update(ShortStory));
router.delete('/short-fiction/:id', remove(ShortStory));

// Audiobooks endpoints
router.get('/audiobooks', getAll(Audiobook));
router.get('/audiobooks/:id', getOne(Audiobook));
router.post('/audiobooks', validateAudiobook, create(Audiobook));
router.put('/audiobooks/:id', update(Audiobook));
router.delete('/audiobooks/:id', remove(Audiobook));

// Poetry Collections endpoints
router.get('/poetry-collections', getAll(PoetryCollection));
router.get('/poetry-collections/:id', getOne(PoetryCollection));
router.post('/poetry-collections', validatePoetryCollection, create(PoetryCollection));
router.put('/poetry-collections/:id', update(PoetryCollection));
router.delete('/poetry-collections/:id', remove(PoetryCollection));

// Poetry Collection Items endpoints
router.get('/poetry-collection-items', getAll(PoetryCollectionItem));
router.get('/poetry-collection-items/:id', getOne(PoetryCollectionItem));
router.post('/poetry-collection-items', validatePoetryCollectionItem, create(PoetryCollectionItem));
router.put('/poetry-collection-items/:id', update(PoetryCollectionItem));
router.delete('/poetry-collection-items/:id', remove(PoetryCollectionItem));

// Audiobook Chapters endpoints
router.get('/audiobook-chapters', getAll(AudiobookChapter));
router.get('/audiobook-chapters/:id', getOne(AudiobookChapter));
router.post('/audiobook-chapters', validateAudiobookChapter, create(AudiobookChapter));
router.put('/audiobook-chapters/:id', update(AudiobookChapter));
router.delete('/audiobook-chapters/:id', remove(AudiobookChapter));

// Novels endpoints
router.get('/novels', getAll(Novel));
router.get('/novels/:id', getOne(Novel));
router.post('/novels', isAuthenticated, validateNovel, async (req, res) => {
    // Check if user owns the author_id
    try {
        const author = await Author.findById(req.body.author_id);
        if (!author || author.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: You can only create works for your own profile' });
        }
        create(Novel)(req, res);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.put('/novels/:id', isAuthenticated, isNovelOwner, update(Novel));
router.delete('/novels/:id', isAuthenticated, isNovelOwner, remove(Novel));
router.get('/novels/:id/chapters', async (req, res) => {
    try {
        const chapters = await Chapter.findAllByNovelId(req.params.id);
        res.json(chapters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/chapters', isAuthenticated, async (req, res) => {
    try {
        const { novel_id, title, chapter_number, content_html } = req.body;
        if (!novel_id || !title || !chapter_number) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify ownership of the novel
        const novel = await Novel.findById(novel_id);
        if (!novel) return res.status(404).json({ error: 'Novel not found' });
        const author = await Author.findById(novel.author_id);
        if (!author || author.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: You do not own this work' });
        }

        // Sanitize
        req.body.title = sanitizeText(title);
        req.body.content_html = sanitizeHtml(content_html);

        const chapter = await Chapter.create(req.body);
        res.status(201).json(chapter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chapters specific endpoints (Get one, Update, Delete)
router.get('/chapters/:id', getOne(Chapter));
router.put('/chapters/:id', isAuthenticated, isChapterOwner, (req, res, next) => {
    if (req.body.title) req.body.title = sanitizeText(req.body.title);
    if (req.body.content_html) req.body.content_html = sanitizeHtml(req.body.content_html);
    next();
}, update(Chapter));
router.delete('/chapters/:id', isAuthenticated, isChapterOwner, remove(Chapter));

// Audiobook streaming endpoint (placeholder)
router.get('/audiobooks/:id/stream', (req, res) => {
    res.json({ message: 'Streaming not implemented' });
});

// Updated comments endpoint to accept content_type and content_id
// Current Session Author Endpoints - MUST be before /authors/:id
router.get('/authors/me', isAuthenticated, async (req, res) => {
    try {
        const author = await Author.findByUserId(req.user.id);
        if (author) {
            res.json(author);
        } else {
            res.status(404).json({ error: 'Author record not found for this user' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Current Session Author Endpoints
router.put('/authors/me', isAuthenticated, async (req, res) => {
    console.log('[API Debug] PUT /authors/me called. User:', req.user ? req.user.id : 'Unauthenticated');
    try {
        const author = await Author.findByUserId(req.user.id);
        if (!author) {
            return res.status(404).json({ error: 'Author record not found' });
        }
        const updatedAuthor = await Author.update(author.id, req.body);
        res.json(updatedAuthor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Authors endpoints
router.get('/authors', getAll(Author));
router.get('/authors/:id', getOne(Author));
router.post('/authors', isAuthenticated, create(Author));
router.put('/authors/:id', isAuthenticated, isAuthorOwner, update(Author));
router.delete('/authors/:id', isAuthenticated, isAuthorOwner, remove(Author));

// Combined Profile Data endpoint
// Combined Profile Data endpoint
// Combined Profile Data endpoint
router.get('/authors/:id/profile', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ error: 'Author not found' });

        const [poems, stories, audiobooks, collections, novels] = await Promise.all([
            // Return empty arrays for tables that don't exist yet to prevent crashes
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
            Promise.resolve([]),
            Novel.findAll() // Novels table exists and works
            /* 
            Poem.findAll().catch(() => []), 
            ShortStory.findAll().catch(() => []),
            Audiobook.findAll().catch(() => []),
            PoetryCollection.findAll().catch(() => []),
            */
        ]);

        const sortByOrder = (a, b) => (a.display_order || 0) - (b.display_order || 0);

        const authorWorks = {
            poems: poems.filter(p => p.author_id == req.params.id).sort(sortByOrder),
            stories: stories.filter(s => s.author_id == req.params.id).sort(sortByOrder),
            audiobooks: audiobooks.filter(a => a.author_id == req.params.id).sort(sortByOrder),
            collections: collections.filter(c => c.author_id == req.params.id).sort(sortByOrder),
            novels: novels.filter(n => n.author_id == req.params.id).sort(sortByOrder)
        };

        res.json({ author, works: authorWorks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reorder Works Endpoint
router.post('/works/reorder', isAuthenticated, async (req, res) => {
    const { updates } = req.body; // Expects array of { type, id, order }

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ error: 'Invalid updates format' });
    }

    try {
        await Promise.all(updates.map(async (update) => {
            let Model;
            switch (update.type) {
                case 'Novel': Model = Novel; break;
                case 'Short Fiction': Model = ShortStory; break;
                case 'Poem': Model = Poem; break;
                case 'Audiobook': Model = Audiobook; break;
                // Add others as needed
            }

            if (Model) {
                await Model.update(update.id, { display_order: update.order });
            }
        }));
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/authors/:id/earnings', async (req, res) => {
    try {
        const earnings = await Author.getEarnings(req.params.id);
        const author = await Author.findById(req.params.id);
        res.json({
            balance: author.balance,
            ...earnings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/authors/:id/payout', async (req, res) => {
    try {
        const result = await Author.requestPayout(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/comments', (req, res) => {
    const { content_type, content_id } = req.query;
    // TODO: filter comments based on content_type and content_id
    res.json({ message: 'Comments fetch not implemented', content_type, content_id });
});
router.post('/comments', (req, res) => {
    const { content_type, content_id, text } = req.body;
    // TODO: create comment linked to specified content
    res.json({ message: 'Create comment not implemented', content_type, content_id, text });
});

export default router;
