import BlurFade from "@/components/magicui/blur-fade";
import { Particles } from "@/components/magicui/particles";
import { getNotionPosts } from "@/lib/notion";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = await getNotionPosts();

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
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="font-medium text-3xl mb-8 tracking-tighter text-center">Blog</h1>
        </BlurFade>
        
        <div className="grid gap-6">
          {posts
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
                <Link
                  className="block"
                  href={`/blog/${post.slug}`}
                >
                  <div className={cn(
                    "w-full p-6 rounded-lg transition-all border border-border",
                    "bg-card hover:bg-card/80 hover:shadow-md",
                    "flex flex-col space-y-2"
                  )}>
                    <h2 className="text-xl font-medium tracking-tight">{post.metadata.title}</h2>
                    {post.metadata.summary && (
                      <p className="text-muted-foreground line-clamp-2">{post.metadata.summary}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.metadata.publishedAt)}
                      </p>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              </BlurFade>
            ))}
        </div>
      </section>
    </>
  );
}
