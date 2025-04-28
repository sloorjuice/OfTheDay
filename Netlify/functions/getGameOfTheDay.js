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
    const apiKey = process.env.RAWG_API_KEY;
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const seed = hashString(today);
    const pseudoRandom = (range, offset = 0) => (seed + offset) % range;

    // Fetch genres
    const fetchGenres = async () => {
      const res = await fetch(`https://api.rawg.io/api/genres?key=${apiKey}`);
      if (!res.ok) throw new Error(`Failed to fetch genres: ${res.status}`);
      const data = await res.json();
      return data.results.map((g) => g.slug);
    };

    // Fetch games (by genre or tag)
    const fetchGames = async (value = '', type = 'genres') => {
      const filter = value ? `&${type}=${value}` : '';
      const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,${today}&ordering=-rating&page_size=50${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
      const data = await res.json();
      return data.results || [];
    };

    // Get genres and pick one deterministically
    const genres = await fetchGenres();
    const selectedGenre = genres.length ? genres[pseudoRandom(genres.length, 0)] : '';

    // Primary game of the day
    let games = await fetchGames(selectedGenre, 'genres');
    if (!games.length) {
      console.warn(`No games found for ${selectedGenre}, using fallback`);
      games = await fetchGames();
    }
    const gameOfTheDay = games.length ? games[pseudoRandom(games.length, 10)] : null;

    // Multiplayer game
    const multiplayerGames = await fetchGames('multiplayer', 'tags');
    const multiplayerGame = multiplayerGames.length ? multiplayerGames[pseudoRandom(multiplayerGames.length, 20)] : null;

    // Indie game
    const indieGames = await fetchGames('indie', 'genres');
    const indieGame = indieGames.length ? indieGames[pseudoRandom(indieGames.length, 30)] : null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        date: today,
        selectedGenre,
        gameOfTheDay,
        multiplayerGameOfTheDay: multiplayerGame,
        indieGameOfTheDay: indieGame,
      }, null, 2), // Pretty print JSON
    };
  } catch (err) {
    console.error('Game fetch failed:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
