/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['pixabay.com', 'images.pexels.com', 'i.vimeocdn.com'],
  },
};

module.exports = nextConfig;
