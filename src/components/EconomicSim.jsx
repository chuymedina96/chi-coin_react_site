import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation'

// ─────────────────────────────────────────────────────────────────────────────
// REAL SIMULATION DATA — run: demo_20260505_2000 (May 5, 2026)
// ─────────────────────────────────────────────────────────────────────────────
const SIM = {
  date: 'May 5, 2026',
  neighbors: 1000, neighborhoods: 15, serviceCategories: 34,
  serviceTxs: 10000, windowMonths: 6, ammTrades: 400000,
  ammTradeSize: 5, ammUsdcIn: 2000000,
  startPrice: 0.01, finalPrice: 4.050949,
  chiVolume: 201070.81, usdVolume: 264460.29,
  burnedChi: 2010.71, treasuryFeesChi: 4021.42,
  liquidityReserveUsd: 5289.21, dexSwapFeesChi: 1753.80,
  treasuryChiHeld: 60000000,
  treasuryValueAtFinal: 243000000,
  reserveValueAtFinal: 121500000,
  combinedValue: 364500000,
}

function useCounter(target, duration = 1800, active = false, decimals = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setValue(parseFloat((ease * target).toFixed(decimals)))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration, decimals])
  return value
}

const AMM_CURVE = [
  { trades: 0,      price: 0.01   },
  { trades: 38000,  price: 0.05   },
  { trades: 75000,  price: 0.10   },
  { trades: 145000, price: 0.25   },
  { trades: 212000, price: 0.50   },
  { trades: 295000, price: 1.00   },
  { trades: 345000, price: 2.00   },
  { trades: 390000, price: 3.00   },
  { trades: 400000, price: 4.05   },
]

function AmmChart({ active }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const go = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 2400, 1)
      setProgress(p)
      if (p < 1) requestAnimationFrame(go)
    }
    requestAnimationFrame(go)
  }, [active])

  const W = 520; const H = 210
  const pad = { l: 52, r: 20, t: 16, b: 44 }
  const cW = W - pad.l - pad.r; const cH = H - pad.t - pad.b

  const pts = AMM_CURVE.map((p) => ({
    x: pad.l + (p.trades / 400000) * cW,
    y: pad.t + cH - (Math.log10(p.price + 0.01) / Math.log10(4.06)) * cH,
    ...p,
  }))

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaD = `${pathD} L${pts.at(-1).x.toFixed(1)},${(pad.t + cH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t + cH).toFixed(1)}Z`
  const activeIdx = Math.min(Math.floor(progress * (pts.length - 1)), pts.length - 1)

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 220 }}>
        <defs>
          <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0F5EA8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0F5EA8" stopOpacity="0.02" />
          </linearGradient>
          <clipPath id="simClip">
            <rect x={pad.l} y={pad.t - 4} width={progress * cW} height={cH + 8} />
          </clipPath>
        </defs>
        {[0.01, 0.10, 0.50, 1.00, 2.00, 4.05].map((p) => {
          const y = pad.t + cH - (Math.log10(p + 0.01) / Math.log10(4.06)) * cH
          return (
            <g key={p}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#D1DCE8" strokeWidth="0.5" strokeDasharray="4,4" />
              <text x={pad.l - 5} y={y + 3.5} textAnchor="end" fill="#8FA4B8" fontSize="9">${p}</text>
            </g>
          )
        })}
        <path d={areaD} fill="url(#simGrad)" clipPath="url(#simClip)" />
        <path d={pathD} fill="none" stroke="#0F5EA8" strokeWidth="2.5" strokeLinecap="round" clipPath="url(#simClip)" />
        {pts.map((p, i) => i <= activeIdx && (
          <circle key={i} cx={p.x} cy={p.y} r={i === activeIdx ? 5.5 : 3}
            fill={i === activeIdx ? '#E53950' : '#0F5EA8'} stroke="white" strokeWidth="1.5" />
        ))}
        {progress > 0.95 && (
          <g>
            <rect x={W - pad.r - 72} y={pad.t} width={68} height={24} rx="6" fill="#E53950" />
            <text x={W - pad.r - 38} y={pad.t + 16} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">$4.05 / CHI</text>
          </g>
        )}
        <text x={pad.l} y={H - 8} fill="#8FA4B8" fontSize="9">Launch</text>
        <text x={pad.l + cW / 2} y={H - 8} textAnchor="middle" fill="#8FA4B8" fontSize="9">200K DEX buys ($1M in)</text>
        <text x={W - pad.r} y={H - 8} textAnchor="end" fill="#8FA4B8" fontSize="9">400K buys ($2M in)</text>
      </svg>
      <p className="text-[10px] text-ink-faint text-center mt-1">
        Real constant-product AMM math (x×y=k) · 5M CHI / $50K USDC starting pool · $5 USDC per buy
      </p>
    </div>
  )
}

