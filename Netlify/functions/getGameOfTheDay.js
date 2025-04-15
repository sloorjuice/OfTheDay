const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const apiKey = process.env.RAWG_API_KEY;

    // Allow date override via query param
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Calculate day of year for deterministic seeding
    const dayOfYear = Math.floor(
      (new Date(today) - new Date(today.split('-')[0], 0, 0)) / (1000 * 60 * 60 * 24)
    );

    const pseudoRandom = (range) => dayOfYear % range;

    // Fetch games from RAWG API
    const fetchGames = async (value = '', type = 'genres') => {
      const filterParam = value ? `&${type}=${value}` : '';
      const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,${today}&ordering=-rating&page_size=50${filterParam}`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RAWG API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.results || [];
    };

    // Fetch genres from RAWG
    const fetchGenres = async () => {
      const response = await fetch(`https://api.rawg.io/api/genres?key=${apiKey}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RAWG Genre API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      return data.results.map(g => g.slug);
    };

    const genres = await fetchGenres();
    const genreIndex = dayOfYear % genres.length;
    const selectedGenre = genres[genreIndex];

    // Fetch "Game of the Day"
    let allGames = await fetchGames(selectedGenre, 'genres');
    console.log(`Genre of the day: ${selectedGenre}, Games found: ${allGames.length}`);

    if (!allGames || allGames.length === 0) {
      console.warn(`No games found for genre: ${selectedGenre}, falling back to top-rated games`);
      allGames = await fetchGames(); // fallback to unfiltered
    }

    const gameOfTheDay = allGames.length > 0 ? allGames[pseudoRandom(allGames.length)] : null;

    // Fetch "Multiplayer Game of the Day"
    const multiplayerGames = await fetchGames('multiplayer', 'tags');
    const multiplayerGameOfTheDay =
      multiplayerGames.length > 0 ? multiplayerGames[pseudoRandom(multiplayerGames.length)] : null;

    // Fetch "Indie Game of the Day"
    const indieGames = await fetchGames('indie', 'genres');
    const indieGameOfTheDay =
      indieGames.length > 0 ? indieGames[pseudoRandom(indieGames.length)] : null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        date: today,
        selectedGenre,
        gameOfTheDay,
        multiplayerGameOfTheDay,
        indieGameOfTheDay,
      }),
    };
  } catch (err) {
    console.error('Error fetching games:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
