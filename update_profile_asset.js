
import db from './src/server/db.js';

async function updateProfileImage() {
    try {
        await db.query('UPDATE Authors SET profile_image_url = ? WHERE id = ?', [
            '/assets/michael_james_profile.jpg',
            '1'
        ]);
        console.log('✅ Updated Author Profile Image to /assets/michael_james_profile.jpg');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

updateProfileImage();
