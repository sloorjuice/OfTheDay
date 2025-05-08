export const handler = async () => {
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  try {
    const res = await fetch("https://api.deezer.com/chart/0/tracks");
    const data = await res.json();
    const song = pickRandom(data.data || []);

    return {
      statusCode: 200,
      body: JSON.stringify({
        name: song.title,
        artist: song.artist.name,
        url: song.link,
        album: {
          name: song.album.title,
          images: [{ url: song.album.cover_medium }]
        }
      })
    };
  } catch (err) {
    console.error("🔥 Song fetch failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch song", details: err.message })
    };
  }
};
