import { useState, useEffect } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise, TIERS, createPaymentIntent } from '../lib/stripe'

// ── Stripe CardElement appearance (matches light theme) ──────────────────
const CARD_STYLE = {
  style: {
    base: {
      color: '#111827',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#7D8DA1' },
    },
    invalid: { color: '#E53950', iconColor: '#E53950' },
  },
}

// ── Inner form (needs Stripe context) ────────────────────────────────────
function CheckoutForm({ initialTier, onSuccess, onClose }) {
  const stripe   = useStripe()
  const elements = useElements()

  const [tier,    setTier]    = useState(initialTier || 'community')
  const [custom,  setCustom]  = useState('')
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState('idle')   // idle | loading | success | error
  const [errMsg,  setErrMsg]  = useState('')

  const selectedTier  = TIERS.find(t => t.id === tier)
  const dollarAmount  = tier === 'custom'
    ? (parseFloat(custom) || 0)
    : selectedTier.amount
  const amountCents   = Math.round(dollarAmount * 100)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name || !email || dollarAmount < 1) return

    setStatus('loading')
    setErrMsg('')

    try {
      const { clientSecret, demo } = await createPaymentIntent({
        amountCents,
        tier,
        email,
        name,
      })

      if (demo) {
        // Demo mode — no real charge
        setStatus('success')
        return
      }

      if (!stripe || !elements) throw new Error('Stripe not loaded')

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
      })

      if (error) throw new Error(error.message)
      if (paymentIntent.status === 'succeeded') setStatus('success')

    } catch (err) {
      setErrMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
        <div className="w-20 h-20 rounded-full bg-soft-blue border-4 border-chi-blue flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0F5EA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-ink mb-2">
            {stripePromise ? `Thank you, ${name}!` : 'Demo complete!'}
          </h3>
          <p className="text-ink-dim max-w-xs mx-auto leading-relaxed">
            {stripePromise
              ? `Your $${dollarAmount.toLocaleString()} contribution is confirmed. You'll receive a receipt at ${email}.`
              : "This was a demo payment — no charge was made. Wire VITE_STRIPE_PK + VITE_API_URL to go live."}
          </p>
        </div>
        <div className="glass rounded-2xl border border-chi-border px-6 py-4 text-sm text-ink-dim text-left w-full max-w-xs">
          <p className="font-semibold text-ink mb-1">You'll receive:</p>
          {selectedTier?.id !== 'custom'
            ? TIERS.find(t => t.id === tier)
              ? <p className="text-chi-blue font-bold">{TIERS.find(t => t.id === tier).coins}</p>
              : null
            : <p className="text-chi-blue font-bold">Pro-rated CHI based on contribution</p>
          }
          <p className="text-ink-muted text-xs mt-1">Tokens distributed at launch</p>
        </div>
        <button onClick={onClose} className="btn-primary px-8 py-3">
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Tier selector */}
      <div>
        <label className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2 block">
          Contribution Tier
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TIERS.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTier(t.id)}
              className={`rounded-xl px-4 py-3 text-left border transition-all duration-200 ${
                tier === t.id
                  ? 'border-chi-blue bg-soft-blue'
                  : 'border-chi-border bg-white hover:border-chi-blue-light'
              }`}
            >
              <div className={`text-sm font-bold ${tier === t.id ? 'text-chi-blue' : 'text-ink'}`}>
                {t.amount ? `$${t.amount.toLocaleString()}` : 'Custom'}
              </div>
              <div className="text-[10px] text-ink-muted">{t.coins}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      {tier === 'custom' && (
        <div>
          <label className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2 block">
            Custom Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted font-semibold">$</span>
            <input
              type="number"
              min="1"
              step="1"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-7 pr-4 py-3 rounded-xl border border-chi-border bg-white text-ink placeholder-ink-faint focus:outline-none focus:border-chi-blue transition-colors text-sm"
              required
            />
          </div>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-3 py-3 rounded-xl border border-chi-border bg-white text-ink placeholder-ink-faint focus:outline-none focus:border-chi-blue transition-colors text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="w-full px-3 py-3 rounded-xl border border-chi-border bg-white text-ink placeholder-ink-faint focus:outline-none focus:border-chi-blue transition-colors text-sm"
          />
        </div>
      </div>

      {/* Card Element */}
      <div>
        <label className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2 block">
          Card Details
        </label>
        {stripePromise ? (
          <div className="px-4 py-3.5 rounded-xl border border-chi-border bg-white focus-within:border-chi-blue transition-colors">
            <CardElement options={CARD_STYLE} />
          </div>
        ) : (
          <div className="px-4 py-3.5 rounded-xl border border-chi-border bg-bg-dark text-center">
            <p className="text-xs text-ink-muted">
              💳 Card field — add <code className="bg-soft-blue px-1 rounded text-chi-blue">VITE_STRIPE_PK</code> to activate
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {status === 'error' && (
        <div className="rounded-xl bg-soft-red border border-chi-red/25 px-4 py-3 text-sm text-chi-red">
          {errMsg}
        </div>
      )}

      {/* Demo mode notice */}
      {!stripePromise && (
        <div className="rounded-xl bg-soft-blue border border-chi-blue/20 px-4 py-3 text-xs text-chi-blue leading-relaxed">
          <strong>Demo mode</strong> — no real charge will occur. Add your Stripe publishable key to activate live payments.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading' || dollarAmount < 1 || !name || !email}
        className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {status === 'loading' ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Processing…
          </span>
        ) : (
          `Contribute $${dollarAmount > 0 ? dollarAmount.toLocaleString() : '—'}`
        )}
      </button>

      <p className="text-center text-[10px] text-ink-faint leading-relaxed">
        Secured by Stripe · Contributions support Chi Coin's launch · Tokens distributed at launch
      </p>
    </form>
  )
}

// ── Modal shell ───────────────────────────────────────────────────────────
export default function DonateModal({ isOpen, onClose, initialTier }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else        document.body.style.overflow = ''
    return ()  => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(17,24,39,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-chi-border sticky top-0 bg-white rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <img src="/chicoin-logo.png" alt="Chi Coin" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="text-lg font-black text-ink leading-tight">Support Chi Coin</h2>
              <p className="text-xs text-ink-muted">Bridging Chicago Neighborhoods</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-bg-dark flex items-center justify-center text-ink-muted hover:text-ink hover:bg-chi-border transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        {/* Elements is safe with stripe={null} — hooks return null, demo mode handles it */}
        <div className="px-7 py-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm initialTier={initialTier} onSuccess={() => {}} onClose={onClose} />
          </Elements>
        </div>
      </div>
    </div>
  )
}
