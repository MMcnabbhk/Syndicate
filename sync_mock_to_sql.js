import 'dotenv/config';
import db from './src/server/db.js';
import { BOOKS, AUDIOBOOKS, AUTHORS, POEMS, SHORT_STORIES } from './src/data/mockData.js';

async function syncMockDataToSQL() {
    try {
        console.log('🔄 Syncing mock data to SQL database...\n');

        // 1. Insert Authors
        console.log('📝 Inserting authors...');
        for (const author of AUTHORS) {
            try {
                await db.query(
                    `INSERT INTO authors (id, name, genre, description, profile_image_url, video_url, balance)
                     VALUES (?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     name = VALUES(name),
                     genre = VALUES(genre),
                     description = VALUES(description),
                     profile_image_url = VALUES(profile_image_url),
                     video_url = VALUES(video_url)`,
                    [author.id, author.name, author.genre, author.description,
                    author.profile_image_url, author.video_url, 0]
                );
                console.log(`   ✅ ${author.name}`);
            } catch (err) {
                console.log(`   ⚠️  ${author.name}: ${err.message}`);
            }
        }

        // 2. Insert Novels (Books)
        console.log('\n📚 Inserting novels...');
        for (const book of BOOKS) {
            try {
                // Find author ID by name
                const authorId = AUTHORS.find(a => a.name === book.author)?.id || 'a1';

                await db.query(
                    `INSERT INTO novels (id, author_id, title, description, cover_image_url, status, price_monthly, published_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     title = VALUES(title),
                     description = VALUES(description),
                     cover_image_url = VALUES(cover_image_url),
                     price_monthly = VALUES(price_monthly)`,
                    [book.id, authorId, book.title, book.blurb, book.coverImage,
                        'published', book.priceFull || 0, book.releaseDate]
                );
                console.log(`   ✅ ${book.title}`);
            } catch (err) {
                console.log(`   ⚠️  ${book.title}: ${err.message}`);
            }
        }

        // 3. Insert Audiobooks
        console.log('\n🎧 Inserting audiobooks...');
        for (const audiobook of AUDIOBOOKS) {
            try {
                const authorId = AUTHORS.find(a => a.name === audiobook.author)?.id || 'a1';

                await db.query(
                    `INSERT INTO audiobooks (id, author_id, title, cover_image_url, narrator, duration_seconds, status, price_monthly, published_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     title = VALUES(title),
                     cover_image_url = VALUES(cover_image_url),
                     narrator = VALUES(narrator),
                     price_monthly = VALUES(price_monthly)`,
                    [audiobook.id, authorId, audiobook.title, audiobook.coverImage,
                    audiobook.narrator, 0, 'published', audiobook.priceFull || 0, audiobook.releaseDate]
                );
                console.log(`   ✅ ${audiobook.title}`);
            } catch (err) {
                console.log(`   ⚠️  ${audiobook.title}: ${err.message}`);
            }
        }

        // 4. Insert Poems
        console.log('\n✍️  Inserting poems...');
        for (const poem of POEMS) {
            try {
                const authorId = AUTHORS.find(a => a.name === poem.author)?.id || 'a1';

                await db.query(
                    `INSERT INTO poems (id, author_id, title, content_html, form, tags, cover_image_url, status, price_monthly, published_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     title = VALUES(title),
                     cover_image_url = VALUES(cover_image_url),
                     price_monthly = VALUES(price_monthly)`,
                    [poem.id, authorId, poem.title, poem.blurb || '', 'Free Verse',
                    JSON.stringify([]), poem.coverImage, 'published', poem.priceFull || 0, poem.releaseDate]
                );
                console.log(`   ✅ ${poem.title}`);
            } catch (err) {
                console.log(`   ⚠️  ${poem.title}: ${err.message}`);
            }
        }

        // 5. Insert Short Stories
        console.log('\n📖 Inserting short stories...');
        for (const story of SHORT_STORIES) {
            try {
                const authorId = AUTHORS.find(a => a.name === story.author)?.id || 'a1';

                await db.query(
                    `INSERT INTO short_stories (id, author_id, title, content_html, cover_image_url, word_count, status, price_monthly, published_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE
                     title = VALUES(title),
                     cover_image_url = VALUES(cover_image_url),
                     price_monthly = VALUES(price_monthly)`,
                    [story.id, authorId, story.title, story.blurb || '', story.coverImage,
                        0, 'published', story.priceFull || 0, story.releaseDate]
                );
                console.log(`   ✅ ${story.title}`);
            } catch (err) {
                console.log(`   ⚠️  ${story.title}: ${err.message}`);
            }
        }

        console.log('\n🎉 Sync complete!');
        console.log('\n📊 Verify with:');
        console.log('   mysql -u root -e "USE book_site; SELECT COUNT(*) FROM novels;"');
        console.log('   mysql -u root -e "USE book_site; SELECT title, cover_image_url FROM novels WHERE title LIKE \'%Thieves%\';"');

    } catch (error) {
        console.error('❌ Error syncing data:', error);
    } finally {
        process.exit();
    }
}

syncMockDataToSQL();
