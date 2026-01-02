
import db from './src/server/db.js';
import Author from './src/server/models/Author.js';

async function fixMissingAuthor() {
    try {
        const userId = 'user_giypuxcey'; // ID for michael@creator.com

        console.log(`Checking author for User ID: ${userId}...`);
        const existing = await Author.findByUserId(userId);

        if (existing) {
            console.log('Author record already exists for this user.');
        } else {
            console.log('No author found. Creating new Author record...');
            await Author.create({
                user_id: userId,
                name: 'Michael (Creator)',
                bio: 'New profile ready for verification.'
            });
            console.log('Successfully created new Author record.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixMissingAuthor();
