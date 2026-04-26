import { loadStripe } from '@stripe/stripe-js'

// Drop your publishable key in .env as VITE_STRIPE_PK
const pk = import.meta.env.VITE_STRIPE_PK || ''
export const stripePromise = pk ? loadStripe(pk) : null

// Tier definitions — single source of truth shared by DonateModal + Invest
export const TIERS = [
  { id: 'community',   label: 'Community',   amount: 100,    coins: '1,000 CHI'  },
  { id: 'neighbor',    label: 'Neighbor',    amount: 1000,   coins: '11,000 CHI' },
  { id: 'block_club',  label: 'Block Club',  amount: 10000,  coins: '125,000 CHI'},
  { id: 'custom',      label: 'Custom',      amount: null,   coins: 'Pro-rated'  },
]

/**
 * createPaymentIntent — calls your backend to get a Stripe client_secret.
 *
 * TODO: Replace the mock below with a real call once your backend is live.
 *
 * Your backend endpoint (e.g. POST /api/create-payment-intent) should:
 *   1. Receive { amountCents, tier, email, name }
 *   2. Call stripe.paymentIntents.create({ amount: amountCents, currency: 'usd', ... })
 *   3. Return { clientSecret: paymentIntent.client_secret }
 */
export async function createPaymentIntent({ amountCents, tier, email, name }) {
  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiUrl) {
    // ── DEMO MODE: no backend wired yet ──────────────────────────────────
    console.warn('[ChiCoin] Demo mode — no VITE_API_URL set. Simulating payment.')
    await new Promise(r => setTimeout(r, 1400))
    return { clientSecret: null, demo: true }
  }

  const res = await fetch(`${apiUrl}/api/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountCents, tier, email, name }),
  })
  if (!res.ok) throw new Error('Failed to create payment intent')
  return res.json()
}
