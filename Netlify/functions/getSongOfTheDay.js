const fetch = require('node-fetch');

exports.handler = async () => {
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

    // Seed based on current date
    //const today = new Date('2025-04-11').toISOString().split('T')[0]; // test date
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const seed = Array.from(today).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pseudoRandom = (range) => seed % range;

    const genres = ["pop", "hip-hop", "rock", "electronic", "jazz", "indie", "metal", "classical", "reggae"];
    const genre = genres[pseudoRandom(genres.length)];
    const year = 1980 + (seed % 46); // 1980–2025

    const query = `genre:${genre} year:${year}`;

    // Fetch tracks
    const trackRes = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const trackData = await trackRes.json();
    const trackItems = trackData.tracks?.items || [];

    if (trackItems.length === 0) throw new Error("No tracks found");

    const song = trackItems[pseudoRandom(trackItems.length)];

    // Fetch albums
    const albumRes = await fetch(`https://api.spotify.com/v1/search?q=year:${year}&type=album&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const albumData = await albumRes.json();
    const albumItems = albumData.albums?.items || [];

    const album = albumItems.length > 0 ? albumItems[pseudoRandom(albumItems.length)] : null;

    // Fetch artists
    const artistRes = await fetch(`https://api.spotify.com/v1/search?q=${genre}&type=artist&limit=50`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const artistData = await artistRes.json();
    const artistItems = artistData.artists?.items || [];

    const artist = artistItems.length > 0 ? artistItems[pseudoRandom(artistItems.length)] : null;

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
