const fetch = require('node-fetch');

async function checkAuthors() {
    try {
        const res = await fetch('http://localhost:4000/api/authors?page=1&limit=2');
        const data = await res.json();
        console.log("Raw Author Data Sample:", JSON.stringify(data[0], null, 2));
    } catch (err) {
        console.error("Error:", err);
    }
}

checkAuthors();
