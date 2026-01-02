
import db from './src/server/db.js';

async function checkSchema() {
    try {
        const { rows } = await db.query("DESCRIBE contributions");
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

checkSchema();
