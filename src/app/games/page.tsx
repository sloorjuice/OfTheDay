"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

interface CardData {
  title: string;
  description: string;
  image?: string;
  extra: JSX.Element | string;
}

interface GameData {
  [key: string]: CardData | null;
}

// Map keys to titles, types, and labels for rendering
const contentMap = [
  { key: "gameOfTheDay", title: "Game of the Day" },
  { key: "multiplayerGameOfTheDay", title: "Multiplayer Pick" },
  { key: "indieGameOfTheDay", title: "Indie Highlight" },
  { key: "pokemonOfTheDay", title: "Pokémon of the Day" },
];

export default function Games() {
  const [data, setData] = useState<GameData | null>(null);
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
          const games = result.game; // Access the `game` key
          const pokemon = result.pokemon;
          const formatted: GameData = {};

          for (const { key } of contentMap) {
            // Handle Pokémon separately
            if (key === "pokemonOfTheDay") {
              const entry = pokemon;
              if (!entry) {
                formatted[key] = null;
                continue;
              }

              const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
              formatted[key] = {
                title: `#${entry.id} — ${capitalize(entry.name)}`,
                description:
                  `Types: ${entry.types.map(capitalize).join(", ")}<br/>` +
                  entry.stats
                    .map((s: { name: string; value: number }) => `${capitalize(s.name)}: ${s.value}`)
                    .join("<br/>"),
                image: entry.image,
                extra: "",
              };
            } else {
              const entry = games?.[key]; // Access the nested properties under `game`
              if (!entry) {
                formatted[key] = null;
                continue;
              }

              formatted[key] = {
                title: entry.name || "Untitled",
                description: `Released: ${entry.released || "Unknown"}<br/>Rating: ${entry.rating || "N/A"}`,
                image: entry.background_image,
                extra: (
                  <>
                    {entry.website && (
                      <a href={entry.website} target="_blank" rel="noopener noreferrer">
                        Visit Game Site
                      </a>
                    )}
                    {entry.store_link && (
                      <a
                        href={entry.store_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-blue-500 hover:underline"
                      >
                        Play This Game
                      </a>
                    )}
                  </>
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
      <h1 className="text-4xl font-bold mb-10">Games of the Day</h1>

      {loading ? (
        <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-7xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mt-10">Error: {error}</div>
      ) : !data ? (
        <div className="text-white text-center mt-10">No data available.</div>
      ) : (
        <>
          <section>
            <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center max-w-7xl mx-auto">
              {contentMap.slice(0, 3).map(({ key, title }) => (
                <Section key={key} title={title} content={data[key]} type={key} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-4xl font-bold mb-10 mt-20">Characters</h2>
            <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-center max-w-7xl mx-auto">
              <Section
                title={contentMap[3].title}
                content={data[contentMap[3].key]}
                type={contentMap[3].key}
              />
            </div>
          </section>

          <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
            Every day at OfTheDay.world, we feature a selection of games and Pokémon for you to discover.
            Whether you're hunting for a hidden gem or catching your favorite Pokémon, check back daily for a new surprise!
          </p>
        </>
      )}
    </main>
  );
}

function Section({ title, content, type }: { title: string; content: CardData | null; type: string }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-[#e67e22] pb-[2px]">{title}</h2>
      {content ? <DailyCard type={type} data={content} /> : <p className="text-gray-400 italic">No {type} available today.</p>}
    </section>
  );
}