const fs = require("fs");
const path = require("path");

const FUNCTIONS_DIR = path.resolve(__dirname);
const CACHE_FILE = path.resolve(__dirname, "../../dailyCache.json");

exports.handler = async () => {
  try {
    const cache = {};

    const functionFiles = fs.readdirSync(FUNCTIONS_DIR)
      .filter(name => name.startsWith("get") && name.endsWith("OfTheDay.js"));

    for (const file of functionFiles) {
      const key = file.replace("get", "").replace("OfTheDay.js", "").toLowerCase();
      const func = require(path.join(FUNCTIONS_DIR, file));

      const res = await func.handler({ queryStringParameters: { date: new Date().toISOString().split("T")[0] } });
      const json = JSON.parse(res.body);

      cache[key] = json;
    }

    cache.date = new Date().toISOString().split("T")[0];

    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));

    return {
      statusCode: 200,
      body: "Cache updated successfully"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Cache error: ${err.message}`
    };
  }
};
