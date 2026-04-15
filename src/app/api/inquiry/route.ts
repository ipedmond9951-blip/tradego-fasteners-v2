import { NextRequest, NextResponse } from 'next/server';

// Email configuration
const INQUIRY_EMAIL = 'aimingtrade@hotmail.com';

// For production, use Resend, SendGrid, or similar email service
// This is a simplified version that logs inquiries

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
  return num >= 10000 || num >= 5000; // 10,000+ pieces or 5000+ kg
}

export async function POST(request: NextRequest) {
  try {
    const data: InquiryData = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.products) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, products' 
      }, { status: 400 });
    }

    const isHighValue = isInquiryHighValue(data.quantity);
    const timestamp = new Date().toISOString();
    
    // Log inquiry (in production, send email)
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

    // In production, send email via Resend/SendGrid
    // Example with Resend:
    /*
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'inquiry@tradego-fasteners.com',
        to: INQUIRY_EMAIL,
        subject: `${isHighValue ? '⭐ HIGH VALUE ' : ''}Inquiry from ${data.company || data.name} (${data.country})`,
        html: `
          <h2>New Inquiry from TradeGo Website</h2>
          <table>
            <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
            <tr><td><strong>Company:</strong></td><td>${data.company || 'N/A'}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${data.phone || 'N/A'}</td></tr>
            <tr><td><strong>Products:</strong></td><td>${data.products}</td></tr>
            <tr><td><strong>Quantity:</strong></td><td>${data.quantity || 'N/A'}</td></tr>
            <tr><td><strong>Country:</strong></td><td>${data.country || 'Unknown'}</td></tr>
            <tr><td><strong>Message:</strong></td><td>${data.message || 'N/A'}</td></tr>
          </table>
        `,
      });
    }
    */

    // Save to file for now (development)
    const fs = await import('fs/promises');
    const path = await import('path');
    const inquiryLog = path.join(process.cwd(), 'inquiries.log');
    const logEntry = `${timestamp} | ${data.name} | ${data.email} | ${data.company || '-'} | ${data.products} | ${data.quantity || '-'} | ${data.country || '-'} | ${isHighValue ? 'HIGH' : 'normal'}\n`;
    
    try {
      await fs.appendFile(inquiryLog, logEntry);
    } catch {
      // Ignore file write errors in production
    }

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
