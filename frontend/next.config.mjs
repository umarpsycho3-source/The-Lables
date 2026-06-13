/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/support',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
