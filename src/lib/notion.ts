import { Client } from '@notionhq/client';
import { NotionConverter } from 'notion-to-md';
import { DefaultExporter } from 'notion-to-md/plugins/exporter';
import { remark } from 'remark';
import html from 'remark-html';

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

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
        
        // Set up a buffer to store the markdown content
        const buffer: Record<string, string> = {};
        
        // Create an exporter with buffer output type
        const exporter = new DefaultExporter({
          outputType: 'buffer',
          buffer
        });
        
        // Create the converter with the exporter
        const converter = new NotionConverter(notion)
          .withExporter(exporter);
        
        // Convert the page to markdown
        await converter.convert(page.id);
        
        // Get the markdown content from the buffer
        const mdContent = buffer[page.id] || '';
        
        // Convert markdown to HTML
        const processedContent = await remark()
          .use(html)
          .process(mdContent);
        const contentHtml = processedContent.toString();
        
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

    return posts;
  } catch (error) {
    console.error('Error fetching Notion posts:', error);
    return [];
  }
}

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