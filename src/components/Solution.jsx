import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, fadeIn, stagger, slideLeft, slideRight } from '../hooks/useScrollAnimation'

const pillars = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Parallel Economy',
    body: 'Services are priced USD + CHI. Workers keep real cash; CHI circulates locally. No one has to go all-in on crypto to participate.',
    color: 'text-chi-red',
    border: 'border-chi-red/25 hover:border-chi-red/50',
    bg: 'bg-soft-red',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    title: 'Community Treasury',
    body: '60% of all CHI funds a DAO treasury controlled by neighborhood councils — grants, loans, and direct community investment.',
    color: 'text-chi-blue',
    border: 'border-chi-blue/25 hover:border-chi-blue/50',
    bg: 'bg-soft-blue',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    title: 'Anti-Manipulation',
    body: '1% wallet cap, 1% burn on transfers, governance by identity not tokens. Whales can\'t buy political power in this economy.',
    color: 'text-ink',
    border: 'border-chi-border hover:border-chi-border-soft',
    bg: 'bg-bg-card-2',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Local Merchant Network',
    body: 'Book services, pay neighbors, support local businesses. Every transaction keeps value circulating inside the community.',
    color: 'text-chi-red',
    border: 'border-chi-red/25 hover:border-chi-red/50',
    bg: 'bg-soft-red',
  },
]

export default function Solution() {
  const { ref: titleRef,   isInView: titleInView   } = useScrollAnimation()
  const { ref: pillarsRef, isInView: pillarsInView } = useScrollAnimation()
  const { ref: quoteRef,   isInView: quoteInView   } = useScrollAnimation()

  return (
    <section id="solution" className="relative py-32 overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-chi-blue/8 bottom-0 left-[-100px] pointer-events-none" />
      <div className="orb w-[250px] h-[250px] bg-chi-red/6 top-20 right-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.p variants={fadeUp} className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-4">
            The Solution
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-ink">
            A new local economy.
            <span className="text-gradient"> Built from the ground up.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim leading-relaxed">
            Chi Coin is local economic infrastructure — a payment rail, a services marketplace,
            a community treasury, and a governance layer. Everything neighbors need
            to build real wealth together, in one app.
          </motion.p>
        </motion.div>

        <motion.div
          ref={pillarsRef}
          variants={stagger}
          initial="hidden"
          animate={pillarsInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`glass rounded-2xl p-7 border ${p.border} hover:scale-[1.02] transition-all duration-300 group`}
            >
              <div className={`w-12 h-12 rounded-xl ${p.bg} border border-chi-border flex items-center justify-center ${p.color} mb-5`}>
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-ink mb-2">{p.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pull quote */}
        <motion.div
          ref={quoteRef}
          variants={fadeIn}
          initial="hidden"
          animate={quoteInView ? 'visible' : 'hidden'}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="glass rounded-3xl p-10 md:p-16 border border-chi-red/20 glow-red">
            <div className="text-6xl text-chi-red/30 font-serif leading-none mb-4">&ldquo;</div>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-ink leading-relaxed italic mb-6">
              When neighbors spend with each other, money stays local.
              When money stays local, neighborhoods grow stronger.
              Chi Coin is the infrastructure that makes it happen.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-px bg-chi-red/40" />
              <span className="text-chi-red text-sm font-medium">Chi Coin Vision</span>
              <div className="w-8 h-px bg-chi-red/40" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
