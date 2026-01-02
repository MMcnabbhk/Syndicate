
import db from './src/server/db.js';

async function runMigrations() {
    console.log('Starting migrations for authors table (Retry)...');

    const columnsToAdd = [
        "ADD COLUMN handle VARCHAR(100)",
        "ADD COLUMN about TEXT",
        "ADD COLUMN socials JSON",
        "ADD COLUMN genre VARCHAR(100)",
        "ADD COLUMN recommended_author_ids JSON",
        "ADD COLUMN amazon_url TEXT",
        "ADD COLUMN goodreads_url TEXT",
        "ADD COLUMN spotify_url TEXT",
        "ADD COLUMN profile_images JSON",
        "ADD COLUMN video_introductions JSON",
        "ADD COLUMN auto_responder_contributor TEXT",
        "ADD COLUMN auto_responder_fan TEXT",
        "ADD COLUMN target_gender JSON",
        "ADD COLUMN target_age JSON",
        "ADD COLUMN target_income JSON",
        "ADD COLUMN target_education JSON",
        "ADD COLUMN meta_pixel_id VARCHAR(50)",
        "ADD COLUMN ga_measurement_id VARCHAR(50)",
        "ADD COLUMN balance DECIMAL(10, 2) DEFAULT 0.00"
    ];

    for (const colDef of columnsToAdd) {
        try {
            await db.query(`ALTER TABLE authors ${colDef}`);
            console.log(`Successfully processed: ${colDef}`);
        } catch (err) {
            // Ignore "Duplicate column name" error (code 1060 for MySQL)
            if (err.errno === 1060 || err.code === 'ER_DUP_FIELDNAME') {
                console.log(`Column already exists (skipped): ${colDef}`);
            } else {
                console.error(`Error adding column: ${colDef}`, err.message);
            }
        }
    }

    console.log('Migrations complete.');
    process.exit(0);
}

runMigrations();
