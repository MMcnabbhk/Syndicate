
import db from './src/server/db.js';
import { randomUUID } from 'crypto';

async function fixMissingAuthorV2() {
    try {
        const userId = 'user_giypuxcey';
        const authorId = randomUUID();

        console.log(`Checking author for User ID: ${userId}...`);
        const { rows } = await db.query('SELECT * FROM authors WHERE user_id = ?', [userId]);

        if (rows.length > 0) {
            console.log('Author record already exists for this user.');
        } else {
            console.log(`No author found. Creating new Author record with ID: ${authorId}...`);
            await db.query(`
                INSERT INTO authors (id, user_id, name, bio, about, socials, profile_images, video_introductions)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                authorId,
                userId,
                'Michael (Creator)',
                'New profile.',
                'About me...',
                '{}',
                '[]',
                '[]'
            ]);
            console.log('Successfully created new Author record verified.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixMissingAuthorV2();
