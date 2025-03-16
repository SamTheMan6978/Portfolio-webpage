import { DATA } from "@/data/resume";
import { MetadataRoute } from "next";

/**
 * This sitemap index file helps search engines discover all your sitemaps
 * and understand the structure of your site.
 */
export default function sitemapIndex(): MetadataRoute.Sitemap {
  const baseUrl = DATA.url;

  return [
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: new Date(),
    },
  ];
} 