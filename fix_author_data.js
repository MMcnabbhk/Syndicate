
import db from './src/server/db.js';
import 'dotenv/config';

async function fixAuthorData() {
    console.log('--- Fixing Author Data ---');
    const correctAuthorId = 1;
    const oldAuthorId = 'a1'; // Based on query result

    // 1. Update existing novels to correct author ID
    console.log(`1. Updating author_id for novels linked to '${oldAuthorId}'...`);
    await db.query(`UPDATE novels SET author_id = ? WHERE author_id = ?`, [correctAuthorId, oldAuthorId]);
    console.log('✅ Updated novels.');

    // 2. Check and Insert "Season of Light"
    console.log('2. Checking for "Season of Light"...');
    const { rows: season } = await db.query('SELECT * FROM novels WHERE title LIKE ?', ['%Season of L%ght%']);

    if (season.length === 0) {
        console.log('Creating "Season of Light"...');
        const sql = `INSERT INTO novels (author_id, title, status, genre, cover_image_url, blurb, rating, price, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        await db.query(sql, [
            correctAuthorId,
            'Season of Light',
            'published',
            'Fantasy',
            'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop', // Placeholder
            'A story of brilliance and shadow.',
            4.8,
            4.99
        ]);
        console.log('✅ Created "Season of Light".');
    } else {
        console.log('ℹ️ "Season of Light" already exists.');
        // Ensure it's linked to correct author
        await db.query('UPDATE novels SET author_id = ? WHERE id = ?', [correctAuthorId, season[0].id]);
    }

    // 3. Clean up duplicate author 'a1' if no longer needed
    // Only delete if it's NOT the same row (though ID is different string vs int)
    if (oldAuthorId != correctAuthorId) {
        console.log(`3. Removing duplicate author record '${oldAuthorId}'...`);
        try {
            await db.query('DELETE FROM authors WHERE id = ?', [oldAuthorId]);
            console.log('✅ Deleted duplicate author.');
        } catch (e) {
            console.warn('⚠️ Could not delete duplicate author (might have other constraints):', e.message);
        }
    }

    process.exit(0);
}

fixAuthorData();
