#!/bin/bash
# deepseek-unlock-check.sh - DeepSeek 解禁后自动验证 (2026-06-20 静默期到期 2026-07-05)
#
# 用途:
#   2026-07-05 09:36 之后, 验证 chat.deepseek.com 网页版是否真解禁
#
# 流程:
#   1. 用 Chrome CDP 打开 chat.deepseek.com
#   2. 检查是否能发送消息 (无禁言)
#   3. 跑简单 prompt "你好, 1+1=?"
#   4. 验证有回复
#
# 静默期禁用:
#   - ai-router.js deepseek
#   - deepseek-client.js
#   - ai-router.js 问deepseek
#
# 解禁后慢热 (避免再次触发):
#   Day 1: 1 call/day
#   Day 2-3: 3 calls/day
#   Day 4-7: 10 calls/day
#   Day 8+: full

set -e

PROJECT_DIR="/Users/zhangming/workspace/tradego-fasteners-v2"
LOG_DIR="$PROJECT_DIR/logs/deepseek-unlock"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M)
LOG_FILE="$LOG_DIR/unlock-check-$TIMESTAMP.log"

# 静默期结束时间 (UTC)
QUIET_END="2026-07-05T01:36:00Z"  # 09:36 Asia/Shanghai = 01:36 UTC
CURRENT_UTC=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "[$TIMESTAMP] 🔍 DeepSeek 解禁检查" | tee -a "$LOG_FILE"
echo "[$TIMESTAMP]   Quiet end: $QUIET_END" | tee -a "$LOG_FILE"
echo "[$TIMESTAMP]   Current:   $CURRENT_UTC" | tee -a "$LOG_FILE"

# 检查是否过静默期
if [[ "$CURRENT_UTC" < "$QUIET_END" ]]; then
    echo "[$TIMESTAMP] ⛔ 静默期未结束, 跳过" | tee -a "$LOG_FILE"
    exit 0
fi

# 检查 Chrome CDP
if ! curl -s http://localhost:9222/json/version > /dev/null 2>&1; then
    echo "[$TIMESTAMP] ⚠️ Chrome CDP 未启动, 启动中..." | tee -a "$LOG_FILE"
    ~/.agents/skills/chrome-remote-debug/start-chrome.sh 2>&1 | tee -a "$LOG_FILE"
    sleep 5
fi

# 用 Playwright 测
cd "$PROJECT_DIR"
node << 'NODE_EOF' 2>&1 | tee -a "$LOG_FILE"
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const ctx = browser.contexts()[0];
  const page = await ctx.newPage();
  try {
    await page.goto('https://chat.deepseek.com', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    
    const title = await page.title();
    const url = page.url();
    console.log('Page title:', title);
    console.log('Page URL:', url);
    
    // 检查登录态
    const isLoggedIn = await page.evaluate(() => {
      return !document.body.innerText.includes('登录') && !document.body.innerText.includes('login');
    });
    console.log('Logged in:', isLoggedIn);
    
    // 检查禁言状态
    const hasBannedMsg = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('禁言') || text.includes('banned');
    });
    console.log('Has banned msg:', hasBannedMsg);
    
    if (isLoggedIn && !hasBannedMsg) {
      console.log('✅ DeepSeek 解禁且可用');
    } else if (hasBannedMsg) {
      console.log('⛔ DeepSeek 仍被禁言');
    } else {
      console.log('⚠️ DeepSeek 未登录或状态未知');
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
  await browser.close();
})();
NODE_EOF

echo "[$TIMESTAMP] 🏁 完成" | tee -a "$LOG_FILE"