
import db from './src/server/db.js';
import 'dotenv/config';

async function fixAssets() {
    console.log('--- Fixing Assets (Covers & Profile) ---');

    const authorID = '1';

    // 1. Update Author Profile Image
    console.log(`1. Updating Michael James Profile Image for ID: ${authorID}...`);
    try {
        await db.query('UPDATE authors SET profile_image_url = ? WHERE id = ?', [
            '/michael_james.png',
            authorID
        ]);
        console.log('✅ Updated Author Profile.');
    } catch (e) {
        console.error('❌ Error updating profile:', e.message);
    }

    // 2. Update Book Covers by ID (b1, b2, b3, b5)
    // Water Washes Earth (b2)
    console.log('2. Updating Water Washes Earth (b2)...');
    try {
        await db.query('UPDATE novels SET cover_image_url = ? WHERE id = ?', [
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop',
            'b2'
        ]);
        console.log('✅ Success b2');
    } catch (e) { console.error('❌ b2 failed:', e.message); }

    // Island Of The Thieves (b1)
    console.log('3. Updating Island Of The Thieves (b1)...');
    try {
        await db.query('UPDATE novels SET cover_image_url = ? WHERE id = ?', [
            'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1746&auto=format&fit=crop',
            'b1'
        ]);
        console.log('✅ Success b1');
    } catch (e) { console.error('❌ b1 failed:', e.message); }

    // Season of Light (b3)
    console.log('4. Updating Season of Light (b3)...');
    try {
        await db.query('UPDATE novels SET cover_image_url = ? WHERE id = ?', [
            'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?q=80&w=1674&auto=format&fit=crop',
            'b3'
        ]);
        console.log('✅ Success b3');
    } catch (e) { console.error('❌ b3 failed:', e.message); }

    // Tyger (b5)
    console.log('5. Updating Tyger (b5)...');
    try {
        await db.query('UPDATE novels SET cover_image_url = ? WHERE id = ?', [
            'https://images.unsplash.com/photo-1500468776721-0257e3f2215c?q=80&w=1740&auto=format&fit=crop',
            'b5'
        ]);
        console.log('✅ Success b5');
    } catch (e) { console.error('❌ b5 failed:', e.message); }

    console.log('🎉 All assets updated.');
    process.exit(0);
}

fixAssets();
