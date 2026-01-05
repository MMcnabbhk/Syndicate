
async function testEndpoints() {
    const endpoints = [
        'http://localhost:4000/api/audiobooks',
        'http://localhost:4000/api/short-fiction',
        'http://localhost:4000/api/poems'
    ];

    for (const url of endpoints) {
        try {
            console.log(`Testing ${url}...`);
            const res = await fetch(url);
            console.log(`Status: ${res.status} ${res.statusText}`);
            if (!res.ok) {
                const text = await res.text();
                console.log(`Error Body: ${text.substring(0, 200)}`);
            } else {
                const json = await res.json();
                console.log(`Success. Items: ${json.length}`);
            }
        } catch (e) {
            console.error(`Fetch failed for ${url}:`, e.message);
        }
        console.log('---');
    }
}

testEndpoints();
