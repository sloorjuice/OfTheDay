import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['media.rawg.io', 'api.deezer.com', 'cdn.deezer.com', 'cdn-images.dzcdn.net', "image.tmdb.org", "cdn.myanimelist.net"], // Add the required domain here
  },
};

export default nextConfig;