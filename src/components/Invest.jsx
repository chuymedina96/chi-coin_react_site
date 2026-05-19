import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation'

// ── Update RAISED as real contributions come in ────────────────────────────
const GOAL   = 50_000
const RAISED = 0          // ← update this as donations come in
const PCT    = Math.min(Math.round((RAISED / GOAL) * 100), 100)

export default function Invest({ onDonate }) {
  const { ref: titleRef,    isInView: titleInView    } = useScrollAnimation()
  const { ref: progressRef, isInView: progressInView } = useScrollAnimation()
  const { ref: ctaRef,      isInView: ctaInView      } = useScrollAnimation()

  return (
    <section id="invest" className="relative py-32 overflow-hidden">
      <div className="orb w-[700px] h-[700px] bg-chi-blue/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.p variants={fadeUp} className="text-chi-blue text-xs tracking-widest uppercase font-semibold mb-4">
            Support the Launch
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-ink">
            Invest in the
            <span className="text-gradient"> next economy</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim">
            Every dollar you contribute helps launch the Chi Coin economy —
            and you receive Chi Coins in return, distributed at launch.
          </motion.p>
        </motion.div>

        {/* ── Fundraising Progress Bar ─────────────────────────────────────── */}
        <motion.div
          ref={progressRef}
          initial={{ opacity: 0, y: 32 }}
          animate={progressInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7 }}
          className="glass rounded-2xl border border-chi-border p-8 mb-20 max-w-3xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs text-ink-muted uppercase tracking-widest font-semibold mb-1">Launch Funding Goal</p>
              <p className="text-2xl font-black text-ink">
                ${RAISED.toLocaleString()}
                <span className="text-ink-muted font-medium text-base"> raised of </span>
                <span className="text-chi-red">${GOAL.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-3xl font-black text-chi-blue">{PCT}%</p>
                <p className="text-xs text-ink-muted">funded</p>
              </div>
              <button
                onClick={() => onDonate?.()}
                className="btn-primary px-6 py-3 text-sm whitespace-nowrap"
              >
                Donate Now
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-chi-border rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={progressInView ? { width: `${Math.max(PCT, 2)}%` } : { width: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-3 rounded-full bg-gradient-to-r from-chi-red to-chi-blue"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-ink-faint">
              USDC accepted · CHI tokens distributed at launch · Secured by Stripe
            </p>
            <a
              href="mailto:invest@chicoin.xyz"
              className="text-xs font-bold text-chi-blue hover:text-chi-blue-light transition-colors"
            >
              Questions? Email us →
            </a>
          </div>
        </motion.div>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <motion.div
          ref={ctaRef}
          variants={fadeUp}
          initial="hidden"
          animate={ctaInView ? 'visible' : 'hidden'}
          className="glass rounded-3xl border border-chi-blue/20 p-10 md:p-16 text-center glow-blue"
        >
          <img src="/chicoin-logo.png" alt="Chi Coin" className="w-16 h-16 rounded-full object-cover mx-auto mb-6 shadow-md shadow-chi-blue/15" />
          <h3 className="text-3xl md:text-4xl font-black mb-4 text-ink">
            Ready to build Chicago's
            <span className="text-chi-blue"> economic future?</span>
          </h3>
          <p className="text-ink-dim mb-8 max-w-xl mx-auto">
            Join early supporters — community members, local businesses, and impact investors —
            who believe Chicago's South and West Sides can reclaim their wealth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onDonate?.()}
              className="btn-primary text-sm px-8 py-4"
            >
              Contribute Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <a
              href="mailto:invest@chicoin.xyz?subject=Chi%20Coin%20%E2%80%94%20Let%27s%20Talk"
              className="btn-outline text-sm px-8 py-4"
            >
              Email Us Directly
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
