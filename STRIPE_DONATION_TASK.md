# Stripe Donation / Support Page

## Overview
Add a "Support the App" donation feature to MasjidConnect GY. The app is built **fisabilillah** (for the sake of Allah) — free for the community. Donations help cover server hosting costs.

**Payment processor:** Stripe Checkout (hosted by Stripe — card details never touch our server)
**Currency:** USD

---

## Prerequisites / Environment Variables

The following env vars must be in `.env.local` (add them if not present):
```
STRIPE_SECRET_KEY=sk_live_...         # from Stripe dashboard
STRIPE_PUBLISHABLE_KEY=pk_live_...    # from Stripe dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # same as above, client-accessible
NEXT_PUBLIC_APP_URL=https://masjidconnectgy.com
```

If `STRIPE_SECRET_KEY` is not set in `.env.local`, **create placeholder values** in `.env.local` and add a clear comment:
```
# TODO: Add Stripe keys from dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
NEXT_PUBLIC_APP_URL=https://masjidconnectgy.com
```

Install Stripe SDK if not already installed:
```bash
cd /home/karetech/v0-masjid-connect-gy
npm install stripe @stripe/stripe-js 2>&1 | tail -5
```

---

## Part 1 — API Route: Create Checkout Session

**File:** `app/api/stripe/checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    // Validate amount (in USD cents, min $1, max $10,000)
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
              description: 'Helping keep MasjidConnect GY free for the Guyanese Muslim community. JazakAllah Khayran!',
              images: ['https://masjidconnectgy.com/icon-192.png'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/support/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/support`,
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
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
```

---

## Part 2 — Main Support/Donation Page

**File:** `app/support/page.tsx`

This is a 'use client' page. Design requirements:
- Full dark bg (`bg-[#0a0b14]`)  
- `PageHero` with `heroTheme="zakat"` (fits the giving/charity theme), title="Support the App", subtitle="Built fisabilillah — for the sake of Allah"
- `showBack` prop on PageHero
- `BottomNav` at bottom, `pb-nav` class on main content

**Layout:**
1. **Mission card** (amber/gold tones) — brief message:
   > "MasjidConnect GY is a free community app built for the Guyanese Muslim community. There are no ads, no subscriptions, no paywalls. Your donation helps cover server hosting and keeps the app free for everyone."

2. **Amount selector** — horizontal/grid buttons:
   - `$5`, `$10`, `$25`, `$50`, `$100`
   - `Custom` — when selected, shows a number input field (min $1, max $10,000)
   - Selected amount highlighted in emerald
   - State: `selectedPreset` (string | null), `customAmount` (string), computed `amountCents` (number)

3. **Donate button** — big emerald button:
   - "Donate $X — JazakAllah Khayran" text
   - Loading state while awaiting API
   - On click: POST to `/api/stripe/checkout` with `{ amount: amountCents }`, then `window.location.href = data.url`
   - Error toast on failure

4. **"Secure payment by Stripe"** note with Stripe logo text (no image needed — just text)

5. **Transparency note** (small, gray text):
   > "100% of donations go toward server hosting costs. MasjidConnect GY is a non-profit community project. No salaries are paid from donations."

6. **Islamic dua** (bottom, Arabic + translation):
   > بارك الله فيك  
   > "May Allah bless you."

**State/logic:**
```typescript
const presets = [5, 10, 25, 50, 100]
const [selected, setSelected] = useState<number | null>(10)  // default $10
const [custom, setCustom] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const amountCents = selected !== null
  ? selected * 100
  : custom ? Math.round(parseFloat(custom) * 100) : 0

const handleDonate = async () => {
  if (amountCents < 100) { setError('Minimum donation is $1'); return }
  setLoading(true)
  setError(null)
  try {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountCents }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setError('Something went wrong. Please try again.')
    }
  } catch {
    setError('Connection error. Please try again.')
  } finally {
    setLoading(false)
  }
}
```

---

## Part 3 — Success Page

**File:** `app/support/success/page.tsx`

'use client' — reads `?session_id=` from URL (using `useSearchParams`).

Content:
- PageHero heroTheme="zakat", title="JazakAllah Khayran!", subtitle="May Allah accept your generosity"
- Large green checkmark icon
- "Your donation was received. بارك الله فيك"
- "Every dollar helps keep MasjidConnect GY free for the Guyanese Muslim community."
- Button: "Return Home" → `href="/"`
- Share button: "Tell a friend about MasjidConnect GY" (uses the existing share utility)

---

## Part 4 — Add "Support" Entry Points

### 4a. Explore page (`app/explore/page.tsx`)
Add a "Support the App" card to the existing grid. Find the community/tools section and add a card:
- Icon: Heart (💚 or Lucide `Heart`)
- Title: "Support the App"
- Subtitle: "Donate to keep it free"
- href: `/support`
- Color: amber/gold (`text-amber-400`, `border-amber-500/20`, `bg-amber-500/5`)

### 4b. Settings page (`app/settings/page.tsx`)
At the bottom of the settings page, add a support section:
```tsx
{/* Support */}
<div className="px-4 pb-4">
  <Link href="/support" className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 active:scale-[0.98] transition-transform">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-xl">🤲</div>
      <div>
        <p className="text-sm font-semibold text-white">Support the App</p>
        <p className="text-xs text-gray-400">Built fisabilillah — donate to help</p>
      </div>
    </div>
    <ChevronRight className="h-4 w-4 text-gray-500" />
  </Link>
</div>
```

---

## Part 5 — Build and Deploy

```bash
cd /home/karetech/v0-masjid-connect-gy
docker build -t ghcr.io/kareemschultz/v0-masjid-connect-gy:latest . -q && \
docker stop kt-masjidconnect-prod && docker rm kt-masjidconnect-prod && \
docker run -d --name kt-masjidconnect-prod --restart always --network pangolin --ip 172.20.0.24 --env-file .env.local ghcr.io/kareemschultz/v0-masjid-connect-gy:latest && \
docker network connect kt-net-apps kt-masjidconnect-prod && \
docker network connect kt-net-databases kt-masjidconnect-prod
```

Verify:
```bash
docker ps | grep kt-masjidconnect-prod
curl -s -o /dev/null -w "%{http_code}" https://masjidconnectgy.com/support
```

Expected: `200`

When completely finished, run:
openclaw system event --text "Done: Stripe donation page built — /support page with $5/$10/$25/$50/$100/custom amounts, Stripe Checkout integration, success page, linked from Explore and Settings. Add STRIPE_SECRET_KEY to .env.local to activate." --mode now

## Important Notes
- If Stripe keys are missing from .env.local, build should still succeed — the page will render but donation will fail with an error message
- Do NOT hardcode any Stripe keys in source code
- The Stripe Checkout is server-side (API route) — the publishable key is NOT needed on the frontend for this flow (we're just redirecting to Stripe's hosted page)
- `NEXT_PUBLIC_APP_URL` must be set correctly for the redirect URLs to work
