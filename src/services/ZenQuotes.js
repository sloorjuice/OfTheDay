/**
 * ZenQuotes API Service
 * Documentation: https://zenquotes.io/
 */

// Using our Netlify function proxy instead of calling the API directly
const API_URL = '/api/FetchQuote';

/**
 * Fetch a random inspirational quote
 * @returns {Promise<{quote: string, author: string}>} A promise that resolves to a quote object
 */
export const getRandomQuote = async () => {
  try {
    const response = await fetch(`${API_URL}?endpoint=random`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        quote: data[0].q,
        author: data[0].a
      };
    }
    
    return {
      quote: "Wisdom does not come from external sources, but from within.",
      author: "Unknown"
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    
    // Return a fallback quote if the API request fails
    return {
      quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela"
    };
  }
};

/**
 * Fetch today's quote of the day
 * @returns {Promise<{quote: string, author: string}>} A promise that resolves to a quote object
 */
export const getQuoteOfTheDay = async () => {
  try {
    const response = await fetch(`${API_URL}?endpoint=today`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quote of the day: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        quote: data[0].q,
        author: data[0].a
      };
    }
    
    return await getRandomQuote(); // Fallback to random quote
  } catch (error) {
    console.error('Error fetching quote of the day:', error);
    return await getRandomQuote(); // Fallback to random quote
  }
};

/**
 * Fetch multiple random quotes
 * @param {number} count - Number of quotes to fetch (max 50)
 * @returns {Promise<Array<{quote: string, author: string}>>} A promise that resolves to an array of quote objects
 */
export const getMultipleQuotes = async (count = 5) => {
  // Limit count to a reasonable number to avoid API abuse
  const safeCount = Math.min(Math.max(1, count), 50);
  
  try {
    const response = await fetch(`${API_URL}?endpoint=quotes/${safeCount}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quotes: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return data.map(item => ({
        quote: item.q,
        author: item.a
      }));
    }
    
    return [await getRandomQuote()]; // Fallback to single random quote
  } catch (error) {
    console.error('Error fetching multiple quotes:', error);
    return [await getRandomQuote()]; // Fallback to single random quote
  }
};

export default {
  getRandomQuote,
  getQuoteOfTheDay,
  getMultipleQuotes
};