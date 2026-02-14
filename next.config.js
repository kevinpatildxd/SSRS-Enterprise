/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    // Disable image optimization for local files
    // Vercel Blob URLs work directly without optimization
    unoptimized: true,
    // Allow images from Vercel Blob Storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    // Supported image formats
    formats: ['image/webp', 'image/avif'],
  },

  // Enable experimental features if needed
  experimental: {
    // serverActions: true, // For future form actions
  },

  // Output mode (standalone for easy deployment)
  output: 'standalone',
}

module.exports = nextConfig
