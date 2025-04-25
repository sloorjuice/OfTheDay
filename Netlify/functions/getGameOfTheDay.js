const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const apiKey = process.env.RAWG_API_KEY;

    if (!apiKey) {
      throw new Error('RAWG_API_KEY is not set. Please configure the environment variable.');
    }

    console.log('RAWG_API_KEY is set. Proceeding with API calls.');

    // Allow overriding the date for testing or specific queries
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Deterministic pseudo-random seed based on day of year
    const dayOfYear = Math.floor(
      (new Date(today) - new Date(today.split('-')[0], 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const pseudoRandom = (range) => dayOfYear % range;

    // Fetch genre list
    const fetchGenres = async () => {
      const res = await fetch(`https://api.rawg.io/api/genres?key=${apiKey}`);
      if (!res.ok) throw new Error(`Failed to fetch genres: ${res.status}`);
      const data = await res.json();
      return data.results.map((g) => g.slug).filter((genre) => genre !== 'indie'); // Exclude "indie"
    };

    // Fetch games, optionally by genre or tag
    const fetchGames = async (value = '', type = 'genres') => {
      const filter = value ? `&${type}=${value}` : '';
      const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,${today}&ordering=-rating&page_size=50${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch games: ${res.status}`);
      const data = await res.json();
      return data.results || [];
    };

    // Get genres and pick one for the day
    const genres = await fetchGenres();
    const selectedGenre = genres[pseudoRandom(genres.length)];

    // Get primary game of the day
    let games = await fetchGames(selectedGenre, 'genres');
    if (!games.length) {
      console.warn(`No games found for ${selectedGenre}, using fallback`);
      games = await fetchGames(); // fallback
    }
    const gameOfTheDay = games[pseudoRandom(games.length)];

    // Multiplayer and Indie
    const multiplayerGames = await fetchGames('multiplayer', 'tags');
    const indieGames = await fetchGames('indie', 'genres');

    const multiplayerGame = multiplayerGames[pseudoRandom(multiplayerGames.length)] || null;
    const indieGame = indieGames[pseudoRandom(indieGames.length)] || null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        date: today,
        selectedGenre,
        gameOfTheDay,
        multiplayerGameOfTheDay: multiplayerGame,
        indieGameOfTheDay: indieGame,
      }),
    };
  } catch (err) {
    console.error('Game fetch failed:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
