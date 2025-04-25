import axios from 'axios';

const ZEN_QUOTES_API_URL = 'https://zenquotes.io/api/today';

const ZenQuotesService = {
  async fetchQuoteOfTheDay() {
    try {
      const response = await axios.get(ZEN_QUOTES_API_URL);
      if (response.data && response.data.length > 0) {
        return response.data[0]; // Return the first quote of the day
      }
      throw new Error('No quotes found');
    } catch (error) {
      console.error('Error fetching quote of the day:', error);
      throw error;
    }
  },
};

export default ZenQuotesService;