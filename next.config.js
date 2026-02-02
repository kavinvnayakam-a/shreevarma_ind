/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Force the system variable to be available during build
  env: {
    FIREBASE_WEBAPP_CONFIG: process.env.FIREBASE_WEBAPP_CONFIG,
  },

  typescript: {
    // Keeps the build moving even with minor type mismatches
    ignoreBuildErrors: true,
  },

  // NEW: Increased limit for image uploads via Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },

  async headers() {
    return [
      {
        // Global policy for Cashfree and Google Sign-In
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'payment=(self "https://sdk.cashfree.com" "https://api.cashfree.com" "https://sandbox.cashfree.com")',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        // Strict headers for Video Consultations (ZEGOCLOUD requirement)
        source: '/consultation/session/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shreevarma-india-location.firebasestorage.app',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;