import DailyCard from '../components/DailyCard';

function Music() {
  return (
    <div className="music">
      <h1>Music of the Day</h1>
      
      <section className="daily-music-section">
        <h2>Song of the Day</h2>
        <DailyCard type="song" />
      </section>
      
      <section className="daily-music-section">
        <h2>Album of the Day</h2>
        <DailyCard type="album" />
      </section>
      
      <section className="daily-music-section">
        <h2>Artist of the Day</h2>
        <DailyCard type="artist" />
      </section>
    </div>
  );
}

export default Music;