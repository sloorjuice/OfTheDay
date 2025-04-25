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
  songOfTheDay: CardData | null;
  albumOfTheDay: CardData | null;
  artistOfTheDay: CardData | null;
}

function Music() {
  const [data, setData] = useState<MusicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      async function fetchData() {
        try {
          const response = await fetch('/.netlify/functions/getSongOfTheDay');
          if (!response.ok) throw new Error('Failed to fetch data');
          const result = await response.json();

          const transformedData: MusicData = {
            songOfTheDay: result.songOfTheDay && {
              title: result.songOfTheDay.name,
              description: `By: ${result.songOfTheDay.artist}`,
              image: result.songOfTheDay.album.images[0]?.url,
              extra: <a href={result.songOfTheDay.url} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>,
            },
            albumOfTheDay: result.albumOfTheDay && {
              title: result.albumOfTheDay.name,
              description: `By: ${result.albumOfTheDay.artist}`,
              image: result.albumOfTheDay.images[0]?.url,
              extra: <a href={result.albumOfTheDay.url} target="_blank" rel="noopener noreferrer">View on Spotify</a>,
            },
            artistOfTheDay: result.artistOfTheDay && {
              title: result.artistOfTheDay.name,
              description: 'Artist of the Day',
              image: result.artistOfTheDay.images[0]?.url,
              extra: <a href={result.artistOfTheDay.url} target="_blank" rel="noopener noreferrer">View on Spotify</a>,
            },
          };

          setData(transformedData);
          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          setLoading(false);
        }
      }
      fetchData();
    });
    return () => cancelIdleCallback(idle);
  }, []);

  if (loading) {
    return (
      <main className="bg-black min-h-screen px-4 sm:px-8 py-12 text-center text-white">
        <h1 className="text-4xl font-bold mb-10">Music of the Day</h1>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
    );
  }

  if (error) return <div className="music-page">Error: {error}</div>;
  if (!data) return <div className="music-page">No data available.</div>;

  return (
    <main className="bg-black min-h-screen px-4 sm:px-8 py-12 text-center text-white">
      <h1 className="text-4xl font-bold mb-10">Music of the Day</h1>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <Section title="Song of the Day" content={data.songOfTheDay} type="song" />
        <Section title="Album of the Day" content={data.albumOfTheDay} type="album" />
        <Section title="Artist of the Day" content={data.artistOfTheDay} type="artist" />
      </div>
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