/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    // Disable image optimization for local files during development
    unoptimized: process.env.NODE_ENV === 'development',
    // Allow images from these domains (add future CDNs here)
    remotePatterns: [],
    // Supported image formats
    formats: ['image/webp', 'image/avif'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different viewports
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable experimental features if needed
  experimental: {
    // serverActions: true, // For future form actions
  },

  // Output mode (standalone for easy deployment)
  output: 'standalone',
}

module.exports = nextConfig
