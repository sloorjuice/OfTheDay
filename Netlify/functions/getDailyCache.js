const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.resolve(__dirname, "../../dailyCache.json");

exports.handler = async () => {
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Cache not yet created." })
      };
    }

    const data = fs.readFileSync(CACHE_FILE, "utf8");
    return {
      statusCode: 200,
      body: data,
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Cache read error: ${err.message}`
    };
  }
};
