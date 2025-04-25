"use client";

import React, { useEffect, useState } from "react";
import DailyComponent from "../components/DailyComponent";

import '../css/Home.css'; // Import the Home-specific styles

interface Quote {
  text: string;
  author: string;
}

const Home = () => {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch('/.netlify/functions/FetchQuote?endpoint=today');
        const data = await res.json();

        if (!data || !data.q || !data.a) {
          throw new Error('No data received');
        }

        setQuote({ text: data.q, author: data.a });
      } catch (err) {
        console.error('Error fetching the quote of the day:', err);
      }
    };

    fetchQuote();
  }, []);

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <h1 className="pt-6 py-2 text-3xl sm:text-4xl font-bold text-center">
        Welcome to{" "}
        <span className="relative inline-block pb-1 border-b-4 border-blue-500 transition-colors duration-300 hover:text-blue-500">
          Of The Day
          <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 scale-x-0 origin-bottom-right transition-transform duration-300 hover:scale-x-100"></span>
        </span>
        !
      </h1>
      <h2 className="text-base sm:text-lg text-white text-center mt-2">
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
      </section>
    </div>
  );
};

export default Home;