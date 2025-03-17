import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles WWW to non-WWW redirects
 * @returns NextResponse with redirect if needed, null otherwise
 */
export function handleWwwRedirect(request: NextRequest): NextResponse | null {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Optimize by checking if www. is present before doing domain-specific check
  if (hostname.startsWith('www.')) {
    // Domain-specific check to avoid over-processing
    if (hostname.includes('samiis.cool')) {
      // Remove 'www.' from the hostname
      const nonWwwHostname = hostname.replace(/^www\./, '');
      
      // Create the redirection URL
      return NextResponse.redirect(
        `${url.protocol}://${nonWwwHostname}${url.pathname}${url.search}`,
        { status: 301 }
      );
    }
  }
  
  return null;
} 