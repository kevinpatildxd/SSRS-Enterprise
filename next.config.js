/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use regular img tags for Blob URLs - disable Next.js image optimization
    unoptimized: true,
  },
};

module.exports = nextConfig;
