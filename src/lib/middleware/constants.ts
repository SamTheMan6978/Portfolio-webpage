// Security headers that remain constant
export const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Priority-Hints': 'on'
};

// Cache control constants
export const CACHE_DURATION = {
  ONE_YEAR: 60 * 60 * 24 * 365,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
  ONE_HOUR: 3600
};

// Content Security Policy
export const CSP_POLICY = "default-src 'self'; " +
  "img-src 'self' data: *.amazonaws.com *.notion.so https://www.google-analytics.com https://*.googletagmanager.com; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://www.google-analytics.com; " +
  "style-src 'self' 'unsafe-inline'; " +
  "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; " +
  "connect-src 'self' https://www.google-analytics.com https://*.googletagmanager.com https://fonts.googleapis.com https://fonts.gstatic.com";

// Global critical resources that should be preloaded for all pages
export const GLOBAL_CRITICAL_RESOURCES = [
  '/_next/static/css/app.css; rel=preload; as=style; fetchpriority=high',
  '/_next/static/css/main.css; rel=preload; as=style; fetchpriority=high',
  '/_next/static/chunks/main.js; rel=preload; as=script; fetchpriority=high',
  '/_next/static/chunks/pages/_app.js; rel=preload; as=script; fetchpriority=high'
];

// Page-specific critical resources
export const PAGE_SPECIFIC_RESOURCES = {
  home: [
    '/pfp.webp; rel=preload; as=image; fetchpriority=high',
    '/_next/static/chunks/structured-data.js; rel=preload; as=script; fetchpriority=high'
  ]
};

// URL paths that should be excluded from middleware processing
export const EXCLUDED_PATHS = [
  '_next/static',
  '_next/image',
  'favicon.ico',
  '.png',
  '.jpg',
  '.svg'
]; 