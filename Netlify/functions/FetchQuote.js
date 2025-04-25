let cachedQuote = null;
let lastFetch = 0;

export const handler = async (event) => {
  const now = Date.now();
  if (cachedQuote && now - lastFetch < 1000 * 60 * 60) { // 1 hour cache
    return {
      statusCode: 200,
      body: JSON.stringify(cachedQuote),
    };
  }

  const endpoint = event.queryStringParameters?.endpoint || 'today';
  const API_URL = process.env.ZEN_QUOTES_API_URL || `https://zenquotes.io/api/${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API Error: ${response.statusText || response.status}` }),
      };
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected API response format' }),
      };
    }

    cachedQuote = data[0]; // store result
    lastFetch = now;

    return {
      statusCode: 200,
      body: JSON.stringify(data[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  } finally {
    clearTimeout(timeout);
  }
};
