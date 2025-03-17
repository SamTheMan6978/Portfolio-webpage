import { NextRequest, NextResponse } from 'next/server';
import { handleWwwRedirect } from './redirects';
import { 
  addSecurityHeaders, 
  addCacheHeaders, 
  addResourceHints 
} from './headers';
import { middlewareConfig } from './matcher';
// import { get } from '@vercel/edge-config'; // Uncomment when you set up edge config

// Export the matcher configuration
export const config = middlewareConfig;

// export const runtime = 'edge'; // Uncomment when you set up edge config

/**
 * Streamlined middleware function that delegates to specialized modules
 */
export async function middleware(request: NextRequest) {
  try {
    // 1. Handle redirects - exit early if redirect is needed
    const redirectResponse = handleWwwRedirect(request);
    if (redirectResponse) return redirectResponse;
    
    // 2. Create the response object for modification
    const response = NextResponse.next();
    const pathname = request.nextUrl.pathname;
    
    // 3. Add headers using specialized functions
    addSecurityHeaders(response);
    addCacheHeaders(response, pathname);
    addResourceHints(response, pathname);
    
    return response;
  } catch (error) {
    // Fall back gracefully in case of error
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
} 