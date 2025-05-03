const fetch = require('node-fetch');

// Hash function for date-based deterministic randomness
const hashString = (str) => {
    let hash = 216636261;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
};

// Get total characters
async function getTotalCharacters() {
    const res = await fetch("https://spapi.dev/api/characters");
    const data = await res.json();
    return data.meta.total;
}

// Get total episodes
async function getTotalEpisodes() {
    const res = await fetch("https://spapi.dev/api/episodes");
    const data = await res.json();
    return data.meta.total;
}

exports.handler = async (event) => {
    try {
        const inputDate = event.queryStringParameters?.date;
        const today = inputDate || new Date().toISOString().split("T")[0];
        const seed = hashString(today);
        const pseudoRandom = (range, offset = 0) => (seed + offset) % range;

        // Get totals
        const [totalCharacters, totalEpisodes] = await Promise.all([
            getTotalCharacters(),
            getTotalEpisodes()
        ]);

        // Select random episode
        const episodeIndex = pseudoRandom(totalEpisodes);
        const episodePage = Math.floor(episodeIndex / 10) + 1;
        const episodeOffset = episodeIndex % 10;
        const episodeRes = await fetch(`https://spapi.dev/api/episodes?page=${episodePage}`);
        const episodeData = await episodeRes.json();
        const episode = episodeData.data[episodeOffset];

        // Select random character
        const characterIndex = pseudoRandom(totalCharacters, 42); // Offset to vary results
        const charPage = Math.floor(characterIndex / 10) + 1;
        const charOffset = characterIndex % 10;
        const charRes = await fetch(`https://spapi.dev/api/characters?page=${charPage}`);
        const charData = await charRes.json();
        const character = charData.data[charOffset];

        return {
            statusCode: 200,
            body: JSON.stringify({
                episode: {
                    id: episode.id,
                    title: episode.name,
                    description: episode.description,
                    season: episode.season,
                    episode: episode.episode,
                    air_date: episode.release_date,
                    image: episode.image,
                },
                character: {
                    id: character.id,
                    name: character.name,
                    image: character.image,
                    description: character.description,
                },
            }, null, 2),
        };
    } catch (err) {
        console.error("Error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
        };
    }
};
