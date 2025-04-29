// File: /netlify/functions/getTvOfTheDay.js

const fetch = require('node-fetch');

// Hash function for stable daily pseudo-randomness
const hashString = (str) => {
  let hash = 53019283;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

exports.handler = async (event) => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) throw new Error('Missing TMDB_API_KEY environment variable');

    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0];

    const seed = hashString(today);
    const pseudoRandom = (range, offset = 0) => (seed + offset) % range;

    // Fetch TV Shows
    const fetchTvShows = async (extraParams = '') => {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&language=en-US&page=1${extraParams}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch TV shows: ${res.status}`);
      const data = await res.json();
      return data.results || [];
    };

    // Fetch Anime
    const fetchAnime = async () => {
      const res = await fetch(`https://api.jikan.moe/v4/anime?order_by=popularity&sort=desc&page=1`);
      if (!res.ok) throw new Error(`Failed to fetch anime: ${res.status}`);
      const data = await res.json();
      return data.data || [];
    };

    // Fetch Dramas
    const fetchDramas = async () => {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=18&sort_by=vote_count.desc&language=en-US&page=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch dramas: ${res.status}`);
      const data = await res.json();
      return data.results || [];
    };

    // Fetch Comedies
    const fetchComedies = async () => {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=35&sort_by=vote_count.desc&language=en-US&page=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch comedies: ${res.status}`);
      const data = await res.json();
      return data.results || [];
    };

    const [tvShows, animes, dramas, comedies] = await Promise.all([
      fetchTvShows(),
      fetchAnime(),
      fetchDramas(),
      fetchComedies(),
    ]);

    const tvShow = tvShows.length ? tvShows[pseudoRandom(tvShows.length, 5)] : null;
    const anime = animes.length ? animes[pseudoRandom(animes.length, 15)] : null;
    const drama = dramas.length ? dramas[pseudoRandom(dramas.length, 35)] : null;
    const comedy = comedies.length ? comedies[pseudoRandom(comedies.length, 45)] : null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        date: today,

        tvShowOfTheDay: tvShow && {
          title: tvShow.name,
          overview: tvShow.overview,
          firstAirDate: tvShow.first_air_date,
          rating: tvShow.vote_average,
          posterUrl: tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : null,
          tmdbUrl: `https://www.themoviedb.org/tv/${tvShow.id}`,
        },

        animeOfTheDay: anime && {
          title: anime.title,
          synopsis: anime.synopsis,
          startDate: anime.aired.from,
          rating: anime.score,
          imageUrl: anime.images?.jpg?.large_image_url || null,
          malUrl: anime.url,
        },

        dramaOfTheDay: drama && {
          title: drama.name,
          overview: drama.overview,
          firstAirDate: drama.first_air_date,
          rating: drama.vote_average,
          posterUrl: drama.poster_path ? `https://image.tmdb.org/t/p/w500${drama.poster_path}` : null,
          tmdbUrl: `https://www.themoviedb.org/tv/${drama.id}`,
        },

        comedyOfTheDay: comedy && {
          title: comedy.name,
          overview: comedy.overview,
          firstAirDate: comedy.first_air_date,
          rating: comedy.vote_average,
          posterUrl: comedy.poster_path ? `https://image.tmdb.org/t/p/w500${comedy.poster_path}` : null,
          tmdbUrl: `https://www.themoviedb.org/tv/${comedy.id}`,
        },

      }, null, 2),
    };
  } catch (error) {
    console.error('TV fetch failed:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};