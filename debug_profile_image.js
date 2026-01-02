
import db from './src/server/db.js';

async function checkImages() {
    try {
        const { rows } = await db.query("SELECT id, name, profile_image_url FROM authors WHERE name = 'Michael James'");
        console.log('Michael James records:');
        rows.forEach(a => console.log(`- ID: ${a.id}, Image: ${a.profile_image_url}`));
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

checkImages();
