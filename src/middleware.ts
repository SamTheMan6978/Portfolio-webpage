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
    const pathname = request.nextUrl.pathname;
    
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
    
    // Add security headers to the response
    const response = NextResponse.next();
    
    // Performance optimizations
    
    // Define critical resources based on the path
    const criticalResources = [];
    
    // Always include critical CSS and fonts
    criticalResources.push(
      '/_next/static/css/app.css; rel=preload; as=style; fetchpriority=high',
      '/_next/static/css/main.css; rel=preload; as=style; fetchpriority=high'
    );
    
    // Home page specific resources
    if (pathname === '/' || pathname === '') {
      criticalResources.push(
        '/pfp.webp; rel=preload; as=image; fetchpriority=high',
        // Preload key JSON-LD structured data
        '/_next/static/chunks/structured-data.js; rel=preload; as=script; fetchpriority=high'
      );
    }
    
    // Add priority hints for main JS bundle
    criticalResources.push(
      '/_next/static/chunks/main.js; rel=preload; as=script; fetchpriority=high',
      '/_next/static/chunks/pages/_app.js; rel=preload; as=script; fetchpriority=high'
    );
    
    // Set resource hints with early hints
    response.headers.set('Link', criticalResources.join(', '));
    
    // Add priority hints header
    response.headers.set('Priority-Hints', 'on');
    
    // Security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    
    // Add cache control headers for better performance and SEO
    const maxAgeOneYear = 60 * 60 * 24 * 365; // 1 year in seconds
    
    // Add different cache policies based on file types
    if (pathname.match(/\.(css|js|woff2)$/)) {
      // Long cache for static assets
      response.headers.set('Cache-Control', `public, max-age=${maxAgeOneYear}, immutable`);
    } else if (pathname.match(/\.(jpg|jpeg|png|webp|svg|ico)$/)) {
      // Medium cache for images
      response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    } else {
      // Default cache for HTML and other documents
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    }
    
    // Content Security Policy with resource prioritization
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: *.amazonaws.com *.notion.so https://www.google-analytics.com https://*.googletagmanager.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://*.googletagmanager.com https://fonts.googleapis.com https://fonts.gstatic.com"
    );
    
    return response;
  } catch (error) {
    // If anything goes wrong, just continue without redirecting
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
} 