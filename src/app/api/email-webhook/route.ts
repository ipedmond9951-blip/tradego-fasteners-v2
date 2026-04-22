import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const FORWARD_TO = [
  'ipedmond9951@gmail.com',
  'aimingtrade@hotmail.com',
  '645096795@qq.com',
];

interface EmailReceivedEvent {
  type: string;
  data: {
    id: string;
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
    reply_to?: string;
    created_at: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const event: EmailReceivedEvent = await request.json();

    if (event.type !== 'email.received') {
      return NextResponse.json({ ok: true });
    }

    const { from, to, subject, html, text, reply_to } = event.data;

    console.log(`[email-webhook] Received email from ${from} to ${to}: ${subject}`);

    // Forward to all recipients
    const results = await Promise.allSettled(
      FORWARD_TO.map((recipient) =>
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `TradeGo <noreply@tradego-fasteners.com>`,
            to: recipient,
            reply_to: reply_to || from,
            subject: `[Fwd] ${subject}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #f5f5f5; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                  <p style="margin: 4px 0;"><strong>From:</strong> ${from}</p>
                  <p style="margin: 4px 0;"><strong>To:</strong> ${to}</p>
                  <p style="margin: 4px 0;"><strong>Subject:</strong> ${subject}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
                <div>${html || `<pre style="white-space: pre-wrap;">${text}</pre>`}</div>
              </div>
            `,
            text: text || '',
          }),
        })
      )
    );

    const failed = results.filter((r) => r.status === 'rejected');
    if (failed.length > 0) {
      console.error('[email-webhook] Some forwards failed:', failed);
    }

    return NextResponse.json({ ok: true, forwarded: FORWARD_TO.length - failed.length });
  } catch (error) {
    console.error('[email-webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
