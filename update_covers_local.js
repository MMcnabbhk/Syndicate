
import db from './src/server/db.js';
import 'dotenv/config';

async function updateCoversToLocal() {
    console.log('--- Updating Book Covers to Local Assets ---');

    const updates = [
        {
            // Water Washes Earth
            id: 'b2',
            cover: '/assets/cover_water_washes.jpg'
        },
        {
            // Island Of The Thieves
            id: 'b1',
            cover: '/assets/island_thieves_new.jpg'
        },
        {
            // Season of Light
            id: 'b3',
            cover: '/assets/cover_season_of_light.jpg'
        },
        {
            // Tyger
            id: 'b5',
            cover: '/assets/cover_tyger.jpg'
        }
    ];

    for (const book of updates) {
        console.log(`Updating ${book.id} to ${book.cover}...`);
        try {
            await db.query('UPDATE novels SET cover_image_url = ? WHERE id = ?', [book.cover, book.id]);
            console.log('✅ Success');
        } catch (e) {
            console.error('❌ Failed:', e.message);
        }
    }

    process.exit(0);
}

updateCoversToLocal();
