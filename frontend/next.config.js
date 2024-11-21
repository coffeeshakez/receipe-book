/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5176/api',
    API_URL: process.env.API_URL || 'http://localhost:5176/api',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5176/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
