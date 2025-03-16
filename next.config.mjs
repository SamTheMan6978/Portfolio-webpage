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
  },
  // Performance optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  swcMinify: true, // Use SWC minifier for faster builds
  // Experimental features for performance
  experimental: {
    optimizeFonts: true,
    // Enable modern JS features with reduced bundle size
    serverActions: true,
  },
};

export default nextConfig;
