import BlurFade from "@/components/magicui/blur-fade";
import { Particles } from "@/components/magicui/particles";
import { getNotionPosts } from "@/lib/notion";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Just a collection of ideas",
};

// Function to strip HTML tags and get plain text excerpt
function getTextExcerpt(html: string, maxLength: number = 150): string {
  // Remove HTML tags
  const textOnly = html.replace(/<[^>]*>/g, ' ');
  // Remove extra spaces
  const cleanText = textOnly.replace(/\s+/g, ' ').trim();
  // Get excerpt and add ellipsis if truncated
  return cleanText.length > maxLength 
    ? cleanText.substring(0, maxLength) + '...' 
    : cleanText;
}

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string };
}) {
  const posts = await getNotionPosts();
  
  // Extract unique tags from all posts
  const allTags = Array.from(
    new Set(
      posts
        .flatMap((post) => post.metadata.tags || [])
        .filter(Boolean)
    )
  ).sort();
  
  // Filter posts by tag if a tag is selected
  const selectedTag = searchParams.tag;
  const filteredPosts = selectedTag
    ? posts.filter((post) => 
        post.metadata.tags?.includes(selectedTag)
      )
    : posts;

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
      
      {/* Main content with cards */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 py-8">
        <div className="text-center mb-12">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tighter mb-3">
              My Blog
            </h1>
          </BlurFade>
          
          <BlurFade delay={BLUR_FADE_DELAY + 0.1}>
            <p className="text-muted-foreground text-lg">
              A collection of random thoughts.
            </p>
          </BlurFade>
          
          {/* Dynamic Tags */}
          {allTags.length > 0 && (
            <BlurFade delay={BLUR_FADE_DELAY + 0.2}>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Link 
                  href="/blog"
                  className={cn(
                    "px-3 py-1 text-sm rounded-full transition-colors",
                    !selectedTag 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  All
                </Link>
                {allTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-colors",
                      selectedTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </BlurFade>
          )}
        </div>
        
        <div className="space-y-16">
          {filteredPosts
            .sort((a, b) => {
              if (
                new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
              ) {
                return -1;
              }
              return 1;
            })
            .map((post, id) => (
              <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Date column */}
                  <div className="sm:w-1/4 text-muted-foreground text-sm">
                    {new Date(post.metadata.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  
                  {/* Content column */}
                  <div className="sm:w-3/4">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-medium tracking-tight hover:text-primary transition-colors">
                        {post.metadata.title}
                      </h2>
                    </Link>
                    
                    {/* Post tags if they exist */}
                    {post.metadata.tags && post.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 my-2">
                        {post.metadata.tags.map((tag) => (
                          <Link
                            key={`${post.slug}-${tag}`}
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="text-xs bg-muted px-2 py-0.5 rounded-full hover:bg-muted/80"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {/* Summary or content preview */}
                    <p className="text-muted-foreground mt-2">
                      {post.metadata.summary || getTextExcerpt(post.source, 150)}
                    </p>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block mt-3 text-sm text-primary hover:underline"
                    >
                      Read note →
                    </Link>
                  </div>
                </div>
              </BlurFade>
            ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found{selectedTag ? ` for tag "${selectedTag}"` : ''}.</p>
            {selectedTag && (
              <Link href="/blog" className="text-primary hover:underline block mt-4">
                View all posts
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
