import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation'

// From chi_coin_strategy.txt Section 4 — exact numbers, no fabrication
const priceRows = [
  { price: '$0.01', treasury: '$600K',  reserve: '$300K',  combined: '$900K',   label: 'Launch Day',     note: 'Economy begins. App live. 50-merchant pilot.' },
  { price: '$0.05', treasury: '$3M',    reserve: '$1.5M',  combined: '$4.5M',   label: 'Early Growth',   note: 'CHI in regular circulation. Refill demand building.' },
  { price: '$0.20', treasury: '$12M',   reserve: '$6M',    combined: '$18M',    label: 'Real Traction',  note: 'Hundreds of businesses. First DAO grants safe to deploy.' },
  { price: '$1.00', treasury: '$60M',   reserve: '$30M',   combined: '$90M',    label: 'City-Wide Scale',note: 'Deep liquidity. Treasury can fund major community projects.' },
  { price: '$5.00', treasury: '$300M',  reserve: '$150M',  combined: '$450M',   label: 'National Model', note: 'Chicago proven. Other cities building their own versions.' },
  { price: '$10.00',treasury: '$600M',  reserve: '$300M',  combined: '$900M',   label: 'Generational',   note: 'A self-sustaining community economy. The goal realized.' },
]

// The 9-step flywheel from the strategy doc
const flywheel = [
  'Users start with starter CHI — they join without buying anything first',
  'Users spend CHI on local services (haircuts, lawn care, tutoring)',
  'Providers accumulate CHI as part of their payment',
  'Customers eventually run low on CHI and need to refill',
  'Customers buy CHI through the AMM — real buy pressure',
  'Buy pressure pushes the CHI price up in the pool',
  'Rising price raises treasury & reserve value (mark-to-market)',
  'The protocol periodically adds matched liquidity to deepen the pool',
  'Deeper pool → less slippage → safer DAO grants → more community investment',
]

