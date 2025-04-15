const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Use test date if provided, otherwise use today
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const seed = Array.from(today).reduce((acc, c) => acc + c.charCodeAt(0), 0);

    // Pseudo-random number generator with seed
    const pseudoRandom = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x); // float between 0–1
    };

    const genres = ["pop", "hip-hop", "rock", "electronic", "jazz", "indie", "metal", "classical", "reggae"];
    const genreIndex = Math.floor(pseudoRandom(seed) * genres.length);
    const genre = genres[genreIndex];
    const year = 1980 + (seed % 46); // 1980–2025

    // ---- SONG OF THE DAY ----
    const songQuery = `genre:${genre} year:${year}`;
    const songRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songQuery)}&type=track&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const songData = await songRes.json();
    const songItems = songData.tracks?.items || [];
    const songIndex = Math.floor(pseudoRandom(seed + 1) * songItems.length);
    const song = songItems[songIndex];

    // ---- ALBUM OF THE DAY ----
    const albumRes = await fetch(`https://api.spotify.com/v1/search?q=year:${year}&type=album&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const albumData = await albumRes.json();
    const albumItems = albumData.albums?.items || [];
    const albumIndex = Math.floor(pseudoRandom(seed + 2) * albumItems.length);
    const album = albumItems[albumIndex];

    // ---- ARTIST OF THE DAY ----
    const artistRes = await fetch(`https://api.spotify.com/v1/search?q=${genre}&type=artist&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const artistData = await artistRes.json();
    const artistItems = artistData.artists?.items || [];
    const artistIndex = Math.floor(pseudoRandom(seed + 3) * artistItems.length);
    const artist = artistItems[artistIndex];

    return {
      statusCode: 200,
      body: JSON.stringify({
        date: today,
        genre,
        year,
        songOfTheDay: song && {
          name: song.name,
          artist: song.artists.map(a => a.name).join(', '),
          url: song.external_urls.spotify,
          album: {
            name: song.album.name,
            images: song.album.images,
          },
        },
        albumOfTheDay: album && {
          name: album.name,
          artist: album.artists.map(a => a.name).join(', '),
          url: album.external_urls.spotify,
          images: album.images,
        },
        artistOfTheDay: artist && {
          name: artist.name,
          url: artist.external_urls.spotify,
          images: artist.images,
        },
      }),
    };
  } catch (err) {
    console.error("Error occurred:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
    };
  }
};
