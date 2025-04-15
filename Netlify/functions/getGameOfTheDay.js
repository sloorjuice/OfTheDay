const fetch = require('node-fetch');

exports.handler = async () => {
  try {
    const apiKey = process.env.RAWG_API_KEY;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const seed = Array.from(today).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pseudoRandom = (range) => seed % range;

    // Fetch games from RAWG API
    const fetchGames = async (tags = '') => {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&dates=2000-01-01,${today}&ordering=-rating&page_size=50&tags=${tags}`
      );
    
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RAWG API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
    
      const data = await response.json();
      return data.results || [];
    };

    // Fetch game details to get the Steam URL
    const fetchSteamLink = async (slug) => {
      const res = await fetch(`https://api.rawg.io/api/games/${slug}?key=${apiKey}`);
      const data = await res.json();
      const steamStore = data.stores?.find(store => store.store.name === "Steam");
      return steamStore?.url || null;
    };

    const genres = [
      'action', 'adventure', 'independent', 'platformer', 'puzzle', 'racing',
      'role-playing-games-rpg', 'shooter', 'simulation', 'sports',
      'strategy', 'fighting', 'family', 'arcade', 'casual',
      'educational', 'card', 'massively-multiplayer', 'board-games'
    ];
    
    // Seeded genre selection based on date
    const genreIndex = seed % genres.length;
    const selectedGenre = genres[genreIndex];
    
    // Fetch "Game of the Day"
    const allGames = await fetchGames(selectedGenre);
    const gameOfTheDay =
      allGames.length > 0 ? allGames[pseudoRandom(allGames.length)] : null;

    // Fetch "Multiplayer Game of the Day"
    const multiplayerGames = await fetchGames('multiplayer');
    const multiplayerGameOfTheDay =
      multiplayerGames.length > 0 ? multiplayerGames[pseudoRandom(multiplayerGames.length)] : null;

    // Fetch "Indie Game of the Day"
    const indieGames = await fetchGames('independent');
    const indieGameOfTheDay =
      indieGames.length > 0 ? indieGames[pseudoRandom(indieGames.length)] : null;

    // Get Steam links
    const [steamGame, steamMultiplayer, steamIndie] = await Promise.all([
      gameOfTheDay ? fetchSteamLink(gameOfTheDay.slug) : null,
      multiplayerGameOfTheDay ? fetchSteamLink(multiplayerGameOfTheDay.slug) : null,
      indieGameOfTheDay ? fetchSteamLink(indieGameOfTheDay.slug) : null
    ]);

    // Attach links
    if (gameOfTheDay) gameOfTheDay.steamUrl = steamGame;
    if (multiplayerGameOfTheDay) multiplayerGameOfTheDay.steamUrl = steamMultiplayer;
    if (indieGameOfTheDay) indieGameOfTheDay.steamUrl = steamIndie;

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
