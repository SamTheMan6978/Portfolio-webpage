/**
 * Utility functions to handle Notion image URL transformation
 * This helps with expiring S3 signed URLs from Notion
 */

// List of known Notion image domains that should be proxied
const NOTION_IMAGE_DOMAINS = [
  'prod-files-secure.s3.us-west-2.amazonaws.com',
  's3.us-west-2.amazonaws.com',
  'secure.notion-static.com',
  'file.notion.so'
];

/**
 * Transforms a Notion image URL to use our proxy
 * @param originalUrl Original image URL from Notion
 * @returns Proxied URL that won't expire
 */
export function proxyNotionImage(originalUrl: string): string {
  if (!originalUrl) return originalUrl;
  
  // Check if the URL is from a Notion domain we should proxy
  const shouldProxy = NOTION_IMAGE_DOMAINS.some(domain => 
    originalUrl.includes(domain)
  );
  
  if (shouldProxy) {
    // URL encode the original URL to be safe as a query parameter
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/image?url=${encodedUrl}`;
  }
  
  // If it's not a Notion domain, return the original URL
  return originalUrl;
}

/**
 * Transform all Notion image URLs in HTML content to use our proxy
 * @param htmlContent HTML content containing Notion image URLs
 * @returns HTML with transformed image URLs
 */
export function transformNotionHtmlContent(htmlContent: string): string {
  if (!htmlContent) return htmlContent;
  
  // Use regex to find image URLs and replace them
  // This pattern looks for image URLs in various contexts (src, srcset, etc.)
  return htmlContent.replace(
    /(https:\/\/[^"'\s]*?(?:prod-files-secure\.s3\.us-west-2\.amazonaws\.com|s3\.us-west-2\.amazonaws\.com|secure\.notion-static\.com|file\.notion\.so)[^"'\s]*)/g,
    (match) => proxyNotionImage(match)
  );
}

/**
 * Process Notion API response data to proxy all image URLs
 * @param notionData Data object from Notion API
 * @returns Data with all image URLs proxied
 */
export function proxyNotionApiImages(notionData: any): any {
  if (!notionData) return notionData;
  
  // If it's a string that looks like a URL, check and proxy it
  if (typeof notionData === 'string' && notionData.startsWith('http')) {
    return proxyNotionImage(notionData);
  }
  
  // If it's an array, process each item
  if (Array.isArray(notionData)) {
    return notionData.map(item => proxyNotionApiImages(item));
  }
  
  // If it's an object, process each property
  if (typeof notionData === 'object') {
    const result = { ...notionData };
    for (const key in result) {
      result[key] = proxyNotionApiImages(result[key]);
    }
    return result;
  }
  
  // Return anything else unchanged
  return notionData;
} 