import { EXCLUDED_PATHS } from './constants';

/**
 * Generates a matcher pattern for middleware
 * This is more efficient than a large regex
 */
export function generateMatcher(): RegExp[] {
  // Create a matcher that excludes static assets, images, favicons
  return [
    new RegExp(`^(?!.*(${EXCLUDED_PATHS.join('|')})).*$`)
  ];
}

// Export the middleware config object
export const middlewareConfig = {
  matcher: [
    // Dynamically generate the matcher from our constants
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}; 