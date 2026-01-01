
import db from './src/server/db.js';

async function migrateGenre() {
    console.log('--- Adding Genre Column to Novels ---');
    try {
        // 1. Add column if it doesn't exist
        // Note: MySQL doesn't support IF NOT EXISTS for ADD COLUMN in all versions easily without procedure,
        // but we can catch the duplicate column error or check information_schema.
        // For simplicity in this dev environment, we'll try to add it.
        try {
            await db.query('ALTER TABLE Novels ADD COLUMN genre VARCHAR(255) DEFAULT "Literary Fiction"');
            console.log('✅ Added genre column');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('ℹ️ Genre column already exists');
            } else {
                throw e;
            }
        }

        // 2. Update existing records
        console.log('Updating existing novels to "Literary Fiction"...');
        await db.query('UPDATE Novels SET genre = "Literary Fiction" WHERE genre IS NULL OR genre = ""');

        // Custom genres for specific books if needed
        await db.query('UPDATE Novels SET genre = "Fantasy" WHERE title LIKE "%Tyger%"');
        await db.query('UPDATE Novels SET genre = "Adventure" WHERE title LIKE "%Thieves%"');

        console.log('✅ Updated genres');
        process.exit(0);

    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrateGenre();
