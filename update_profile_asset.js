
import db from './src/server/db.js';
import 'dotenv/config';

async function updateProfileImageToAsset() {
    console.log('--- Updating Profile Image to Asset ---');

    const authorID = '1';
    const newProfileImage = '/assets/michael_james_profile.jpg';

    try {
        await db.query('UPDATE authors SET profile_image_url = ? WHERE id = ?', [
            newProfileImage,
            authorID
        ]);
        console.log(`✅ Updated Author ${authorID} profile image to: ${newProfileImage}`);
    } catch (e) {
        console.error('❌ Error updating profile:', e.message);
    }

    process.exit(0);
}

updateProfileImageToAsset();
