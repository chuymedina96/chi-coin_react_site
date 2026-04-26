import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger, slideLeft, slideRight } from '../hooks/useScrollAnimation'

const allocation = [
  { label: 'Community Treasury', pct: 60, color: '#E53950', desc: 'DAO-governed grants, loans, and direct neighborhood investment' },
  { label: 'Market Stability',   pct: 35, color: '#0F5EA8', desc: 'Price stability reserve + AMM liquidity pool — protects the economy' },
  { label: 'Core Team',          pct: 5,  color: '#41B6E6', desc: 'Vested over 4 years — builders stay aligned with the community long-term' },
]

const principles = [
  { title: '1% Wallet Cap',      body: 'No single wallet can hold more than 1M CHI — prevents wealth concentration.' },
  { title: '1% Burn on Transfer', body: 'Every on-chain transfer reduces circulating supply, supporting long-term value.' },
  { title: '1-Person-1-Vote',    body: 'Governance is identity-based. Wealth cannot buy political power in this community.' },
  { title: 'Starter Balance',    body: 'Every new user receives starter CHI so the economy begins immediately.' },
]

function DonutChart({ segments }) {
  const size = 260
  const cx = size / 2, cy = size / 2
  const r = 95, inner = 58
  let cumulative = 0

  const arcs = segments.map(seg => {
    const start = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
    cumulative += seg.pct
    const end   = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
    const large = seg.pct > 50 ? 1 : 0
    const d = [
      `M ${cx + r * Math.cos(start)} ${cy + r * Math.sin(start)}`,
      `A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(end)} ${cy + r * Math.sin(end)}`,
      `L ${cx + inner * Math.cos(end)} ${cy + inner * Math.sin(end)}`,
      `A ${inner} ${inner} 0 ${large} 0 ${cx + inner * Math.cos(start)} ${cy + inner * Math.sin(start)}`,
      'Z',
    ].join(' ')
    return { ...seg, d }
  })

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill={arc.color} opacity={0.9} />
      ))}
      <circle cx={cx} cy={cy} r={inner - 4} fill="#EEF2F6" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#111827" fontSize="20" fontWeight="900" fontFamily="Inter,sans-serif">100M</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#66768A" fontSize="9" fontFamily="Inter,sans-serif">CHI COINS</text>
    </svg>
  )
}

export default function Tokenomics() {
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation()
  const { ref: chartRef, isInView: chartInView } = useScrollAnimation()
  const { ref: protsRef, isInView: protsInView } = useScrollAnimation()

  return (
    <section id="tokenomics" className="relative py-32 overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-chi-red/6 top-1/2 right-[-150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.p variants={fadeUp} className="text-chi-blue text-xs tracking-widest uppercase font-semibold mb-4">
            Tokenomics
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-ink">
            Community-first.
            <span className="text-gradient"> By design.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim">
            100,000,000 Chi Coins. Fixed total supply.
            The community always holds the majority.
          </motion.p>
        </motion.div>

        {/* Chart + legend */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            ref={chartRef}
            variants={slideLeft}
            initial="hidden"
            animate={chartInView ? 'visible' : 'hidden'}
            className="flex flex-col items-center gap-8"
          >
            <DonutChart segments={allocation} />
            {/* Legend */}
            <div className="flex flex-col gap-4 w-full max-w-xs">
              {allocation.map((a, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: a.color }} />
                  <span className="text-2xl font-black" style={{ color: a.color }}>{a.pct}%</span>
                  <div>
                    <div className="text-sm font-semibold text-ink">{a.label}</div>
                    <div className="text-xs text-ink-muted">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={slideRight}
            initial="hidden"
            animate={chartInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            <h3 className="text-3xl font-black leading-tight text-ink">
              A parallel economy
              <span className="text-chi-red"> powered by real activity</span>
            </h3>
            <p className="text-ink-dim leading-relaxed">
              Chi Coin runs alongside USD, not instead of it.
              Workers get paid in both — real cash immediately,
              CHI accumulating in the local economy.
            </p>
            <div className="glass rounded-2xl border border-chi-border p-6 flex flex-col gap-4">
              <p className="text-xs text-ink-muted uppercase tracking-widest">How the Economy Flows</p>
              {[
                ['1', 'Users start with starter CHI — join instantly'],
                ['2', 'Book services · Pay USD + CHI to providers'],
                ['3', 'CHI fee routes to community treasury'],
                ['4', 'Users run low → refill from market → real buy pressure'],
                ['5', 'Treasury grows → community votes on deployment'],
              ].map(([n, step]) => (
                <div key={n} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-soft-red border border-chi-red/25 flex items-center justify-center text-chi-red text-[9px] font-bold shrink-0 mt-0.5">{n}</div>
                  <p className="text-sm text-ink-dim">{step}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-faint italic">
              Built on Base L2 (Ethereum Layer 2) — audited smart contracts, low fees.
            </p>
          </motion.div>
        </div>

        {/* Principles */}
        <motion.div
          ref={protsRef}
          variants={stagger}
          initial="hidden"
          animate={protsInView ? 'visible' : 'hidden'}
        >
          <motion.h3 variants={fadeUp} className="text-2xl font-black text-center mb-10 text-ink">
            Built-in <span className="text-chi-red">Protection Rules</span>
          </motion.h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {principles.map((p, i) => (
              <motion.div key={i} variants={fadeUp} className="glass rounded-2xl p-6 border border-chi-border hover:border-chi-red/30 transition-colors text-center">
                <div className="w-10 h-10 rounded-xl bg-soft-red border border-chi-red/20 flex items-center justify-center mx-auto mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E53950" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="text-sm font-bold text-ink mb-2">{p.title}</div>
                <div className="text-xs text-ink-muted leading-relaxed">{p.body}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
