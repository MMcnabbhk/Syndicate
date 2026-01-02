
import db from './src/server/db.js';

async function deleteLegacy() {
    try {
        const result = await db.query("DELETE FROM authors WHERE id = '1'");
        console.log('Delete result:', result);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

deleteLegacy();
