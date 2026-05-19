import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation'

const phases = [
  {
    phase: 'Phase 1',
    period: 'Q3 2025 through Q1 2026',
    title: 'Foundation',
    status: 'active',
    items: [
      'Smart contract audit and deployment on Solana',
      'Mobile app launch on iOS and Android',
      'Pilot merchant network with 50 South Side businesses',
      'Community treasury DAO formation',
      'Financial literacy curriculum launch',
    ],
  },
  {
    phase: 'Phase 2',
    period: 'Q2 2026 through Q4 2026',
    title: 'Growth',
    status: 'upcoming',
    items: [
      'Public token sale with community-priority allocation',
      'Expand to 200 or more merchant partners',
      'Neighborhood council governance goes live',
      'First community grant round at $500K',
      'West Side expansion',
    ],
  },
  {
    phase: 'Phase 3',
    period: '2027',
    title: 'Scale',
    status: 'future',
    items: [
      'Chi Coin debit card (Visa/Mastercard network)',
      'Micro-lending protocol for small businesses',
      'Cross-city partnerships (Detroit, St. Louis, Baltimore)',
      'Chicago Public Schools financial literacy integration',
      'Real estate investment DAO',
    ],
  },
  {
    phase: 'Phase 4',
    period: '2028+',
    title: 'Legacy',
    status: 'future',
    items: [
      'National community currency network',
      'Federal advocacy for crypto equity frameworks',
      'University partnerships and research programs',
      'International South Side diaspora connections',
      '10,000+ participating businesses',
    ],
  },
]

const statusStyles = {
  active:   { dot: 'bg-chi-blue animate-pulse', border: 'border-chi-blue/40', badge: 'bg-soft-blue text-chi-blue border-chi-blue/30', label: 'In Progress' },
  upcoming: { dot: 'bg-chi-blue-light',          border: 'border-chi-blue-light/30', badge: 'bg-soft-blue text-chi-blue-light border-chi-blue-light/30', label: 'Upcoming' },
  future:   { dot: 'bg-ink-faint',              border: 'border-chi-border',   badge: 'bg-bg-dark text-ink-faint border-chi-border', label: 'Future' },
}

export default function Roadmap() {
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation()
  const { ref: timeRef,  isInView: timeInView  } = useScrollAnimation()

  return (
    <section id="roadmap" className="relative py-32 overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-chi-blue/6 top-0 left-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.p variants={fadeUp} className="text-chi-blue text-xs tracking-widest uppercase font-semibold mb-4">
            Roadmap
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-ink">
            The path to
            <span className="text-gradient"> economic justice</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim">
            Here is where we are headed and what we are focused on right now.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          ref={timeRef}
          variants={stagger}
          initial="hidden"
          animate={timeInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {phases.map((p, i) => {
            const s = statusStyles[p.status]
            return (
              <motion.div key={i} variants={fadeUp} className={`glass rounded-2xl p-7 border ${s.border} flex flex-col gap-5`}>
                {/* Phase header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                    <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">{p.phase}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${s.badge}`}>{s.label}</span>
                </div>

                <div>
                  <div className="text-lg font-black text-ink mb-1">{p.title}</div>
                  <div className="text-xs text-ink-faint">{p.period}</div>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-ink-faint mt-2 shrink-0" />
                      <span className="text-xs text-ink-dim leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
