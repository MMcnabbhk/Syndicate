
import db from './src/server/db.js';

async function fixProfileImages() {
    try {
        // Fetch current data using snake_case column name
        const { rows } = await db.query(`SELECT id, profile_images FROM authors WHERE name = 'Michael James'`);
        if (rows.length === 0) {
            console.log('Author not found');
            return;
        }
        const author = rows[0];
        let images = author.profile_images;

        // Verify it is an array
        if (typeof images === 'string') {
            try { images = JSON.parse(images); } catch (e) { images = []; }
        }
        if (!Array.isArray(images)) images = [];

        // Ensure at least one slot exists
        if (images.length === 0) images.push({ id: 1, url: '', caption: '' });

        // Update Image 1
        console.log('Old Image 1:', images[0]);
        images[0].url = '/assets/michael_james_profile.jpg';
        // Remove 'file' object if present as it's not needed in DB
        delete images[0].file;

        console.log('New Image 1:', images[0]);

        // Update DB using snake_case column name
        await db.query(`UPDATE authors SET profile_images = ? WHERE id = ?`, [JSON.stringify(images), author.id]);
        console.log('Updated profile_images JSON successfully.');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

fixProfileImages();
