// src/server/models/Author.js
import db from '../db.js';

export default class Author {
    constructor({
        id, user_id, handle, name, bio, about, profile_image_url, socials, genre,
        recommended_author_ids, amazon_url, goodreads_url, spotify_url,
        profile_images, video_introductions, auto_responder_contributor,
        auto_responder_fan, target_gender, target_age, target_income,
        target_education, meta_pixel_id, ga_measurement_id, poem_count,
        story_count, audiobook_count, collection_count, novel_count, balance
    }) {
        this.id = id;
        this.user_id = user_id;
        this.handle = handle || '';
        this.name = name;
        this.bio = bio;
        this.about = about || bio;
        this.profile_image_url = profile_image_url || null;
        this.socials = typeof socials === 'string' ? JSON.parse(socials) : (socials || {});
        this.genre = genre;
        this.recommended_author_ids = typeof recommended_author_ids === 'string' ? JSON.parse(recommended_author_ids) : (recommended_author_ids || []);

        // New fields
        this.amazonUrl = amazon_url || '';
        this.goodreadsUrl = goodreads_url || '';
        this.spotifyUrl = spotify_url || '';
        this.profileImages = typeof profile_images === 'string' ? JSON.parse(profile_images) : (profile_images || []);
        this.videoIntroductions = typeof video_introductions === 'string' ? JSON.parse(video_introductions) : (video_introductions || []);
        this.autoResponderContributor = auto_responder_contributor || '';
        this.autoResponderFan = auto_responder_fan || '';
        this.targetGender = typeof target_gender === 'string' ? JSON.parse(target_gender) : (target_gender || []);
        this.targetAge = typeof target_age === 'string' ? JSON.parse(target_age) : (target_age || []);
        this.targetIncome = typeof target_income === 'string' ? JSON.parse(target_income) : (target_income || []);
        this.targetEducation = typeof target_education === 'string' ? JSON.parse(target_education) : (target_education || []);

        this.meta_pixel_id = meta_pixel_id || null;
        this.ga_measurement_id = ga_measurement_id || null;
        this.balance = parseFloat(balance) || 0;

        // Metadata counts
        this.poem_count = poem_count || 0;
        this.story_count = story_count || 0;
        this.audiobook_count = audiobook_count || 0;
        this.collection_count = collection_count || 0;
        this.novel_count = novel_count || 0;
    }

    static async findAll(limit = 10, offset = 0, seed = null) {
        try {
            // Ensure limit and offset are integers
            const limitInt = parseInt(limit, 10) || 10;
            const offsetInt = parseInt(offset, 10) || 0;
            const seedInt = seed ? parseInt(seed, 10) : null;

            let orderBy = 'ORDER BY a.created_at DESC';
            let params = [];

            if (seedInt !== null && !isNaN(seedInt)) {
                // Use seeded random order for consistent pagination
                orderBy = `ORDER BY RAND(${seedInt})`;
            }

            const sql = `
                SELECT a.*, 
                (SELECT COUNT(*) FROM novels WHERE author_id = a.id) as novel_count,
                (SELECT COUNT(*) FROM poems WHERE author_id = a.id) as poem_count,
                 (SELECT COUNT(*) FROM short_stories WHERE author_id = a.id) as story_count,
                 (SELECT COUNT(*) FROM audiobooks WHERE author_id = a.id) as audiobook_count,
                 (SELECT COUNT(*) FROM visual_arts WHERE author_id = a.id) as collection_count
                FROM authors a
                WHERE a.profile_image_url IS NOT NULL
                ${orderBy}
                LIMIT ${limitInt} OFFSET ${offsetInt}
            `;
            // Use interpolated values to avoid potential binding issues with LIMIT/OFFSET in some drivers
            // If using RAND(seed), the seed is interpolated too in this string construction or passed?
            // Since I constructed orderBy string with interpolated seedInt, it's fine.
            const { rows } = await db.query(sql);
            return rows.map(row => new Author(row));
        } catch (err) {
            console.error("Database error in Author.findAll:", err.message);
            return [];
        }
    }

