/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your system variables
  env: {
    FIREBASE_WEBAPP_CONFIG: process.env.FIREBASE_WEBAPP_CONFIG,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. Keep Server Actions (Required for your business logic)
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },

  images: {
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    
    // Aligned to your component requirements
    qualities: [75, 85, 90],

    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'shreevarma-india-location.firebasestorage.app', pathname: '/**' },
    ],
  },

  async headers() {
    return [
      {
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
};

module.exports = nextConfig;
