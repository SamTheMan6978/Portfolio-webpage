/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
  images: {
    domains: [
      // Notion domains
      'www.notion.so',
      'notion.so',
      'file.notion.so',
      'images.unsplash.com',
      'S3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'secure.notion-static.com',
      'notion-static.com',
      // Add your own domain for the proxied images
      process.env.VERCEL_URL ? `${process.env.VERCEL_URL}` : 'localhost',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
    // Alternative to domains: use remotePatterns for more flexibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.notion.so',
      },
      {
        protocol: 'https',
        hostname: '**.notion-static.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  swcMinify: true, // Use SWC minifier for faster builds
  
  // Font optimization is now part of the main config, not experimental
  optimizeFonts: true,
  
  // URL Canonicalization
  async redirects() {
    return [
      // Redirect www to non-www (permanent redirect)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.samiis.cool',
          },
        ],
        destination: 'https://samiis.cool/:path*',
        permanent: true,
      },
      // Remove trailing slashes
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
  
  // Add response headers for better caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
