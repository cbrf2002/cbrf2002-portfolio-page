import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.fmnl3-3.fna.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fmnl37-2.fna.fbcdn.net',
      },
    ],
  },
};

export default nextConfig;
