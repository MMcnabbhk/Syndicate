
import db from './src/server/db.js';
import 'dotenv/config';

async function updateCovers() {
    console.log('--- Updating Book Covers ---');

    const updates = [
        {
            title: 'Water Washes Earth',
            cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop' // Earth/Space/Water theme
        },
        {
            title: 'Island Of The Thieves', // Note: Check capitalisation from previous step
            cover: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1746&auto=format&fit=crop' // Island/Sea theme
        },
        {
            title: 'Season of Light',
            cover: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=1674&auto=format&fit=crop' // Light/Sun theme
        },
        {
            title: 'Tyger',
            cover: 'https://images.unsplash.com/photo-1500468776721-0257e3f2215c?q=80&w=1740&auto=format&fit=crop' // Tiger eye/texture
        }
    ];

    for (const book of updates) {
        console.log(`Updating cover for: ${book.title}`);
        // Using LIKE to handle potential slight title variations
        const res = await db.query('UPDATE novels SET cover_image_url = ? WHERE title LIKE ?', [book.cover, book.title]);
        if (res.rowCount > 0) {
            console.log(`✅ Success`);
        } else {
            console.log(`❌ Book not found (trying exact match): ${book.title}`);
        }
    }

    // Also update "Island of The Thieves" separately if capitalization differed
    await db.query(`UPDATE novels SET cover_image_url = ? WHERE title = 'Island of The Thieves'`, ['https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1746&auto=format&fit=crop']);

    process.exit(0);
}

updateCovers();
