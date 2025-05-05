const fetch = require('node-fetch');

const BASE_URL = "https://rickandmortyapi.com/api/";

const hashString = (str) => {
    let hash = 159641291;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
};

exports.handler = async (event) => {
    try {
        const inputDate = event.queryStringParameters?.date;
        const today = inputDate || new Date().toISOString().split("T")[0];
        const seed = hashString(today);
        const pseudoRandom = (range) => seed % range;

        const characterRes = await fetch(`${BASE_URL}character`);
        if (!characterRes.ok) throw new Error('Failed to fetch character data');
        const characterData = await characterRes.json();
        const totalCharacters = characterData.info.count;

        const characterId = pseudoRandom(totalCharacters) + 1;
        const characterRes2 = await fetch(`${BASE_URL}character/${characterId}`);
        if (!characterRes2.ok) throw new Error('Failed to fetch character data');
        const characterData2 = await characterRes2.json();

        const character = {
            id: characterData2.id,
            name: characterData2.name,
            image: characterData2.image,
            species: characterData2.species,
            status: characterData2.status,
        };

        return {
            statusCode: 200,
            body: JSON.stringify(character, null, 2),
        };

    } catch (err) {
        console.error('Error fetching character of the day:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
        };
    }
};
