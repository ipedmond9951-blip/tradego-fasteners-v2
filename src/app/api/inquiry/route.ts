import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const INQUIRY_EMAIL = 'ipedmond9951@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const WHATSAPP_WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL;
const CRM_API_URL = process.env.CRM_API_URL || 'https://gentle-cities-rescue.loca.lt';

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
        subject: `${isHighValue ? '⭐ HIGH VALUE ' : ''}Inquiry from ${data.company || data.name} (${data.country || 'Unknown'})`,
        html: `
          <h2>New Inquiry from TradeGo Website</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toISOString()}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.company || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Products</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.products}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantity</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.quantity || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Country</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.country || 'Unknown'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.message || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Value</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${isHighValue ? '⭐ HIGH VALUE' : 'Normal'}</td></tr>
          </table>
          <p style="margin-top: 20px;">Reply to: <a href="mailto:${data.email}">${data.email}</a></p>
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
        from: 'TradeGo Fasteners <info@tradegofasteners.com>',
        to: data.email,
        subject: `Thank you for your inquiry - TradeGo Fasteners`,
        html: `
          <h2>Dear ${data.name},</h2>
          <p>Thank you for your interest in TradeGo Fasteners products. We have received your inquiry and will respond within <strong>24 hours</strong>.</p>
          
          <h3>Your Inquiry Details:</h3>
          <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Products</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.products}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Quantity</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.quantity || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Country</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.country || 'Not specified'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${data.message || 'Not specified'}</td></tr>
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
            <li>✅ ISO 9001 & SABS certified manufacturer</li>
            <li>✅ 15+ years experience in fastener production</li>
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

export async function POST(request: NextRequest) {
  try {
    const data: InquiryData = await request.json();
    
    if (!data.name || !data.email || !data.products) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, products' 
      }, { status: 400 });
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

    return NextResponse.json({ 
      success: true,
      message: 'Inquiry submitted successfully',
      lead_id: lead.id,
      highValue: isHighValue,
      crm_synced: crmSent,
    });

  } catch (error) {
    console.error('Inquiry API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET endpoint to retrieve leads (for testing)
export async function GET() {
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
