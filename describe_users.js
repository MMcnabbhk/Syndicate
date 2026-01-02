
import db from './src/server/db.js';

async function describe() {
    try {
        const { rows } = await db.query("DESCRIBE users");
        console.table(rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}

describe();
