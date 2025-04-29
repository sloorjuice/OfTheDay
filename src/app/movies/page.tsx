"use client";

import { useEffect, useState, JSX } from "react";
import DailyCard from "../../components/DailyCard";
import SkeletonCard from "../../components/SkeletonCard";

interface MovieCardData {
  title: string;
  description: string;
  image?: string;
  extra: JSX.Element;
}

interface MovieData {
  movieOfTheDay: MovieCardData | null;
  animatedMovieOfTheDay: MovieCardData | null;
  horrorMovieOfTheDay: MovieCardData | null;
}

export default function Movies() {
  const [data, setData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const idle = requestIdleCallback(() => {
      async function fetchMovies() {
        try {
          const res = await fetch("/.netlify/functions/getMovieOfTheDay");
          if (!res.ok) throw new Error("Failed to fetch movie data");
          const result = await res.json();

          interface MovieApiResponse {
            title: string;
            overview: string;
            releaseDate: string;
            rating: number;
            posterUrl?: string;
            tmdbUrl: string;
          }
          
          const transform = (movie: MovieApiResponse): MovieCardData => ({          
            title: movie.title || "Untitled",
            description: `
              Released: ${movie.releaseDate || "Unknown"}<br/>
              Rating: ${movie.rating || "N/A"}
            `,
            image: movie.posterUrl,
            extra: (
              <a
                href={movie.tmdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                View on TMDB
              </a>
            ),
          });

          setData({
            movieOfTheDay: result.movieOfTheDay ? transform(result.movieOfTheDay) : null,
            animatedMovieOfTheDay: result.animatedMovieOfTheDay ? transform(result.animatedMovieOfTheDay) : null,
            horrorMovieOfTheDay: result.horrorMovieOfTheDay ? transform(result.horrorMovieOfTheDay) : null,
          });

          setLoading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
      fetchMovies();
    });
    return () => cancelIdleCallback(idle);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
        <h1 className="text-4xl font-bold mb-10">Movies of the Day</h1>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
          Every day at OfTheDay.world, we randomly feature a fresh new movies for you to discover. Whether you&apos;re dying for a new horror movie, some awesome animated movie for the family or even just want something funny in the background, this is the place to be. Check back daily for something new!
        </p>
        <section className="mt-6 flex flex-col items-center">
          <p className="text-gray-600 mb-2">
            Explore our daily picks:
          </p>
          <ul className="flex justify-center">
            <li><a href="/music" className="text-blue-500 hover:underline mx-2">Music</a></li>
            <li><a href="/games" className="text-blue-500 hover:underline mx-2">Games</a></li>
          </ul>
        </section>
      </main>
    );
  }

  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (!data) return <div className="text-white text-center mt-10">No movie data available.</div>;

  return (
    <main className="min-h-screen px-4 sm:px-8 py-12 text-center">
      <h1 className="text-4xl font-bold mb-10">Movies of the Day</h1>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        <MovieSection title="Movie of the Day" content={data.movieOfTheDay} type="movie" />
        <MovieSection title="Animated Movie of the Day" content={data.animatedMovieOfTheDay} type="animated" />
        <MovieSection title="Horror Movie of the Day" content={data.horrorMovieOfTheDay} type="horror" />
      </div>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto pt-8">
        Every day at OfTheDay.world, we randomly feature a fresh new movies for you to discover. Whether you&apos;re dying for a new horror movie, some awesome animated movie for the family or even just want something funny in the background, this is the place to be. Check back daily for something new!
      </p>
      <section className="mt-6 flex flex-col items-center">
        <p className="text-gray-600 mb-2">
          Explore our daily picks:
        </p>
        <ul className="flex justify-center">
          <li><a href="/music" className="text-blue-500 hover:underline mx-2">Music</a></li>
          <li><a href="/games" className="text-blue-500 hover:underline mx-2">Games</a></li>
        </ul>
      </section>
    </main>
  );
}

function MovieSection({
  title,
  content,
  type,
}: {
  title: string;
  content: MovieCardData | null;
  type: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-[#9b59b6] pb-[2px]">{title}</h2>
      {content ? (
        <DailyCard type={type} data={content} />
      ) : (
        <p className="text-gray-400 italic">No {type} available today.</p>
      )}
    </section>
  );
}
