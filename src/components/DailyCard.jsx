import React, { useState, useEffect } from 'react';
import '../css/DailyCard.css';

const DailyCard = ({ type = 'song' }) => {
  const [song, setSong] = useState(null);
  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/.netlify/functions/getSongOfTheDay')
      .then(response => {
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("API Response:", data); // Debug the full response
        
        setSong(data.song);
        setAlbum(data.album);
        setArtist(data.artist);
        
        // Debug info for each item
        console.log("Song data:", data.song);
        console.log("Album data:", data.album);
        console.log("Artist data:", data.artist);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load music data. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Handle share functionality
  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    // Determine what we're sharing based on type
    let title, text;
    switch (type) {
      case 'song':
        title = 'Song of the Day';
        text = song ? `Check out today's song: "${song.name}" by ${song.artists.map(a => a.name).join(', ')}` : '';
        break;
      case 'album':
        title = 'Album of the Day';
        text = album ? `Check out today's album: "${album.name}" by ${album.artists.map(a => a.name).join(', ')}` : '';
        break;
      case 'artist':
        title = 'Artist of the Day';
        text = artist ? `Check out today's artist: ${artist.name}` : '';
        break;
      default:
        title = 'Music of the Day';
        text = 'Check out today\'s music picks!';
    }

    try {
      // Use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url: currentUrl
        });
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(`${text} ${currentUrl}`);
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <div className="daily-card loading">Loading today's music picks...</div>;
  }

  if (error) {
    return <div className="daily-card error">{error}</div>;
  }

  // Display different content based on the type prop
  const renderContent = () => {
    switch (type) {
      case 'song':
        return song ? (
          <>
            <h3 className="card-title">{song.name}</h3>
            <div className="card-artist">by {song.artists.map(a => a.name).join(', ')}</div>
            {song.album && (
              <div className="card-album">
                <span>Album: </span>{song.album.name}
              </div>
            )}
            {song.preview_url && (
              <audio className="preview-player" controls>
                <source src={song.preview_url} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}
          </>
        ) : null;
      
      case 'album':
        return album ? (
          <>
            <h3 className="card-title">{album.name}</h3>
            <div className="card-artist">by {album.artists.map(a => a.name).join(', ')}</div>
            {album.release_date && (
              <div className="card-release">
                <span>Released: </span>{new Date(album.release_date).toLocaleDateString()}
              </div>
            )}
          </>
        ) : null;
      
      case 'artist':
        return artist ? (
          <>
            <h3 className="card-title">{artist.name}</h3>
            {artist.genres && artist.genres.length > 0 && (
              <div className="card-genres">
                <span>Genres: </span>{artist.genres.join(', ')}
              </div>
            )}
          </>
        ) : null;
      
      default:
        return <div>Unknown card type</div>;
    }
  };

  let imageUrl;
  if (type === 'song' && song?.album?.images?.[0]?.url) {
    imageUrl = song.album.images[0].url;
  } else if (type === 'album' && album?.images?.[0]?.url) {
    imageUrl = album.images[0].url;
  } else if (type === 'artist' && artist?.images?.[0]?.url) {
    imageUrl = artist.images[0].url;
  }

  return (
    <div className={`daily-card ${type}-card`}>
      {imageUrl && (
        <div className="card-image-container">
          <img src={imageUrl} alt={`${type} artwork`} className="card-image" />
        </div>
      )}
      <div className="card-content">
        {renderContent()}
      </div>
      <div className="card-footer">
        {type === 'song' && song?.external_urls?.spotify && (
          <a 
            href={song.external_urls.spotify} 
            target="_blank" 
            rel="noopener noreferrer"
            className="spotify-link"
          >
            Listen on Spotify
          </a>
        )}
        {type === 'album' && album?.external_urls?.spotify && (
          <a 
            href={album.external_urls.spotify} 
            target="_blank" 
            rel="noopener noreferrer"
            className="spotify-link"
          >
            View on Spotify
          </a>
        )}
        {type === 'artist' && artist?.external_urls?.spotify && (
          <a 
            href={artist.external_urls.spotify} 
            target="_blank" 
            rel="noopener noreferrer"
            className="spotify-link"
          >
            Follow on Spotify
          </a>
        )}
        <button 
          onClick={handleShare}
          className="share-button"
          aria-label="Share"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
          </svg>
          Share
        </button>
        {shareMessage && <div className="share-message">{shareMessage}</div>}
      </div>
    </div>
  );
};

export default DailyCard;