const axios = require('axios');

exports.handler = async function() {
  try {
    const tokenResponse = await axios.get(`${process.env.URL}/.netlify/functions/getSpotifyToken`);
    const accessToken = tokenResponse.data.access_token;

    const headers = { 'Authorization': `Bearer ${accessToken}` };
    
    // Get current date in YYYY-MM-DD format for consistency
    const today = new Date();
    const dateString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    // Calculate a stable number for the day (1-365/366)
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    console.log(`Date: ${dateString}, Day of year: ${dayOfYear}`);
    
    // Very small offsets to ensure we get results
    // Use different seeds to get variety between categories
    // Use more diverse prime numbers for multiplication to increase randomness
    const trackOffset = (dayOfYear * 19) % 50;  // Increased range 0-49
    const albumOffset = (dayOfYear * 23) % 50;  // Increased range 0-49
    const artistOffset = (dayOfYear * 17) % 20; // Keep this as is since it works
    
    console.log(`Offsets: track=${trackOffset}, album=${albumOffset}, artist=${artistOffset}`);
    
    // Simpler, more reliable queries with no year constraints
    const songQuery = "tag:new genre:pop";
    const albumQuery = "tag:new genre:rock"; 
    const artistQuery = "genre:pop OR genre:rock";

    // Storage for our results
    let song = null, album = null, artist = null;
    
    // First try: Use the day-based offsets
    try {
      const trackResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(songQuery)}&type=track&limit=1&offset=${trackOffset}`, 
        { headers }
      );
      if (trackResponse.data?.tracks?.items?.length > 0) {
        song = trackResponse.data.tracks.items[0];
        console.log("Track found:", song.name);
      } else {
        console.log("No track found with primary query");
      }
    } catch (error) {
      console.error("Error fetching track:", error.message);
    }
    
    try {
      const albumResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(albumQuery)}&type=album&limit=1&offset=${albumOffset}`, 
        { headers }
      );
      if (albumResponse.data?.albums?.items?.length > 0) {
        album = albumResponse.data.albums.items[0];
        console.log("Album found:", album.name);
      } else {
        console.log("No album found with primary query");
      }
    } catch (error) {
      console.error("Error fetching album:", error.message);
    }
    
    try {
      const artistResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistQuery)}&type=artist&limit=1&offset=${artistOffset}`, 
        { headers }
      );
      if (artistResponse.data?.artists?.items?.length > 0) {
        artist = artistResponse.data.artists.items[0];
        console.log("Artist found:", artist.name);
      } else {
        console.log("No artist found with primary query");
      }
    } catch (error) {
      console.error("Error fetching artist:", error.message);
    }
    
    // Second try: Fallback to zero offset if any are still null
    if (!song) {
      try {
        console.log("Trying fallback for track...");
        const fallbackTrackResponse = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent("genre:pop")}&type=track&limit=1&offset=0`, 
          { headers }
        );
        if (fallbackTrackResponse.data?.tracks?.items?.length > 0) {
          song = fallbackTrackResponse.data.tracks.items[0];
          console.log("Track found with fallback:", song.name);
        }
      } catch (error) {
        console.error("Error in track fallback:", error.message);
      }
    }
    
    if (!album) {
      try {
        console.log("Trying fallback for album...");
        const fallbackAlbumResponse = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent("genre:rock")}&type=album&limit=1&offset=0`, 
          { headers }
        );
        if (fallbackAlbumResponse.data?.albums?.items?.length > 0) {
          album = fallbackAlbumResponse.data.albums.items[0];
          console.log("Album found with fallback:", album.name);
        }
      } catch (error) {
        console.error("Error in album fallback:", error.message);
      }
    }
    
    if (!artist) {
      try {
        console.log("Trying fallback for artist...");
        const fallbackArtistResponse = await axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent("genre:pop")}&type=artist&limit=1&offset=0`, 
          { headers }
        );
        if (fallbackArtistResponse.data?.artists?.items?.length > 0) {
          artist = fallbackArtistResponse.data.artists.items[0];
          console.log("Artist found with fallback:", artist.name);
        }
      } catch (error) {
        console.error("Error in artist fallback:", error.message);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify({
        song,
        album,
        artist,
        date: dateString
      }),
    };
  } catch (error) {
    console.error('Error in getSongOfTheDay:', error);
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data || 'No additional error details available'
      }),
    };
  }
};