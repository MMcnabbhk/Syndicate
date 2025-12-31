// src/server/routes/api.js
import { Router } from 'express';

// Placeholder controller functions – to be implemented
import Poem from '../models/Poem.js';
import ShortStory from '../models/ShortStory.js';
import Audiobook from '../models/Audiobook.js';
import Novel from '../models/Novel.js';
import PoetryCollection from '../models/PoetryCollection.js';
import PoetryCollectionItem from '../models/PoetryCollectionItem.js';
import AudiobookChapter from '../models/AudiobookChapter.js';
import Author from '../models/Author.js';

// Validation middleware
const validatePoem = (req, res, next) => {
    const { author_id, title, content_html } = req.body;
    if (!author_id || !title || !content_html) {
        return res.status(400).json({ error: 'Missing required fields: author_id, title, content_html' });
    }
    next();
};

const validateShortStory = (req, res, next) => {
    const { author_id, title, content_html } = req.body;
    if (!author_id || !title || !content_html) {
        return res.status(400).json({ error: 'Missing required fields: author_id, title, content_html' });
    }
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
    const { author_id, title } = req.body;
    if (!author_id || !title) {
        return res.status(400).json({ error: 'Missing required fields: author_id, title' });
    }
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
router.post('/novels', validateNovel, create(Novel));
router.put('/novels/:id', update(Novel));
router.delete('/novels/:id', remove(Novel));

// Audiobook streaming endpoint (placeholder)
router.get('/audiobooks/:id/stream', (req, res) => {
    res.json({ message: 'Streaming not implemented' });
});

// Updated comments endpoint to accept content_type and content_id
// Authors endpoints
router.get('/authors', getAll(Author));
router.get('/authors/:id', getOne(Author));
router.post('/authors', create(Author));
router.put('/authors/:id', update(Author));
router.delete('/authors/:id', remove(Author));

// Combined Profile Data endpoint
// Combined Profile Data endpoint
router.get('/authors/:id/profile', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ error: 'Author not found' });

        // Fetch works (in a real app, optimize with joins or specific author_id queries in models)
        // Here we'll just filter after fetching all or assume specific methods exist
        const [poems, stories, audiobooks, collections, novels] = await Promise.all([
            Poem.findAll(),
            ShortStory.findAll(),
            Audiobook.findAll(),
            PoetryCollection.findAll(),
            Novel.findAll()
        ]);

        const authorWorks = {
            poems: poems.filter(p => p.author_id == req.params.id),
            stories: stories.filter(s => s.author_id == req.params.id),
            audiobooks: audiobooks.filter(a => a.author_id == req.params.id),
            collections: collections.filter(c => c.author_id == req.params.id),
            novels: novels.filter(n => n.author_id == req.params.id)
        };

        res.json({ author, works: authorWorks });
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
