import PageModal from './PageModal'

// ── Shared helpers ────────────────────────────────────────────────────────

function Slide({ n, title, accent = 'chi-blue', children }) {
  return (
    <div className="mb-14">
      <div className="flex items-end gap-4 mb-6 pb-5 border-b-2 border-chi-border">
        <span className="text-6xl font-black leading-none select-none"
          style={{ color: accent === 'chi-red' ? '#FCECEF' : '#EAF6FC' }}>
          {String(n).padStart(2, '0')}
        </span>
        <div className="pb-1">
          <div className={`w-8 h-0.5 mb-2 rounded-full ${accent === 'chi-red' ? 'bg-chi-red' : 'bg-chi-blue'}`} />
          <h3 className="text-xl font-black text-ink">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  )
}

function Stat({ value, label, color = 'red' }) {
  const styles = {
    red:  { bg: 'bg-soft-red',  border: 'border-chi-red/20',  text: 'text-chi-red'  },
    blue: { bg: 'bg-soft-blue', border: 'border-chi-blue/20', text: 'text-chi-blue' },
    sky:  { bg: 'bg-soft-blue', border: 'border-chi-blue-light/30', text: 'text-chi-blue-light' },
    ink:  { bg: 'bg-bg-dark',   border: 'border-chi-border',  text: 'text-ink'      },
  }
  const s = styles[color] || styles.blue
  return (
    <div className={`rounded-2xl ${s.bg} border ${s.border} p-5 text-center`}>
      <div className={`text-3xl font-black ${s.text} mb-1.5`}>{value}</div>
      <div className="text-xs text-ink-muted leading-relaxed">{label}</div>
    </div>
  )
}

