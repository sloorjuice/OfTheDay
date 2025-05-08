export const handler = async () => {
  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Function to generate a random string for search
  const generateRandomSearchTerm = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomTerm = '';
    for (let i = 0; i < 5; i++) {  // Random 5-character search term
      randomTerm += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomTerm;
  };

  // Generate a random search term
  const randomSearchTerm = generateRandomSearchTerm();

  try {
    // Use Deezer's search API with the random search term
    const res = await fetch(`https://api.deezer.com/search?q=${randomSearchTerm}`);
    const data = await res.json();

    if (data && data.data && data.data.length > 0) {
      // Pick a random result (could be an artist, track, or album)
      const randomResult = pickRandom(data.data);

      // Choose whether to return an artist, album, or track depending on the result type
      const resultType = randomResult.artist ? 'artist' : randomResult.album ? 'album' : 'track';

      let response = {
        statusCode: 200,
        body: JSON.stringify({
          name: resultType === 'artist' ? randomResult.artist.name : resultType === 'album' ? randomResult.album.title : randomResult.title,
          url: resultType === 'artist' ? randomResult.artist.link : resultType === 'album' ? randomResult.album.link : randomResult.link,
          image: resultType === 'artist' ? randomResult.artist.picture_medium : resultType === 'album' ? randomResult.album.cover_medium : randomResult.album.cover_medium,
          type: resultType
        })
      };

      return response;
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "No results found" })
    };

  } catch (err) {
    console.error("🔥 Fetch failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch random music", details: err.message })
    };
  }
};
