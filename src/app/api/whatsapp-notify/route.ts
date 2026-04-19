import { NextRequest, NextResponse } from 'next/server'

// This endpoint receives inquiry notifications and forwards to WhatsApp
// via OpenClaw gateway running on the host machine
export async function POST(request: NextRequest) {
  try {
    const { text, phone } = await request.json()
    
    if (!text || !phone) {
      return NextResponse.json({ error: 'Missing text or phone' }, { status: 400 })
    }

    // Forward to OpenClaw gateway WhatsApp endpoint
    // Note: This only works when called from the same network as the Mac mini
    // For production, we use Resend email as primary and this as secondary
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789'
    
    try {
      await fetch(`${gatewayUrl}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'whatsapp',
          target: phone,
          message: text,
        }),
      })
    } catch {
      // Gateway not reachable (Vercel is remote) — email is the primary channel
      console.log('OpenClaw gateway not reachable, WhatsApp skipped (email is primary)')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('WhatsApp notify error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
