/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['pixabay.com', 'images.pexels.com', 'i.vimeocdn.com', 'picsum.photos'],
  },
  async rewrites() {
    return [
      { source: '/voiceovers', destination: '/narrations' },
      { source: '/medias', destination: '/media' },
    ];
  },
};

module.exports = nextConfig;
