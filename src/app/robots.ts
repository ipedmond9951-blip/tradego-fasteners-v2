import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      {
        // Allow AI search bots (ChatGPT, Claude, Gemini, Perplexity, etc.)
        userAgent: ['CCBot', 'GPTBot', 'ChatGPT-User', 'GPT-User', 'Google-Extended', 'anthropic-ai', 'PerplexityBot', 'OAI-SearchBot', 'cohere-ai'],
        allow: '/',
      },
    ],
    sitemap: 'https://www.tradego-fasteners.com/sitemap.xml',
  };
}
