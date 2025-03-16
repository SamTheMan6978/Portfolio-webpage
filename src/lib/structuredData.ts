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

export function generatePersonSchema(): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: DATA.name,
    url: DATA.url,
    sameAs: [
      DATA.contact?.social?.GitHub?.url,
      DATA.contact?.social?.LinkedIn?.url,
    ].filter(Boolean),
    description: DATA.description,
    image: `${DATA.url}${DATA.avatarUrl}`,
    email: DATA.contact?.email,
    knowsAbout: DATA.skills,
  };

  return JSON.stringify(structuredData);
}

export function generateWebSiteSchema(): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: DATA.name,
    url: DATA.url,
    description: DATA.description,
    author: {
      "@type": "Person",
      name: DATA.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${DATA.url}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return JSON.stringify(structuredData);
} 