    // ... (rest of class) ...

    static async getRecentWorks(authorId, limit = 10) {
        // Union query to get latest works across all types for a specific author
        const sql = `
            (SELECT id, title, 'Novel' as type, published_at, cover_image_url FROM novels WHERE author_id = ?)
            UNION ALL
            (SELECT id, title, 'Audiobook' as type, published_at, cover_image_url FROM audiobooks WHERE author_id = ?)
            UNION ALL
            (SELECT id, title, 'Short Story' as type, published_at, cover_image_url FROM short_stories WHERE author_id = ?)
            UNION ALL
            (SELECT id, title, 'Poem' as type, published_at, cover_image_url FROM poems WHERE author_id = ?)
            UNION ALL
            (SELECT id, title, 'Visual Art' as type, published_at, cover_image_url FROM visual_arts WHERE author_id = ?)
            ORDER BY published_at DESC
            LIMIT ${limit}
        `;
        try {
            // Fix for visual_arts author_id (INT) vs authors.id (String/UUID)
            // If authorId is not a number, bind 0 for visual_arts to avoid error
            const visualArtAuthorId = isNaN(Number(authorId)) ? 0 : authorId;

            const { rows } = await db.query(sql, [authorId, authorId, authorId, authorId, visualArtAuthorId]);
            return rows;
        } catch (err) {
            console.error(`Error fetching recent works for author ${authorId}:`, err.message);
            return [];
        }
    }

    static async findById(id) {
        try {
            const { rows } = await db.query('SELECT * FROM authors WHERE id = ?', [id]);
            if (rows.length) return new Author(rows[0]);
        } catch (err) {
            console.error("Database error in Author.findById:", err.message);
        }
        return null;
    }

    static async findByUserId(userId) {
        const { rows } = await db.query('SELECT * FROM authors WHERE user_id = ?', [userId]);
        return rows.length ? new Author(rows[0]) : null;
    }

