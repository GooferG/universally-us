/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  images: {
    // Allow webp and avif from WordPress media library
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.universallyus.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'w4n.08a.mytemp.website',
        pathname: '/**',
      },
      // Add other image hosts as needed (e.g. secure.gravatar.com for avatars)
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
