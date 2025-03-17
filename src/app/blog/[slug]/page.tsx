import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import { getNotionPost, getNotionPosts } from "@/lib/notion";
import { Particles } from "@/components/magicui/particles";
import { generateBlogPostStructuredData, generateBreadcrumbStructuredData } from "@/lib/structuredData";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/OptimizedImage";

// Increase revalidation time to reduce build frequency
// This provides a good balance between freshness and build performance
export const revalidate = 3600; // 1 hour instead of 30 minutes

// Generate static paths more efficiently
export async function generateStaticParams() {
  const posts = await getNotionPosts();
  // Only return the necessary slug for static generation
  return posts.map((post) => ({ 
    slug: post.slug 
  }));
}

// Uncomment this to always fetch fresh data on each request
// export const dynamic = 'force-dynamic';

// Metadata generation with caching
const metadataCache = new Map<string, Metadata>();

export async function generateMetadata(
  props: {
    params: Promise<{
      slug: string;
    }>;
  }
): Promise<Metadata | undefined> {
  const params = await props.params;
  
  // Check cache first
  const cacheKey = params.slug;
  if (metadataCache.has(cacheKey)) {
    return metadataCache.get(cacheKey);
  }
  
  let post = await getNotionPost(params.slug);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
    tags,
  } = post.metadata;
  let ogImage = image || `${DATA.url}/og?title=${encodeURIComponent(title)}`;

  const metadata: Metadata = {
    title,
    description,
    keywords: tags,
    authors: [{ name: DATA.name, url: DATA.url }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      tags,
      authors: [DATA.name],
      siteName: DATA.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: DATA.name,
    },
  };
  
  // Store in cache
  metadataCache.set(cacheKey, metadata);
  
  return metadata;
}

// Separate component for the post header details
function PostHeader({ 
  title, 
  publishedAt, 
  breadcrumbs 
}: { 
  title: string; 
  publishedAt: string; 
  breadcrumbs: { name: string; href: string }[] 
}) {
  return (
    <div className="mb-8">
            
      {/* Post Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {title}
      </h1>
      
      {/* Publication Date */}
      <time dateTime={publishedAt} className="text-muted-foreground">
        {new Date(publishedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </time>
    </div>
  );
}

// Separate component for post content that can be lazy loaded
async function PostContent({ slug }: { slug: string }) {
  const post = await getNotionPost(slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }
  
  return (
    <>
      {/* Post Tags */}
      {post.metadata.tags && post.metadata.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.metadata.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-xs bg-muted px-2 py-1 rounded-full hover:bg-muted/80"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* Main Content */}
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.source }} />
      </article>
    </>
  );
}

// Loading placeholder for post content
function PostContentLoading() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Reduced tag loading placeholders to just 2 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="bg-muted rounded-full px-2 py-1 w-36 h-6"></div>
        <div className="bg-muted rounded-full px-2 py-1 w-36 h-6"></div>
      </div>
      
      {/* Content loading placeholders - better matching the prose content */}
      <div className="h-5 bg-muted rounded w-full mb-3"></div>
      <div className="h-5 bg-muted rounded w-5/6 mb-3"></div>
      <div className="h-5 bg-muted rounded w-4/6 mb-6"></div>
      <div className="h-5 bg-muted rounded w-full mb-3"></div>
      <div className="h-5 bg-muted rounded w-full mb-3"></div>
      <div className="h-5 bg-muted rounded w-5/6 mb-3"></div>
      <div className="h-5 bg-muted rounded w-4/6 mb-3"></div>
      
      {/* Image placeholder */}
      <div className="h-48 bg-muted rounded w-full mb-6"></div>
      
      {/* More text placeholders */}
      <div className="h-5 bg-muted rounded w-full mb-3"></div>
      <div className="h-5 bg-muted rounded w-5/6 mb-3"></div>
      <div className="h-5 bg-muted rounded w-full mb-3"></div>
    </div>
  );
}

export default async function Blog(
  props: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  const params = await props.params;
  // Fetch minimal post data for the header
  // This ensures the page header loads quickly
  let post = await getNotionPost(params.slug);

  if (!post) {
    notFound();
  }

  // Define breadcrumbs for structured data and UI
  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.metadata.title, href: `/blog/${post.slug}` },
  ];

  // Generate structured data
  const structuredData = {
    article: generateBlogPostStructuredData({
      title: post.metadata.title,
      description: post.metadata.summary || '',
      publishedAt: post.metadata.publishedAt,
      updatedAt: post.metadata.publishedAt, // Use publishedAt as a fallback
      image: post.metadata.image,
      slug: post.slug, // Add required slug property
      tags: post.metadata.tags,
    }),
    breadcrumb: generateBreadcrumbStructuredData({
      items: breadcrumbs.map((crumb) => ({
        name: crumb.name,
        url: `${DATA.url}${crumb.href}`,
      }))
    }),
  };

  return (
    <>
      {/* Background particles on sides */}
      <div className="fixed left-0 top-0 bottom-0 w-1/6 z-0 pointer-events-none">
        <Particles
          className="h-full"
          quantity={50}
          staticity={50}
          ease={50}
          color="#64748b"
        />
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-1/6 z-0 pointer-events-none">
        <Particles
          className="h-full"
          quantity={50}
          staticity={50}
          ease={50}
          color="#64748b"
        />
      </div>
      
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        {/* Header loads immediately - no suspense */}
        <PostHeader 
          title={post.metadata.title} 
          publishedAt={post.metadata.publishedAt}
          breadcrumbs={breadcrumbs}
        />
        
        {/* Content loads with suspense */}
        <Suspense fallback={<PostContentLoading />}>
          <PostContent slug={params.slug} />
        </Suspense>
        
        {/* Back link */}
        <div className="mt-12 pt-6 border-t">
          <Link
            href="/blog"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </>
  );
}

