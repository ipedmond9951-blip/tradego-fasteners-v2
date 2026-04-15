import { Metadata } from 'next';
import Script from 'next/script';
import FAQSection from '@/components/FAQSection';
import ProductGrid from '@/components/ProductGrid';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';

// 生成完整的SEO Schema标记（GEO增强版）
const BASE_URL = 'https://tradego-fasteners-h3wb.vercel.app';

const generateSEOData = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization + Author/Expert（E-E-A-T核心信号）
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "TradeGo Fasteners",
        "url": BASE_URL,
        "logo": `${BASE_URL}/logo.png`,
        "description": "Leading manufacturer of drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001:2015 certified.",
        "foundingDate": "2004",
        "numberOfEmployees": { "@type": "QuantitativeValue", "minValue": 100, "maxValue": 200 },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Industrial Zone",
          "addressLocality": "Shanghai",
          "addressRegion": "Shanghai",
          "postalCode": "200000",
          "addressCountry": "CN"
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+86-135-6265-9951",
            "contactType": "sales",
            "email": "aimingtrade@hotmail.com",
            "availableLanguage": ["English", "Chinese"]
          }
        ],
        "sameAs": [
          "https://www.linkedin.com/company/tradego-fasteners",
          "https://twitter.com/tradegofasteners"
        ],
        "hasCredential": {
          "@type": "EducationalOccupationalCredential",
          "credentialCategory": "certification",
          "name": "ISO 9001:2015",
          "recognizedBy": { "@type": "Organization", "name": "International Organization for Standardization" }
        }
      },
      // 2. Expert/Author Profile（AI引用的关键信任信号）
      {
        "@type": "Person",
        "@id": `${BASE_URL}/#expert-zhang`,
        "name": "Zhang Ming",
        "jobTitle": "Chief Engineer",
        "worksFor": { "@id": `${BASE_URL}/#organization` },
        "knowsAbout": ["Fastener Manufacturing", "Drywall Screws", "Self-Drilling Screws", "Bolt Manufacturing", "Quality Control", "ISO Standards"],
        "description": "20+ years of expertise in fastener manufacturing, specializing in drywall screws and self-drilling screws for construction and industrial applications."
      },
      // 3. WebSite with SearchAction
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": "TradeGo Fasteners",
        "description": "Leading manufacturer of high-quality fasteners including drywall screws, self-drilling screws, bolts, nuts, and IBR nails",
        "publisher": { "@id": `${BASE_URL}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${BASE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      // 4. WebPage with Breadcrumb + Author
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#webpage`,
        "url": BASE_URL,
        "name": "TradeGo Fasteners - Leading Fastener Manufacturer",
        "description": "TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified.",
        "isPartOf": { "@id": `${BASE_URL}/#website` },
        "about": { "@id": `${BASE_URL}/#organization` },
        "author": { "@id": `${BASE_URL}/#expert-zhang` },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "inLanguage": "en",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL }
          ]
        }
      },
      // 5. AggregateRating（社交证明，AI引用高权重）
      {
        "@type": "AggregateRating",
        "@id": `${BASE_URL}/#rating`,
        "itemReviewed": { "@id": `${BASE_URL}/#organization` },
        "ratingValue": "4.8",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "156",
        "reviewCount": "89"
      },
      // 6. HowTo Schema（AI最爱引用的格式）
      {
        "@type": "HowTo",
        "@id": `${BASE_URL}/#howto-choose-fasteners`,
        "name": "How to Choose the Right Fasteners for Your Project",
        "description": "A step-by-step guide to selecting the correct fasteners for construction and industrial applications.",
        "author": { "@id": `${BASE_URL}/#expert-zhang` },
        "publisher": { "@id": `${BASE_URL}/#organization` },
        "totalTime": "PT10M",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Identify Your Base Material",
            "text": "Determine whether you are fastening into wood, metal, concrete, or drywall. Wood requires coarse threads; metal needs fine threads with drill points; drywall uses bugle-head screws.",
            "url": `${BASE_URL}/#about`
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Choose the Right Screw Type",
            "text": "For drywall: use drywall screws with bugle heads. For metal-to-metal: use self-drilling screws with drill points. For heavy loads: use bolts and nuts. For roofing: use IBR nails or roofing screws.",
            "url": `${BASE_URL}/#products`
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Select the Correct Size",
            "text": "Screw length should penetrate at least 1 inch into the base material. For drywall: screw length = drywall thickness + 1 inch. For metal: drill point length must exceed total material thickness.",
            "url": `${BASE_URL}/#products`
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Consider Environmental Factors",
            "text": "For outdoor or humid environments: choose zinc-plated, galvanized, or stainless steel fasteners to prevent corrosion. For interior drywall: phosphate-coated screws are sufficient and cost-effective.",
            "url": `${BASE_URL}/#products`
          },
          {
            "@type": "HowToStep",
            "position": 5,
            "name": "Verify Quality Standards",
            "text": "Ensure your fasteners meet relevant standards: DIN for Europe, ANSI for North America, JIS for Japan, GB for China. ISO 9001 certified manufacturers provide consistent quality.",
            "url": `${BASE_URL}/#about`
          }
        ]
      },
      // 7. Speakable Specification（语音搜索+AI摘要优化）
      {
        "@type": "WebPage",
        "@id": `${BASE_URL}/#speakable`,
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["#hero-title", "#about-section", "#faq-section"]
        },
        "url": BASE_URL
      },
      // 8. Service Schema（AI引用产品+服务）
      {
        "@type": "Service",
        "@id": `${BASE_URL}/#service-custom`,
        "serviceType": "Custom Fastener Manufacturing",
        "provider": { "@id": `${BASE_URL}/#organization` },
        "areaServed": {
          "@type": "GeoShape",
          "name": "Worldwide - 50+ Countries"
        },
        "description": "Custom fastener manufacturing with specifications for size, material, coating, and thread pattern. ISO 9001:2015 certified quality.",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };
};

export const metadata: Metadata = {
  title: "TradeGo Fasteners | Leading Fastener Manufacturer",
  description: "TradeGo Fasteners is a leading manufacturer specializing in drywall screws, self-drilling screws, bolts, nuts, and IBR nails. 20+ years experience, ISO 9001 certified, global delivery.",
  keywords: "fastener manufacturer, drywall screws, self-drilling screws, bolts, nuts, IBR nails, wholesale fasteners, ISO 9001 certified",
  authors: [{ name: "TradeGo Engineering Team" }],
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