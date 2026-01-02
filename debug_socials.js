
import db from './src/server/db.js';

async function checkSocials() {
    console.log('--- Checking Socials Data ---');
    try {
        // Get the author (using the UUID one we know is active)
        const { rows } = await db.query(`SELECT id, name, socials FROM authors WHERE id = 'd3993ab0-2a72-4f1d-b676-cd15051fae50'`);

        if (rows.length === 0) {
            console.log('Author not found.');
        } else {
            const author = rows[0];
            console.log('Author Name:', author.name);
            console.log('Socials Raw Type:', typeof author.socials);
            console.log('Socials Value:', author.socials);

            if (typeof author.socials === 'string') {
                try {
                    console.log('Parsed Socials:', JSON.parse(author.socials));
                } catch (e) {
                    console.log('Error parsing JSON string:', e.message);
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSocials();
