import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const INQUIRY_EMAIL = process.env.INQUIRY_EMAIL || 'zhangming@tradego-fasteners.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const WHATSAPP_WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL;
const INQUIRY_WEBHOOK_URL = process.env.INQUIRY_WEBHOOK_URL;
const CRM_API_URL = process.env.CRM_API_URL;

interface InquiryData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  products: string;
  quantity?: string;
  message?: string;
  country?: string;
  locale?: string;
}

// ---- 反滥用：蜜罐 + 提交时长 + 频率限制 ----
// 说明：进程内计数在 serverless 上是"每实例一份"，只能算第一道拦网（挡掉不针对目标的批量脚本）。
// 真正有组织的刷量要靠 Edge/WAF 规则或 Cloudflare Turnstile，这里不做重复建设。
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_IP = 8; // 非洲移动网络 NAT 共享 IP 常见，阈值不能压太死
const RATE_MAX_GLOBAL = 30;
const MIN_FILL_MS = 2000;

type HitMap = Map<string, number[]>;
const ipHits: HitMap = new Map();
let globalHits: number[] = [];

function prune(list: number[], now: number): number[] {
  return list.filter((t) => now - t < RATE_WINDOW_MS);
}

// 询盘内容会拼进 HTML 邮件，必须转义，否则客户可以在邮件里注入任意标签
function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function overLimit(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  globalHits = prune(globalHits, now);
  const ipList = prune(ipHits.get(ip) || [], now);

  // 记录本次尝试（被拦的也算，避免持续刷）
  ipList.push(now);
  globalHits.push(now);
  ipHits.set(ip, ipList);

  if (ipHits.size > 2000) {
    for (const [key, list] of ipHits) {
      if (prune(list, now).length === 0) ipHits.delete(key);
    }
  }

  const ipOver = ipList.length > RATE_MAX_PER_IP;
  const globalOver = globalHits.length > RATE_MAX_GLOBAL;
  const oldest = ipOver ? ipList[0] : globalHits[0];
  const retryAfter = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000));
  return { limited: ipOver || globalOver, retryAfter };
}

function spamReason(data: InquiryData, honeypot?: string, elapsedMs?: unknown): string | null {
  if ((honeypot || '').trim() !== '') return 'honeypot_filled';
  const elapsed = typeof elapsedMs === 'number' ? elapsedMs : Number(elapsedMs);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) return 'submitted_too_fast';
  const links = (data.message || '').match(/https?:\/\/|www\./gi);
  if (links && links.length > 3) return 'excessive_links';
  return null;
}

interface LeadRecord extends InquiryData {
  id: string;
  created_at: string;
  source: string;
  lead_score: number;
  lead_status: string;
  tags: string[];
  is_high_value: boolean;
}

function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function isInquiryHighValue(quantity?: string): boolean {
  if (!quantity) return false;
  const match = quantity.match(/[\d,]+/);
  if (!match) return false;
  const num = parseInt(match[0].replace(/,/g, ''), 10);
  return num >= 10000 || num >= 5000;
}

function getLeadsFilePath(): string {
  return join(process.cwd(), 'data', 'leads.json');
}

async function saveLeadToFile(data: InquiryData & { is_high_value: boolean }): Promise<LeadRecord> {
  const filePath = getLeadsFilePath();
  
  let leads: LeadRecord[] = [];
  
  // Read existing leads
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      leads = JSON.parse(content);
    } catch (e) {
      console.error('Error reading leads file:', e);
    }
  }
  
  // Create new lead record
  const newLead: LeadRecord = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
    source: 'website_form',
    lead_score: data.is_high_value ? 50 : 10, // High value leads start with higher score
    lead_status: 'new',
    tags: ['website_inquiry', data.products].filter(Boolean),
    is_high_value: data.is_high_value,
  };
  
  leads.unshift(newLead); // Add to beginning (newest first)
  
  // Save back to file
  try {
    writeFileSync(filePath, JSON.stringify(leads, null, 2));
    console.log(`Lead saved to file: ${newLead.id}`);
  } catch (e) {
    console.error('Error saving lead to file:', e);
    throw e;
  }
  
  return newLead;
}

async function sendToCRM(lead: LeadRecord): Promise<boolean> {
  if (!CRM_API_URL) {
    console.log('CRM_API_URL not configured, skipping CRM sync');
    return false;
  }
  try {
    const crmData = {
      company_name: lead.company || '',
      contact_name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      country: lead.country || '',
      target_products: lead.products,
      source: 'website_form',
      notes: lead.message || '',
      lead_score: lead.lead_score,
      lead_status: lead.lead_status,
    };
    
    const response = await fetch(`${CRM_API_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crmData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`Lead sent to CRM: ${JSON.stringify(result)}`);
      return true;
    } else {
      console.log(`CRM API returned: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`CRM API not available (will use local file storage): ${error}`);
    return false;
  }
}

