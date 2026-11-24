// ego-ai-router.js —— 用 ego lite 浏览器驱动 Gemini / Grok / ChatGPT 网页版（2026-11-24）
// 由 scripts/ego-ai-router-call.sh 生成并交给 `ego-browser nodejs` 执行。
// 脚本里的 __CFG__ 会被替换成实际配置 JSON；prompt 直接内嵌（ego 不继承 shell 环境变量）。
//
// 输出协议：[[EGO_REPLY]]<回复文本>[[/EGO_REPLY]]，失败时 [[EGO_ERROR]]<原因>[[/EGO_ERROR]]

const CFG = __CFG__;
const BASE_SPACE = 'seo-llm-' + CFG.ai + '-' + (Date.now() % 100000);  // 不复用固定名字：旧空间被用户接管后会让 taskSpace() 直接抛错

async function openSpace() {
  const candidates = [BASE_SPACE];
  for (let i = 0; i < 2; i++) candidates.push(BASE_SPACE + '-' + (Date.now() % 100000 + i));
  let firstErr = null;
  for (const name of candidates) {
    try {
      return { task: await taskSpace(name), name };
    } catch (e) {
      if (!firstErr) firstErr = e;
      // 空间被用户接管/被占用时换一个名字；登录态在浏览器 profile 里，不会丢
    }
  }
  throw firstErr;
}

function pickLast(nodes) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const t = (nodes[i].innerText || '').trim();
    if (t) return t;
  }
  return '';
}

// 兜底抽取：DOM 改版后选择器可能全失效（ChatGPT 2026-11 就把 data-message-author-role 去掉了），
// 退化为"正文里提问之后的文本"，再切掉尾部 UI 噪音。返回空表示没找到新回复。
async function diffReply(page, prompt) {
  return await page.evaluate((p) => {
    const text = document.body.innerText || '';
    const key = p.slice(0, 30).trim();
    const i = text.lastIndexOf(key);
    if (i < 0) return '';
    let rest = text.slice(i + key.length);
    const tails = ['ChatGPT can make mistakes', 'ChatGPT 可能会犯错', 'Latest response',
                   'Response complete', 'Think\n', 'Gemini can make mistakes', 'Gemini 可能会出错',
                   'Google 可能会出错', '查看结果', 'Copy code', 'Copy\n'];
    let cut = rest.length;
    for (const t of tails) {
      const j = rest.indexOf(t);
      if (j >= 0 && j < cut) cut = j;
    }
    rest = rest.slice(0, cut);
    rest = rest.replace(/^\s*(ChatGPT said:|Gemini said:|Grok said:|You said:|你说：|ChatGPT 说：|Gemini 说：)\s*/, '');
    return rest.trim();
  }, prompt);
}

const t0 = Date.now();
let space = null;
try {
  const opened = await openSpace();
  space = opened.task;
  const page = space.page('p1');

  if (!(await page.url()).includes(CFG.host)) {
    await page.goto(CFG.url, { timeout: 45000 });
  }
  await page.waitForTimeout(1200);

  // 输入框：按候选选择器逐个试，找到可见可编辑的那个
  let composer = null;
  for (const sel of CFG.composer) {
    try {
      const loc = await page.waitForSelector(sel, { timeout: 8000 });
      if (loc) { composer = sel; break; }
    } catch (e) { /* 试下一个 */ }
  }
  if (!composer) throw new Error('找不到输入框: ' + CFG.composer.join(' | '));

  await page.click('css:' + composer);
  await page.keyboard.insertText(CFG.prompt);
  await page.waitForTimeout(400);

  // 发送前先记下当前最后一条回复的文本，用来判断"是否有新回复"
  const before = await page.evaluate((sels) => {
    const nodes = sels.flatMap((s) => [...document.querySelectorAll(s)]);
    const last = nodes[nodes.length - 1];
    return last ? (last.innerText || '').trim() : '';
  }, CFG.answer);

  if (CFG.send === 'button' && CFG.sendButton) {
    await page.click('css:' + CFG.sendButton).catch(async () => { await page.keyboard.press('Enter'); });
  } else {
    await page.keyboard.press('Enter');
  }

  // 轮询抓回复：文本变化后等它连续两次稳定
  let reply = '';
  let prev = '';
  let stable = 0;
  const deadline = Date.now() + CFG.timeoutMs;
  while (Date.now() < deadline) {
    await page.waitForTimeout(2500);
    const cur = await page.evaluate((sels) => {
      const nodes = sels.flatMap((s) => [...document.querySelectorAll(s)]);
      for (let i = nodes.length - 1; i >= 0; i--) {
        const t = (nodes[i].innerText || '').trim();
        if (t) return t;
      }
      return '';
    }, CFG.answer);
    let cand = cur;
    if (!cand) cand = await diffReply(page, CFG.prompt);
    if (cand && cand !== before) {
      if (cand === prev) { stable++; if (stable >= 2 && reply.length > 0) break; }
      else { reply = cand; prev = cand; stable = 0; }
    } else if (cand && cand.length >= 2) {
      reply = cand;
    }
  }
  if (!reply) reply = await diffReply(page, CFG.prompt);
  if (!reply) throw new Error('等待超时（' + Math.round((Date.now() - t0) / 1000) + 's）未拿到新回复，可能是未登录或被验证码拦截');
  console.log('[[EGO_REPLY]]' + reply + '[[/EGO_REPLY]]');
  await space.finish({ keep: ['p1'] });
} catch (e) {
  console.log('[[EGO_ERROR]]' + String((e && e.message) || e).replace(/\s+/g, ' ').slice(0, 200) + '[[/EGO_ERROR]]');
  try { if (space) await space.finish({ keep: ['p1'] }); } catch (e2) {}
  process.exitCode = 1;
}
