import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';
    
    // Skip processing for certain conditions
    if (!hostname || 
        hostname.includes('localhost') || 
        hostname.includes('127.0.0.1') ||
        hostname.includes('vercel.app') ||    // Skip Vercel preview URLs
        hostname.startsWith('www.')) {
      return NextResponse.next();
    }
    
    // Only process for specific domains - replace with your actual domain
    // This prevents errors on unknown/unexpected hostnames
    if (!hostname.includes('samiis.cool')) {
      return NextResponse.next();
    }
    
    // Add 'www.' to the hostname
    const wwwHostname = `www.${hostname}`;
    
    // Create the redirection URL
    return NextResponse.redirect(
      `${url.protocol}://${wwwHostname}${url.pathname}${url.search}`,
      { status: 301 }
    );
  } catch (error) {
    // If anything goes wrong, just continue without redirecting
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
}; 