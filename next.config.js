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

  // Note: Don't use output: 'standalone' on Vercel - it handles this automatically

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  // Redirects (if needed)
  async redirects() {
    return [];
  },

  // Webpack config for better error handling
  webpack: (config, { isServer }) => {
    // Handle native modules better
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_NAME: 'SSRS',
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

module.exports = nextConfig;
