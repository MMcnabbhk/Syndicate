
import 'dotenv/config';
import Audiobook from './src/server/models/Audiobook.js';
import ShortStory from './src/server/models/ShortStory.js';
import Poem from './src/server/models/Poem.js';

async function testModels() {
    console.log("Testing Audiobook model...");
    try {
        const audiobooks = await Audiobook.findAll();
        console.log(`Audiobooks found: ${audiobooks.length}`);
    } catch (e) {
        console.error("Audiobook error:", e);
    }

    console.log("Testing ShortStory model...");
    try {
        const stories = await ShortStory.findAll();
        console.log(`Stories found: ${stories.length}`);
    } catch (e) {
        console.error("ShortStory error:", e);
    }

    console.log("Testing Poem model...");
    try {
        const poems = await Poem.findAll();
        console.log(`Poems found: ${poems.length}`);
    } catch (e) {
        console.error("Poem error:", e);
    }

    process.exit(0);
}

testModels();
