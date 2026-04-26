import PageModal from './PageModal'

function Section({ n, title, children }) {
  return (
    <div className="mb-12">
      <div className="flex items-end gap-4 mb-5 pb-4 border-b-2 border-chi-border">
        <span className="text-5xl font-black leading-none select-none text-soft-blue" style={{ color: '#EAF6FC' }}>{String(n).padStart(2, '0')}</span>
        <div className="pb-1">
          <div className="w-6 h-0.5 mb-2 rounded-full bg-chi-blue" />
          <h3 className="text-lg font-black text-ink">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  )
}

function P({ children }) {
  return <p className="text-sm text-ink-dim leading-relaxed mb-4">{children}</p>
}

function H({ children }) {
  return <h4 className="text-sm font-bold text-ink mt-5 mb-2">{children}</h4>
}

function InfoRow({ label, value, sub }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-chi-border last:border-0 gap-4">
      <span className="text-sm text-ink-muted">{label}</span>
      <div className="text-right">
        <span className="text-sm font-bold text-ink">{value}</span>
        {sub && <p className="text-[10px] text-ink-faint mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function WhitepaperModal({ isOpen, onClose }) {
  return (
    <PageModal
      isOpen={isOpen}
      onClose={onClose}
      badge="Technical Whitepaper · v1.0 · April 2026"
      title="Chi Coin — Technical Specification"
      subtitle="Community Currency on Base L2"
    >
      {/* Abstract */}
      <div
        className="rounded-2xl overflow-hidden mb-12"
        style={{ background: 'linear-gradient(135deg, #0F5EA8 0%, #111827 100%)' }}
      >
        <div className="px-7 py-8">
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">Abstract</p>
          <p className="text-sm text-white/85 leading-relaxed">
            Chi Coin (CHI) is a community currency deployed on Base L2 designed to rebuild economic
            circulation in neighborhoods historically damaged by federal redlining policy. This document
            describes the technical architecture, tokenomics, AMM mechanics, fee model, governance
            structure, treasury deployment logic, and replication framework.
          </p>
        </div>
      </div>

      <Section n={1} title="Background & Motivation">
        <P>Between 1935 and 1940, the HOLC graded neighborhoods in 239 American cities. Communities marked "D" (red) were systematically denied federally-backed mortgages — predominantly Black and immigrant neighborhoods. This was coordinated federal extraction of generational wealth.</P>
        <P>The consequences are measurable: a $79,000 median income gap between adjacent Chicago zip codes, a 14-year life expectancy gap between communities 8 miles apart, and persistent bank deserts pushing residents toward 300%+ APR predatory lenders.</P>
        <P>Chi Coin is infrastructure to reverse the wealth-leakage pattern — a functioning local economy where value circulates among neighbors instead of leaving to outside platforms and chains.</P>
      </Section>

      <Section n={2} title="Token Specification">
        <div className="bg-bg-dark rounded-2xl border border-chi-border overflow-hidden mb-4">
          <InfoRow label="Token name"    value="Chi Coin" />
          <InfoRow label="Ticker"        value="CHI" />
          <InfoRow label="Total supply"  value="100,000,000 CHI" sub="Fixed. No automatic inflation." />
          <InfoRow label="Blockchain"    value="Base L2 (Ethereum Layer 2)" sub="Low fees, fast finality, EVM-compatible" />
          <InfoRow label="Standard"      value="ERC-20 with extensions" />
          <InfoRow label="Burn rate"     value="1% per on-chain transfer" sub="Reduces circulating supply over time" />
          <InfoRow label="Max wallet"    value="1,000,000 CHI (1%)" sub="Prevents wealth concentration" />
          <InfoRow label="Max tx size"   value="500,000 CHI (0.5%)" sub="Prevents single-trade manipulation" />
        </div>
        <P>The 1% auto-burn applies to all on-chain CHI transfers unless explicit protocol-level exemptions are coded. Burn reduces circulating supply — if demand holds or rises, this creates upward price pressure over time.</P>
      </Section>

      <Section n={3} title="Token Allocation">
        <div className="rounded-2xl border border-chi-border overflow-hidden mb-4">
          <div className="grid grid-cols-4 bg-ink px-5 py-3">
            {['Allocation', 'CHI', '%', 'Notes'].map(h => (
              <div key={h} className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{h}</div>
            ))}
          </div>
          {[
            { label: 'Community Treasury', chi: '60,000,000', pct: '60%', note: 'DAO-governed deployment', color: 'text-chi-red',  bg: 'bg-soft-red/30' },
            { label: 'Stability Reserve',  chi: '30,000,000', pct: '30%', note: 'Price backstop — off-market', color: 'text-chi-blue', bg: '' },
            { label: 'AMM Liquidity',      chi: '5,000,000',  pct: '5%',  note: 'CHI/USDC pool seed', color: 'text-ink-muted', bg: '' },
            { label: 'Team / Builders',    chi: '5,000,000',  pct: '5%',  note: '4-yr vest, 1-yr cliff', color: 'text-ink-muted', bg: '' },
          ].map((r, i) => (
            <div key={i} className={`grid grid-cols-4 px-5 py-4 border-b border-chi-border last:border-0 text-sm ${r.bg}`}>
              <span className="font-semibold text-ink">{r.label}</span>
              <span className="text-ink-dim font-mono text-xs self-center">{r.chi}</span>
              <span className={`font-black text-base ${r.color}`}>{r.pct}</span>
              <span className="text-ink-faint text-xs self-center">{r.note}</span>
            </div>
          ))}
        </div>
        <P>The 60M community treasury is the central economic institution — governed entirely by the DAO, deployed only through approved proposals. The 30M stability reserve exists as a backstop against extreme market conditions and is not freely spendable.</P>
      </Section>

      <Section n={4} title="AMM Mechanics & Liquidity">
        <P>Chi Coin uses a constant-product AMM (Uniswap v3-style) on Base L2 for the CHI/USDC pair. The pool is seeded at launch with real USDC raised from supporters and CHI from the 5% AMM allocation.</P>
        <div className="bg-bg-dark rounded-2xl border border-chi-border overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-chi-border">
            <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">Launch pool scenarios</p>
          </div>
          <div className="grid grid-cols-4 px-5 py-2 border-b border-chi-border">
            {['USDC Seeded', 'CHI in Pool', 'Start Price', 'Day-1 Combined Value'].map(h => (
              <div key={h} className="text-[10px] text-ink-faint uppercase tracking-widest">{h}</div>
            ))}
          </div>
          {[
            ['$50,000',  '5,000,000', '$0.01 / CHI', '$900,000',    true],
            ['$250,000', '5,000,000', '$0.05 / CHI', '$4,500,000',  false],
            ['$500,000', '5,000,000', '$0.10 / CHI', '$9,000,000',  false],
          ].map((row, i) => (
            <div key={i} className={`grid grid-cols-4 px-5 py-3.5 border-b border-chi-border last:border-0 text-sm ${row[4] ? 'bg-soft-red/20' : ''}`}>
              <span className={`font-semibold ${row[4] ? 'text-chi-red' : 'text-ink'}`}>{row[0]}</span>
              <span className="text-ink-dim">{row[1]}</span>
              <span className="text-ink-dim">{row[2]}</span>
              <span className="font-bold text-chi-blue">{row[3]}</span>
            </div>
          ))}
          <div className="px-5 py-3 border-t border-chi-border">
            <p className="text-xs text-ink-faint italic">Recommended: $50K minimum · $60K+ preferred for launch overhead + operating room</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="bg-soft-red/30 rounded-xl border border-chi-red/20 p-4">
            <p className="text-xs font-bold text-chi-red uppercase tracking-widest mb-2">Balance — what moves price</p>
            <p className="text-xs text-ink-dim leading-relaxed">When users buy CHI, CHI leaves the pool, USDC enters, price rises. Refill demand from service spending is the primary organic price driver.</p>
          </div>
          <div className="bg-soft-blue/40 rounded-xl border border-chi-blue/20 p-4">
            <p className="text-xs font-bold text-chi-blue uppercase tracking-widest mb-2">Depth — what stabilizes it</p>
            <p className="text-xs text-ink-dim leading-relaxed">Depth determines slippage. More depth = less slippage = safer treasury conversions. Built by adding matched USDC+CHI liquidity periodically at the current ratio.</p>
          </div>
        </div>
      </Section>

      <Section n={5} title="Fee Architecture">
        <P>Two separate fee buckets route value to different protocol functions:</P>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl border border-chi-red/25 bg-soft-red/30 p-5">
            <p className="text-xs font-bold text-chi-red uppercase tracking-widest mb-2">CHI-Side Fee → Treasury</p>
            <p className="text-xs text-ink-muted leading-relaxed mb-3">A portion of the CHI component of each service payment routes to the community treasury on every booking.</p>
            <div className="bg-white rounded-lg border border-chi-border p-3 text-xs">
              <p className="text-ink font-semibold">$20 + 15 CHI service</p>
              <p className="text-ink-muted mt-0.5">2% of CHI side → treasury receives <strong className="text-chi-red">0.30 CHI</strong> (before burn)</p>
            </div>
          </div>
          <div className="rounded-xl border border-chi-blue/25 bg-soft-blue/40 p-5">
            <p className="text-xs font-bold text-chi-blue uppercase tracking-widest mb-2">USD-Side Fee → Liquidity Reserve</p>
            <p className="text-xs text-ink-muted leading-relaxed mb-3">A small fee from the USD component routes to a USDC reserve dedicated to future liquidity support.</p>
            <div className="bg-white rounded-lg border border-chi-border p-3 text-xs">
              <p className="text-ink font-semibold">$20 USD service payment</p>
              <p className="text-ink-muted mt-0.5">Small % → USDC reserve → periodically added to pool to deepen liquidity</p>
            </div>
          </div>
        </div>
        <P>The liquidity reserve does NOT auto-add to the AMM per transaction. USDC accumulates, then the DAO or protocol logic adds matched liquidity (USDC + CHI at current ratio) in controlled batches. This preserves governance control over capital deployment.</P>
      </Section>

      <Section n={6} title="Treasury Deployment Logic">
        <P>Treasury CHI value and treasury liquidity are fundamentally different. The DAO must manage deployment according to market depth at each stage:</P>
        <div className="flex flex-col gap-3">
          {[
            { n: 1, stage: 'Early Launch',    desc: 'Shallow pool. No CHI selling. Focus on usage and onboarding. Small operational conversions only.',               color: 'bg-soft-red/40   border-chi-red/20',   label: 'chi-red'        },
            { n: 2, stage: 'Growth',          desc: 'Deeper pool from reserve additions + refill buy pressure. Small DAO-approved treasury deployments become safer. Community grants begin.', color: 'bg-soft-blue/40  border-chi-blue/20',  label: 'chi-blue'       },
            { n: 3, stage: 'Mature Economy',  desc: 'Strong liquidity, lower slippage. Treasury can support larger community initiatives. National replication phase begins.',                color: 'bg-bg-dark       border-chi-border',   label: 'chi-blue-light' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border p-4 flex gap-4 ${s.color}`}>
              <div className={`w-7 h-7 rounded-full bg-${s.label}/20 border border-${s.label}/30 flex items-center justify-center text-xs font-black text-${s.label} shrink-0`}>{s.n}</div>
              <div>
                <p className="text-sm font-bold text-ink mb-1">{s.stage}</p>
                <p className="text-xs text-ink-muted leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section n={7} title="The Economic Flywheel">
        <P>Not every transaction touches the AMM. Service payments circulate CHI between wallets. The AMM is touched when users refill. Real utility creates real demand without artificial trading volume.</P>
        <div className="relative">
          <div className="absolute left-3.5 top-4 bottom-4 w-px bg-chi-border" />
          {[
            'Users receive starter CHI — join without buying first',
            'Users spend CHI on local services (barbers, tutors, handymen, DJs)',
            'Providers accumulate CHI as part of their USD + CHI payment',
            'Customers run low on CHI and need to refill',
            'Customers buy CHI from the AMM — real market interaction',
            'Buy pressure: CHI leaves pool, USDC enters, price rises',
            'Treasury & reserve mark-to-market value rises with price',
            'Protocol periodically adds matched liquidity to reduce slippage',
            'Deeper pool → safer DAO grants → more community investment → more users',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4 mb-3 pl-1">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-black shrink-0 z-10 ${
                i < 4  ? 'bg-soft-red  border-chi-red  text-chi-red'  :
                i < 7  ? 'bg-soft-blue border-chi-blue text-chi-blue' :
                'bg-bg-dark border-chi-border text-ink-muted'
              }`}>{i + 1}</div>
              <p className="text-sm text-ink-dim leading-relaxed pt-1">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n={8} title="Governance">
        <P>Chi Coin uses identity-based governance — 1 person, 1 vote. Wallet size does not determine voting power. This directly prevents wealthy actors from buying political control — the core weakness of most token governance models.</P>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: 'DAO Proposals',         body: 'Any verified community member can submit proposals for treasury deployment, fee adjustments, or governance changes.' },
            { title: 'Neighborhood Councils', body: 'Geographically organized councils represent all 77 community areas. Council votes aggregate into the main DAO.' },
            { title: 'Anti-manipulation',     body: '1% max wallet cap and 0.5% transaction cap prevent wealthy actors from accumulating control even outside governance.' },
            { title: 'Minting control',       body: 'DAO-governed minting cap of up to 10% of current supply at a time. Any mint requires a full community vote.' },
          ].map((g, i) => (
            <div key={i} className="bg-bg-dark rounded-xl border border-chi-border p-4">
              <p className="text-sm font-bold text-ink mb-1">{g.title}</p>
              <p className="text-xs text-ink-muted leading-relaxed">{g.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n={9} title="Replication Framework">
        <P>Once the model is proven in Chicago, it becomes a starter kit — open infrastructure that Detroit, Baltimore, St. Louis, Atlanta, and other cities can adapt to launch their own locally-controlled economies. Chicago is the proof of concept, not the monopoly.</P>
        <div className="bg-soft-blue/40 rounded-xl border border-chi-blue/20 p-5">
          <p className="text-xs font-bold text-chi-blue uppercase tracking-widest mb-4">Starter Kit Components</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {['Smart contract template (audited)', 'Tokenomics framework', 'Treasury & DAO governance rules', 'Liquidity launch playbook', 'App codebase template', 'Onboarding & education toolkit', 'Provider activation playbook', 'Legal / policy framing guidance'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-ink-dim">
                <div className="w-1.5 h-1.5 rounded-full bg-chi-blue shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <div className="text-center pt-4 mt-4 border-t border-chi-border">
        <p className="text-xs text-ink-faint">
          Chi Coin Whitepaper v1.0 · April 2026 · Chicago, IL<br/>
          Questions: <a href="mailto:invest@chicoin.xyz" className="text-chi-blue hover:underline">invest@chicoin.xyz</a>
        </p>
      </div>
    </PageModal>
  )
}
