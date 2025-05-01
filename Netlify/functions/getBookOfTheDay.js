const fetch = require('node-fetch');
const crypto = require('crypto');

exports.handler = async (event) => {
  try {
    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // 🔐 Deterministic hash from date
    const hash = crypto.createHash('sha256').update(today + 'book').digest('hex');
    const seed = parseInt(hash.substring(0, 8), 16); // Convert part of hash to number

    const pseudoRandom = (range) => seed % range;

    const res = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=40');
    const data = await res.json();
    const books = data.items;

    if (!books || books.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No books found.' }),
      };
    }

    const book = books[pseudoRandom(books.length)];

    const { title, authors, description, imageLinks, infoLink } = book.volumeInfo;

    return {
      statusCode: 200,
      body: JSON.stringify({
        title,
        author: authors?.join(', ') || 'Unknown',
        description: description || 'No description available.',
        image: imageLinks?.thumbnail || null,
        link: infoLink || null,
        date: today,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
