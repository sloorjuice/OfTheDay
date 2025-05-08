// netlify/plugins/run-once/index.js

const fetch = require('node-fetch');

module.exports = {
  onSuccess: async () => {
    console.log("Running scheduled logic on deploy...");

    try {
      const res = await fetch('https://somethingtoday.netlify.app/.netlify/functions/cacheDailyData');
      const data = await res.text(); // or res.json() if JSON
      console.log("Function triggered successfully:", data);
    } catch (err) {
      console.error("Failed to trigger function:", err);
    }
  }
};
