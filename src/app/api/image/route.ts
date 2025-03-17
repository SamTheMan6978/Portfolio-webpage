import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to proxy Notion images and prevent expiration issues
 * Use this route with ?url= parameter to proxy any image
 * Example: /api/image?url=https://prod-files-secure.s3...
 */
export async function GET(request: NextRequest) {
  try {
    // Get the image URL from the request query parameters
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    // Return 400 if no URL is provided
    if (!imageUrl) {
      return new NextResponse('No image URL provided', { status: 400 });
    }
    
    // Fetch the image from the original source
    const imageResponse = await fetch(imageUrl, {
      headers: {
        // Prevent Vercel from caching the response at the edge
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    
    // If the fetch failed, return an error
    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`);
      return new NextResponse('Failed to fetch image', { status: 502 });
    }
    
    // Get the image data and content type
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        // Cache the image for 30 days on the client side
        'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error in image proxy:', error);
    return new NextResponse('Error processing image', { status: 500 });
  }
}

// Configure which HTTP methods are allowed for this route
export const dynamic = 'force-dynamic'; // Make sure the route is always dynamic and not cached at build time 