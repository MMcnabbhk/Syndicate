
import db from './src/server/db.js';

async function checkNovelAuthor() {
    try {
        console.log('Checking Novel b1...');
        const { rows: novels } = await db.query("SELECT * FROM novels WHERE id = 'b1'");
        if (novels.length === 0) {
            console.log('Novel b1 not found.');
        } else {
            console.log('Novel:', novels[0]);
            const authorId = novels[0].author_id;
            console.log(`Checking Author ID: ${authorId}`);
            const { rows: authors } = await db.query('SELECT * FROM authors WHERE id = ?', [authorId]);
            console.log('Author:', authors[0] || 'Not Found');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    process.exit();
}

checkNovelAuthor();
