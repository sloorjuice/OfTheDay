// cacheDailyData.js (updated to use Firebase)
const path = require("path");
const { db } = require("./FirebaseConfig");
const { setDoc, doc } = require("firebase/firestore");

exports.handler = async () => {
  try {
    const cache = {};
    const FUNCTIONS_DIR = __dirname;

    // Get all function files that fetch "of the day" data
    const fs = require("fs");
    const functionFiles = fs.readdirSync(FUNCTIONS_DIR)
      .filter(name => name.startsWith("get") && name.endsWith("OfTheDay.js"));

    // Execute each function and collect the results
    for (const file of functionFiles) {
      const key = file.replace("get", "").replace("OfTheDay.js", "").toLowerCase();
      const func = require(path.join(FUNCTIONS_DIR, file));

      const res = await func.handler({ 
        queryStringParameters: { date: new Date().toISOString().split("T")[0] } 
      });
      const json = JSON.parse(res.body);

      cache[key] = json;
    }

    // Add the current date to the cache object
    cache.date = new Date().toISOString().split("T")[0];

    // Save to Firebase instead of writing to a file
    await setDoc(doc(db, "dailyCache", "latest"), cache);

    // Also save a dated version for history
    await setDoc(doc(db, "dailyCache", cache.date), cache);

    return {
      statusCode: 200,
      body: "Cache updated successfully in Firebase"
    };
  } catch (err) {
    console.error("Firebase cache error:", err);
    return {
      statusCode: 500,
      body: `Firebase cache error: ${err.message}`
    };
  }
};