"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

interface TvCardData {
  title: string;
  description: string;
  image?: string;
  extra?: JSX.Element;
}

interface TvData {
  tvShowOfTheDay: TvCardData | null;
  animeOfTheDay: TvCardData | null;
  dramaOfTheDay: TvCardData | null;
  comedyOfTheDay: TvCardData | null;
}

export default function TV() {
  const [data, setData] = useState<TvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      async function fetchTv() {
        try {
          const res = await fetch("/.netlify/functions/getTvOfTheDay");
          if (!res.ok) throw new Error("Failed to fetch TV data");
          const result = await res.json();

          const transform = (item: any): TvCardData => ({
            title: item.title || "Untitled",
            description: `First Air Date: ${item.firstAirDate || "Unknown"}<br/>Rating: ${item.rating || "N/A"}`,
            image: item.posterUrl || item.imageUrl,
            extra: (
              <a href={item.tmdbUrl || item.malUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                View More
              </a>
            ),
          });

          setData({
            tvShowOfTheDay: result.tvShowOfTheDay ? transform(result.tvShowOfTheDay) : null,
            animeOfTheDay: result.animeOfTheDay ? transform(result.animeOfTheDay) : null,
            dramaOfTheDay: result.dramaOfTheDay ? transform(result.dramaOfTheDay) : null,
            comedyOfTheDay: result.comedyOfTheDay ? transform(result.comedyOfTheDay) : null,
          });

          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
      fetchTv();
    });
    return () => cancelIdleCallback(idle);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
        <h1 className="text-4xl font-bold mb-10">TV of the Day</h1>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
          Every day at OfTheDay.world, we feature a random TV show, anime, drama, and comedy for you to explore.
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

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!data) return <div className="text-white text-center mt-10">No TV data available.</div>;

  return (
    <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
      <h1 className="text-4xl font-bold mb-10">TV of the Day</h1>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        <TvSection title="TV Show of the Day" content={data.tvShowOfTheDay} type="tv" />
        <TvSection title="Anime of the Day" content={data.animeOfTheDay} type="anime" />
        <TvSection title="Drama of the Day" content={data.dramaOfTheDay} type="drama" />
        <TvSection title="Comedy of the Day" content={data.comedyOfTheDay} type="comedy" />
      </div>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
        Every day at OfTheDay.world, we feature a random TV show, anime, drama, and comedy for you to explore.
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

function TvSection({
  title,
  content,
  type,
}: {
  title: string;
  content: TvCardData | null;
  type: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-[#1abc9c] pb-[2px]">{title}</h2>
      {content ? (
        <DailyCard type={type} data={content} />
      ) : (
        <p className="text-gray-400 italic">No {type} available today.</p>
      )}
    </section>
  );
}