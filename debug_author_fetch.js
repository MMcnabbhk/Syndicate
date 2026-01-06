
import Author from './src/server/models/Author.js';
import db from './src/server/db.js';

async function testStrategies() {
    try {
        console.log("--- Testing Author.findAll ---");
        const authors = await Author.findAll(5, 0);
        console.log(`Found ${authors.length} authors.`);
        if (authors.length > 0) {
            console.log("First author:", authors[0].name, authors[0].id);

            console.log("\n--- Testing Author.getRecentWorks ---");
            // Test with the first author
            const works = await Author.getRecentWorks(authors[0].id);
            console.log(`Found ${works.length} works for ${authors[0].name}.`);
        } else {
            console.log("No authors found, skipping works test.");
        }

    } catch (e) {
        console.error("Test execution failed:", e);
    } finally {
        // We can't easily close the db pool if it's exported as singleton without end method exposed differently, 
        // but Node will exit.
        process.exit(0);
    }
}

testStrategies();
