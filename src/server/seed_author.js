import 'dotenv/config';
import db from './db.js';

const seedAuthor = async () => {
    try {
        console.log('Starting Author Seed...');

        // 1. Get first user
        let { rows: users } = await db.query('SELECT id, email FROM users LIMIT 1');
        let user;

        if (!users || users.length === 0) {
            console.log('No users found. Creating a default sample user...');

            // Debug: Check columns
            try {
                const { rows: columns } = await db.query('SHOW COLUMNS FROM users');
                console.log('User table columns:', columns.map(c => `${c.Field} (${c.Type}, ${c.Extra})`).join(', '));
            } catch (e) {
                console.log('Could not show columns:', e.message);
            }

            // Fallback: provide ID explicitly (assuming int) and use 'name' instead of 'display_name'
            const createUserSql = "INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)";
            const result = await db.query(createUserSql, [1, 'sample@example.com', 'Sample User', 'creator']);


            // Re-fetch the new user
            const { rows: newUsers } = await db.query('SELECT id, email FROM users WHERE email = ?', ['sample@example.com']);
            user = newUsers[0];
            console.log(`Created new user: ${user.email} (ID: ${user.id})`);
        } else {
            user = users[0];
            console.log(`Found user: ${user.email} (ID: ${user.id})`);
        }

        // 2. Define Sample Author Data
        const sampleAuthor = {
            user_id: user.id,
            name: "Michael James",
            handle: "@michaeljames",
            genre: "Literary Fiction",
            bio: "Award-winning author of 'The Echo of Silence' and 'Midnight in the Garden'. Exploring the human condition through prose and poetry. He lives in the Pacific Northwest with his two dogs and an excessive amount of coffee. His work has been featured in The New Yorker, The Paris Review, and Granta.",
            about: `
## About Michael

Michael James is a writer based in Seattle, WA. With a background in philosophy and a penchant for the melancholy, his stories often traverse the grey areas of morality and human connection.

He began his career writing short fiction for literary journals before publishing his debut novel, *The Echo of Silence*, which was a finalist for the National Book Award. 

Michael believes in the power of serialized storytelling to build community and deeper engagement with readers. When not writing, he can be found hiking the Cascades or hunting for rare vinyl records.

### Accolades
*   National Book Award Finalist
*   Pushcart Prize Nominee (2024)
*   Best American Short Stories Selection
            `,
            profile_image_url: "", // Can't easily upload a file via script, leave blank or use a placeholder URL if valid
            socials: {
                website: "https://michaeljames.writer",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com",
                facebook: "https://facebook.com",
                threads: "",
                tiktok: "",
                bluesky: "",
                dispatch: "",
                linkedin: ""
            },
            amazon_url: "https://amazon.com/author/michaeljames",
            goodreads_url: "https://goodreads.com",
            spotify_url: "https://open.spotify.com/show/example",

            // Rich Arrays
            profile_images: [
                { id: 1, url: "", caption: "Headshot by Annie Leibovitz" },
                { id: 2, url: "", caption: "Speaking at Powell's Books" },
                { id: 3, url: "", caption: "Writing retreat in cabin" }
            ],
            video_introductions: [
                { id: 1, url: "https://youtube.com/watch?v=example", title: "Welcome to my World" },
                { id: 2, url: "", title: "" },
                { id: 3, url: "", title: "" },
                { id: 4, url: "", title: "" }
            ],

            // Auto Responders
            auto_responder_contributor: "Thank you so much for your support! It means the world to me and helps keep the lights on and the coffee brewing. I hope you enjoy the stories.",
            auto_responder_fan: "Welcome to the inner circle! You'll now get early access to my drafts and exclusive Q&A sessions. Thanks for reading.",

            // Audience
            target_gender: ["All"],
            target_age: ["25-34", "35-44", "45-54"],
            target_income: ["All"],
            target_education: ["Bachelor's degree", "Master's degree"],

            meta_pixel_id: "1234567890",
            ga_measurement_id: "G-ABC123XYZ"
        };

        console.log('Sample data prepared.');

        // 3. Check if author exists
        const { rows: existingAuthors } = await db.query('SELECT id FROM authors WHERE user_id = ?', [user.id]);

        if (existingAuthors.length > 0) {
            console.log(`Updating existing author profile for user ${user.id}...`);
            const authorId = existingAuthors[0].id;

            // Update Query matching Author.js update method structure roughly
            const sql = `UPDATE authors SET 
                handle = ?, name = ?, bio = ?, about = ?, profile_image_url = ?, socials = ?, genre = ?, 
                amazon_url = ?, goodreads_url = ?, spotify_url = ?, 
                profile_images = ?, video_introductions = ?, auto_responder_contributor = ?, 
                auto_responder_fan = ?, target_gender = ?, target_age = ?, target_income = ?, 
                target_education = ?, meta_pixel_id = ?, ga_measurement_id = ? 
                WHERE id = ?`;

            await db.query(sql, [
                sampleAuthor.handle,
                sampleAuthor.name,
                sampleAuthor.bio,
                sampleAuthor.about,
                sampleAuthor.profile_image_url,
                JSON.stringify(sampleAuthor.socials),
                sampleAuthor.genre,
                sampleAuthor.amazon_url,
                sampleAuthor.goodreads_url,
                sampleAuthor.spotify_url,
                JSON.stringify(sampleAuthor.profile_images),
                JSON.stringify(sampleAuthor.video_introductions),
                sampleAuthor.auto_responder_contributor,
                sampleAuthor.auto_responder_fan,
                JSON.stringify(sampleAuthor.target_gender),
                JSON.stringify(sampleAuthor.target_age),
                JSON.stringify(sampleAuthor.target_income),
                JSON.stringify(sampleAuthor.target_education),
                sampleAuthor.meta_pixel_id,
                sampleAuthor.ga_measurement_id,
                authorId
            ]);
            console.log('Author profile updated successfully.');

        } else {
            console.log(`Creating new author profile for user ${user.id}...`);

            const sql = `INSERT INTO authors (
                id, user_id, handle, name, bio, about, profile_image_url, socials, genre, 
                amazon_url, goodreads_url, spotify_url, 
                profile_images, video_introductions, auto_responder_contributor, 
                auto_responder_fan, target_gender, target_age, target_income, 
                target_education, meta_pixel_id, ga_measurement_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            await db.query(sql, [
                1, // Explicit ID
                sampleAuthor.user_id,
                sampleAuthor.handle,
                sampleAuthor.name,
                sampleAuthor.bio,
                sampleAuthor.about,
                sampleAuthor.profile_image_url,
                JSON.stringify(sampleAuthor.socials),
                sampleAuthor.genre,
                sampleAuthor.amazon_url,
                sampleAuthor.goodreads_url,
                sampleAuthor.spotify_url,
                JSON.stringify(sampleAuthor.profile_images),
                JSON.stringify(sampleAuthor.video_introductions),
                sampleAuthor.auto_responder_contributor,
                sampleAuthor.auto_responder_fan,
                JSON.stringify(sampleAuthor.target_gender),
                JSON.stringify(sampleAuthor.target_age),
                JSON.stringify(sampleAuthor.target_income),
                JSON.stringify(sampleAuthor.target_education),
                sampleAuthor.meta_pixel_id,
                sampleAuthor.ga_measurement_id
            ]);
            console.log('New Author profile created successfully.');
        }

        console.log('Done.');
        process.exit(0);

    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedAuthor();
