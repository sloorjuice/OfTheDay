const axios = require('axios'); // Importing the Axios library for making HTTP requests.

exports.handler = async function() {
  try {
    // Fetching the Spotify access token from another Netlify function.
    const tokenResponse = await axios.get(`${process.env.URL}/.netlify/functions/getSpotifyToken`);
    const accessToken = tokenResponse.data.access_token; // Extracting the access token from the response.

    // Setting up the Authorization header for Spotify API requests.
    const headers = { 'Authorization': `Bearer ${accessToken}` };

    // Getting today's date and formatting it as YYYY-MM-DD.
    const today = new Date();
    //const today = new Date('2025-08-04'); // test date
    const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    console.log('Today\'s date:', dateString); // Logging today's date for debugging.

    // Calculating the day of the year (1-365/366).
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));

    // Setting a limit for the number of items to fetch and determining the index for selection.
    const limit = 20;
    const index = dayOfYear % limit;

    // Generating a random year between 1980 and 2025 based on the day of the year.
    const minYear = 1980, maxYear = 2025;
    const randomYear = minYear + (dayOfYear * 97) % (maxYear - minYear + 1);

    // Calculating offsets for tracks, albums, and artists to ensure variety.
    const trackOffset = (dayOfYear * 19) % 1000;
    const albumOffset = dayOfYear % 50;
    const artistOffset = (dayOfYear * 17) % 500;

    // Defining a list of genres and selecting one based on the day of the year.
    const genres = ['pop', 'rock', 'hip-hop', 'indie', 'jazz', 'electronic', 'country', 'metal'];
    const genreOfDay = genres[dayOfYear % genres.length];

    // Constructing search queries for Spotify API requests.
    const queries = {
      song: `genre:${genreOfDay}`, // Search for songs in the selected genre.
      album: `year:${randomYear}`, // Search for albums released in the random year.
      artist: `genre:${genreOfDay}` // Search for artists in the selected genre.
    };

    // Helper function to fetch data from Spotify API.
    const fetchSpotifyData = async (query, type, offset = 0, limit = 1) => {
      try {
        // Making a GET request to Spotify's search endpoint with the query, type, offset, and limit.
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}&offset=${offset}`,
          { headers }
        );
        // Returning the items from the response, or an empty array if no items are found.
        return response.data?.[`${type}s`]?.items || [];
      } catch (error) {
        // Logging any errors that occur during the request and returning an empty array.
        console.error(`Error fetching ${type}:`, error.message);
        return [];
      }
    };

    // Fetching tracks, albums, and artists concurrently using Promise.all.
    const [tracks, albums, artists] = await Promise.all([
      fetchSpotifyData(queries.song, 'track', trackOffset, limit), // Fetch tracks with the song query.
      fetchSpotifyData(queries.album, 'album', albumOffset, 50),   // Fetch albums with the album query.
      fetchSpotifyData(queries.artist, 'artist', artistOffset, 1) // Fetch artists with the artist query.
    ]);

    // Selecting a song, album, and artist from the fetched data, with fallbacks in case of empty results.
    const song = tracks[index % tracks.length] || (await fetchSpotifyData('genre:pop', 'track'))[0];
    const album = albums[dayOfYear % albums.length] || (await fetchSpotifyData('genre:rock', 'album'))[0];
    const artist = artists[0] || (await fetchSpotifyData('genre:pop', 'artist'))[0];

    // Returning the selected song, album, and artist along with the current date.
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Preventing caching of the response.
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({ song, album, artist, date: dateString }), // Sending the data as a JSON response.
    };
  } catch (error) {
    // Handling errors and returning an appropriate error response.
    console.error('Error in getSongOfTheDay:', error);
    return {
      statusCode: error.response?.status || 500, // Using the status code from the error response, or 500 by default.
      body: JSON.stringify({ 
        error: error.message, // Including the error message in the response.
        details: error.response?.data || 'No additional error details available' // Including additional error details if available.
      }),
    };
  }
};