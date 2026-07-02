#!/usr/bin/env node
/**
 * seo-deep-ask.js — 直接调 AI client 拿 raw 回复 (绕过 ai-router 包装)
 *
 * 用途: SEO pipeline 需要 LLM 输出原始文本 (含 JSON 块), ai-router
 *       用 extractLastReply 拿的是 page 文本, 不适合 structured output.
 *
 * 用法:
 *   node scripts/seo-deep-ask.js deepseek "Output JSON: {...}"
 *   node scripts/seo-deep-ask.js doubao "Output JSON: {...}"
 *
 * 输出: stdout = AI 原始回复 (含 markdown code fence 的 JSON)
 * 退出码: 0 = 成功, 1 = 失败
 */

const ai = (process.argv[2] || '').toLowerCase();
const prompt = process.argv.slice(3).join(' ');

if (!['deepseek', 'doubao', 'chatgpt', 'gemini', 'grok'].includes(ai)) {
  console.error(`[seo-deep-ask] invalid AI: ${ai}`);
  process.exit(1);
}

if (!prompt) {
  console.error('[seo-deep-ask] no prompt');
  process.exit(1);
}

const AI_DIR = `${process.env.HOME}/.agents/skills/ai-assistant-router`;

const { chromium } = require(`${process.env.HOME}/.agents/skills/ai-assistant-router/node_modules/playwright`);

(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:18800');
  const pages = browser.contexts().flatMap(c => c.pages());

  const DOMAIN_MAP = {
    grok: 'grok.com',
    doubao: 'doubao.com',
    gemini: 'gemini.google.com',
    deepseek: 'deepseek.com',
    chatgpt: 'chatgpt.com',
  };
  const domain = DOMAIN_MAP[ai];

  let page = pages.find(p => p.url().includes(domain));
  if (!page) {
    console.error(`[seo-deep-ask] no ${ai} page open`);
    await browser.close();
    process.exit(1);
  }

  // Use the existing client library to send the question
  const clientMap = {
    doubao: 'doubao-client',
    gemini: 'gemini-client',
    deepseek: 'deepseek-client',
    chatgpt: 'chatgpt-client',
  };

  try {
    if (ai === 'doubao') {
      const { askDoubao } = require(`${AI_DIR}/doubao-client.js`);
      await askDoubao(prompt);
    } else if (ai === 'deepseek') {
      const { askDeepSeek } = require(`${AI_DIR}/deepseek-client.js`);
      await askDeepSeek(prompt);
    } else if (ai === 'chatgpt') {
      const { askChatGPT } = require(`${AI_DIR}/chatgpt-client.js`);
      await askChatGPT(prompt);
    } else if (ai === 'gemini') {
      const { callGemini } = require(`${AI_DIR}/gemini-client.js`);
      await callGemini(prompt);
    } else if (ai === 'grok') {
      console.error('[seo-deep-ask] grok not yet supported in this script');
      process.exit(1);
    }

    // Wait for AI to finish typing
    await page.waitForTimeout(5000);

    // Get raw page text
    const body = await page.evaluate(() => document.body.innerText);
    console.log(body);
  } catch (e) {
    console.error(`[seo-deep-ask] error: ${e.message}`);
    await browser.close();
    process.exit(1);
  }

  await browser.close();
  process.exit(0);
})();
