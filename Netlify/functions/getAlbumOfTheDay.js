export const handler = async () => {
    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
    try {
      const res = await fetch("https://api.deezer.com/chart/0/albums");
      const data = await res.json();
      const album = pickRandom(data.data || []);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          name: album.title,
          artist: album.artist.name,
          url: album.link,
          images: [{ url: album.cover_medium }]
        })
      };
    } catch (err) {
      console.error("🔥 Album fetch failed:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to fetch album", details: err.message })
      };
    }
  };
  