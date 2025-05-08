const fetch = require("node-fetch");

// Hash function for date-based pseudo-random
const hashString = (str) => {
  let hash = 21643360981;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

exports.handler = async (event) => {
  try {
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split("T")[0];

    const seed = hashString(today);
    const pseudoRandom = (range, offset = 0) => (seed + offset) % range;

    // We'll target a known ID range (say 0 to 300)
    const jokeId = pseudoRandom(300); // Deterministic joke ID
    const res = await fetch(`https://v2.jokeapi.dev/joke/Any?idRange=${jokeId}-${jokeId}`);

    if (!res.ok) throw new Error("Joke API failed");

    const data = await res.json();

    const joke =
      data.type === "single"
        ? { setup: data.joke, delivery: "" }
        : { setup: data.setup, delivery: data.delivery };

    return {
      statusCode: 200,
      body: JSON.stringify({
        category: data.category,
        joke: `${joke.setup} ... ${joke.delivery}`.trim(),
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
