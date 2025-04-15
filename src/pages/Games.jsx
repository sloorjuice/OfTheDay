import React, { useState, useEffect } from 'react';
import DailyCard from '../components/DailyCard';
import '../css/Games.css';

function Games() {
  const [gameOfTheDay, setGameOfTheDay] = useState(null);
  const [multiplayerGameOfTheDay, setMultiplayerGameOfTheDay] = useState(null);
  const [indieGameOfTheDay, setIndieGameOfTheDay] = useState(null); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const response = await fetch('/.netlify/functions/getGameOfTheDay');
        if (!response.ok) {
          throw new Error(`Failed to fetch games: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data); // Debugging
        setGameOfTheDay(data.gameOfTheDay);
        setMultiplayerGameOfTheDay(data.multiplayerGameOfTheDay);
        setIndieGameOfTheDay(data.indieGameOfTheDay); // Set indie game
        setError(null);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return <div className="games-loading">Loading games...</div>;
  }

  if (error) {
    return <div className="games-error">{error}</div>;
  }

  return (
    <div className="games-page">
      <h1>Games of the Day</h1>
      <div className="games-grid">
        {gameOfTheDay && (
          <section className="games-section">
            <h2>Game of the Day</h2>
            <DailyCard
              type="game"
              data={{
                title: gameOfTheDay.name,
                description: `Released: ${gameOfTheDay.released}`,
                image: gameOfTheDay.background_image,
                extra: `Rating: ${gameOfTheDay.rating}`,
              }}
            />
          </section>
        )}
        {multiplayerGameOfTheDay && (
          <section className="games-section">
            <h2>Multiplayer Game of the Day</h2>
            <DailyCard
              type="game"
              data={{
                title: multiplayerGameOfTheDay.name,
                description: `Released: ${multiplayerGameOfTheDay.released}`,
                image: multiplayerGameOfTheDay.background_image,
                extra: `Rating: ${multiplayerGameOfTheDay.rating}`,
              }}
            />
          </section>
        )}
        {indieGameOfTheDay && ( // New section for Indie Game
          <section className="games-section">
            <h2>Indie Game of the Day</h2>
            <DailyCard
              type="game"
              data={{
                title: indieGameOfTheDay.name,
                description: `Released: ${indieGameOfTheDay.released}`,
                image: indieGameOfTheDay.background_image,
                extra: `Rating: ${indieGameOfTheDay.rating}`,
              }}
            />
          </section>
        )}
      </div>
    </div>
  );
}

export default Games;