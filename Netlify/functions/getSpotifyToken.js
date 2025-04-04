const axios = require('axios');
const querystring = require('querystring');

exports.handler = async function() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
  };

  const data = querystring.stringify({ grant_type: 'client_credentials' });

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    const { access_token } = response.data;
    return {
      statusCode: 200,
      body: JSON.stringify({ access_token }),
    };
  } catch (error) {
    return {
      statusCode: error.response.status,
      body: JSON.stringify({ error: error.message }),
    };
  }
};