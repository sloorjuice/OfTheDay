const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Extract the endpoint from query params (today, random, or quotes/N)
  const endpoint = event.queryStringParameters.endpoint || 'today';
  const API_URL = `https://zenquotes.io/api/${endpoint}`;
  
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      // Add rate limiting specific handling
      if (response.status === 429) {
        console.log('Rate limit exceeded with ZenQuotes API');
        return {
          statusCode: 429,
          body: JSON.stringify({ 
            error: 'Rate limit exceeded with ZenQuotes API',
            message: 'Too many requests. Please try again later.' 
          })
        };
      }
      
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API responded with status: ${response.status}` })
      };
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600" // Cache response for 1 hour
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Error in Netlify function:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to fetch from ZenQuotes API',
        message: error.message 
      })
    };
  }
};