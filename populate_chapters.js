
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'serialized_novels'
};

const chapters = [
    "Prologue",
    "Chapter 1: The First Execution of Eng Kang",
    "Chapter 2: The Penitent",
    "Chapter 3: The Second Execution of Eng Kang",
    "Chapter 4: The Birth of Juan de Vera",
    "Chapter 5: Judgement Arrives",
    "Chapter 6: Stone & Labor",
    "Chapter 7: The Roma",
    "Chapter 8: Gaspar",
    "Chapter 9: The Passion",
    "Chapter 10: The Witness",
    "Chapter 11: God Does Not Whisper",
    "Chapter 12: The Fever",
    "Chapter 13: The Holy War",
    "Chapter 14: For God & Glory",
    "Chapter 15: They Shall Know That I Am the Lord",
    "Chapter 16: The Veil Is Torn",
    "Chapter 17: The Sins of Jeroboam",
    "Chapter 18: No One Ever Asked",
    "Chapter 19: Dominion",
    "Chapter 20: Sayang",
    "Chapter 21: Daughter, Arise",
    "Chapter 22: Lim Ah Hong Returns",
    "Chapter 23: The Compañía General",
    "Chapter 24: The Bells Never Ring",
    "Chapter 25: A Cup of Wrath",
    "Chapter 26: 30 Pieces of Silver",
    "Chapter 27: Gethsemane",
    "Chapter 28: Gabbatha",
    "Chapter 29: The Third Execution of Eng Kang",
    "Epigraph",
    "Note From the Translator"
];

async function updateChapters() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Connected to database.");

        console.log("Clearing existing chapters for b1...");
        await connection.query("DELETE FROM chapters WHERE novel_id = 'b1'");

        console.log("Inserting new chapters...");
        const sql = `INSERT INTO chapters (novel_id, title, chapter_number, content_html, status, created_at) VALUES ?`;

        const values = chapters.map((title, index) => [
            'b1',
            title,
            index + 1,
            ``,
            'published',
            new Date()
        ]);

        await connection.query(sql, [values]);
        console.log(`Successfully inserted ${values.length} chapters.`);

        await connection.end();
    } catch (err) {
        console.error("Error:", err);
    }
}

updateChapters();
