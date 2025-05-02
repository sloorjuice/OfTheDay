const fetch = require('node-fetch');

// Hash function to generate a stable pseudo-random seed from a string (the date)
const hashString = (str) => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0; // Ensure unsigned
};

exports.handler = async (event) => {
  try {
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const seed = hashString(today);
    const pseudoRandom = (range) => seed % range;

    // Fetch the total number of Pokémon
    const speciesRes = await fetch('https://pokeapi.co/api/v2/pokemon-species/');
    if (!speciesRes.ok) throw new Error('Failed to fetch Pokémon species data');
    const speciesData = await speciesRes.json();
    const totalPokemon = speciesData.count;

    // Select a Pokémon deterministically
    const pokemonId = pseudoRandom(totalPokemon) + 1; // Pokémon IDs start at 1
    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!pokemonRes.ok) throw new Error('Failed to fetch Pokémon data');
    const pokemonData = await pokemonRes.json();

    // Extract relevant data
    const pokemon = {
      id: pokemonData.id,
      name: pokemonData.name,
      image: pokemonData.sprites.other['official-artwork'].front_default,
      types: pokemonData.types.map((type) => type.type.name),
      stats: pokemonData.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(pokemon),
    };
  } catch (err) {
    console.error('Error fetching Pokémon of the day:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};