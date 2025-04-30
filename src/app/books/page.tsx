"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

interface BookCardData {
  title: string;
  description: string;
  image?: string;
  extra: JSX.Element;
}

export default function Books() {
  const [book, setBook] = useState<BookCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      async function fetchBook() {
        try {
          const res = await fetch("/.netlify/functions/getBookOfTheDay");
          if (!res.ok) throw new Error("Failed to fetch book data");
          const result = await res.json();

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

          setBook(card);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }

      fetchBook();
    });

    return () => cancelIdleCallback(idle);
  }, []);

  return (
    <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
      <h1 className="text-4xl font-bold mb-10">Book of the Day</h1>

      {loading && (
        <div className="max-w-md mx-auto">
          <SkeletonCard />
        </div>
      )}

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}
      {!loading && !error && book && (
        <div className="max-w-md mx-auto">
          <DailyCard type="book" data={book} />
        </div>
      )}

      <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
        Every day we highlight one book you might love. Whether it&rsquo;s fiction, nonfiction, or a total wildcard, this daily pick is chosen at random and changes every 24 hours. Discover something new to read today!
      </p>

      <section className="mt-6 flex flex-col items-center">
        <p className="text-gray-600 mb-2">Explore more daily picks:</p>
        <ul className="flex justify-center">
          <li><a href="/music" className="text-blue-500 hover:underline mx-2">Music</a></li>
          <li><a href="/movies" className="text-blue-500 hover:underline mx-2">Movies</a></li>
          <li><a href="/games" className="text-blue-500 hover:underline mx-2">Games</a></li>
        </ul>
      </section>
    </main>
  );
}
