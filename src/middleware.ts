import { NextRequest, NextResponse } from 'next/server';
// import { get } from '@vercel/edge-config'; // Uncomment when you set up edge config

// Configure edge function
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};

// export const runtime = 'edge'; // Uncomment when you set up edge config

export async function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';
    
    // WWW to non-WWW redirect
    if (hostname.startsWith('www.') && hostname.includes('samiis.cool')) {
      // Remove 'www.' from the hostname
      const nonWwwHostname = hostname.replace(/^www\./, '');
      
      // Create the redirection URL
      return NextResponse.redirect(
        `${url.protocol}://${nonWwwHostname}${url.pathname}${url.search}`,
        { status: 301 }
      );
    }
    
    // Get the pathname of the request
    const pathname = request.nextUrl.pathname;
    
    // You can use edge config to store redirects, feature flags, etc.
    // const redirects = await get('redirects');
    
    // Add security headers to the response
    const response = NextResponse.next();
    
    // Security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    // Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: *.amazonaws.com *.notion.so; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self'"
    );
    
    return response;
  } catch (error) {
    // If anything goes wrong, just continue without redirecting
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
} 