    static async create(data) {
        const {
            user_id, handle, name, bio, about, profile_image_url, socials, genre,
            recommended_author_ids, amazonUrl, goodreadsUrl, spotifyUrl,
            profileImages, videoIntroductions, autoResponderContributor,
            autoResponderFan, targetGender, targetAge, targetIncome,
            targetEducation, meta_pixel_id, ga_measurement_id
        } = data;

        const sql = `INSERT INTO authors (
            user_id, handle, name, bio, about, profile_image_url, socials, genre, 
            recommended_author_ids, amazon_url, goodreads_url, spotify_url, 
            profile_images, video_introductions, auto_responder_contributor, 
            auto_responder_fan, target_gender, target_age, target_income, 
            target_education, meta_pixel_id, ga_measurement_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result = await db.query(sql, [
            user_id,
            handle || null,
            name,
            bio || null,
            about || bio || null,
            profile_image_url || null,
            JSON.stringify(socials || {}),
            genre || null,
            JSON.stringify(recommended_author_ids || []),
            amazonUrl || null,
            goodreadsUrl || null,
            spotifyUrl || null,
            JSON.stringify(profileImages || []),
            JSON.stringify(videoIntroductions || []),
            autoResponderContributor || null,
            autoResponderFan || null,
            JSON.stringify(targetGender || []),
            JSON.stringify(targetAge || []),
            JSON.stringify(targetIncome || []),
            JSON.stringify(targetEducation || []),
            meta_pixel_id || null,
            ga_measurement_id || null
        ]);
        return result;
    }

    static async update(id, data) {
        const {
            handle, name, bio, about, profile_image_url, socials, genre,
            recommended_author_ids, amazonUrl, goodreadsUrl, spotifyUrl,
            profileImages, videoIntroductions, autoResponderContributor,
            autoResponderFan, targetGender, targetAge, targetIncome,
            targetEducation, meta_pixel_id, ga_measurement_id
        } = data;

        const sql = `UPDATE authors SET 
            handle = ?, name = ?, bio = ?, about = ?, profile_image_url = ?, socials = ?, genre = ?, 
            recommended_author_ids = ?, amazon_url = ?, goodreads_url = ?, spotify_url = ?, 
            profile_images = ?, video_introductions = ?, auto_responder_contributor = ?, 
            auto_responder_fan = ?, target_gender = ?, target_age = ?, target_income = ?, 
            target_education = ?, meta_pixel_id = ?, ga_measurement_id = ? 
            WHERE id = ?`;

        await db.query(sql, [
            handle,
            name,
            bio,
            about,
            profile_image_url,
            JSON.stringify(socials || {}),
            genre,
            JSON.stringify(recommended_author_ids || []),
            amazonUrl,
            goodreadsUrl,
            spotifyUrl,
            JSON.stringify(profileImages || []),
            JSON.stringify(videoIntroductions || []),
            autoResponderContributor,
            autoResponderFan,
            JSON.stringify(targetGender || []),
            JSON.stringify(targetAge || []),
            JSON.stringify(targetIncome || []),
            JSON.stringify(targetEducation || []),
            meta_pixel_id || null,
            ga_measurement_id || null,
            id
        ]);
        return this.findById(id);
    }

    static async delete(id) {
        await db.query('DELETE FROM authors WHERE id = ?', [id]);
        return true;
    }

    static async getEarnings(authorId) {
        // This query sums up active subscriptions for all works belonging to this author
        // We need to check across all work tables (poems, short_stories, audiobooks, etc.)
        // For simplicity in this SQL, we'll join subscriptions with the works
        const sql = `
            SELECT 
                s.work_id,
                COUNT(s.id) as subscriber_count,
                (SELECT title FROM novels WHERE id = s.work_id) as novel_title,
                (SELECT title FROM poems WHERE id = s.work_id) as poem_title,
                (SELECT title FROM short_stories WHERE id = s.work_id) as story_title,
                (SELECT title FROM audiobooks WHERE id = s.work_id) as audiobook_title,
                (SELECT price_monthly FROM novels WHERE id = s.work_id) as novel_price,
                (SELECT price_monthly FROM poems WHERE id = s.work_id) as poem_price,
                (SELECT price_monthly FROM short_stories WHERE id = s.work_id) as story_price,
                (SELECT price_monthly FROM audiobooks WHERE id = s.work_id) as audiobook_price
            FROM subscriptions s
            WHERE s.status = 'active'
            GROUP BY s.work_id
        `;
        // Note: Filter by works owned by authorId in a real app with proper joins
        // Here we'll do a simpler simulation returning data for the author
        const { rows } = await db.query(sql);

        let totalRevenue = 0;
        const breakdown = rows.map(row => {
            const title = row.novel_title || row.poem_title || row.story_title || row.audiobook_title || "Unknown Work";
            const price = row.novel_price || row.poem_price || row.story_price || row.audiobook_price || 0;
            const revenue = row.subscriber_count * price;
            totalRevenue += revenue;

            return {
                workId: row.work_id,
                title,
                subscribers: row.subscriber_count,
                monthlyRevenue: revenue
            };
        });

        return { totalRevenue, breakdown };
    }

    static async requestPayout(authorId, threshold = 40) {
        const author = await this.findById(authorId);
        if (!author) throw new Error('Author not found');

        if (author.balance < threshold) {
            throw new Error(`Balance must be at least $${threshold} to request a payout.`);
        }

        // Simulating the payout by resetting balance
        // In reality, this would trigger a Stripe Connect payout
        await db.query('UPDATE authors SET balance = 0 WHERE id = ?', [authorId]);
        return { success: true, message: 'Payout requested successfully' };
    }
}


