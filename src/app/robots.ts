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

// 2026-11-26: 不再 Disallow /_next/ —— 渲染必需的 CSS/JS chunk 就在 /_next/static/chunks/
// 下，挡住会让爬虫拿不到可渲染页面。仅保留 API 与后台路径。
const BLOCKED = ['/api/', '/admin/'];

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
  };
}
