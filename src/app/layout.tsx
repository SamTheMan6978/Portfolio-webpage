import Navbar from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { generatePersonSchema, generateWebSiteSchema } from "@/lib/structuredData";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import Script from "next/script";
import { CriticalCSS } from "@/components/critical-css";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: `${DATA.name} | Cyber Security Specialist & Developer`,
    template: `%s | ${DATA.name} - Cyber Security Portfolio`,
  },
  description: `${DATA.description} Featuring projects and expertise in cybersecurity, web development, and software engineering.`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${DATA.name} | Cyber Security & Development Portfolio`,
    description: `${DATA.description} Featuring projects and expertise in cybersecurity, web development, and software engineering.`,
    url: DATA.url,
    siteName: `${DATA.name} - Personal Portfolio`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name} | Cyber Security Portfolio`,
    card: "summary_large_image",
    description: `${DATA.description} Specializing in cybersecurity, information security and web development.`,
  },
  keywords: [
    "Cyber Security", 
    "Web Development", 
    "Full Stack Developer", 
    "React", 
    "TypeScript", 
    "Information Security", 
    "Portfolio", 
    `${DATA.name}`, 
    "Software Engineer",
    "CISO"
  ],
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <CriticalCSS />
        
        {/* Resource hints for external domains */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Add browser hint for faster connections */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generatePersonSchema() }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: generateWebSiteSchema() }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/pfp.jpg" as="image" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider delayDuration={0}>
            <ScrollProgress />
            {children}
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtag/js"
          strategy="lazyOnload"
          id="gtag-script"
        />
        <Script
          id="gtag-init"
          strategy="lazyOnload"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