async function sendEmail(data: InquiryData, isHighValue: boolean): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TradeGo Inquiry <inquiry@tradego-fasteners.com>',
        to: INQUIRY_EMAIL,
        replyTo: data.email,
        subject: `${isHighValue ? '⭐ HIGH VALUE ' : ''}${/certificate request|随订单附.*证书|要求.*证书/i.test(data.message || '') ? '[CERT] ' : ''}Inquiry from ${data.company || data.name} (${data.country || 'Unknown'})`,
        html: `
          <h2>New Inquiry from TradeGo Website</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.company || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.phone || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Products</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.products)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantity</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.quantity || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Country</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.country || 'Unknown')}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.message || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Value</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${isHighValue ? '⭐ HIGH VALUE' : 'Normal'}</td></tr>
          </table>
          <p style="margin-top: 20px;">Reply to: <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
        `,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

async function sendConfirmationEmail(data: InquiryData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping confirmation email');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // 必须用已验证的域名发信：tradegofasteners（无横线，非本站域名）没有任何 DNS 记录，
        // 用它发信会被 Resend 拒，客户也永远看不到确认邮件
        from: 'TradeGo Fasteners <info@tradego-fasteners.com>',
        reply_to: INQUIRY_EMAIL,
        to: data.email,
        subject: `Thank you for your inquiry - TradeGo Fasteners`,
        html: `
          <h2>Dear ${escapeHtml(data.name)},</h2>
          <p>Thank you for your interest in TradeGo Fasteners products. We have received your inquiry and will respond within <strong>24 hours</strong>.</p>
          
          <h3>Your Inquiry Details:</h3>
          <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Products</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.products)}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantity</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.quantity || 'Not specified')}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Country</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.country || 'Not specified')}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(data.message || 'Not specified')}</td></tr>
          </table>
          
          <h3>What happens next?</h3>
          <ol>
            <li>Our sales team will review your inquiry</li>
            <li>We will send you a detailed quotation</li>
            <li>If needed, we may contact you for clarification</li>
            <li>Sample orders can be arranged for quality verification</li>
          </ol>
          
          <h3>Why choose TradeGo?</h3>
          <ul>
            <li>✅ Made to SABS 1195 / DIN / ISO manufacturer</li>
            <li>✅ 20+ years experience in fastener production</li>
            <li>✅ Sea freight to Africa - competitive rates</li>
            <li>✅ Custom packaging available</li>
          </ul>
          
          <p style="margin-top: 20px;">Best regards,<br/>TradeGo Fasteners Sales Team</p>
          
          <hr style="margin-top: 30px;"/>
          <p style="color: #666; font-size: 12px;">
            This email was sent because you submitted an inquiry on our website. 
            If you did not make this request, please ignore this email.
          </p>
        `,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Confirmation email error:', error);
    return false;
  }
}

async function sendWhatsAppNotification(data: InquiryData, isHighValue: boolean): Promise<boolean> {
  if (!WHATSAPP_WEBHOOK_URL) {
    console.log('WHATSAPP_WEBHOOK_URL not configured, skipping WhatsApp');
    return false;
  }

  try {
    const msg = isHighValue
      ? `⭐ HIGH VALUE INQUIRY!\n`
      : `📦 New Inquiry\n`;
    const text = `${msg}From: ${data.name}${data.company ? ` (${data.company})` : ''}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone || 'N/A'}\n` +
      `Products: ${data.products}\n` +
      `Quantity: ${data.quantity || 'N/A'}\n` +
      `Country: ${data.country || 'Unknown'}\n` +
      (data.message ? `Message: ${data.message}\n` : '');

    const response = await fetch(WHATSAPP_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, phone: '+8615963409951' }),
    });

    return response.ok;
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    return false;
  }
}

