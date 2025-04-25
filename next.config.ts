import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['media.rawg.io', 'api.deezer.com', 'cdn.deezer.com'], // Add the required domain here
  },
};

export default nextConfig;
