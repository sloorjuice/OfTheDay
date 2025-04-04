import DailyCard from '../components/DailyCard';
import '../css/Music.css';

function Music() {
  return (
    <div className="music-page">
      <h1>Music of the Day</h1>
      
      <div className="daily-music-grid">
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
    </div>
  );
}

export default Music;