function Check({ children, color = 'blue' }) {
  const c = color === 'red' ? 'text-chi-red' : 'text-chi-blue'
  return (
    <li className="flex items-start gap-3">
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none" className={`mt-0.5 shrink-0 ${c}`}>
        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-sm text-ink-dim leading-relaxed">{children}</span>
    </li>
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-bg-dark rounded-2xl border border-chi-border p-5 ${className}`}>
      {children}
    </div>
  )
}

// ── Pitch Deck ────────────────────────────────────────────────────────────

export default function PitchDeckModal({ isOpen, onClose }) {
  return (
    <PageModal
      isOpen={isOpen}
      onClose={onClose}
      badge="Investor Pitch Deck · 2025–2026"
      title="Chi Coin"
      subtitle="Bridging Chicago Neighborhoods"
    >

      {/* ── Cover slide ─────────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden mb-14"
        style={{ background: 'linear-gradient(135deg, #0F5EA8 0%, #111827 55%, #E53950 100%)' }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Flag stripe at top */}
        <div className="absolute top-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-chi-blue-light/60" />
          <div className="w-4 bg-white/30" />
          <div className="flex-1 bg-chi-red/60" />
          <div className="w-4 bg-white/30" />
          <div className="flex-1 bg-chi-blue-light/60" />
        </div>
        <div className="relative z-10 px-10 py-14 text-center">
          <img
            src="/chicoin-logo.png"
            alt="Chi Coin"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-2xl ring-4 ring-white/20"
          />
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 leading-tight">Chi Coin</h1>
          <p className="text-white/50 text-sm tracking-widest uppercase mb-3">Investor Pitch Deck · 2025–2026</p>
          <p className="text-white/80 text-base max-w-md mx-auto leading-relaxed mb-8">
            A blockchain-powered parallel economy rebuilding wealth in Chicago's
            historically redlined neighborhoods.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Base L2 (Ethereum)', '100M CHI Supply', '$50K USDC Raise', 'Community DAO'].map(tag => (
              <span key={tag} className="text-xs font-semibold text-white bg-white/15 border border-white/20 px-4 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 01 The Problem ──────────────────────────────────────────────── */}
      <Slide n={1} title="The Problem" accent="chi-red">
        <p className="text-sm text-ink-dim leading-relaxed mb-5">
          Federal redlining was a deliberate national policy. The HOLC graded neighborhoods in 239
          American cities between 1935–1940, systematically denying mortgages to Black and immigrant
          communities. The economic damage is still measurable today.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <Stat value="73%" label="of South Side zip codes were redlined in the 1930s" color="red" />
          <Stat value="$79K" label="median income gap between Englewood and Lincoln Park" color="red" />
          <Stat value="3×" label="more likely to be denied a bank loan on the South & West Sides" color="red" />
          <Stat value="14 yrs" label="life expectancy gap between zip codes 8 miles apart" color="red" />
        </div>
        <Card className="border-chi-red/20 bg-soft-red/40">
          <p className="text-sm text-ink-dim leading-relaxed">
            <strong className="text-ink">Core pattern:</strong> wealth leaks out of disinvested neighborhoods constantly.
            Neighbors buy from national chains. Local labor is undervalued. Communities lack local capital infrastructure.
            Every dollar spent in these areas leaves within hours and doesn't come back.
          </p>
        </Card>
      </Slide>

      {/* ── 02 The Solution ─────────────────────────────────────────────── */}
      <Slide n={2} title="The Solution" accent="chi-blue">
        <p className="text-sm text-ink-dim leading-relaxed mb-5">
          Chi Coin is infrastructure — a parallel economy that runs alongside USD, not instead of it.
          Workers keep real cash. CHI circulates locally. No one has to go all-in on crypto.
        </p>
        <Card className="mb-5">
          <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">How payments work</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { service: 'Haircut', provider: 'Marcus B.', price: '$20 + 15 CHI' },
              { service: 'Lawn Care', provider: 'Reyes Lawn', price: '$40 + 25 CHI' },
              { service: 'Tutoring', provider: 'Ms. Johnson', price: '$25 + 10 CHI' },
            ].map((ex, i) => (
              <div key={i} className="bg-white rounded-xl border border-chi-border p-4">
                <p className="text-[10px] text-ink-muted uppercase tracking-widest mb-1">{ex.service} · {ex.provider}</p>
                <p className="text-lg font-black text-chi-red">{ex.price}</p>
                <p className="text-[10px] text-ink-faint mt-1">Worker receives both. CHI stays local.</p>
              </div>
            ))}
          </div>
        </Card>
        <ul className="flex flex-col gap-2.5">
          {[
            'Workers receive USD immediately + CHI that accumulates in the local economy',
            'Every booking routes a CHI fee to the community treasury',
            'When users run low on CHI, they refill through the AMM — creating real buy pressure',
            'The community DAO votes on how the treasury is deployed',
          ].map((item, i) => <Check key={i}>{item}</Check>)}
        </ul>
      </Slide>

      {/* ── 03 How It Works ─────────────────────────────────────────────── */}
      <Slide n={3} title="How It Works — 6 Layers" accent="chi-blue">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { n: '1', label: 'Utility Layer',     body: 'People book services and pay USD + CHI through the marketplace app.',             color: 'text-chi-red'        },
            { n: '2', label: 'Treasury Layer',    body: 'A CHI-side fee routes to the community treasury on every completed booking.',    color: 'text-chi-blue'       },
            { n: '3', label: 'Liquidity Layer',   body: 'A small USD-side fee accumulates in a reserve to deepen the AMM pool over time.', color: 'text-chi-blue'      },
            { n: '4', label: 'Market Layer',      body: 'Users refill CHI through the AMM, creating real buy pressure and price discovery.', color: 'text-chi-blue'   },
            { n: '5', label: 'Depth Layer',       body: 'As price rises, matched liquidity is added to reduce slippage and stabilize the market.', color: 'text-chi-blue-light' },
            { n: '6', label: 'Replication Layer', body: 'Once proven in Chicago, the framework becomes a starter kit for other cities.',  color: 'text-ink-muted'      },
          ].map(l => (
            <Card key={l.n} className="flex gap-3">
              <div className={`text-2xl font-black ${l.color} leading-none shrink-0 w-7`}>{l.n}</div>
              <div>
                <p className="text-sm font-bold text-ink mb-1">{l.label}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{l.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </Slide>

      {/* ── 04 Market Opportunity ───────────────────────────────────────── */}
      <Slide n={4} title="Market Opportunity" accent="chi-blue">
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Stat value="2.7M" label="Chicago residents — primary market" color="blue" />
          <Stat value="77"   label="Chicago community areas — all addressable" color="blue" />
          <Stat value="239"  label="US cities with HOLC redlining maps — replication market" color="sky" />
        </div>
        <p className="text-sm text-ink-dim leading-relaxed mb-4">
          Chi Coin starts in Chicago. But every major American city has a redlining history and the
          same wealth-leakage problem. Once proven here, the model becomes a starter kit —
          Detroit, Baltimore, St. Louis, Atlanta each launch their own locally-controlled economy.
        </p>
        <Card className="border-chi-blue/20 bg-soft-blue/40">
          <p className="text-xs font-bold text-chi-blue uppercase tracking-widest mb-2">Strategic positioning</p>
          <p className="text-sm text-ink-dim leading-relaxed">
            Chi Coin is not trying to be one coin for all cities. It's the
            <strong className="text-ink"> infrastructure standard</strong> — each city adapts it,
            owns it, and governs it locally. That's more defensible than a single shared token economy.
          </p>
        </Card>
      </Slide>

      {/* ── 05 Tokenomics ───────────────────────────────────────────────── */}
      <Slide n={5} title="Tokenomics" accent="chi-red">
        <div className="rounded-2xl border border-chi-border overflow-hidden mb-5">
          <div className="grid grid-cols-4 bg-ink px-5 py-3">
            {['Allocation', 'CHI Amount', 'Share', 'Purpose'].map(h => (
              <div key={h} className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{h}</div>
            ))}
          </div>
          {[
            { label: 'Community Treasury', amount: '60,000,000', pct: '60%', desc: 'DAO-governed grants & community projects', color: 'text-chi-red',  bg: 'bg-soft-red/30' },
            { label: 'Stability Reserve',  amount: '30,000,000', pct: '30%', desc: 'Price stability backstop — off-market',   color: 'text-chi-blue', bg: ''              },
            { label: 'AMM Pool',           amount: '5,000,000',  pct: '5%',  desc: 'CHI/USDC liquidity on Base L2',           color: 'text-ink-muted',bg: ''              },
            { label: 'Team (4yr vest)',    amount: '5,000,000',  pct: '5%',  desc: 'Builder alignment — 1yr cliff',           color: 'text-ink-muted',bg: ''              },
          ].map((r, i) => (
            <div key={i} className={`grid grid-cols-4 px-5 py-4 border-b border-chi-border last:border-0 text-sm ${r.bg}`}>
              <span className="font-semibold text-ink">{r.label}</span>
              <span className="text-ink-dim font-mono text-xs self-center">{r.amount}</span>
              <span className={`font-black text-base ${r.color}`}>{r.pct}</span>
              <span className="text-ink-faint text-xs self-center">{r.desc}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { rule: '1% Auto-burn',    detail: 'Every on-chain CHI transfer reduces supply — supports long-term value' },
            { rule: '1% Max wallet',   detail: 'No single wallet > 1M CHI — prevents wealth concentration' },
            { rule: '0.5% Max tx',     detail: 'Single trade cap — prevents price manipulation' },
            { rule: '1-Person-1-Vote', detail: 'Identity-based DAO governance — money cannot buy political power' },
          ].map((r, i) => (
            <Card key={i}>
              <p className="text-sm font-bold text-ink mb-1">{r.rule}</p>
              <p className="text-xs text-ink-muted leading-relaxed">{r.detail}</p>
            </Card>
          ))}
        </div>
      </Slide>

      {/* ── 06 The Ask ──────────────────────────────────────────────────── */}
      <Slide n={6} title="The Ask — $50,000 USDC" accent="chi-red">
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-2xl bg-chi-red text-white p-5 text-center">
            <p className="text-3xl font-black mb-1">$50K</p>
            <p className="text-xs text-white/70">USDC raised from supporters</p>
          </div>
          <div className="rounded-2xl bg-chi-blue text-white p-5 text-center">
            <p className="text-3xl font-black mb-1">$0.01</p>
            <p className="text-xs text-white/70">Starting CHI price<br/>(50K ÷ 5M CHI in pool)</p>
          </div>
          <div className="rounded-2xl bg-ink text-white p-5 text-center">
            <p className="text-3xl font-black mb-1">$900K</p>
            <p className="text-xs text-white/70">Combined treasury + reserve<br/>value on Day 1</p>
          </div>
        </div>
        <p className="text-sm text-ink-dim leading-relaxed mb-5">
          The $50K seeds the AMM: 50K USDC paired with 5M CHI sets the starting price.
          The 60M CHI treasury and 30M CHI reserve are now worth $900K combined — <em>not from raising $900K</em>,
          but from that math. From there, every neighbor who refills CHI after spending it on services
          drives price and treasury value up organically.
        </p>
        <ul className="flex flex-col gap-2.5">
          {[
            'Seed the CHI/USDC liquidity pool on Base L2',
            'Cover launch overhead — legal, compliance, community outreach',
            'Fund the 50-business South Side pilot merchant program',
            'Operate the app through the early growth phase',
          ].map((item, i) => <Check key={i} color="red">{item}</Check>)}
        </ul>
      </Slide>

      {/* ── 07 Treasury Projections ─────────────────────────────────────── */}
      <Slide n={7} title="Treasury Value as CHI Price Grows" accent="chi-blue">
        <p className="text-sm text-ink-dim leading-relaxed mb-5">
          Mark-to-market values from the strategy document. Treasury value ≠ treasury liquidity —
          the DAO deploys only what pool depth can safely support. These numbers show what's possible
          as real economic activity drives CHI demand.
        </p>
        <div className="rounded-2xl border border-chi-border overflow-hidden">
          <div className="grid grid-cols-4 bg-ink px-5 py-3">
            {['CHI Price', 'Treasury (60M CHI)', 'Reserve (30M CHI)', 'Combined'].map(h => (
              <div key={h} className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{h}</div>
            ))}
          </div>
          {[
            { price: '$0.01',  treas: '$600K',  res: '$300K',  combo: '$900K',  launch: true  },
            { price: '$0.10',  treas: '$6M',    res: '$3M',    combo: '$9M',    launch: false },
            { price: '$1.00',  treas: '$60M',   res: '$30M',   combo: '$90M',   launch: false },
            { price: '$5.00',  treas: '$300M',  res: '$150M',  combo: '$450M',  launch: false },
            { price: '$10.00', treas: '$600M',  res: '$300M',  combo: '$900M',  launch: false },
          ].map((r, i) => (
            <div key={i} className={`grid grid-cols-4 px-5 py-4 border-b border-chi-border last:border-0 ${r.launch ? 'bg-soft-red/30' : i % 2 === 0 ? 'bg-bg-dark/50' : ''}`}>
              <span className="font-bold text-sm text-ink">
                {r.price}
                {r.launch && <span className="ml-2 text-[9px] font-bold text-chi-red bg-soft-red px-1.5 py-0.5 rounded-full">Day 1</span>}
              </span>
              <span className="text-sm text-ink-dim">{r.treas}</span>
              <span className="text-sm text-ink-dim">{r.res}</span>
              <span className="text-sm font-bold text-chi-blue">{r.combo}</span>
            </div>
          ))}
        </div>
      </Slide>

      {/* ── 08 Roadmap ──────────────────────────────────────────────────── */}
      <Slide n={8} title="Roadmap" accent="chi-blue">
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { phase: 'Phase 1', period: 'Now', title: 'Foundation', active: true, items: ['Smart contract deploy on Base L2', 'App launch iOS + Android', '50-business South Side pilot', 'Treasury DAO formation'] },
            { phase: 'Phase 2', period: 'Q2–Q4 2026', title: 'Growth', active: false, items: ['200+ merchant partners', 'First $500K community grant round', 'West Side expansion', 'Neighborhood council governance'] },
            { phase: 'Phase 3', period: '2027', title: 'Scale', active: false, items: ['Chi Coin Visa/Mastercard debit card', 'Micro-lending protocol', 'Cross-city partnerships', 'CPS financial literacy integration'] },
            { phase: 'Phase 4', period: '2028+', title: 'Legacy', active: false, items: ['National community currency model', 'Starter kit for Detroit, Baltimore, St. Louis', 'Open economic self-determination framework'] },
          ].map((p, i) => (
            <div key={i} className={`rounded-xl border p-5 ${p.active ? 'border-chi-blue bg-soft-blue/40' : 'border-chi-border bg-bg-dark'}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${p.active ? 'text-chi-blue' : 'text-ink-muted'}`}>{p.phase}</p>
                  <p className="text-base font-black text-ink">{p.title}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${p.active ? 'bg-chi-blue text-white' : 'bg-chi-border text-ink-muted'}`}>
                  {p.period}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {p.items.map((item, j) => <Check key={j}>{item}</Check>)}
              </ul>
            </div>
          ))}
        </div>
      </Slide>

      {/* ── 09 Investment Tiers ─────────────────────────────────────────── */}
      <Slide n={9} title="Investment Tiers" accent="chi-red">
        <div className="grid sm:grid-cols-2 gap-3 mb-5">
          {[
            { tier: 'Community', amount: '$100', chi: '1,000 CHI', highlight: false, perks: ['Early app access', 'Community NFT badge', 'DAO voting rights'] },
            { tier: 'Neighbor',  amount: '$1,000', chi: '11,000 CHI', highlight: true, perks: ['10% bonus tokens', 'Founding supporter list', 'Quarterly investor calls'] },
            { tier: 'Block Club', amount: '$10,000', chi: '125,000 CHI', highlight: false, perks: ['25% bonus tokens', 'Advisory table seat', 'Logo on app & website'] },
            { tier: 'Institutional', amount: 'Custom', chi: 'Pro-rated', highlight: false, perks: ['Custom allocation', 'ESG impact reporting', 'Board observer seat (optional)'] },
          ].map((t, i) => (
            <div key={i} className={`rounded-xl border p-5 ${t.highlight ? 'border-chi-blue bg-chi-blue text-white' : 'border-chi-border bg-bg-dark'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className={`text-xs font-semibold mb-0.5 ${t.highlight ? 'text-white/60' : 'text-ink-muted'}`}>{t.tier}</p>
                  <p className={`text-2xl font-black ${t.highlight ? 'text-white' : 'text-ink'}`}>{t.amount}</p>
                </div>
                <span className={`text-sm font-bold ${t.highlight ? 'text-white/80' : 'text-chi-blue'}`}>{t.chi}</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {t.perks.map((p, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className={t.highlight ? 'text-white/70' : 'text-chi-blue'}>
                      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={`text-xs ${t.highlight ? 'text-white/80' : 'text-ink-dim'}`}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-chi-red/20 bg-soft-red/30 p-5 text-center">
          <p className="text-sm text-ink-dim mb-3">Ready to invest? Reach out directly or contribute through the site.</p>
          <a
            href="mailto:invest@chicoin.xyz?subject=Chi%20Coin%20Investment%20Inquiry"
            className="inline-flex items-center gap-2 bg-chi-red text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-chi-red-light transition-colors"
          >
            Contact the Team →
          </a>
        </div>
      </Slide>

      {/* ── Closing ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden text-center px-10 py-12"
        style={{ background: 'linear-gradient(135deg, #0F5EA8 0%, #111827 60%, #E53950 100%)' }}
      >
        <img src="/chicoin-logo.png" alt="Chi Coin" className="w-16 h-16 rounded-full object-cover mx-auto mb-5 shadow-lg ring-2 ring-white/20" />
        <p className="text-2xl font-light text-white italic leading-relaxed mb-4 max-w-lg mx-auto">
          "The goal is not just one successful coin.
          The goal is a new model for local economic
          self-determination."
        </p>
        <p className="text-white/40 text-xs mb-6">Chi Coin Strategy Document · April 2026</p>
        <a
          href="mailto:invest@chicoin.xyz?subject=Chi%20Coin%20%E2%80%94%20Let%27s%20Talk"
          className="inline-flex items-center gap-2 bg-white text-ink font-semibold text-sm px-7 py-3 rounded-full hover:bg-chi-border transition-colors"
        >
          Start the Conversation →
        </a>
      </div>

    </PageModal>
  )
}
