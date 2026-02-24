import { NextRequest, NextResponse } from 'next/server'
import dns from 'node:dns'
import https from 'node:https'
import type { LookupFunction } from 'node:net'
import Stripe from 'stripe'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://masjidconnectgy.com'
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY

// Docker's embedded resolver can intermittently fail external lookups (EAI_AGAIN).
// Force Stripe traffic through explicit public DNS first, then fall back to system DNS.
const resolver = new dns.Resolver()
resolver.setServers(['8.8.8.8', '1.1.1.1'])

const stripeLookup: LookupFunction = (hostname, options, callback) => {
  const cb = (typeof options === 'function' ? options : callback) as (...args: any[]) => void
  const opts = typeof options === 'function' ? undefined : options

  resolver.resolve4(hostname, (resolveErr, addresses) => {
    if (!resolveErr && addresses && addresses.length > 0) {
      if (opts && typeof opts === 'object' && 'all' in opts && (opts as dns.LookupAllOptions).all) {
        cb(null, addresses.map((address) => ({ address, family: 4 })))
        return
      }
      cb(null, addresses[0], 4)
      return
    }
    dns.lookup(hostname, options as any, cb as any)
  })
}

const stripeAgent = new https.Agent({
  keepAlive: true,
  lookup: stripeLookup,
})

const stripe = STRIPE_SECRET
  ? new Stripe(STRIPE_SECRET, { httpAgent: stripeAgent, maxNetworkRetries: 2 })
  : null

export async function POST(req: NextRequest) {
  if (!stripe) {
    console.error('Stripe checkout error: STRIPE_SECRET_KEY is not configured')
    return NextResponse.json({ error: 'Donations are temporarily unavailable' }, { status: 503 })
  }

  try {
    const { amount } = await req.json()

    if (!amount || typeof amount !== 'number' || amount < 100 || amount > 1000000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Support MasjidConnect GY',
              description:
                'Helping keep MasjidConnect GY free for the Guyanese Muslim community. JazakAllah Khayran!',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${APP_URL}/support/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/support`,
      metadata: {
        source: 'masjidconnect-gy',
      },
      custom_text: {
        submit: {
          message: 'بارك الله فيك — May Allah reward you for your generosity.',
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
