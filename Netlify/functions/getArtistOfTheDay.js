export const handler = async () => {
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  try {
    const res = await fetch("https://api.deezer.com/chart/0/artists");
    const data = await res.json();
    const artist = pickRandom(data.data || []);

    return {
      statusCode: 200,
      body: JSON.stringify({
        name: artist.name,
        url: artist.link,
        images: [{ url: artist.picture_medium }]
      })
    };
  } catch (err) {
    console.error("🔥 Artist fetch failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch artist", details: err.message })
    };
  }
};

