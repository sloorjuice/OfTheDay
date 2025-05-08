"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

// Define the structure of the book data
interface BookCardData {
  title: string;
  description: string;
  image?: string;
  extra: JSX.Element;
}

export default function Books() {
  // State variables for book data, loading status, and error messages
  const [book, setBook] = useState<BookCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use requestIdleCallback to fetch data when the browser is idle
    const idle = requestIdleCallback(() => {
      async function fetchBook() {
        try {
          // Fetch the daily cache file
          const res = await fetch("/.netlify/functions/getDailyCache")
          if (!res.ok) throw new Error("Failed to fetch daily cache");

          const cache = await res.json();
          const result = cache.book; // Access the "book" key from the cache

          if (!result) throw new Error("No book data available in cache");

          // Format the book data for display
          const card: BookCardData = {
            title: result.title,
            description: result.description
              ? `Author: ${result.author || "Unknown"}<br/><br/>${result.description}`
              : `Author: ${result.author || "Unknown"}`,
            image: result.image,
            extra: (
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View on Google Books
              </a>
            ),
          };

          // Update state with the fetched book data
          setBook(card);
          setLoading(false);
        } catch (err) {
          // Handle errors and update the error state
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }

      fetchBook();
    });

    // Cleanup function to cancel the idle callback
    return () => cancelIdleCallback(idle);
  }, []);

  return (
    <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
      {/* Page title */}
      <h1 className="text-4xl font-bold mb-10">Book of the Day</h1>

      {/* Show a loading skeleton while data is being fetched */}
      {loading && (
        <div className="max-w-md mx-auto">
          <SkeletonCard />
        </div>
      )}

      {/* Display an error message if an error occurs */}
      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      {/* Display the book card if data is successfully fetched */}
      {!loading && !error && book && (
        <div className="max-w-md mx-auto">
          <DailyCard type="book" data={book} />
        </div>
      )}

      {/* Informational paragraph */}
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
        Every day we highlight one book you might love. Whether it&rsquo;s fiction, nonfiction, or a total wildcard, this daily pick is chosen at random and changes every 24 hours. Discover something new to read today!
      </p>

      {/* Navigation links to explore other daily picks */}
      <section className="mt-6 flex flex-col items-center">
        <p className="text-gray-600 mb-2">Explore more daily picks:</p>
        <ul className="flex justify-center">
          <li>
            <a href="/music" className="text-blue-500 hover:underline mx-2">
              Music
            </a>
          </li>
          <li>
            <a href="/movies" className="text-blue-500 hover:underline mx-2">
              Movies
            </a>
          </li>
          <li>
            <a href="/games" className="text-blue-500 hover:underline mx-2">
              Games
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