async function sendWebhookAlert(data: InquiryData, isHighValue: boolean): Promise<boolean> {
  if (!INQUIRY_WEBHOOK_URL) return false;

  const summary = `${isHighValue ? '⭐ HIGH VALUE ' : ''}New inquiry from ${data.company || data.name} (${data.country || 'Unknown'})\n`
    + `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\n`
    + `Products: ${data.products}\nQuantity: ${data.quantity || 'N/A'}\n`
    + (data.message ? `Message: ${data.message}` : '');

  const isFeishu = /feishu|larksuite|open\.feishu/i.test(INQUIRY_WEBHOOK_URL);
  const body = isFeishu
    ? { msg_type: 'text', content: { text: summary } }
    : { text: summary };

  try {
    const response = await fetch(INQUIRY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.ok;
  } catch (error) {
    console.error('Webhook alert error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 0. 频率限制（第一道）：同一 IP 10 分钟最多 5 次，全局每实例 30 次
    const ip = clientIp(request);
    const rate = overLimit(ip);
    if (rate.limited) {
      console.warn(`[RATE_LIMIT] ip=${ip} retry_after=${rate.retryAfter}s`);
      return NextResponse.json(
        { error: 'Too many requests, please try again later', retry_after: rate.retryAfter },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfter) } }
      );
    }

    const payload = (await request.json()) as InquiryData & {
      _honeypot?: string;
      _elapsed?: number | string;
    };
    const { _honeypot, _elapsed, ...data } = payload;

    if (!data.name || !data.email || !data.products) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, products' 
      }, { status: 400 });
    }

    // 0b. 机器特征（第二道）：蜜罐被填 / 表单填得太快 / 正文塞满链接
    // 命中后返回与成功完全一致的响应，不给脚本任何"被识别"的信号，但不投递、不落库
    const spam = spamReason(data, _honeypot, _elapsed);
    if (spam) {
      console.warn(`[SPAM] reason=${spam} ip=${ip} email=${data.email} products=${data.products}`);
      return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' });
    }

    const isHighValue = isInquiryHighValue(data.quantity);
    const timestamp = new Date().toISOString();
    
    console.log('=== NEW INQUIRY ===');
    console.log(`Time: ${timestamp}`);
    console.log(`Name: ${data.name}`);
    console.log(`Email: ${data.email}`);
    console.log(`Company: ${data.company || 'N/A'}`);
    console.log(`Phone: ${data.phone || 'N/A'}`);
    console.log(`Products: ${data.products}`);
    console.log(`Quantity: ${data.quantity || 'N/A'}`);
    console.log(`Country: ${data.country || 'Unknown'}`);
    console.log(`Message: ${data.message || 'N/A'}`);
    console.log(`HIGH VALUE: ${isHighValue ? 'YES ⭐' : 'NO'}`);
    console.log('====================');

    // 1. Save lead to local JSON file (primary storage)
    // Note: On Vercel serverless, this will fail. For production, use Vercel Postgres or cloud DB.
    let lead: LeadRecord | null = null;
    try {
      lead = await saveLeadToFile({ ...data, is_high_value: isHighValue });
      console.log(`Lead saved: ${lead.id}`);
    } catch (e) {
      console.warn('File storage not available on serverless (expected on Vercel):', String(e));
      // Create a temporary lead record without saving to file
      lead = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString(),
        source: 'website_form',
        lead_score: isHighValue ? 50 : 10,
        lead_status: 'new',
        tags: ['website_inquiry', data.products].filter(Boolean),
        is_high_value: isHighValue,
      };
      console.log(`Lead created (no file storage): ${lead.id}`);
    }

    // 2. Send to CRM API (secondary, non-blocking)
    const crmSent = await sendToCRM(lead);
    console.log(`CRM sync: ${crmSent ? 'SUCCESS' : 'FAILED (using local file)'}`);

    // 3. Send email notification to sales team
    const emailSent = await sendEmail(data, isHighValue);
    console.log(`Email to sales: ${emailSent}`);

    // 4. Send confirmation email to customer
    const confirmationSent = await sendConfirmationEmail(data);
    console.log(`Confirmation email: ${confirmationSent}`);

    // 5. Send WhatsApp notification (non-blocking)
    const waSent = await sendWhatsAppNotification(data, isHighValue);
    console.log(`WhatsApp: ${waSent}`);

    // 6. 免费兜底告警通道（飞书/企业微信/Slack 群机器人），任一成功即视为已通知
    const webhookSent = (emailSent || waSent) ? false : await sendWebhookAlert(data, isHighValue);
    console.log(`Webhook alert: ${webhookSent}`);

    const alerted = emailSent || waSent || webhookSent || crmSent;
    if (!alerted) {
      // 一条询盘都可能没被任何人看到，必须显眼地留在 Vercel 日志里
      console.error(`[CRITICAL] Inquiry ${lead.id} was NOT delivered to any channel. Configure RESEND_API_KEY or INQUIRY_WEBHOOK_URL. Payload: ${JSON.stringify(data)}`);
    }

    // 预览/开发环境没有投递凭据时必须显式失败，否则测试会以为“提交成功”，线上却是空的
    const isProd = process.env.VERCEL_ENV === 'production';
    if (!alerted && !isProd) {
      return NextResponse.json({
        error: 'Delivery not configured in this environment',
        detail: '缺少 RESEND_API_KEY / INQUIRY_WEBHOOK_URL，询盘未送达任何人',
        lead_id: lead.id,
        delivered: false,
      }, { status: 503 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Inquiry submitted successfully',
      lead_id: lead.id,
      highValue: isHighValue,
      delivered: alerted,
      crm_synced: crmSent,
      email_sent: emailSent,
      webhook_sent: webhookSent,
    });

  } catch (error) {
    console.error('Inquiry API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET 用于取回线索列表（含客户邮箱/电话），默认关闭：
// 必须配置环境变量 LEADS_TOKEN，并带上同一个 token 才能读，避免公开端点被爬走客户名单
export async function GET(request: NextRequest) {
  const token = process.env.LEADS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const provided =
    request.headers.get('x-leads-token') || request.nextUrl.searchParams.get('token');
  if (provided !== token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const filePath = getLeadsFilePath();
    if (!existsSync(filePath)) {
      return NextResponse.json({ success: true, data: [], count: 0 });
    }
    
    const content = readFileSync(filePath, 'utf-8');
    const leads = JSON.parse(content);
    
    return NextResponse.json({ 
      success: true, 
      data: leads,
      count: leads.length 
    });
  } catch (error) {
    console.error('Error reading leads:', error);
    return NextResponse.json({ error: 'Failed to read leads' }, { status: 500 });
  }
}