function TreasuryBar({ active }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const go = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 1600, 1)
      setPct(1 - Math.pow(1 - p, 2))
      if (p < 1) requestAnimationFrame(go)
    }
    requestAnimationFrame(go)
  }, [active])

  return (
    <div className="flex flex-col gap-5">
      {[
        { label: 'Community Treasury', chi: '60M CHI', value: '$243M', widthPct: 66.7, color: '#0F5EA8' },
        { label: 'Off-Market Reserve', chi: '30M CHI', value: '$121.5M', widthPct: 33.3, color: '#E53950' },
      ].map((b, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-bold text-ink">{b.label}</span>
            <span className="text-xs text-ink-muted">{b.chi} × $4.05</span>
          </div>
          <div className="w-full bg-chi-border rounded-full h-7 overflow-hidden">
            <div
              className="h-7 rounded-full flex items-center px-4 transition-all"
              style={{ width: `${b.widthPct * pct}%`, background: b.color, minWidth: pct > 0.1 ? 60 : 0 }}
            >
              {pct > 0.4 && <span className="text-white text-sm font-black whitespace-nowrap">{b.value}</span>}
            </div>
          </div>
        </div>
      ))}
      <div className="glass rounded-xl border border-chi-blue/30 px-5 py-4 flex justify-between items-center">
        <span className="text-sm font-bold text-ink">Combined at $4.05/CHI</span>
        <span className="text-2xl font-black text-chi-blue">${((364.5) * pct).toFixed(0)}M+</span>
      </div>
    </div>
  )
}

