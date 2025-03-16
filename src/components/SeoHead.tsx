import { DATA } from '@/data/resume';
import { Metadata } from 'next';

interface SeoMetadataProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  keywords?: string[];
}

export function generateSeoMetadata({
  title,
  description = DATA.description,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  keywords = [],
}: SeoMetadataProps): Metadata {
  // Generate the page title
  const pageTitle = title 
    ? `${title} | ${DATA.name}` 
    : DATA.name;
    
  // Generate the canonical URL
  const canonical = canonicalUrl || `${DATA.url}${title ? '/blog' : ''}`;
  
  // Default OG image if none provided
  const ogImageUrl = ogImage || `${DATA.url}/og?title=${encodeURIComponent(pageTitle)}`;
  
  return {
    title: pageTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: DATA.name,
      type: ogType,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    metadataBase: new URL(DATA.url),
  };
} 