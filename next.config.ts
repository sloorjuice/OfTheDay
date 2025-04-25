import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  domains: [
    'media.rawg.io', 
    'api.deezer.com', 
    'cdn.deezer.com', 
    'cdn-images.dzcdn.net' // Added the required domain
  ],
};

export default nextConfig;
