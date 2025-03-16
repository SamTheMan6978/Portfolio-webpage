import { DATA } from "@/data/resume";

interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  slug: string;
  tags?: string[];
}

export function generateBlogPostStructuredData({
  title,
  description,
  publishedAt,
  updatedAt,
  image,
  slug,
  tags,
}: BlogPostStructuredDataProps): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    image: image || `${DATA.url}/og?title=${encodeURIComponent(title)}`,
    url: `${DATA.url}/blog/${slug}`,
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
    keywords: tags?.join(", ") || "",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${DATA.url}/blog/${slug}`,
    },
  };

  return JSON.stringify(structuredData);
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function generateBreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(structuredData);
} 