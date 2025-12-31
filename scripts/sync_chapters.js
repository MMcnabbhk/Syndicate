
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? 'password',
    database: process.env.DB_NAME || 'book_site',
};

const CHAPTERS = {
    'b1': [
        { id: 'c1-1', sequence: 1, title: 'Chapter 1: The Map', content: 'The parchment was brittle...' }
    ],
    'b2': [
        { id: 'c2-1', sequence: 1, title: 'Chapter 1: The Shore', content: 'The waves crashed against...' }
    ],
    'b3': [
        { id: 'c3-1', sequence: 1, title: 'Chapter 1: Midsummer', content: 'The sun never set that year...' }
    ]
};

async function syncChapters() {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection(dbConfig);

    try {
        console.log('Syncing chapters...');

        for (const [novelId, chapters] of Object.entries(CHAPTERS)) {
            for (const chapter of chapters) {
                const wordCount = chapter.content.split(/\s+/).length;

                // Using INSERT ON DUPLICATE KEY UPDATE to handle re-runs safely
                const sql = `
                    INSERT INTO chapters (id, novel_id, chapter_number, title, content_html, word_count)
                    VALUES (?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        title = VALUES(title),
                        content_html = VALUES(content_html),
                        word_count = VALUES(word_count)
                `;

                await connection.execute(sql, [
                    chapter.id,
                    novelId,
                    chapter.sequence,
                    chapter.title,
                    chapter.content,
                    wordCount
                ]);

                console.log(`Synced chapter: ${chapter.title} (${novelId})`);
            }
        }

        console.log('Chapter sync complete!');
    } catch (error) {
        console.error('Error syncing chapters:', error);
    } finally {
        await connection.end();
    }
}

syncChapters();
