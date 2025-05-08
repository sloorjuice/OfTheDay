"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

interface CardData {
  title: string;
  description: string;
  image?: string;
  extra: JSX.Element;
}

interface TvData {
  [key: string]: CardData | null;
}

// Keys must match what's in the `tv` and `ram` sections of your cache
const contentMap = [
  { key: "tvShowOfTheDay", title: "TV Show of the Day", label: "View More" },
  { key: "animeOfTheDay", title: "Anime of the Day", label: "View More" },
  { key: "dramaOfTheDay", title: "Drama of the Day", label: "View More" },
  { key: "comedyOfTheDay", title: "Comedy of the Day", label: "View More" },
  { key: "ram", title: "R&M Character of the Day", label: "View on API", isCharacter: true }
];

function TV() {
  const [data, setData] = useState<TvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      fetch("/.netlify/functions/getDailyCache")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch cached data");
          return res.json();
        })
        .then((result) => {
          const tv = result.tv;
          const ram = result.ram;
          const formatted: TvData = {};

          for (const { key, label, isCharacter } of contentMap) {
            // Pull from different cache sections based on type
            const entry = isCharacter ? ram : tv?.[key];
            if (!entry) {
              formatted[key] = null;
              continue;
            }

            if (isCharacter) {
              formatted[key] = {
                title: entry.name,
                description: `Species: ${entry.species}<br/>Status: ${entry.status}`,
                image: entry.image,
                extra: (
                  <a
                    href={`https://rickandmortyapi.com/character/${entry.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                ),
              };
            } else {
              formatted[key] = {
                title: entry.title || entry.name || "Untitled",
                description: `First Air Date: ${entry.firstAirDate || entry.startDate || "Unknown"}<br/>Rating: ${entry.rating || entry.vote_average || "N/A"}`,
                image: entry.posterUrl || entry.poster_path || entry.imageUrl,
                extra: (
                  <a
                    href={entry.tmdbUrl || entry.malUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                  </a>
                ),
              };
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
      <h1 className="text-4xl font-bold mb-10">TV of the Day</h1>

      {loading ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
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
        Every day at OfTheDay.world, we feature a new TV show, anime, drama, comedy, and even a Rick & Morty character to spark your screen-time joy.
      </p>

      <section className="mt-6 flex flex-col items-center">
        <p className="text-gray-600 mb-2">Explore more daily picks:</p>
        <ul className="flex justify-center">
          <li><a href="/games" className="text-blue-500 hover:underline mx-2">Games</a></li>
          <li><a href="/movies" className="text-blue-500 hover:underline mx-2">Movies</a></li>
          <li><a href="/music" className="text-blue-500 hover:underline mx-2">Music</a></li>
        </ul>
      </section>
    </main>
  );
}

function Section({ title, content, type }: { title: string; content: CardData | null; type: string }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-[#1abc9c] pb-[2px]">{title}</h2>
      {content ? <DailyCard type={type} data={content} /> : <p>No {type} today.</p>}
    </section>
  );
}

export default TV;
