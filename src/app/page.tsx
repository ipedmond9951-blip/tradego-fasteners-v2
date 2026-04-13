import { Metadata } from 'next';
import Script from 'next/script';
import FAQSection from '@/components/FAQSection';
import ProductGrid from '@/components/ProductGrid';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';

// 生成完整的SEO Schema标记
const generateSEOData = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://tradego-fasteners.vercel.app/#organization",
        "name": "TradeGo Fasteners",
        "url": "https://tradego-fasteners.vercel.app",
        "logo": "https://tradego-fasteners.vercel.app/logo.png",
        "description": "Leading manufacturer of drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Industrial Zone",
          "addressLocality": "Shanghai",
          "addressRegion": "Shanghai",
          "postalCode": "200000",
          "addressCountry": "CN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+86-21-1234-5678",
          "contactType": "sales",
          "email": "sales@tradegofasteners.com"
        },
        "sameAs": [
          "https://www.linkedin.com/company/tradego-fasteners",
          "https://twitter.com/tradegofasteners"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://tradego-fasteners.vercel.app/#website",
        "url": "https://tradego-fasteners.vercel.app",
        "name": "TradeGo Fasteners",
        "description": "Leading manufacturer of high-quality fasteners including drywall screws, self-drilling screws, bolts, nuts, and IBR nails",
        "publisher": {
          "@id": "https://tradego-fasteners.vercel.app/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://tradego-fasteners.vercel.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://tradego-fasteners.vercel.app/#webpage",
        "url": "https://tradego-fasteners.vercel.app",
        "name": "TradeGo Fasteners - Leading Fastener Manufacturer",
        "description": "TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified.",
        "isPartOf": {
          "@id": "https://tradego-fasteners.vercel.app/#website"
        },
        "about": {
          "@id": "https://tradego-fasteners.vercel.app/#organization"
        },
        "datePublished": "2024-01-01",
        "dateModified": "2024-04-09",
        "inLanguage": "en",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://tradego-fasteners.vercel.app"
            }
          ]
        }
      }
    ]
  };
};

export const metadata: Metadata = {
  title: "TradeGo Fasteners | Leading Fastener Manufacturer",
  description: "TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified, global delivery.",
  keywords: "fastener manufacturer, drywall screws, self-drilling screws, bolts, nuts, IBR nails, wholesale fasteners, ISO 9001 certified",
  authors: ["TradeGo Engineering Team"],
  creator: "TradeGo Engineering Team",
  publisher: "TradeGo Fasteners",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tradego-fasteners.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TradeGo Fasteners | Leading Fastener Manufacturer",
    description: "Leading manufacturer of drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified.",
    url: 'https://tradego-fasteners.vercel.app',
    siteName: 'TradeGo Fasteners',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TradeGo Fasteners - Leading Fastener Manufacturer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TradeGo Fasteners | Leading Fastener Manufacturer",
    description: "Leading manufacturer of drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <>
      {/* 注入SEO Schema标记 */}
      <Script
        id="seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSEOData())
        }}
      />
      
      <main className="min-h-screen bg-white">
        <HeroSection />
        <AboutSection />
        <ProductGrid />
        <FAQSection />
      </main>
    </>
  );
}