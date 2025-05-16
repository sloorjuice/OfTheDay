export const handler = async (event) => {
  try {
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate && /^\d{4}-\d{2}-\d{2}$/.test(inputDate)
      ? inputDate
      : new Date().toISOString().split("T")[0];

    const seed = Array.from(today).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pseudoRandom = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x); // float between 0–1
    };

    // 1. SONG OF THE DAY
    const songRes = await fetch("https://api.deezer.com/chart/0/tracks");
    const songData = await songRes.json();
    const songs = songData.data || [];
    const songIndex = Math.floor(pseudoRandom(seed + 1) * songs.length);
    const song = songs[songIndex];

    // 2. ALBUM OF THE DAY
    const albumRes = await fetch("https://api.deezer.com/chart/0/albums");
    const albumData = await albumRes.json();
    const albums = albumData.data || [];
    const albumIndex = Math.floor(pseudoRandom(seed + 2) * albums.length);
    const album = albums[albumIndex];

    // 3. ARTIST OF THE DAY
    const artistRes = await fetch("https://api.deezer.com/chart/0/artists");
    const artistData = await artistRes.json();
    const artists = artistData.data || [];
    const artistIndex = Math.floor(pseudoRandom(seed + 3) * artists.length);
    const artist = artists[artistIndex];

    return {
      statusCode: 200,
      body: JSON.stringify({
        date: today,
        genre: "N/A", // Deezer doesn't provide genre in chart endpoints directly
        year: "N/A",  // No year metadata in public Deezer endpoints

        songOfTheDay: song && {
          name: song.title,
          artist: song.artist.name,
          url: song.link,
          album: {
            name: song.album.title,
            images: [
              { url: song.album.cover_medium }
            ]
          }
        },

        albumOfTheDay: album && {
          name: album.title,
          artist: album.artist.name,
          url: album.link,
          images: [
            { url: album.cover_medium }
          ]
        },

        artistOfTheDay: artist && {
          name: artist.name,
          url: artist.link,
          images: [
            { url: artist.picture_medium }
          ]
        }
      }, null, 2), // Pretty print JSON
    };
  } catch (err) {
    console.error("💥 Deezer function failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
    };
  }
};
