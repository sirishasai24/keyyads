// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dkm46q09h/image/upload/**', // Adjust this if your Cloudinary path changes significantly
      },
      {
        protocol: 'https',
        hostname: 'www.glassdoor.co.in',
        port: '',
        pathname: '/pc-app/static/img/partnerCenter/badges/**',
      }
    ],
  },
};

module.exports = nextConfig;