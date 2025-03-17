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

// We still generate static params for all posts
export async function generateStaticParams() {
  const posts = await getNotionPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Shorter revalidation time to ensure fresh S3 links
// This will rebuild pages more frequently to get fresh image URLs
export const revalidate = 1800; // 30 minutes - shorter than S3 expiration

// Force dynamic rendering to always get fresh content
// Uncomment this to always fetch fresh data on each request
// export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
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

  return {
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
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  // Every time this page loads, it will fetch fresh data from Notion
  // This ensures we always get the latest S3 image URLs that haven't expired
  let post = await getNotionPost(params.slug);

  if (!post) {
    notFound();
  }

  // Define breadcrumbs for structured data and UI
  const breadcrumbs = [
    { name: 'Home', url: DATA.url },
    { name: 'Blog', url: `${DATA.url}/blog` },
    { name: post.metadata.title, url: `${DATA.url}/blog/${post.slug}` }
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBlogPostStructuredData({
            title: post.metadata.title,
            description: post.metadata.summary,
            publishedAt: post.metadata.publishedAt,
            image: post.metadata.image,
            slug: post.slug,
            tags: post.metadata.tags,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbStructuredData({
            items: breadcrumbs,
          }),
        }}
      />

      {/* Left side particles */}
      <div className="fixed left-0 top-0 bottom-0 w-1/6 z-0 pointer-events-none">
        <Particles
          className="h-full"
          quantity={50}
          staticity={50}
          ease={50}
          color="#64748b"
        />
      </div>
      
      {/* Right side particles */}
      <div className="fixed right-0 top-0 bottom-0 w-1/6 z-0 pointer-events-none">
        <Particles
          className="h-full"
          quantity={50}
          staticity={50}
          ease={50}
          color="#64748b"
        />
      </div>
      
      {/* Main content */}
      <section id="blog" className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image || `${DATA.url}/og?title=${encodeURIComponent(post.metadata.title)}`,
              url: `${DATA.url}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: DATA.name,
                url: DATA.url,
              },
              publisher: {
                "@type": "Person",
                name: DATA.name,
                url: DATA.url,
              },
              keywords: post.metadata.tags?.join(", ") || "",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${DATA.url}/blog/${post.slug}`,
              }
            }),
          }}
        />
        
        {/* Article header */}
        <div className="mb-10 space-y-4">
          <h1 className="font-medium text-3xl md:text-4xl tracking-tighter max-w-[650px]">
            {post.metadata.title}
          </h1>
          
          <div className="flex items-center space-x-4">
            <Suspense fallback={<div className="h-5 w-20 animate-pulse bg-muted rounded" />}>
              <p className="text-sm text-muted-foreground">
                {formatDate(post.metadata.publishedAt)}
              </p>
            </Suspense>
            
            {post.metadata.summary && (
              <p className="text-sm text-muted-foreground italic border-l border-border pl-4">
                {post.metadata.summary}
              </p>
            )}
          </div>
          
          {/* Display tags if they exist */}
          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.metadata.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  )}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Main content */}
        <article className="prose prose-slate dark:prose-invert max-w-full 
          prose-headings:font-medium 
          prose-h1:text-3xl prose-h1:font-bold
          prose-h2:text-2xl prose-h2:font-bold 
          prose-h3:text-xl prose-h3:font-semibold
          prose-a:text-primary 
          prose-img:rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: post.source }} />
        </article>
        
        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-border">
          <a href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to all posts
          </a>
        </div>
      </section>
    </>
  );
}