const SCRIPT_STEPS = [
  {
    n: '01', color: 'border-chi-blue/30', dot: 'bg-chi-blue',
    title: '1,000 Chicago neighbors created with real jobs and wallets',
    plain: 'The script generated 1,000 realistic Chicago residents — barbers, tutors, childcare workers, drivers, cooks, handymen — spread across 15 neighborhoods like Englewood, Little Village, Bronzeville, and Pilsen. Each person got a profile, a job, and a wallet loaded with 100 CHI as a starter balance. These are not abstract wallet addresses. They are simulated people with bios, skills, and services to offer.',
    code: 'Faker library + custom OCCUPATION_PROFILES array. 15 Chicago neighborhoods. Each wallet seeded 100 CHI from treasury at $0.01/CHI.',
  },
  {
    n: '02', color: 'border-chi-red/30', dot: 'bg-chi-red',
    title: '34 real neighborhood services listed at real prices',
    plain: 'Each neighbor listed the services they could offer: fades and braids, math tutoring, babysitting, house cleaning, meal prep, TV mounting, music sessions, portrait photography. These are the exact services a South Side neighborhood economy actually runs on — not hypothetical products. Every service was priced in both USD and CHI, the way the parallel economy works.',
    code: '34 SERVICE_TEMPLATES entries. Dual pricing: USD + CHI. Example: Fade & Line-Up = $20 USD + 15 CHI. Price jitter ±$2-3 to simulate market variety.',
  },
  {
    n: '03', color: 'border-chi-blue/30', dot: 'bg-chi-blue',
    title: 'Phase 1 — 10,000 neighbor-to-neighbor service transactions',
    plain: 'The script ran 10,000 bookings between neighbors. A resident in Englewood books a haircut from someone in Bronzeville. Every transaction splits into two parallel flows: the USD side sends 2% to the liquidity reserve — strengthening the pool that backs CHI on the market. The CHI side burns 1% permanently and routes 2% to the citywide DAO treasury. The other 97% goes straight to the provider. Both pools grow with every transaction.',
    code: 'CHI_BURN_RATE=1%, CHI_TREASURY_FEE_RATE=2% → DAO treasury. USD_LIQUIDITY_FEE_RATE=2% → liquidity reserve. Parallel economy: both USD and CHI tracked separately per transaction. 6-month window.',
  },
  {
    n: '04', color: 'border-chi-red/30', dot: 'bg-chi-red',
    title: 'Depleted wallets trigger real DEX buys',
    plain: 'When a neighbor spends enough CHI that their wallet drops below 30 CHI, the script simulates them going to the exchange and buying more CHI with real USD. This is the key moment in the whole simulation. That DEX purchase pushes USDC into the liquidity pool and CHI out. The price moves up. No manipulation — that is just what happens when you buy something that has limited supply.',
    code: 'WALLET_TOPUP_THRESHOLD_ESC=30. _simulate_dex_topup_for_user() uses live AMM reserves. 0.3% DEX swap fee split 50/50 between liquidity reserve and treasury.',
  },
  {
    n: '05', color: 'border-chi-blue/30', dot: 'bg-chi-blue',
    title: 'Phase 2 — 400,000 AMM trades run using Uniswap-style math',
    plain: 'Once the 10,000 service transactions finished, the script entered a second phase: a standalone AMM price simulation. This models what happens as the city scales up and more people buy CHI from the exchange. 400,000 buy trades at $5 each. Separate from the service economy — this is the exchange activity, not neighbor-to-neighbor payments. The formula is x×y=k, the same constant-product math that powers Uniswap. Every buy is small, which matters: thousands of people topping up $5 or $10 at a time cause far less slippage than a handful of large trades. The pool handled all 400,000 with no injection needed.',
    code: 'Phase 2: _run_amm_price_sim() — runs AFTER service sim. x×y=k constant-product. Starting pool taken from end of Phase 1. 400,000 × $5 = $2,000,000 USDC into pool. Zero --amm-inject flags.',
  },
  {
    n: '06', color: 'border-chi-red/30', dot: 'bg-chi-red',
    title: 'Price hit $4.05 — treasury worth $243 million',
    plain: 'After 400,000 organic buy trades, the CHI price reached $4.05 — with zero liquidity injections needed. The pool still had approximately 506,000 CHI remaining. The reason it held up all the way to $4.05 without intervention is that every single buy was small. Small distributed wallet top-ups are the most pool-friendly demand pattern possible. The injection infrastructure exists as a safety net for large trades or whale activity. The simulation proved it was not needed for organic community demand. At $4.05, the citywide DAO treasury is worth $243 million and combined community holdings hit $364.5 million.',
    code: 'Final pool: ~$2.05M USDC / ~506K CHI → $4.050949/CHI. Zero --amm-inject flags used. Pool survived 400K trades without injection. DAO treasury: 60M × $4.05 = $243M.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Community programs the treasury could fund
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMS = [
  {
    category: 'Housing',
    color: '#0F5EA8',
    icon: '🏠',
    title: 'Community Land Trust Fund',
    cost: '$5M–$15M',
    impact: '500–2,000 families',
    desc: 'Purchase and permanently protect land on the South and West Sides so that affordable housing can never be flipped by developers. Residents own their homes. The community owns the land beneath them. Generational housing security — the thing redlining specifically denied.',
  },
  {
    category: 'Small Business',
    color: '#E53950',
    icon: '✊',
    title: 'Micro-Grant Program for Local Businesses',
    cost: '$10K–$50K per grant',
    impact: 'Hundreds of businesses',
    desc: 'Direct DAO-voted grants to Black and Latino/a owned businesses — barbershops, restaurants, construction firms, childcare providers. No bank required. No credit score gatekeeping. The community votes on who gets funded.',
  },
  {
    category: 'Youth',
    color: '#0F5EA8',
    icon: '🎓',
    title: 'South & West Side Scholarship Fund',
    cost: '$500K–$2M/year',
    impact: 'Hundreds of students annually',
    desc: 'Annual scholarships for students from redlined zip codes. Not competitive applications written by people with resources. If you live in Englewood, Austin, Little Village, or Roseland — you qualify.',
  },
  {
    category: 'Green Energy',
    color: '#3DAA6F',
    icon: '☀️',
    title: 'Block-by-Block Solar Program',
    cost: '$50K–$500K per block',
    impact: 'Lower bills for thousands',
    desc: 'Community-owned solar installations on rooftops across the most energy-burdened blocks in Chicago. Cut utility bills for working-class families. Clean energy owned by the neighborhood, not a utility company.',
  },
  {
    category: 'Health',
    color: '#E53950',
    icon: '🏥',
    title: 'Neighborhood Health Clinic Network',
    cost: '$1M–$5M per clinic',
    impact: 'Tens of thousands of residents',
    desc: 'Community health clinics across the South and West Sides — mental health, primary care, maternal care, substance recovery. Staffed by people from the neighborhoods they serve. The 14-year life expectancy gap between zip codes is a policy problem. This is a policy answer.',
  },
  {
    category: 'Culture',
    color: '#0F5EA8',
    icon: '🎨',
    title: 'Neighborhood Mural & Arts Grants',
    cost: '$5K–$25K per project',
    impact: 'Every block, every neighborhood',
    desc: 'Small DAO grants for murals, community art installations, and cultural events across Black and Latino/a neighborhoods. Chicago\'s culture lives in Bronzeville, Pilsen, Humboldt Park, Back of the Yards. Fund the people keeping it alive.',
  },
  {
    category: 'Food',
    color: '#3DAA6F',
    icon: '🌱',
    title: 'Community Food Cooperative Seed Grants',
    cost: '$100K–$500K per co-op',
    impact: 'Thousands of families per location',
    desc: 'Grants to launch community-owned grocery cooperatives in food desert zip codes. Fresh produce. Local vendors. Profits stay in the neighborhood. No more dollar store as the only option on the block.',
  },
  {
    category: 'Jobs',
    color: '#E53950',
    icon: '🔧',
    title: 'Trade & Tech Apprenticeship Pipeline',
    cost: '$250K–$2M per program',
    impact: 'Thousands of workers',
    desc: 'Paid apprenticeships in construction, electrical, HVAC, plumbing, and software. Funded by the DAO. Partnered with local employers. Chicago is building. The people from these neighborhoods should be the ones getting those contracts and that income.',
  },
  {
    category: 'Legal',
    color: '#0F5EA8',
    icon: '⚖️',
    title: 'Community Legal Defense Clinic',
    cost: '$75K–$300K per clinic',
    impact: 'Thousands of families',
    desc: 'Free legal help for residents facing eviction, wage theft, predatory lending, and wrongful termination. The wealth gap is also an access-to-justice gap. Small DAO grants can fund legal clinics that serve entire neighborhoods.',
  },
  {
    category: 'Environment',
    color: '#3DAA6F',
    icon: '🌿',
    title: 'Lead Removal & Green Space Fund',
    cost: '$50K–$1M per project',
    impact: 'Block by block across the city',
    desc: 'Remove lead from homes, clean up contaminated lots, plant trees on heat-burdened blocks, build parks where there are none. Environmental racism is documented in Chicago\'s data. This fund attacks it directly, project by project.',
  },
  {
    category: 'Youth',
    color: '#E53950',
    icon: '🏀',
    title: 'Community Sports & Recreation Leagues',
    cost: '$20K–$100K per league',
    impact: 'Thousands of young people',
    desc: 'Fund organized sports, recreation programs, and after-school leagues in neighborhoods that lost park funding through decades of city budget cuts. Keep young people engaged, safe, and connected to their community.',
  },
  {
    category: 'Culture',
    color: '#3DAA6F',
    icon: '📻',
    title: 'Community Radio & Media Fund',
    cost: '$150K–$500K',
    impact: 'Entire neighborhoods',
    desc: 'Fund community radio stations, podcasts, and local media run by and for South and West Side residents. Neighborhoods that control their own narrative have more political and economic power. This is infrastructure.',
  },
  {
    category: 'Safety',
    color: '#E53950',
    icon: '🕊️',
    title: 'Violence Interruption & Street Outreach',
    cost: '$250K–$2M/year',
    impact: 'Entire city blocks',
    desc: 'Fund community-based violence interruption programs — credible messengers, street outreach workers, and conflict mediators from the neighborhoods they serve. Programs like CRED and Cure Violence have data behind them. The DAO funds what works.',
  },
  {
    category: 'Childcare',
    color: '#0F5EA8',
    icon: '👶',
    title: 'Worker-Owned Childcare Cooperative',
    cost: '$300K–$1M per location',
    impact: 'Hundreds of families',
    desc: 'Launch affordable, worker-owned childcare centers in neighborhoods where waitlists are years long and costs eat entire paychecks. Owned by the workers who run them. Subsidized for families who need it. A prerequisite for everything else — parents cannot work if there is nowhere safe for their kids to go.',
  },
  {
    category: 'Tech',
    color: '#3DAA6F',
    icon: '📡',
    title: 'Community-Owned Mesh Network Infrastructure',
    cost: '$100K–$800K per neighborhood',
    impact: 'Entire neighborhoods online',
    desc: 'Fund community-owned mesh network infrastructure across South and West Side neighborhoods — internet that belongs to the block, not a corporation. Mesh networks are decentralized by design: each node extends coverage to the next, so the more people connect, the stronger it gets. No Comcast. No AT&T. No monthly price gouging. The neighborhood owns the pipes. This is digital infrastructure as a community right, not a commodity.',
  },
  {
    category: 'Elders',
    color: '#0F5EA8',
    icon: '👵',
    title: 'Senior Care & Elder Transportation Fund',
    cost: '$50K–$300K',
    impact: 'Thousands of seniors',
    desc: 'Grants for in-home elder care services, medical transportation, grocery delivery, and check-in programs for South and West Side seniors. The people who held these neighborhoods together through decades of disinvestment deserve to age with dignity in the communities they built.',
  },
  {
    category: 'Immigrant',
    color: '#E53950',
    icon: '🌎',
    title: 'Immigrant Family Legal & Resource Fund',
    cost: '$100K–$500K',
    impact: 'Thousands of families',
    desc: 'Fund immigration legal aid, citizenship application support, DACA renewal assistance, and multilingual resource navigation for Chicago\'s immigrant families. Little Village, Pilsen, and Back of the Yards have some of the highest immigrant populations in the Midwest. They built those neighborhoods. The DAO has their back.',
  },
  {
    category: 'Re-entry',
    color: '#3DAA6F',
    icon: '🔑',
    title: 'Re-entry Business Launch Grants',
    cost: '$10K–$50K per grant',
    impact: 'Hundreds of individuals',
    desc: 'Direct grants for people coming home from incarceration who want to start a business. Chicago has over 100,000 people on parole or probation. Giving them a pathway to ownership instead of a dead-end job is how you reduce recidivism and build community wealth at the same time.',
  },
  {
    category: 'Small Business',
    color: '#0F5EA8',
    icon: '🏪',
    title: 'Neighborhood Business Incubator Spaces',
    cost: '$500K–$3M',
    impact: 'Dozens of businesses per location',
    desc: 'Convert vacant storefronts and lots into community-owned incubator spaces — affordable co-working, shared commercial kitchens, retail pop-up markets — for local entrepreneurs who cannot afford commercial rent. The South Side has the talent. It just needs the space.',
  },
]

function TreasuryPrograms() {
  const { ref, isInView } = useScrollAnimation()
  const [active, setActive] = useState(0)

  // Auto-advance — pauses when user manually picks
  const timerRef = useRef(null)

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % PROGRAMS.length)
    }, 13000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const prev = () => {
    setActive((i) => (i - 1 + PROGRAMS.length) % PROGRAMS.length)
    startTimer()
  }
  const next = () => {
    setActive((i) => (i + 1) % PROGRAMS.length)
    startTimer()
  }
  const pick = (i) => {
    setActive(i)
    startTimer()
  }

  const p = PROGRAMS[active]

  return (
    <div ref={ref} className="mb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-3">What the Treasury Can Fund</p>
        <h3 className="text-3xl sm:text-4xl font-black text-ink mb-4">
          An economic engine that
          <span className="text-gradient"> funds the repair.</span>
        </h3>
        <p className="text-ink-dim max-w-2xl mx-auto leading-relaxed mb-3">
          Redlining was programmatic extraction. Chi Coin is programmatic repair.
          A citywide DAO governed by Black, Latino/a, and working-class Chicago —
          voting on where the money goes. These are the kinds of programs that become possible.
        </p>
        <p className="text-xs text-ink-faint max-w-xl mx-auto">
          Note: The $243M treasury is a mark-to-market value — not all of it is liquid cash.
          The DAO deploys capital responsibly over time as the pool deepens, starting small and scaling
          with market conditions. Programs range from $10K community grants to multi-million initiatives.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid lg:grid-cols-[1fr_320px] gap-6 mb-6"
      >
        {/* Featured card + arrows */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-3xl border p-8 relative overflow-hidden flex flex-col"
            style={{ borderColor: p.color + '40', minHeight: 340 }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: p.color }} />

            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white inline-block mb-3"
                  style={{ background: p.color }}>
                  {p.category}
                </span>
                <h4 className="text-xl font-black text-ink leading-tight">{p.title}</h4>
              </div>
              <span className="text-4xl ml-4 shrink-0">{p.icon}</span>
            </div>

            <p className="text-sm text-ink-dim leading-relaxed flex-1 mb-6">{p.desc}</p>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-black" style={{ color: p.color }}>{p.cost}</div>
                <div className="text-xs text-ink-muted">DAO grant allocation</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-ink">{p.impact}</div>
                <div className="text-xs text-ink-muted">estimated impact</div>
              </div>
            </div>
          </div>

          {/* Arrows + counter */}
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-chi-border bg-white flex items-center justify-center hover:border-chi-blue hover:text-chi-blue transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-chi-border bg-white flex items-center justify-center hover:border-chi-blue hover:text-chi-blue transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-xs text-ink-muted">{active + 1} of {PROGRAMS.length}</span>

            {/* Progress dots */}
            <div className="flex gap-1.5 flex-wrap flex-1">
              {PROGRAMS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: i === active ? p.color : '#D1DCE8',
                    width: i === active ? 20 : 6,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Full program list — all 20 */}
        <div className="glass rounded-2xl border border-chi-border overflow-hidden flex flex-col" style={{ maxHeight: 420 }}>
          <div className="px-4 py-3 border-b border-chi-border bg-bg-dark">
            <p className="text-[10px] font-black uppercase tracking-widest text-ink-muted">All Programs</p>
          </div>
          <div className="overflow-y-auto flex-1">
            {PROGRAMS.map((prog, i) => (
              <button
                key={prog.title}
                onClick={() => pick(i)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-chi-border transition-all duration-150 last:border-b-0"
                style={{ background: i === active ? prog.color + '12' : 'transparent' }}
              >
                <span className="text-lg shrink-0">{prog.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-ink leading-snug truncate">{prog.title}</div>
                  <div className="text-[10px] font-semibold mt-0.5" style={{ color: prog.color }}>{prog.cost}</div>
                </div>
                {i === active && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: prog.color }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Total allocation context */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass rounded-2xl border border-chi-border p-6 text-center"
      >
        <p className="text-sm text-ink-dim leading-relaxed max-w-3xl mx-auto">
          These are not a budget. They are a vision of what becomes possible when a community
          controls its own economic infrastructure. Some projects cost $10,000. Some cost $5 million.
          The DAO votes on all of it — delegates from Englewood, Little Village, Bronzeville, Austin,
          Pilsen, and every other neighborhood deciding together where resources go.
          <strong className="text-ink"> This is not philanthropy. This is community ownership of an economic engine.</strong>
        </p>
      </motion.div>
    </div>
  )
}

export default function EconomicSim() {
  const { ref: titleRef,   isInView: titleInView   } = useScrollAnimation()
  const { ref: resultsRef, isInView: resultsInView } = useScrollAnimation()
  const { ref: chartRef,   isInView: chartInView   } = useScrollAnimation()
  const { ref: treasRef,   isInView: treasInView   } = useScrollAnimation()
  const { ref: stepsRef,   isInView: stepsInView   } = useScrollAnimation()
  const { ref: cmdRef,     isInView: cmdInView     } = useScrollAnimation()

  const price    = useCounter(SIM.finalPrice,        2000, resultsInView, 2)
  const usdVol   = useCounter(SIM.usdVolume,         2000, resultsInView, 0)
  const burned   = useCounter(SIM.burnedChi,         1600, resultsInView, 0)
  const tresFee  = useCounter(SIM.treasuryFeesChi,   1600, resultsInView, 0)

  return (
    <section id="simulation" className="relative py-32 overflow-hidden">
      <div className="orb w-[600px] h-[600px] bg-chi-red/5 top-0 right-[-200px] pointer-events-none" />
      <div className="orb w-[400px] h-[400px] bg-chi-blue/6 bottom-0 left-[-100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div ref={titleRef} variants={stagger} initial="hidden" animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-20">
          <motion.p variants={fadeUp} className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-4">
            Economic Simulation · May 2026
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-ink">
            We built the neighborhood.
            <span className="text-gradient"> Then we ran the math.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim leading-relaxed">
            Before asking anyone to invest, we built a state-of-the-art economic simulation engine in Python.
            1,000 Chicago neighbors. 34 service categories. 10,000 real transactions between real simulated people.
            A custom constant-product AMM — the same math that powers Uniswap — running live price discovery.
            Every number on this page is real output from that simulation.
          </motion.p>
        </motion.div>

        {/* Results grid */}
        <motion.div ref={resultsRef} variants={stagger} initial="hidden" animate={resultsInView ? 'visible' : 'hidden'} className="mb-8">
          <motion.p variants={fadeUp} className="text-xs text-ink-muted uppercase tracking-widest font-semibold mb-2 text-center">
            Simulation output · {SIM.date} · All numbers from actual script run
          </motion.p>
          <motion.p variants={fadeUp} className="text-center text-sm text-ink-dim mb-5">
            10,000 transactions over 180 days — that is <strong className="text-ink">~56 service bookings per day</strong> between 1,000 people. Less than one busy barbershop on a Saturday.
          </motion.p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {[
              { label: 'Simulated neighbors',   val: '1,000',    color: 'text-chi-blue' },
              { label: 'Chicago neighborhoods', val: '15',       color: 'text-chi-red'  },
              { label: 'Service categories',    val: '34',       color: 'text-chi-blue' },
              { label: 'Service transactions',  val: '10,000',   color: 'text-chi-red'  },
              { label: 'AMM buy trades',        val: '400,000',  color: 'text-chi-blue' },
              { label: 'Simulation window',     val: '6 months', color: 'text-chi-red'  },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="glass rounded-2xl border border-chi-border p-4 text-center">
                <div className={`text-xl sm:text-2xl font-black mb-1 ${s.color}`}>{s.val}</div>
                <div className="text-[10px] text-ink-muted uppercase tracking-wide font-medium leading-tight">{s.label}</div>
              </motion.div>
            ))}
          </div>
          {/* Two separate money flows — clearly labeled */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="glass rounded-2xl border border-chi-blue/30 bg-soft-blue/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-widest text-chi-blue mb-3">Flow 1 — The Local Economy</div>
              <div className="text-3xl font-black text-chi-blue mb-1">${usdVol.toLocaleString()}</div>
              <div className="text-sm font-bold text-ink mb-2">USD paid between neighbors for real services</div>
              <p className="text-xs text-ink-muted leading-relaxed">
                This is money neighbors paid <strong>each other</strong> — haircuts, tutoring, cleaning, meals.
                It goes to the service provider. This is the local economy working.
                2% of this ($5,289) went to the liquidity reserve.
              </p>
            </div>
            <div className="glass rounded-2xl border border-chi-red/30 bg-soft-red/20 p-5">
              <div className="text-[10px] font-black uppercase tracking-widest text-chi-red mb-3">Flow 2 — The AMM Pool</div>
              <div className="text-3xl font-black text-chi-red mb-1">$2,000,000</div>
              <div className="text-sm font-bold text-ink mb-2">USDC pumped into the liquidity pool via DEX buys</div>
              <p className="text-xs text-ink-muted leading-relaxed">
                This is completely separate. When wallets ran low, users bought more CHI from the exchange —
                400,000 times at $5 each. That USD goes <strong>into the pool</strong>, not to a neighbor.
                This is what moved the price from $0.01 to $4.05.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'CHI permanently burned',           val: `${Math.round(burned).toLocaleString()} CHI`, sub: '1% destroyed on every transfer',   color: 'text-ink',      border: 'border-chi-border'  },
              { label: 'CHI earned by community treasury', val: `${Math.round(tresFee).toLocaleString()} CHI`, sub: '2% CHI fee from every service booking', color: 'text-chi-blue', border: 'border-chi-blue/30' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className={`glass rounded-2xl border ${s.border} p-5`}>
                <div className={`text-2xl font-black mb-1 ${s.color}`}>{s.val}</div>
                <div className="text-sm font-bold text-ink mb-1">{s.label}</div>
                <div className="text-xs text-ink-muted">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily context callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={resultsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid sm:grid-cols-3 gap-3 mb-8"
        >
          {[
            { val: '~56/day',    label: 'Average service bookings', sub: 'Phase 1 — neighbors paying neighbors' },
            { val: '~$1,470/day', label: 'Average USD service volume', sub: '$264K ÷ 180 days' },
            { val: '~2,222/day', label: 'Average DEX buy trades', sub: 'Phase 2 — wallet top-up activity' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl border border-chi-border p-4 text-center">
              <div className="text-2xl font-black text-chi-blue mb-1">{s.val}</div>
              <div className="text-sm font-bold text-ink">{s.label}</div>
              <div className="text-xs text-ink-muted mt-1">{s.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* AMM Chart */}
        <motion.div ref={chartRef} initial={{ opacity: 0, y: 32 }} animate={chartInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} className="glass rounded-2xl border border-chi-blue/25 p-7 mb-8">
          <h3 className="text-xl font-black text-ink mb-2">CHI Price Path — Actual Simulation Output</h3>
          <p className="text-sm text-ink-muted leading-relaxed max-w-2xl mb-5">
            Starting pool: 5 million CHI paired against $50,000 USDC — setting the launch price at $0.01 per CHI.
            Every price movement was driven by organic DEX buy pressure from neighbors whose wallets ran low after spending CHI on services.
            No artificial pumping. The math does it.
          </p>
          <AmmChart active={chartInView} />
        </motion.div>

        {/* Treasury at $4.05 */}
        <motion.div ref={treasRef} initial={{ opacity: 0, y: 32 }} animate={treasInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} className="glass rounded-2xl border border-chi-blue/20 p-8 mb-20 glow-blue">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-chi-blue text-xs tracking-widest uppercase font-semibold mb-3">Treasury Value at Simulation Price</p>
              <h3 className="text-3xl font-black text-ink mb-4">
                At $4.05 per CHI, the community treasury
                <span className="text-chi-blue"> is worth $243 million.</span>
              </h3>
              <p className="text-ink-dim leading-relaxed mb-4">
                The community treasury holds 60 million CHI — 60% of the total supply. That is not
                a rounding error. It means this economy exists to serve Chicago, not its founders.
                At the simulation's final price, that 60 million CHI is worth $243 million — available for
                grants, loans, housing projects, and small business support. All of it governed by a
                citywide DAO where every Chicago neighborhood sends delegates to vote.
              </p>
              <p className="text-ink-dim leading-relaxed mb-4">
                On top of that, every USD transaction across the platform routes a 2% fee into a
                separate liquidity reserve. That reserve exists to strengthen the CHI/USDC pool over time
                — less price volatility, more market depth, and a safer environment for the treasury
                to eventually deploy capital back into communities.
              </p>
              <p className="text-ink-dim leading-relaxed">
                The off-market stability reserve holds another 30 million CHI as a price backstop.
                Combined, the two non-circulating pools represent <strong className="text-ink">$364.5 million</strong> at
                the simulation price — controlled by Chicago, not a company.
              </p>
              <p className="text-xs text-ink-faint mt-4">
                Note: Mark-to-market at the simulation final price. This reflects what the treasury would be
                worth at that price — not a guaranteed future value.
              </p>
            </div>
            <TreasuryBar active={treasInView} />
          </div>
        </motion.div>

        {/* What $243M could fund */}
        <TreasuryPrograms />

        {/* Script breakdown */}
        <div ref={stepsRef} className="mb-20">
          <div className="text-center mb-10">
            <p className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-3">How We Built It</p>
            <h3 className="text-3xl sm:text-4xl font-black text-ink mb-4">Inside the simulation — step by step</h3>
            <p className="text-ink-dim max-w-2xl mx-auto mb-8">
              This is not a spreadsheet model or a back-of-napkin projection. We built a
              state-of-the-art economic simulation engine in Python — a custom Django management
              command that generates synthetic populations, runs real financial transactions,
              and executes live AMM price discovery using the same math that powers Uniswap.
              Every number on this page came out of that script.
            </p>

            {/* Tech stack */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-4">
              {[
                {
                  lib: 'Python Decimal',
                  detail: '28 significant digits of precision',
                  sub: 'No floating point errors in financial math',
                },
                {
                  lib: 'Faker Library',
                  detail: 'Synthetic population generation',
                  sub: '1,000 realistic Chicago residents with jobs, bios, and skills',
                },
                {
                  lib: 'Django ORM',
                  detail: 'Real database persistence',
                  sub: 'Every transaction written to SQLite — not just console output',
                },
                {
                  lib: 'Constant-Product AMM',
                  detail: 'x × y = k price engine',
                  sub: 'The same formula that powers Uniswap and every major DEX',
                },
              ].map((t, i) => (
                <div key={i} className="glass rounded-xl border border-chi-border p-4 text-left">
                  <div className="text-xs font-black text-chi-blue mb-1">{t.lib}</div>
                  <div className="text-[11px] font-semibold text-ink mb-1 leading-snug">{t.detail}</div>
                  <div className="text-[10px] text-ink-muted leading-snug">{t.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-faint max-w-xl mx-auto">
              The simulation persists to a real relational database, generates CSV exports, stores
              economic snapshots, and supports CLI parameters for running different scenarios —
              more users, higher trade volumes, liquidity injections at price targets.
              It is a research-grade tool built to stress-test the Chi Coin economy before a single
              real dollar is deployed.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {SCRIPT_STEPS.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className={`glass rounded-2xl border ${s.color} p-7`}>
                <div className="flex items-start gap-5">
                  <div className={`w-10 h-10 rounded-full ${s.dot} flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5`}>
                    {s.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-ink mb-2">{s.title}</h4>
                    <p className="text-sm text-ink-dim leading-relaxed mb-3">{s.plain}</p>
                    <div className="bg-bg-dark rounded-xl px-4 py-3 border border-chi-border">
                      <p className="text-[11px] font-mono text-ink-muted leading-relaxed">{s.code}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The actual command */}
        <motion.div ref={cmdRef} initial={{ opacity: 0, y: 24 }} animate={cmdInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} className="glass rounded-2xl border border-chi-border p-7 mb-8">
          <p className="text-xs text-ink-muted uppercase tracking-widest font-semibold mb-4">The Exact Command That Produced These Results</p>
          <div className="bg-bg-dark rounded-xl p-5 border border-chi-border overflow-x-auto mb-5">
            <pre className="text-[12px] text-chi-blue font-mono leading-7 whitespace-pre">{`python manage.py seed_esc_demo \\
  --target-payments 10000    # 10,000 neighbor-to-neighbor service transactions
  --amm-max-trades  400000   # 400,000 DEX buy trades after service simulation
  --amm-trade-size-usd 5     # $5 USDC per buy from the liquidity pool
  --amm-target-price 4.05    # stop when CHI price hits $4.05`}</pre>
          </div>
          {/* Three buckets — the key distinction */}
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            {[
              {
                label: 'What the project raises',
                amount: '$50K USDC',
                color: 'border-chi-blue/40 bg-soft-blue',
                textColor: 'text-chi-blue',
                desc: 'Seeds the CHI/USDC liquidity pool at launch. Sets the starting price at $0.01/CHI. This is the fundraising target.',
              },
              {
                label: 'What the city generates',
                amount: '~$2M USDC',
                color: 'border-chi-red/40 bg-soft-red',
                textColor: 'text-chi-red',
                desc: 'Organic buy pressure from Chicagoans topping up their wallets to keep participating. This is NOT money the project raises. It flows in as the city uses the app.',
              },
              {
                label: 'What transactions build',
                amount: 'Liquidity reserve',
                color: 'border-chi-border bg-bg-card-2',
                textColor: 'text-ink',
                desc: '2% of every USD service payment goes into a reserve that deepens the pool over time — less slippage, more stability. It grows with every transaction, not from a raise.',
              },
            ].map((s, i) => (
              <div key={i} className={`glass rounded-2xl border ${s.color} p-5`}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-ink-muted mb-2">{s.label}</div>
                <div className={`text-2xl font-black mb-3 ${s.textColor}`}>{s.amount}</div>
                <p className="text-xs text-ink-dim leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="glass rounded-xl border border-chi-blue/20 bg-soft-blue/20 px-5 py-4 text-sm text-chi-blue leading-relaxed">
            <strong>The key distinction for investors:</strong> the project only needs to raise $50K to seed the pool.
            The ~$2M that drives the price to $4.05 is not a second fundraise — it is what happens naturally
            when Chicago uses the app. Every wallet top-up is a $5 or $10 buy into the pool.
            400,000 of those moments = $2M of organic demand.
          </div>
        </motion.div>

        {/* Bottom callout */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={cmdInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass rounded-3xl border border-chi-red/20 p-10 md:p-14 text-center glow-red">
          <h3 className="text-2xl sm:text-3xl font-black text-ink mb-2">
            $4.05. Zero injections. Pool still had CHI left.
          </h3>
          <p className="text-ink-dim max-w-xl mx-auto mb-8 text-sm">
            The pool reached $4.05 per CHI with no artificial liquidity injections. The injection
            mechanism exists as a safety net — it was never needed because organic community demand
            is made of thousands of small buys, not a handful of large ones. Small distributed
            pressure is what a community economy naturally produces. The math confirmed it.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left">
            <div className="glass rounded-2xl border border-chi-blue/30 p-5">
              <div className="text-2xl font-black text-chi-blue mb-1">$50K</div>
              <div className="text-xs font-bold text-ink uppercase tracking-wide mb-2">We raise this</div>
              <p className="text-xs text-ink-dim leading-relaxed">Seeds the CHI/USDC pool at launch. Sets the starting price. This is the only money the project asks for.</p>
            </div>
            <div className="glass rounded-2xl border border-chi-red/30 p-5">
              <div className="text-2xl font-black text-chi-red mb-1">~$2M</div>
              <div className="text-xs font-bold text-ink uppercase tracking-wide mb-2">The city generates this</div>
              <p className="text-xs text-ink-dim leading-relaxed">Organic buy pressure from users topping up wallets. Flows in as Chicago uses the app. Nobody writes a check for this.</p>
            </div>
            <div className="glass rounded-2xl border border-chi-border p-5">
              <div className="text-2xl font-black text-ink mb-1">$4.05</div>
              <div className="text-xs font-bold text-ink uppercase tracking-wide mb-2">Math produces this</div>
              <p className="text-xs text-ink-dim leading-relaxed">CHI price once $2M of organic demand flows through the constant-product pool. Treasury worth $243M at this price.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              ['$50K USDC',  'project raises this — seeds the pool'],
              ['$264K USD',  'neighbors paid each other for real services'],
              ['~$2M USDC',  'separately flowed into AMM pool via DEX buys'],
              ['$4.05',      'CHI price after $2M of pool buy pressure'],
              ['$243M',      'citywide DAO treasury at that price'],
              ['$364.5M',    'total community-controlled value'],
            ].map(([val, lbl], i) => (
              <div key={i} className="glass rounded-xl border border-chi-border px-5 py-3 text-sm">
                <span className="font-black text-chi-red">{val}</span>
                <span className="text-ink-muted ml-1.5">{lbl}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
