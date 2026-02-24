import { NextRequest } from 'next/server'
import { processWebhookEvent, verifyStripeSignature } from '@/lib/stripe-billing'

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return Response.json({ error: 'Webhook secret missing' }, { status: 503 })

  const raw = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!verifyStripeSignature(raw, sig, secret)) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(raw)
  const result = processWebhookEvent(event)
  return Response.json({ received: true, ...result })
}
