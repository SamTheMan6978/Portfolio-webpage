/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NOTION_TOKEN: process.env.NOTION_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  },
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'S3.us-west-2.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Cache images for at least 60 seconds
  },
  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  
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
