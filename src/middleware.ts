import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Handle non-www to www redirects
  if (!hostname.startsWith('www.') && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
    // Add 'www.' to the hostname
    const wwwHostname = `www.${hostname}`;
    
    return NextResponse.redirect(
      `${url.protocol}://${wwwHostname}${url.pathname}${url.search}`,
      { status: 301 }
    );
  }

  return NextResponse.next();
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