import { NextRequest, NextResponse } from 'next/server';

const INQUIRY_EMAIL = 'ipedmond9951@gmail.com';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const WHATSAPP_WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL;

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

function isInquiryHighValue(quantity?: string): boolean {
  if (!quantity) return false;
  const match = quantity.match(/[\d,]+/);
  if (!match) return false;
  const num = parseInt(match[0].replace(/,/g, ''), 10);
  return num >= 10000 || num >= 5000;
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
        from: 'TradeGo Inquiry <onboarding@resend.dev>',
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

    // Send email notification
    const emailSent = await sendEmail(data, isHighValue);
    console.log(`Email sent: ${emailSent}`);

    // Send WhatsApp notification
    const waSent = await sendWhatsAppNotification(data, isHighValue);
    console.log(`WhatsApp sent: ${waSent}`);

    return NextResponse.json({ 
      success: true,
      message: 'Inquiry submitted successfully',
      highValue: isHighValue,
    });

  } catch (error) {
    console.error('Inquiry API error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
