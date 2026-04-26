import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger, slideLeft, slideRight } from '../hooks/useScrollAnimation'

const features = [
  {
    id: 'marketplace',
    title: 'Services Marketplace',
    subtitle: 'Book local. Pay in USD + CHI.',
    body: 'Browse verified local service providers — barbers, tutors, handymen, DJs, lawn care, and more. Every booking uses our parallel payment model: real cash for the worker, CHI circulating in the community.',
    detail: 'Example: Haircut = $20 + 15 CHI. The worker gets paid in both. You spend CHI you\'ve earned locally.',
    screen: 'marketplace',
  },
  {
    id: 'wallet',
    title: 'Chi Wallet',
    subtitle: 'No bank account required.',
    body: 'Every user starts with a CHI starter balance so the economy can begin immediately. Send, receive, and accumulate CHI with a few taps. When your balance runs low, refill from the AMM.',
    detail: 'Built on Base L2 (Ethereum Layer 2) — fast, low-cost, and environmentally efficient.',
    screen: 'wallet',
  },
  {
    id: 'map',
    title: 'Community Data Maps',
    subtitle: 'Know your neighborhood\'s history.',
    body: 'Interactive maps show redlining history, income gaps, lead levels, eviction rates, transit access, and more — sourced from public data. Education is part of the app.',
    detail: '18 civic datasets covering all 77 Chicago community areas. Available in English and Spanish.',
    screen: 'map',
  },
  {
    id: 'governance',
    title: 'Community Governance',
    subtitle: '1 person. 1 vote. Not 1 token = 1 vote.',
    body: 'Vote on how the community treasury is deployed. Submit grant proposals, fund local initiatives, and elect neighborhood representatives — all on-chain.',
    detail: 'Identity-based governance prevents wealthy actors from buying political control.',
    screen: 'governance',
  },
  {
    id: 'education',
    title: 'Financial Literacy',
    subtitle: 'Earn CHI while you learn.',
    body: 'Complete financial education modules covering credit, savings, crypto basics, and community economics. Every module completed adds CHI to your wallet.',
    detail: 'Bilingual — English and Spanish. Designed for communities that traditional finance has ignored.',
    screen: 'education',
  },
]

function AppScreen({ screen }) {
  const screens = {
    marketplace: (
      <div className="flex flex-col gap-3">
        <p className="text-ink-faint text-[9px] uppercase tracking-widest">Nearby Services</p>
        {[
          { name: 'Marcus B. — Barber', price: '$20 + 15 CHI', rating: '4.9', cat: 'Beauty' },
          { name: 'Reyes Lawn Care', price: '$40 + 25 CHI', rating: '4.8', cat: 'Home' },
          { name: 'Ms. Johnson — Tutor', price: '$25 + 10 CHI', rating: '5.0', cat: 'Education' },
          { name: 'DJ Smooth — Events', price: '$100 + 50 CHI', rating: '4.7', cat: 'Events' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-white border border-chi-border px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chi-red/30 to-chi-blue/30 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-ink text-[10px] font-semibold truncate">{s.name}</p>
              <p className="text-chi-red text-[9px]">{s.price}</p>
            </div>
            <div className="text-[8px] text-ink-faint">⭐ {s.rating}</div>
          </div>
        ))}
        <div className="rounded-xl bg-soft-red border border-chi-red/25 px-3 py-2 text-center">
          <p className="text-chi-red text-[9px] font-semibold">+ List your service</p>
        </div>
      </div>
    ),
    wallet: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-white border border-chi-border shadow-sm p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-chi-red" />
          <p className="text-ink-muted text-[10px] mb-1">Your Balance</p>
          <p className="text-ink font-black text-3xl">1,240 <span className="text-chi-red text-base">CHI</span></p>
          <p className="text-ink-faint text-[10px] mt-1">≈ $12.40 market value</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Send', icon: '→' },
            { label: 'Receive', icon: '←' },
            { label: 'Refill', icon: '+' },
          ].map((a, i) => (
            <div key={i} className="rounded-xl bg-soft-blue border border-chi-border p-3 text-center">
              <div className="text-chi-blue text-base font-bold mb-1">{a.icon}</div>
              <p className="text-ink-muted text-[9px]">{a.label}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-faint text-[9px] uppercase tracking-widest">Recent Activity</p>
        {[
          { label: 'Haircut — Marcus', amt: '−15 CHI', color: 'text-chi-red' },
          { label: 'Literacy Module #3', amt: '+50 CHI', color: 'text-green-600' },
          { label: 'Sent to neighbor', amt: '−20 CHI', color: 'text-chi-red' },
        ].map((tx, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-chi-border px-3 py-2">
            <p className="text-ink-dim text-[10px]">{tx.label}</p>
            <p className={`text-[10px] font-bold ${tx.color}`}>{tx.amt}</p>
          </div>
        ))}
      </div>
    ),
    map: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-soft-blue border border-chi-border h-40 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 30% 40%, #E53950 0%, transparent 40%), radial-gradient(circle at 70% 60%, #0F5EA8 0%, transparent 40%)',
          }} />
          <div className="text-center z-10">
            <p className="text-ink-dim text-[10px]">Chicago · HOLC 1940</p>
            <p className="text-ink-faint text-[9px] mt-1">Tap to explore</p>
          </div>
        </div>
        <p className="text-ink-faint text-[9px] uppercase tracking-widest">Available Maps</p>
        {['Redlining History','Income by Neighborhood','Eviction Rates','Lead Levels','Transit Access'].map((m, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-white border border-chi-border px-3 py-2">
            <div className="w-2 h-2 rounded-full" style={{ background: ['#E53950','#0F5EA8','#41B6E6','#FF9800','#4CAF50'][i] }} />
            <p className="text-ink-dim text-[10px]">{m}</p>
          </div>
        ))}
      </div>
    ),
    governance: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-soft-blue border border-chi-border p-4">
          <p className="text-ink-faint text-[9px] mb-2 uppercase tracking-widest">Active Proposal</p>
          <p className="text-ink text-[11px] font-semibold mb-3">Fund Englewood Youth Center — 50,000 CHI</p>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 bg-chi-blue/30 rounded-full h-1.5" />
            <div className="w-1/4 bg-chi-red/30 rounded-full h-1.5" />
          </div>
          <div className="flex justify-between">
            <p className="text-chi-blue text-[9px]">72% For</p>
            <p className="text-chi-red text-[9px]">28% Against</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-soft-blue border border-chi-border p-3 text-center">
            <p className="text-chi-blue font-black text-lg">342</p>
            <p className="text-ink-faint text-[9px]">Votes cast</p>
          </div>
          <div className="rounded-xl bg-white border border-chi-border p-3 text-center">
            <p className="text-ink font-black text-lg">3</p>
            <p className="text-ink-faint text-[9px]">Days left</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-xl bg-soft-blue border border-chi-blue/30 py-2.5 text-center">
            <p className="text-chi-blue text-[10px] font-bold">Vote For</p>
          </div>
          <div className="flex-1 rounded-xl bg-soft-red border border-chi-red/20 py-2.5 text-center">
            <p className="text-chi-red text-[10px] font-bold">Vote Against</p>
          </div>
        </div>
      </div>
    ),
    education: (
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl bg-white border border-chi-border shadow-sm p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-chi-blue" />
          <p className="text-ink-faint text-[9px] mb-1 uppercase tracking-widest">Current Module</p>
          <p className="text-ink font-bold text-[11px] mb-2">Understanding Credit Scores</p>
          <div className="w-full bg-chi-border rounded-full h-1.5 mb-1">
            <div className="bg-chi-red h-1.5 rounded-full" style={{ width: '65%' }} />
          </div>
          <p className="text-ink-faint text-[9px]">65% complete · Reward: +30 CHI</p>
        </div>
        <p className="text-ink-faint text-[9px] uppercase tracking-widest">All Modules</p>
        {[
          { title: 'What Is Redlining?', reward: '+20 CHI', done: true },
          { title: 'Building an Emergency Fund', reward: '+25 CHI', done: true },
          { title: 'Understanding Credit Scores', reward: '+30 CHI', done: false },
          { title: 'What Is a DAO?', reward: '+35 CHI', done: false },
        ].map((m, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-white border border-chi-border px-3 py-2">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${m.done ? 'bg-green-100 border-green-400 text-green-600' : 'border-chi-border text-ink-faint'}`}>
                {m.done ? '✓' : ''}
              </div>
              <p className="text-ink-dim text-[10px]">{m.title}</p>
            </div>
            <p className="text-chi-red text-[9px] font-bold">{m.reward}</p>
          </div>
        ))}
      </div>
    ),
  }
  return screens[screen] || null
}

