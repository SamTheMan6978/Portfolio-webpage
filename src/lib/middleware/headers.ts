import { NextResponse } from 'next/server';
import { 
  SECURITY_HEADERS, 
  CSP_POLICY, 
  CACHE_DURATION, 
  GLOBAL_CRITICAL_RESOURCES,
  PAGE_SPECIFIC_RESOURCES
} from './constants';

/**
 * Adds security headers to a response
 */
export function addSecurityHeaders(response: NextResponse): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CSP separately as it's more complex
  response.headers.set('Content-Security-Policy', CSP_POLICY);
}

/**
 * Adds cache control headers based on the file type
 */
export function addCacheHeaders(response: NextResponse, pathname: string): void {
  if (pathname.match(/\.(css|js|woff2)$/)) {
    // Long cache for static assets
    response.headers.set(
      'Cache-Control', 
      `public, max-age=${CACHE_DURATION.ONE_YEAR}, immutable`
    );
  } else if (pathname.match(/\.(jpg|jpeg|png|webp|svg|ico)$/)) {
    // Medium cache for images
    response.headers.set(
      'Cache-Control', 
      `public, max-age=${CACHE_DURATION.ONE_DAY}, stale-while-revalidate=${CACHE_DURATION.ONE_WEEK}`
    );
  } else {
    // Default cache for HTML and other documents
    response.headers.set(
      'Cache-Control', 
      `public, max-age=${CACHE_DURATION.ONE_HOUR}, s-maxage=${CACHE_DURATION.ONE_DAY}, stale-while-revalidate=${CACHE_DURATION.ONE_WEEK}`
    );
  }
}

/**
 * Adds resource hints for critical assets
 */
export function addResourceHints(response: NextResponse, pathname: string): void {
  const criticalResources = [...GLOBAL_CRITICAL_RESOURCES];
  
  // Add page-specific resources
  if (pathname === '/' || pathname === '') {
    criticalResources.push(...PAGE_SPECIFIC_RESOURCES.home);
  }
  
  // Set resource hints
  response.headers.set('Link', criticalResources.join(', '));
} 