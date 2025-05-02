import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['media.rawg.io', 'api.deezer.com', 'cdn.deezer.com', 'cdn-images.dzcdn.net', "image.tmdb.org", "cdn.myanimelist.net", "books.google.com", "raw.githubusercontent.com"], // Add the required domain here
  },
};

export default nextConfig;