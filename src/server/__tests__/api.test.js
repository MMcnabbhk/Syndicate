import { jest } from '@jest/globals';
import request from 'supertest';

// Mock all content models
jest.unstable_mockModule('../models/Poem.js', () => ({ default: { findAll: jest.fn(), findById: jest.fn(), create: jest.fn() } }));
jest.unstable_mockModule('../models/ShortStory.js', () => ({ default: { findAll: jest.fn(), findById: jest.fn(), create: jest.fn() } }));
jest.unstable_mockModule('../models/Audiobook.js', () => ({ default: { findAll: jest.fn(), findById: jest.fn(), create: jest.fn() } }));
jest.unstable_mockModule('../models/PoetryCollection.js', () => ({ default: { findAll: jest.fn(), findById: jest.fn(), create: jest.fn() } }));
jest.unstable_mockModule('../models/PoetryCollectionItem.js', () => ({ default: { findAllByCollectionId: jest.fn(), create: jest.fn() } }));
jest.unstable_mockModule('../models/AudiobookChapter.js', () => ({ default: { findAllByAudiobookId: jest.fn(), create: jest.fn() } }));

const { default: app } = await import('../index.js');
const { default: Poem } = await import('../models/Poem.js');
const { default: ShortStory } = await import('../models/ShortStory.js');
const { default: Audiobook } = await import('../models/Audiobook.js');
const { default: PoetryCollection } = await import('../models/PoetryCollection.js');

describe('API Routes Integration Tests', () => {

    describe('Poems API', () => {
        it('POST /api/poems - validation failure', async () => {
            const res = await request(app).post('/api/poems').send({});
            expect(res.statusCode).toEqual(400);
        });
        it('POST /api/poems - success', async () => {
            Poem.create.mockResolvedValue({ id: 1, title: 'Test' });
            const res = await request(app).post('/api/poems').send({ author_id: 1, title: 'Test', content_html: 'p' });
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('Short Fiction API', () => {
        it('POST /api/short-fiction - validation failure', async () => {
            const res = await request(app).post('/api/short-fiction').send({});
            expect(res.statusCode).toEqual(400);
        });
        it('POST /api/short-fiction - success', async () => {
            ShortStory.create.mockResolvedValue({ id: 1, title: 'Story' });
            const res = await request(app).post('/api/short-fiction').send({ author_id: 1, title: 'Story', content_html: 'p' });
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('Audiobooks API', () => {
        it('POST /api/audiobooks - validation failure', async () => {
            const res = await request(app).post('/api/audiobooks').send({});
            expect(res.statusCode).toEqual(400);
        });
        it('POST /api/audiobooks - success', async () => {
            Audiobook.create.mockResolvedValue({ id: 1, title: 'Audio' });
            const res = await request(app).post('/api/audiobooks').send({ author_id: 1, title: 'Audio' });
            expect(res.statusCode).toEqual(201);
        });
    });

    describe('Poetry Collections API', () => {
        it('POST /api/poetry-collections - validation failure', async () => {
            const res = await request(app).post('/api/poetry-collections').send({});
            expect(res.statusCode).toEqual(400);
        });
        it('POST /api/poetry-collections - success', async () => {
            PoetryCollection.create.mockResolvedValue({ id: 1, title: 'Coll' });
            const res = await request(app).post('/api/poetry-collections').send({ author_id: 1, title: 'Coll' });
            expect(res.statusCode).toEqual(201);
        });
    });

});
