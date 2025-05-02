"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

interface GameCardData {
  title: string;
  description: string;
  image?: string;
  extra: JSX.Element | string;
}

interface PokemonData {
  title: string;
  description: string;
  image: string;
  extra: JSX.Element | string;
}

interface GameData {
  gameOfTheDay: GameCardData | null;
  multiplayerGameOfTheDay: GameCardData | null;
  indieGameOfTheDay: GameCardData | null;
  pokemonOfTheDay: PokemonData | null;
}

export default function Games() {
  const [data, setData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      async function fetchGamesAndPokemon() {
        try {
          const [gamesRes, pokemonRes] = await Promise.all([
            fetch("/.netlify/functions/getGameOfTheDay"),
            fetch("/.netlify/functions/getPokemonOfTheDay"),
          ]);

          if (!gamesRes.ok) throw new Error("Failed to fetch game data");
          if (!pokemonRes.ok) throw new Error("Failed to fetch Pokémon data");

          const gamesResult = await gamesRes.json();
          const pokemon = await pokemonRes.json();

          const transform = (game: any): GameCardData => ({
            title: game.name || "Untitled",
            description: `Released: ${game.released || "Unknown"}<br/>Rating: ${game.rating || "N/A"}`,
            image: game.background_image,
            extra: (
              <>
                {game.website ? (
                  <a href={game.website} target="_blank" rel="noopener noreferrer">
                    Visit Game Site
                  </a>
                ) : (
                  "No site available"
                )}
                {game.store_link && (
                  <a
                    href={game.store_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-500 hover:underline"
                  >
                    Play This Game
                  </a>
                )}
              </>
            ),
          });

            const pokemonData: PokemonData = {
            title: `#${pokemon.id} — ${pokemon.name}`,
            description: `Types: ${pokemon.types.join(", ")}<br/>` +
              pokemon.stats.map((s: { name: string; value: number }) => `${s.name}: ${s.value}`).join("<br/>"),
            image: pokemon.image,
            extra: "",
            };

          setData({
            gameOfTheDay: gamesResult.gameOfTheDay ? transform(gamesResult.gameOfTheDay) : null,
            multiplayerGameOfTheDay: gamesResult.multiplayerGameOfTheDay ? transform(gamesResult.multiplayerGameOfTheDay) : null,
            indieGameOfTheDay: gamesResult.indieGameOfTheDay ? transform(gamesResult.indieGameOfTheDay) : null,
            pokemonOfTheDay: pokemonData,
          });

          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
      fetchGamesAndPokemon();
    });
    return () => cancelIdleCallback(idle);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
        <h1 className="text-4xl font-bold mb-10">Games of the Day</h1>
        <div className="grid gap-10 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-7xl mx-auto">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    );
  }

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!data) return <div className="text-white text-center mt-10">No data available.</div>;

  return (
    <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
      <h1 className="text-4xl font-bold mb-10">Games of the Day</h1>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        <GameSection title="Game of the Day" content={data.gameOfTheDay} type="game" />
        <GameSection title="Multiplayer Pick" content={data.multiplayerGameOfTheDay} type="multiplayer" />
        <GameSection title="Indie Highlight" content={data.indieGameOfTheDay} type="indie" />
        <GameSection title="Pokémon of the Day" content={data.pokemonOfTheDay} type="pokemon" />
      </div>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
        Every day at OfTheDay.world, we feature a selection of games and Pokémon for you to discover.
        Whether you&apos;re hunting for a hidden gem or catching your favorite Pokémon, check back daily for a new surprise!
      </p>
    </main>
  );
}

function GameSection({
  title,
  content,
  type,
}: {
  title: string;
  content: GameCardData | PokemonData | null;
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
