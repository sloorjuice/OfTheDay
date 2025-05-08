"use client";

import React, { useEffect, useState } from "react";
import DailyComponent from "../components/DailyComponent";
import JokeComponent from "../components/JokeComponent";


interface Quote {
  text: string;
  author: string;
}

interface Joke {
  setup: string;
  delivery: string;
  category: string;
}

interface Word {
  word: string;
  definition: string;
  partOfSpeech: string;
  examples: string[];
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);


const Home = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [wordData, setWordData] = useState<Word | null>(null);
  const [joke, setJoke] = useState<Joke | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch('/.netlify/functions/getDailyCache');
        const cache = await res.json();

        const quoteData = cache.quote;
        if (!quoteData || !quoteData.q || !quoteData.a) throw new Error('No quote data received');

        setQuote({ text: quoteData.q, author: quoteData.a });
      } catch (err) {
        console.error('Error fetching the quote of the day from cache:', err);
      }
    };

    const fetchWord = async () => {
      try {
        const res = await fetch('/.netlify/functions/getDailyCache');
        const cache = await res.json();

        const wordData = cache.word;

        if (!wordData || !wordData.word || !wordData.definition) throw new Error('No cache data received');

        setWordData(wordData);
      } catch (err) {
        console.error('Error fetching the word of the day from cache:', err);
      }
    };

    const fetchJoke = async () => {
      try {
        const res = await fetch('/.netlify/functions/getDailyCache');
        const cache = await res.json();

        const jokeData = cache.joke;
        if (!jokeData || !jokeData.joke) throw new Error("No joke data in cache");

        const jokeText = jokeData.joke;
        const [setup, delivery] = jokeText.split(" ... ");

        setJoke({ setup, delivery, category: jokeData.category });
      } catch (err) {
        console.error("Error fetching joke of the day from cache:", err);
      }
    }

    fetchQuote();
    fetchWord();
    fetchJoke();
  }, []);

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white min-h-screen">
      <h1 className="pt-6 py-2 text-3xl sm:text-4xl font-bold text-center">
        Welcome to{" "}
        <span className="relative inline-block pb-1 border-b-4 border-blue-500 transition-colors duration-300 hover:text-blue-500">
          Of The Day
          <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 scale-x-0 origin-bottom-right transition-transform duration-300 hover:scale-x-100"></span>
        </span>
        !
      </h1>
      <h2 className="text-base sm:text-lg text-center mt-2 text-gray-300">
        Discover something new every day.
      </h2>

      <section className="flex flex-col lg:flex-row items-center mt-8 gap-4 lg:gap-8">
        {/* Quote of the Day */}
        {quote && (
          <DailyComponent
            title="Quote of the Day"
            content={`"${quote.text}"`}
            author={quote.author || "Unknown"}
          />
        )}

        {/* Joke of the Day */}
        {joke && (
          <JokeComponent
            setup={joke.setup}
            punchline={joke.delivery}
            category={joke.category}
          />
        )}

        {/* Word of the Day */}
        {wordData && (
          <DailyComponent
            title={`Word of the Day (${capitalize(wordData.partOfSpeech)})`}
            content={`${capitalize(wordData.word)}: ${capitalize(wordData.definition)}.${
              wordData.examples?.length > 0 ? `\n\nExample: "${wordData.examples[0]}"` : ''}`}

          />
        )}
      </section>

      <section className="mt-6 max-w-2xl text-center text-gray-400">
        <p>
          At OfTheDay.World, we deliver randomized quotes, music, games, movies, and words daily to inspire, entertain, and enrich your day. Whether you&apos;re looking for a new album to listen to, an old horror movie you&apos;ve never seen, a motivational quote, or a fun new game to play, our daily selections help you discover something fresh every day. Bookmark us and make discovering your next favorite thing a daily habit!
        </p>
      </section>

      <section className="mt-6 flex flex-col items-center">
        <p className="text-gray-400 mb-2">
          Explore our daily picks:
        </p>
        <ul className="flex justify-center">
          <li><a href="/music" className="text-blue-400 hover:underline mx-2">Music</a></li>
          <li><a href="/games" className="text-blue-400 hover:underline mx-2">Games</a></li>
          <li><a href="/movies" className="text-blue-400 hover:underline mx-2">Movies</a></li>
        </ul>
      </section>
    </div>
  );
};

export default Home;