function PhoneFeature({ screen }) {
  return (
    <div className="w-52 sm:w-60 bg-bg-card rounded-[2.5rem] border border-chi-border shadow-2xl shadow-black/10 overflow-hidden mx-auto">
      <div className="flex justify-center pt-3 pb-1 bg-bg-card">
        <div className="w-20 h-5 bg-[#111827] rounded-full" />
      </div>
      <div className="bg-white px-4 pb-6 pt-3 min-h-[420px]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-ink text-xs font-black">Chi<span className="text-chi-red">Coin</span></span>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-chi-red" />
            <div className="w-1.5 h-1.5 rounded-full bg-chi-border" />
            <div className="w-1.5 h-1.5 rounded-full bg-chi-blue" />
          </div>
        </div>
        <AppScreen screen={screen} />
      </div>
      <div className="flex justify-center py-2 bg-bg-dark">
        <div className="w-24 h-1 bg-chi-border rounded-full" />
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const [active, setActive] = useState('marketplace')
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation()
  const { ref: bodyRef,  isInView: bodyInView  } = useScrollAnimation()
  const activeFeature = features.find(f => f.id === active)

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-chi-blue/6 top-1/2 left-[-150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.p variants={fadeUp} className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-4">
            App Features
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-ink">
            Everything your
            <span className="text-gradient"> community needs.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim">
            One app. A complete local economy.
          </motion.p>
        </motion.div>

        {/* Feature tabs + phone */}
        <motion.div
          ref={bodyRef}
          initial={{ opacity: 0, y: 48 }}
          animate={bodyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 0.8 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Feature list */}
          <div className="flex flex-col gap-3 order-2 lg:order-1">
            {features.map(f => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`text-left rounded-2xl p-5 border transition-all duration-300 ${
                  active === f.id
                    ? 'border-chi-red/40 bg-soft-red scale-[1.01]'
                    : 'border-chi-border bg-white hover:border-chi-border-soft hover:bg-bg-card-2'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm font-bold mb-0.5 ${active === f.id ? 'text-ink' : 'text-ink-dim'}`}>{f.title}</p>
                    <p className={`text-xs ${active === f.id ? 'text-chi-red' : 'text-ink-faint'}`}>{f.subtitle}</p>
                  </div>
                  <motion.div
                    animate={{ rotate: active === f.id ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-ink-faint mt-0.5 shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {active === f.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-ink-dim leading-relaxed mt-3">{f.body}</p>
                      <p className="text-xs text-ink-muted mt-2 italic">{f.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Phone */}
          <div className="order-1 lg:order-2 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ duration: 0.35 }}
              >
                <div className="relative">
                  <PhoneFeature screen={active} />
                  <div className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 w-2/3 h-8 bg-chi-red/10 blur-2xl rounded-full" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
