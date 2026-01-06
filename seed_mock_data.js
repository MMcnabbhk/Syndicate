
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME || 'serialized_novels',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

async function seedData() {
    try {
        console.log("Seeding mock data...");

        // 1. Ensure we have a compatible Mock Author (ID '999')
        const mockAuthorId = '999';
        const [existing] = await pool.query("SELECT id FROM authors WHERE id = ?", [mockAuthorId]);

        if (existing.length === 0) {
            console.log("Creating Mock Author (ID 999)...");
            await pool.query(`
                INSERT INTO authors (id, name, bio, profile_image_url) 
                VALUES (?, ?, ?, ?)
            `, [mockAuthorId, 'Mock Creator', 'A generated profile for testing.', '/assets/michael_james_profile.jpg']);
        }

        const authorIdStr = mockAuthorId; // For VARCHAR author_id
        const authorIdInt = 999;          // For INT author_id

        // 2. Define the works (2 per category)
        const mocks = [
            // Novels
            { table: 'novels', title: 'The Silent Star', genre: 'Sci-Fi', image: '/assets/cover_chronomancer.png' },
            { table: 'novels', title: 'Whispers of the Old World', genre: 'Fantasy', image: '/assets/island_thieves_new.jpg' },

            // Audiobooks
            { table: 'audiobooks', title: 'Echoes in the Void (Audio)', genre: 'Sci-Fi', image: '/assets/cover_deep.png' },
            { table: 'audiobooks', title: 'The Last Bard (Audio)', genre: 'Fantasy', image: '/assets/cover_season_of_light.jpg' },

            // Short Stories
            { table: 'short_stories', title: 'A Coffee Shop in Paris', genre: 'Romance', image: '/assets/cover_water_washes.jpg' },
            { table: 'short_stories', title: 'The Midnight Train', genre: 'Mystery', image: '/assets/cover_tyger.jpg' },

            // Poems
            { table: 'poems', title: 'Ode to the Digital Age', genre: 'Contemporary', image: '/assets/cover_neon.png' },
            { table: 'poems', title: 'Rust and Bone', genre: 'Nature', image: '/assets/cover_chronomancer.png' },

            // Visual Arts
            { table: 'visual_arts', title: 'Cyberpunk Cityscapes', genre: 'Digital', image: '/assets/cover_neon.png' },
            { table: 'visual_arts', title: 'Traditional Japanese Inks', genre: 'Traditional', image: '/assets/island_thieves_new.jpg' }
        ];

        // 3. Insert them
        for (const work of mocks) {
            const description = `This is a complete mock profile for ${work.title}. It includes all necessary input fields, logic, and descriptions. A compelling masterpiece in the ${work.genre} genre.`;
            const short_desc = description.slice(0, 150) + "...";
            const content = `<p>${description}</p><p>Sample content for ${work.title}.</p>`;

            let sql = '';
            let params = [];

            if (work.table === 'novels') {
                const id = crypto.randomUUID();
                sql = `INSERT INTO novels (id, author_id, title, description, cover_image_url, status, published_at, genre, short_description) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`;
                // Novels uses VARCHAR ID and VARCHAR author_id
                params = [id, authorIdStr, work.title, description, work.image, 'published', work.genre, short_desc];

            } else if (work.table === 'audiobooks') {
                sql = `INSERT INTO audiobooks (author_id, title, short_description, cover_image_url, status, published_at, genre, narrator, duration_seconds) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)`;
                // Audiobooks uses VARCHAR author_id, AUTO_INC ID
                params = [authorIdStr, work.title, short_desc, work.image, 'published', work.genre, 'Mock Narrator', 3600];

            } else if (work.table === 'short_stories') {
                sql = `INSERT INTO short_stories (author_id, title, short_description, summary, content_html, cover_image_url, status, published_at, genre) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;
                // Short Stories uses VARCHAR author_id, AUTO_INC ID
                params = [authorIdStr, work.title, short_desc, description, content, work.image, 'published', work.genre];

            } else if (work.table === 'poems') {
                sql = `INSERT INTO poems (author_id, title, short_description, content_html, cover_image_url, status, published_at, genre, form) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`;
                // Poems uses VARCHAR author_id, AUTO_INC ID
                params = [authorIdStr, work.title, short_desc, content, work.image, 'published', work.genre, 'Free Verse'];

            } else if (work.table === 'visual_arts') {
                sql = `INSERT INTO visual_arts (author_id, title, description, cover_image_url, status, published_at, genre) VALUES (?, ?, ?, ?, ?, NOW(), ?)`;
                // Visual Arts uses INT author_id (legacy), AUTO_INC ID
                params = [authorIdInt, work.title, description, work.image, 'published', work.genre];
            }

            try {
                await pool.execute(sql, params);
                console.log(`Created ${work.table}: ${work.title}`);
            } catch (e) {
                console.error(`Failed to create ${work.title} in ${work.table}:`, e.message);
            }
        }

    } catch (err) {
        console.error("Seeding Failed:", err);
    } finally {
        await pool.end();
    }
}

seedData();
