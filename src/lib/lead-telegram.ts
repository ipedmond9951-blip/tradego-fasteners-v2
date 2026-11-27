/**
 * 站内即时提醒：客户在首页弹框/询盘表单留下邮箱或 WhatsApp 后，
 * 直接把一条结构化消息推到 Telegram（手机端 1 秒内到达）。
 *
 * 为什么不用邮件：邮件进的是 inbox，要人主动去翻；Telegram 是推送。
 * 为什么不用 WhatsApp Cloud API：模板消息要审核，且我们的收信号在国内网络不稳。
 *
 * 凭据：TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID（Vercel 生产环境变量）。
 * 未配置时只打一行日志，不阻塞询盘主流程。
 */

const TELEGRAM_API = 'https://api.telegram.org';

type LeadPayload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  products?: string;
  quantity?: string;
  message?: string;
  country?: string;
  locale?: string;
  source?: string;
};

function cstNow(): string {
  const d = new Date(Date.now() + 8 * 3600 * 1000);
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' CST';
}

function channelLabel(source?: string, products?: string): string {
  if (products === 'lead_modal' || source === 'lead_modal') return '首页留资弹框';
  if (source === 'search') return '站内搜索页';
  return '询盘表单';
}

export function buildTelegramMessage(
  data: LeadPayload,
  lead: { id: string },
  isHighValue: boolean
): string {
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const lines: string[] = [];

  lines.push(`🔔 TradeGo 新线索${isHighValue ? '（高价值）' : ''}`);
  lines.push(`时间：${cstNow()}`);
  lines.push(`渠道：${channelLabel(data.source, data.products)}${data.locale ? ` · ${data.locale}` : ''}`);
  if (email) lines.push(`邮箱：${email}`);
  if (phone) lines.push(`WhatsApp/电话：${phone}`);
  if (!email && !phone) lines.push('联系方式：⚠️ 既没留邮箱也没留电话');

  if (data.name && data.name !== 'WhatsApp lead' && data.name !== 'N/A') {
    lines.push(`称呼：${data.name}`);
  }
  if (data.company && data.company !== 'N/A') lines.push(`公司：${data.company}`);
  if (data.country && data.country !== 'Unknown') lines.push(`国家：${data.country}`);
  if (data.quantity && data.quantity !== 'N/A') lines.push(`数量：${data.quantity}`);

  const products = (data.products || '').trim();
  if (products && products !== 'lead_modal') lines.push(`产品：${products}`);

  const msg = (data.message || '').trim();
  if (msg && !/lead capture popup/i.test(msg)) lines.push(`留言：${msg.slice(0, 200)}`);

  lines.push(`ID：${lead.id}`);
  return lines.join('\n');
}

export async function sendTelegramLead(
  data: LeadPayload,
  lead: { id: string },
  isHighValue: boolean
): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log('TELEGRAM_BOT_TOKEN/CHAT_ID not configured, skipping Telegram alert');
    return false;
  }

  try {
    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(data, lead, isHighValue),
        disable_web_page_preview: true,
      }),
      // 手机推送不值得为了它把询盘请求拖死
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`Telegram alert HTTP ${res.status}`);
      return false;
    }
    const body = (await res.json().catch(() => ({}))) as { ok?: boolean };
    return body.ok === true;
  } catch (error) {
    console.error('Telegram alert error:', error);
    return false;
  }
}
