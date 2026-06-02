#!/usr/bin/env node
/**
 * GA4 Token 25-day Check + Auto Refresh
 * 
 * - 检查 google-oauth-tokens.json 的 expiry_date
 * - 如果剩余 < 7 天: 通知用户 (Telegram)
 * - 如果剩余 < 0 天: 尝试自动 refresh
 * - 如果 refresh 失败: 通知用户需手动操作
 * 
 * 适用: 每月 5 日 09:00 跑一次
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN_PATH = '/Users/zhangming/Projects/tradebrain-v2/server/config/google-oauth-tokens.json';
const OAUTH_URL_PATH = '/Users/zhangming/Projects/tradebrain-v2/server/oauth-server-nopkce.js';
// Credentials loaded from oauth-server-nopkce.js (canonical source) or env vars
// Never hardcode OAuth credentials in scripts pushed to public repos
const fs_for_creds = require('fs');
let CLIENT_ID = process.env.GA4_CLIENT_ID;
let CLIENT_SECRET = process.env.GA4_CLIENT_SECRET;
if (!CLIENT_ID || !CLIENT_SECRET) {
  try {
    const oauthServerSrc = fs_for_creds.readFileSync(OAUTH_URL_PATH, 'utf8');
    const idMatch = oauthServerSrc.match(/CLIENT_ID\s*=\s*['"]([^'"]+)['"]/);
    const secretMatch = oauthServerSrc.match(/CLIENT_SECRET\s*=\s*['"]([^'"]+)['"]/);
    if (idMatch) CLIENT_ID = idMatch[1];
    if (secretMatch) CLIENT_SECRET = secretMatch[1];
  } catch (e) {
    // Credentials unavailable - refresh will fail gracefully
  }
}

const TELEGRAM_TARGET = '8758157215';

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function sendTelegram(message) {
  // 通过 exec 调用 openclaw message send
  const { execSync } = require('child_process');
  try {
    execSync(`openclaw message send --target ${TELEGRAM_TARGET} --message "${message.replace(/"/g, '\\"')}"`, 
      { stdio: 'pipe', timeout: 30000 });
    log(`✅ Telegram sent`);
  } catch (e) {
    log(`❌ Telegram failed: ${e.message}`);
  }
}

function checkToken() {
  if (!fs.existsSync(TOKEN_PATH)) {
    return { status: 'missing', daysLeft: -999 };
  }

  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
  const expiry = tokens.expiry_date;
  const now = Date.now();
  const msLeft = expiry - now;
  const daysLeft = Math.floor(msLeft / 86400000);

  if (daysLeft < 0) return { status: 'expired', daysLeft, tokens };
  if (daysLeft < 7) return { status: 'expiring_soon', daysLeft, tokens };
  return { status: 'healthy', daysLeft, tokens };
}

async function testApiWithToken(accessToken) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'sessions' }]
    });
    const req = https.request({
      hostname: 'analyticsdata.googleapis.com',
      path: '/v1beta/properties/534542915:runReport',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 30000
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', (e) => resolve({ status: 0, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, error: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

async function tryRefresh(tokens) {
  return new Promise((resolve) => {
    const data = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    }).toString();

    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 30000
    }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.access_token) {
            // 保存新 token
            const newTokens = {
              access_token: result.access_token,
              refresh_token: result.refresh_token || tokens.refresh_token,
              expiry_date: Date.now() + (result.expires_in * 1000),
            };
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(newTokens, null, 2));
            resolve({ success: true, tokens: newTokens });
          } else {
            resolve({ success: false, error: result.error || 'unknown' });
          }
        } catch (e) {
          resolve({ success: false, error: 'parse_error' });
        }
      });
    });
    req.on('error', (e) => resolve({ success: false, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ success: false, error: 'timeout' }); });
    req.write(data);
    req.end();
  });
}

async function main() {
  log('🔍 GA4 Token 25-day Check');
  
  const check = checkToken();
  log(`Status: ${check.status}, Days left: ${check.daysLeft}`);

  // Case 1: 缺失 token 文件
  if (check.status === 'missing') {
    await sendTelegram(`🚨 GA4 Token 缺失!

文件不存在: ${TOKEN_PATH}

请手动跑 OAuth 流程:
1. cd /Users/zhangming/Projects/tradebrain-v2/server
2. node oauth-server-nopkce.js
3. Chrome 打开 URL, 授权
4. 完成后自动保存`);
    return;
  }

  // Case 2: 健康
  if (check.status === 'healthy') {
    log(`✅ Token healthy, ${check.daysLeft} days left`);
    return;
  }

  // Case 3: 即将过期 (< 7 天) - 通知
  if (check.status === 'expiring_soon') {
    await sendTelegram(`⚠️ GA4 Token 即将过期!

剩余: ${check.daysLeft} 天
过期时间: ${new Date(check.tokens.expiry_date).toLocaleString('zh-CN')}

建议 1-2 天内手动刷新 (用 Playwright CDP 方案):
bash ~/workspace/tradego-fasteners-v2/scripts/ga4-token-refresh.sh`);
    return;
  }

  // Case 4: 已过期 - 尝试自动 refresh
  if (check.status === 'expired') {
    log('⚠️ Token expired, attempting auto refresh...');
    
    // 先用旧 token 测 API
    const apiTest = await testApiWithToken(check.tokens.access_token);
    log(`Old token API test: ${apiTest.status}`);

    // 尝试 refresh
    const refresh = await tryRefresh(check.tokens);
    
    if (refresh.success) {
      // 用新 token 测 API
      const newApiTest = await testApiWithToken(refresh.tokens.access_token);
      log(`New token API test: ${newApiTest.status}`);

      if (newApiTest.status === 200) {
        await sendTelegram(`✅ GA4 Token 自动刷新成功!

新过期: ${new Date(refresh.tokens.expiry_date).toLocaleString('zh-CN')}
(约 1 小时后再次过期, 但 access_token 由服务自动续期)

API 验证: ✅ 工作正常`);
        return;
      }
    }

    // Refresh 失败 - 需要用户手动
    await sendTelegram(`🚨 GA4 Token 自动刷新失败!

错误: ${refresh.error}

refresh_token 已失效, 必须重新走完整 OAuth:
1. Playwright CDP 方案 (推荐, 不关 Chrome):
   bash ~/workspace/tradego-fasteners-v2/scripts/ga4-token-refresh.sh

2. 或手动: cd /Users/zhangming/Projects/tradebrain-v2/server && node oauth-server-nopkce.js`);
  }
}

main().catch(e => {
  log(`❌ Fatal: ${e.message}`);
  sendTelegram(`🚨 GA4 Check Script 错误: ${e.message}`);
});
