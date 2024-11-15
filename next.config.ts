import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**', // Match all paths on the domain
      },
      {
        protocol: 'https',
        hostname: 'www.stockholmlgbt.com', // Add the desired hostname
        pathname: '/wp-content/uploads/**', // Match the specific path (optional)
      },
      {
        protocol: 'https',
        hostname: 'www.slsgoteborg.se', // Add the domain
        pathname: '/wp-content/uploads/**', // Match paths under this folder (optional)
      },
      {
        protocol: 'https',
        hostname: 'world-complete.com', // Add this domain
        pathname: '/wp-content/uploads/**', // Match paths under this folder (optional)
      },
      {
        protocol: 'https',
        hostname: 'jholmes.unomaha.community', // Add this domain
        pathname: '/TravelStudy/maps_files/**', // Match paths under this folder (optional)
      },
    ],
  },
};

module.exports = nextConfig;
