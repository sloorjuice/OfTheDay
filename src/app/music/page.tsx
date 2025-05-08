"use client";

import { useEffect, useState, JSX } from 'react';
import DailyCard from '../../components/DailyCard';
import SkeletonCard from '../../components/SkeletonCard';

interface CardData {
  title: string;
  description: string;
  image?: string;
  extra: JSX.Element;
}

interface MusicData {
  [key: string]: CardData | null;
}

const contentMap = [
  { key: "song", title: "Song of the Day", label: "Listen on Deezer" },
  { key: "album", title: "Album of the Day", label: "View on Deezer" },
  { key: "artist", title: "Artist of the Day", label: "View on Deezer", description: "Artist of the Day" }
];

function Music() {
  const [data, setData] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      fetch("/.netlify/functions/getDailyCache")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch data");
          return res.json();
        })
        .then((result) => {
          const formatted: MusicData = {};

          for (const { key, label, description } of contentMap) {
            const entry = result[key];
            if (entry) {
              formatted[key] = {
                title: entry.name,
                description: description || `By: ${entry.artist}`,
                image: entry.album?.images?.[0]?.url || entry.images?.[0]?.url,
                extra: (
                  <a href={entry.url} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                )
              };
            } else {
              formatted[key] = null;
            }
          }

          setData(formatted);
          setLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        });
    });

    return () => cancelIdleCallback(idle);
  }, []);

  return (
    <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
      <h1 className="text-4xl font-bold mb-10">Music of the Day</h1>

      {loading ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <p className="text-red-500 text-lg">{error}</p>
      ) : (
        <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center max-w-7xl mx-auto">
          {contentMap.map(({ key, title }) => (
            <Section key={key} title={title} content={data?.[key] ?? null} type={key} />
          ))}
        </div>
      )}

      <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
        Every day at OfTheDay.world, we feature a fresh new song, album, and artist for you to discover.
        Whether you&apos;re hunting for new jams or daily inspiration, this is the place to be.
      </p>

      <section className="mt-6 flex flex-col items-center">
        <p className="text-gray-600 mb-2">Explore our daily picks:</p>
        <ul className="flex justify-center">
          <li><a href="/games" className="text-blue-500 hover:underline mx-2">Games</a></li>
          <li><a href="/movies" className="text-blue-500 hover:underline mx-2">Movies</a></li>
        </ul>
      </section>
    </main>
  );
}

function Section({ title, content, type }: { title: string; content: CardData | null; type: string }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-[#3498db] pb-[2px]">{title}</h2>
      {content ? <DailyCard type={type} data={content} /> : <p>No {type} available for today.</p>}
    </section>
  );
}

export default Music;
