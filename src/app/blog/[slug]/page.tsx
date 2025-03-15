import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import { getNotionPost, getNotionPosts } from "@/lib/notion";
import { Particles } from "@/components/magicui/particles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  const posts = await getNotionPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

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
  } = post.metadata;
  let ogImage = image || `${DATA.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
  let post = await getNotionPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
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
              image: post.metadata.image || `${DATA.url}/og?title=${post.metadata.title}`,
              url: `${DATA.url}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: DATA.name,
              },
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
        </div>
        
        {/* Main content */}
        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-medium prose-a:text-primary prose-img:rounded-lg">
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
