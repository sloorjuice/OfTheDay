const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

exports.handler = async (event) => {
  try {
    const response = await fetch('https://www.dictionary.com/e/word-of-the-day/');
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const wordElement = document.querySelector('.otd-item-headword__word');
    const posBlock = document.querySelector('.otd-item-headword__pos-blocks');
    
    if (!wordElement || !posBlock) {
      throw new Error('Failed to find word or pos block');
    }

    const partOfSpeechElement = posBlock.querySelector('span.italic');
    const definitionParagraphs = posBlock.querySelectorAll('p');

    if (definitionParagraphs.length < 2) {
      throw new Error('Not enough paragraph elements to find definition');
    }

    const partOfSpeech = partOfSpeechElement ? partOfSpeechElement.textContent.trim() : '';
    const definition = definitionParagraphs[1].textContent.trim(); // <-- SECOND <p> = definition

    const word = wordElement.textContent.trim();
    const examples = []; // Not available in the source page

    return {
      statusCode: 200,
      body: JSON.stringify({
        word,
        definition,
        partOfSpeech,
        examples,
      }),
    };

  } catch (error) {
    console.error('Failed to scrape word of the day:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to scrape word of the day' }),
    };
  }
};
