
import db from './src/server/db.js';

async function fixImage() {
    try {
        // Update the UUID user (which is the one usually logged in/active)
        // We identify by name 'Michael James' and length of ID > 10 to target UUID
        const result = await db.query(`
            UPDATE authors 
            SET profile_image_url = '/assets/michael_james_profile.jpg' 
            WHERE name = 'Michael James' AND LENGTH(id) > 10
        `);
        console.log('Update result:', result);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

fixImage();
