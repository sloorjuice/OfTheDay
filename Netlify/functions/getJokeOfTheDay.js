const fetch = require("node-fetch");

const hashString = (str) => {
  let hash = 2166134261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

exports.handler = async (event) => {
  try {
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split("T")[0];

    const seed = hashString(today);
    const pseudoRandom = (range, offset = 0) => (seed + offset) % range;

    const genres = ["Misc", "Programming", "Pun", "Spooky", "Christmas"];
    const genreIndex = pseudoRandom(genres.length);
    const selectedGenre = genres[genreIndex];

    const url = `https://v2.jokeapi.dev/joke/${selectedGenre}?blacklistFlags=nsfw,explicit&type=twopart`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Joke API failed");

    const data = await res.json();
    if (data.error || !data.setup || !data.delivery) {
      throw new Error("No joke data");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        category: data.category,
        joke: `${data.setup} ... ${data.delivery}`,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to get joke",
        details: err.message,
      }),
    };
  }
};
