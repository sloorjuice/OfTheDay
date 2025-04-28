require('dotenv').config();
const fetch = require('node-fetch');

// Hash function for stable pseudo-randomness based on date
const hashString = (str) => {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

exports.handler = async (event) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('Missing TMDB_API_KEY environment variable');
    }

    const inputDate = event.queryStringParameters?.date;
    const today = inputDate || new Date().toISOString().split('T')[0];

    const seed = hashString(today);
    const pseudoRandom = (range, offset = 0) => (seed + offset) % range;

    // Helper to fetch movies
    const fetchMovies = async (extraParams = '') => {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc&vote_count.gte=50&language=en-US&page=1${extraParams}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);
      const data = await res.json();
      return data.results || [];
    };

    // 1. GENERAL TOP MOVIES
    const generalMovies = await fetchMovies();
    const generalMovie = generalMovies.length ? generalMovies[pseudoRandom(generalMovies.length, 10)] : null;

    // 2. ANIMATED MOVIES
    const animatedMovies = await fetchMovies('&with_genres=16'); // 16 = Animation
    const animatedMovie = animatedMovies.length ? animatedMovies[pseudoRandom(animatedMovies.length, 20)] : null;

    // 3. HORROR MOVIES
    const horrorMovies = await fetchMovies('&with_genres=27'); // 27 = Horror
    const horrorMovie = horrorMovies.length ? horrorMovies[pseudoRandom(horrorMovies.length, 30)] : null;

    return {
      statusCode: 200,
      body: JSON.stringify({
        date: today,

        movieOfTheDay: generalMovie && {
          title: generalMovie.title,
          overview: generalMovie.overview,
          releaseDate: generalMovie.release_date,
          rating: generalMovie.vote_average,
          posterUrl: generalMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${generalMovie.poster_path}`
            : null,
          tmdbUrl: `https://www.themoviedb.org/movie/${generalMovie.id}`,
        },

        animatedMovieOfTheDay: animatedMovie && {
          title: animatedMovie.title,
          overview: animatedMovie.overview,
          releaseDate: animatedMovie.release_date,
          rating: animatedMovie.vote_average,
          posterUrl: animatedMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${animatedMovie.poster_path}`
            : null,
          tmdbUrl: `https://www.themoviedb.org/movie/${animatedMovie.id}`,
        },

        horrorMovieOfTheDay: horrorMovie && {
          title: horrorMovie.title,
          overview: horrorMovie.overview,
          releaseDate: horrorMovie.release_date,
          rating: horrorMovie.vote_average,
          posterUrl: horrorMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${horrorMovie.poster_path}`
            : null,
          tmdbUrl: `https://www.themoviedb.org/movie/${horrorMovie.id}`,
        },
      }, null, 2), // Pretty print JSON
    };
  } catch (err) {
    console.error('Movie fetch failed:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
