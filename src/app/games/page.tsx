"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

interface GameCardData {
  title: string;
  description: string;
  image: string | undefined;
  extra: JSX.Element | string;
}

interface GameData {
  gameOfTheDay: GameCardData | null;
  multiplayerGameOfTheDay: GameCardData | null;
  indieGameOfTheDay: GameCardData | null;
}

export default function Games() {
  const [data, setData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      async function fetchGames() {
        try {
          const res = await fetch("/.netlify/functions/getGameOfTheDay");
          if (!res.ok) throw new Error("Failed to fetch game data");
          const result = await res.json();

          const transform = (game: any): GameCardData => ({
            title: game?.name || "Untitled",
            description: `Released: ${game?.released || "Unknown"}<br/>Rating: ${game?.rating || "N/A"}`,
            image: game?.background_image,
            extra: game?.website ? (
              <a href={game.website} target="_blank" rel="noopener noreferrer">Visit Game Site</a>
            ) : "No site available",
          });

          setData({
            gameOfTheDay: result.gameOfTheDay ? transform(result.gameOfTheDay) : null,
            multiplayerGameOfTheDay: result.multiplayerGameOfTheDay ? transform(result.multiplayerGameOfTheDay) : null,
            indieGameOfTheDay: result.indieGameOfTheDay ? transform(result.indieGameOfTheDay) : null,
          });

          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
      fetchGames();
    });
    return () => cancelIdleCallback(idle);
  }, []);

  if (loading) {
    return (
      <main className="bg-black min-h-screen px-4 sm:px-8 py-12 text-center text-white">
        <h1 className="text-4xl font-bold mb-10">Games of the Day</h1>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    );
  }

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!data) return <div className="text-white text-center mt-10">No game data available.</div>;

  return (
    <main className="bg-black min-h-screen px-4 sm:px-8 py-12 text-center text-white">
      <h1 className="text-4xl font-bold mb-10">Games of the Day</h1>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <GameSection title="Game of the Day" content={data.gameOfTheDay} type="game" />
        <GameSection title="Multiplayer Pick" content={data.multiplayerGameOfTheDay} type="multiplayer" />
        <GameSection title="Indie Highlight" content={data.indieGameOfTheDay} type="indie" />
      </div>
    </main>
  );
}

function GameSection({
  title,
  content,
  type,
}: {
  title: string;
  content: GameCardData | null;
  type: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-[#e67e22] pb-[2px]">{title}</h2>
      {content ? (
        <DailyCard type={type} data={content} />
      ) : (
        <p className="text-gray-400 italic">No {type} available today.</p>
      )}
    </section>
  );
}
