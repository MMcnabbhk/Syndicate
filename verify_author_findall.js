
import Author from './src/server/models/Author.js';

async function verifyFindAll() {
    try {
        const authors = await Author.findAll();
        console.log(`Author.findAll() returned ${authors.length} authors.`);
        authors.forEach(a => console.log(`- ${a.id}: ${a.name}`));
    } catch (err) {
        console.error('Error calling Author.findAll():', err);
    } finally {
        process.exit();
    }
}

verifyFindAll();
