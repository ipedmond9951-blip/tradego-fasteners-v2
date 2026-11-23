import { MetadataRoute } from 'next';

// AI / LLM crawlers we explicitly welcome: being cited in ChatGPT, Claude,
// Perplexity, Gemini, Grok and Bing answers is a real traffic channel now.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Gemini-Deep-Research',
  'Grok',
  'GrokBot',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'anthropic-ai',
  'cohere-ai',
  'meta-externalagent',
  'DuckAssistBot',
];

const BLOCKED = ['/api/', '/_next/', '/admin/'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Standard search engine crawlers
        userAgent: '*',
        allow: '/',
        disallow: BLOCKED,
      },
      ...AI_CRAWLERS.map((ua) => ({
        userAgent: ua,
        allow: '/',
        disallow: BLOCKED,
      })),
    ],
    sitemap: 'https://www.tradego-fasteners.com/sitemap.xml',
    host: 'https://www.tradego-fasteners.com',
  };
}
