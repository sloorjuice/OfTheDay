import { useEffect, useState } from 'react';
import DailyCard from '../components/DailyCard';
import '../css/Music.css';

function Music() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/.netlify/functions/getSongOfTheDay');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

        // Transform data to match DailyCard's expected structure
        const transformedData = {
          songOfTheDay: result.songOfTheDay
            ? {
                title: result.songOfTheDay.name,
                description: `By: ${result.songOfTheDay.artist}`,
                image: result.songOfTheDay.album.images[0]?.url,
                extra: <a href={result.songOfTheDay.url} target="_blank" rel="noopener noreferrer">Listen on Spotify</a>,
              }
            : null,
          albumOfTheDay: result.albumOfTheDay
            ? {
                title: result.albumOfTheDay.name,
                description: `By: ${result.albumOfTheDay.artist}`,
                image: result.albumOfTheDay.images[0]?.url,
                extra: <a href={result.albumOfTheDay.url} target="_blank" rel="noopener noreferrer">View on Spotify</a>,
              }
            : null,
          artistOfTheDay: result.artistOfTheDay
            ? {
                title: result.artistOfTheDay.name,
                description: 'Artist of the Day',
                image: result.artistOfTheDay.images[0]?.url,
                extra: <a href={result.artistOfTheDay.url} target="_blank" rel="noopener noreferrer">View on Spotify</a>,
              }
            : null,
        };

        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div className="music-page">Loading...</div>;
  }

  if (error) {
    return <div className="music-page">Error: {error}</div>;
  }

  return (
    <div className="music-page">
      <h1>Music of the Day</h1>
      
      <div className="daily-music-grid">
        <section className="daily-music-section">
          <h2>Song of the Day</h2>
          <DailyCard type="song" data={data.songOfTheDay} />
        </section>
        
        <section className="daily-music-section">
          <h2>Album of the Day</h2>
          <DailyCard type="album" data={data.albumOfTheDay} />
        </section>
        
        <section className="daily-music-section">
          <h2>Artist of the Day</h2>
          <DailyCard type="artist" data={data.artistOfTheDay} />
        </section>
      </div>
    </div>
  );
}

export default Music;