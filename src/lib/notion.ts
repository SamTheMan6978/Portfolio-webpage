import { Client } from '@notionhq/client';
import { NotionConverter } from 'notion-to-md';
import { DefaultExporter } from 'notion-to-md/plugins/exporter';
import { remark } from 'remark';
import html from 'remark-html';

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Simple in-memory cache with expiration
interface CacheEntry<T> {
  data: T;
  expires: number;
}

class SimpleCache {
  private cache: Record<string, CacheEntry<any>> = {};
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default

  get<T>(key: string): T | null {
    const entry = this.cache[key];
    if (!entry) return null;
    
    if (Date.now() > entry.expires) {
      // Cache expired
      delete this.cache[key];
      return null;
    }
    
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache[key] = {
      data,
      expires: Date.now() + ttl
    };
  }

  clear(): void {
    this.cache = {};
  }
}

const notionCache = new SimpleCache();

export interface NotionPost {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  lastEditedAt: string;
  summary: string;
  coverImage?: string;
  content: string;
  tags?: string[];
}

// Helper function to ensure database ID is in the correct format
function formatDatabaseId(id: string): string {
  // If the ID doesn't contain hyphens, add them in the right places
  if (!id.includes('-')) {
    // Format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
  }
  return id;
}

// Helper function to handle dates, preventing future dates
function handlePublishedDate(dateStr: string): string {
  // Parse the date
  const date = new Date(dateStr);
  
  // If the date is in the future, use current date instead
  if (date > new Date()) {
    return new Date().toISOString();
  }
  
  // Return ISO format for consistent parsing
  return date.toISOString();
}

/**
 * Fetch Notion posts with intelligent caching
 * Uses a short cache TTL to balance performance with getting fresh image URLs
 */
export async function getNotionPosts(): Promise<{
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    tags?: string[];
  };
  source: string;
}[]> {
  try {
    // Generate a cache key
    const cacheKey = 'notion_posts';
    
    // Check cache first with proper typing
    const cachedData = notionCache.get<{
      slug: string;
      metadata: {
        title: string;
        publishedAt: string;
        summary: string;
        image?: string;
        tags?: string[];
      };
      source: string;
    }[]>(cacheKey);
    
    if (cachedData) {
      console.log('[Notion] Using cached posts data');
      return cachedData;
    }
    
    console.log('[Notion] Fetching fresh posts data from API');
    
    // Replace with your database ID and ensure correct format
    const databaseId = formatDatabaseId(process.env.NOTION_DATABASE_ID as string);
    
    // Query the database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    if (response.results.length === 0) {
      return [];
    }

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        // Get page properties with careful null checking
        let title = 'Untitled';
        let slug = page.id;
        let date = page.created_time;
        let summary = '';
        
        try {
          
          // Check for title in various properties
          if (page.properties?.Title?.title?.[0]?.plain_text) {
            title = page.properties.Title.title[0].plain_text;
          } else if (page.properties?.Name?.title?.[0]?.plain_text) {
            title = page.properties.Name.title[0].plain_text;
          } else {
            // Try to find any property with a title array
            const propertyNames = Object.keys(page.properties || {});
            for (const propName of propertyNames) {
              const prop = page.properties[propName];
              if (prop?.type === 'title' && prop?.title?.[0]?.plain_text) {
                title = prop.title[0].plain_text;
                break;
              }
            }
          }
          
          if (page.properties?.Slug?.rich_text?.[0]?.plain_text) {
            slug = page.properties.Slug.rich_text[0].plain_text;
          }
          
          if (page.properties?.Date?.date?.start) {
            date = page.properties.Date.date.start;
          }
          
          if (page.properties?.Summary?.rich_text?.[0]?.plain_text) {
            summary = page.properties.Summary.rich_text[0].plain_text;
          }
        } catch (err) {
          console.error('Error extracting properties from page:', err);
        }
        
        // Create individual cache key for this page's content
        const pageContentCacheKey = `notion_page_${page.id}`;
        let contentHtml = notionCache.get<string>(pageContentCacheKey);
        
        if (!contentHtml) {
          // Set up a buffer to store the markdown content
          const buffer: Record<string, string> = {};
          
          // Create an exporter with buffer output type
          const exporter = new DefaultExporter({
            outputType: 'buffer',
            buffer
          });
          
          // Create the NotionConverter with proper v4 API
          const converter = new NotionConverter(notion);
          
          // Add exporter
          converter.withExporter(exporter);
          
          // Convert the page to markdown
          await converter.convert(page.id);
          
          // Get the markdown content from the buffer
          const mdContent = buffer[page.id] || '';
          
          // Convert markdown to HTML
          const processedContent = await remark()
            .use(html)
            .process(mdContent);
          contentHtml = processedContent.toString();
          
          // Cache the page content with a longer TTL (10 minutes)
          notionCache.set(pageContentCacheKey, contentHtml, 10 * 60 * 1000);
        }
        
        // Get cover image if exists
        let coverImage;
        if (page.cover) {
          if (page.cover.type === 'external') {
            coverImage = page.cover.external.url;
          } else if (page.cover.type === 'file') {
            coverImage = page.cover.file.url;
          }
        }

        // Extract tags if they exist
        let tags: string[] = [];
        try {
          if (page.properties?.Tags?.multi_select) {
            tags = page.properties.Tags.multi_select.map((tag: any) => tag.name);
          }
        } catch (err) {
          console.error('Error extracting tags from page:', err);
        }

        return {
          slug,
          metadata: {
            title,
            publishedAt: handlePublishedDate(date),
            summary,
            image: coverImage,
            tags,
          },
          source: contentHtml,
        };
      })
    );
    
    // Cache the posts list with a short TTL (5 minutes)
    notionCache.set(cacheKey, posts, 5 * 60 * 1000);

    return posts;
  } catch (error) {
    console.error('Error fetching Notion posts:', error);
    return [];
  }
}

/**
 * Get a specific post by slug
 * Uses the cached posts list if available
 */
export async function getNotionPost(slug: string): Promise<{
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
    tags?: string[];
  };
  slug: string;
  source: string;
} | null> {
  try {
    const posts = await getNotionPosts();
    const post = posts.find((post) => post.slug === slug);
    
    if (!post) {
      return null;
    }
    
    return post;
  } catch (error) {
    console.error('Error fetching Notion post:', error);
    return null;
  }
} 