export default function TreasuryVision() {
  const { ref: titleRef,  isInView: titleInView  } = useScrollAnimation()
  const { ref: how1Ref,   isInView: how1InView   } = useScrollAnimation()
  const { ref: flyRef,    isInView: flyInView    } = useScrollAnimation()
  const { ref: tableRef,  isInView: tableInView  } = useScrollAnimation()
  const { ref: quoteRef,  isInView: quoteInView  } = useScrollAnimation()

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-chi-blue/6 top-0 right-[-150px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-chi-red/5 bottom-0 left-[-100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.p variants={fadeUp} className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-4">
            How the Treasury Works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-ink">
            $50K seeds it.
            <span className="text-gradient"> Real activity grows it.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim leading-relaxed">
            The $50,000 we're raising isn't the treasury. It's the ignition —
            the USDC that starts the market. From there, every neighbor who buys
            a haircut or books lawn care is what makes the treasury grow.
          </motion.p>
        </motion.div>

        {/* ── How the $50K works ──────────────────────────────────────────── */}
        <motion.div
          ref={how1Ref}
          initial={{ opacity: 0, y: 32 }}
          animate={how1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <h3 className="text-xl font-black text-ink mb-6 text-center">What happens on Day 1</h3>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { step: '1', title: '$50K USDC raised', sub: 'From donors & supporters like you', color: 'chi-red' },
              { step: '2', title: 'Paired with 5M CHI', sub: 'Sets starting price at $0.01 per CHI', color: 'chi-blue' },
              { step: '3', title: '$900K combined treasury', sub: '60M CHI + 30M reserve × $0.01', color: 'chi-blue-light' },
            ].map((s, i) => (
              <div key={i} className="glass rounded-2xl border border-chi-border p-5 text-center">
                <div className={`w-9 h-9 rounded-full bg-${s.color}/15 border border-${s.color}/30 flex items-center justify-center mx-auto mb-3`}>
                  <span className={`text-sm font-black text-${s.color}`}>{s.step}</span>
                </div>
                <p className="text-sm font-bold text-ink mb-1">{s.title}</p>
                <p className="text-xs text-ink-muted">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Important clarification */}
          <div className="glass rounded-2xl border border-chi-blue/20 p-6 bg-soft-blue/40">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-chi-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 1v4M5 8v.5" stroke="#0F5EA8" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-chi-blue mb-1">Treasury value ≠ treasury cash</p>
                <p className="text-sm text-ink-dim leading-relaxed">
                  The $900K is a <em>mark-to-market value</em> — what the CHI is worth at the launch price.
                  It doesn't mean $900K cash sitting in a wallet. As the economy grows and CHI price rises,
                  that mark-to-market value grows. The DAO only spends what the market depth can safely support.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── The Flywheel ─────────────────────────────────────────────────── */}
        <motion.div
          ref={flyRef}
          initial={{ opacity: 0, y: 32 }}
          animate={flyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <h3 className="text-xl font-black text-ink mb-2 text-center">How real activity grows the treasury</h3>
          <p className="text-sm text-ink-muted text-center mb-8">Not every transaction hits the AMM. But every transaction eventually does.</p>
          <div className="flex flex-col gap-2">
            {flywheel.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={flyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex items-start gap-4 glass rounded-xl border border-chi-border px-5 py-3.5"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                  i < 4 ? 'bg-soft-red border border-chi-red/25 text-chi-red' :
                  i < 7 ? 'bg-soft-blue border border-chi-blue/25 text-chi-blue' :
                  'bg-chi-border border border-chi-border-soft text-ink-muted'
                }`}>{i + 1}</div>
                <p className="text-sm text-ink-dim leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Price → Treasury Value table ─────────────────────────────────── */}
        <motion.div
          ref={tableRef}
          initial={{ opacity: 0, y: 32 }}
          animate={tableInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <h3 className="text-xl font-black text-ink mb-2 text-center">What does a $1B treasury actually mean?</h3>
          <p className="text-sm text-ink-muted text-center mb-8">
            These numbers come directly from the Chi Coin strategy. They're what happens
            when CHI price rises from real demand — not promises, not projections pulled from thin air.
          </p>

          <div className="glass rounded-2xl border border-chi-border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 gap-0 bg-bg-dark border-b border-chi-border px-4 py-3">
              <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">CHI Price</div>
              <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Treasury</div>
              <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Reserve</div>
              <div className="text-[10px] font-bold text-chi-blue uppercase tracking-widest">Combined</div>
              <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Stage</div>
            </div>

            {priceRows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={tableInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                className={`grid grid-cols-5 gap-0 px-4 py-4 border-b border-chi-border last:border-0 transition-colors group hover:bg-soft-blue/30 ${i === 0 ? 'bg-soft-red/20' : ''}`}
              >
                <div className="font-black text-sm text-ink">{row.price}</div>
                <div className="text-sm text-ink-dim">{row.treasury}</div>
                <div className="text-sm text-ink-dim">{row.reserve}</div>
                <div className="font-bold text-sm text-chi-blue">{row.combined}</div>
                <div>
                  <div className="text-[10px] font-semibold text-ink-muted">{row.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Notes row */}
          <div className="grid grid-cols-1 gap-3 mt-4">
            {priceRows.map((row, i) => (
              <div key={i} className={`flex items-center gap-3 text-xs text-ink-muted ${i > 2 ? 'hidden sm:flex' : ''}`}>
                <span className="font-bold text-ink shrink-0">{row.price}</span>
                <span className="text-chi-blue font-semibold shrink-0">{row.combined}</span>
                <span>— {row.note}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Replication vision + pull quote ─────────────────────────────── */}
        <motion.div
          ref={quoteRef}
          initial={{ opacity: 0, y: 40 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl border border-chi-blue/20 p-10 md:p-14 text-center max-w-3xl mx-auto"
        >
          <img src="/chicoin-logo.png" alt="Chi Coin" className="w-20 h-20 rounded-full object-cover mx-auto mb-6 shadow-lg shadow-chi-blue/15" />
          <p className="text-xl sm:text-2xl font-light text-ink leading-relaxed italic mb-4">
            "The goal is not just one successful coin.
            The goal is a new model for local economic self-determination —
            Chicago proves it first, then other cities build their own."
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-chi-red/40" />
            <span className="text-chi-red text-sm font-semibold">Chi Coin Strategy · April 2026</span>
            <div className="w-8 h-px bg-chi-red/40" />
          </div>
          <p className="text-sm text-ink-muted max-w-xl mx-auto">
            Once Chicago proves the model, other cities harmed by redlining —
            Detroit, Baltimore, St. Louis — can launch their own locally controlled economies
            using Chi Coin's open framework. One coin per city. Owned by that city.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
