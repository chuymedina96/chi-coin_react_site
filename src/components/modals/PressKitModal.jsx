import PageModal from './PageModal'

const brandColors = [
  { name: 'Chi Blue',        hex: '#0F5EA8', use: 'Primary — buttons, links, headings' },
  { name: 'Chi Red',         hex: '#E53950', use: 'CTAs, highlights, alerts' },
  { name: 'Sky Blue',        hex: '#41B6E6', use: 'Secondary accent — flag light stripe' },
  { name: 'Page Background', hex: '#EEF2F6', use: 'App & web backgrounds' },
  { name: 'Ink (text)',      hex: '#111827', use: 'Primary text color' },
  { name: 'Ink Muted',       hex: '#66768A', use: 'Secondary / caption text' },
]

const keyFacts = [
  { label: 'Founded',              value: '2025 · Chicago, IL' },
  { label: 'Token',                value: 'CHI (Chi Coin) on Base L2' },
  { label: 'Total Supply',         value: '100,000,000 CHI — fixed' },
  { label: 'Community Treasury',   value: '60M CHI (60% of supply)' },
  { label: 'Launch Raise Target',  value: '$50,000 USDC (AMM seed)' },
  { label: 'Day-1 Treasury Value', value: '$900,000 combined (mark-to-market)' },
  { label: 'Primary Market',       value: 'Chicago, IL — 2.7M residents, 77 neighborhoods' },
  { label: 'Replication Market',   value: '239 US cities with documented redlining maps' },
  { label: 'Governance',           value: '1-person-1-vote community DAO' },
  { label: 'Press Contact',        value: 'invest@chicoin.xyz' },
]

const boilerplate = `Chi Coin (CHI) is a community currency built on Base L2 (Ethereum Layer 2) designed to rebuild economic circulation in neighborhoods historically damaged by federal redlining policy. Through a parallel-economy model — where local services are priced in USD + CHI — Chi Coin keeps value circulating among neighbors instead of leaking to outside platforms. The community treasury, comprising 60% of the 100M CHI supply, is governed entirely by a decentralized DAO using identity-based (1-person-1-vote) governance. Founded in Chicago, 2025.`

export default function PressKitModal({ isOpen, onClose }) {
  return (
    <PageModal
      isOpen={isOpen}
      onClose={onClose}
      badge="Press Kit"
      title="Chi Coin Media Resources"
      subtitle="Everything you need to cover the story"
    >
      {/* Logo section */}
      <div className="mb-10">
        <h3 className="text-base font-black text-ink mb-4">Official Logo</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {/* Light bg */}
          <div className="bg-bg-dark rounded-2xl border border-chi-border p-8 flex flex-col items-center gap-4">
            <img src="/chicoin-logo.png" alt="Chi Coin Logo" className="w-28 h-28 object-contain rounded-full shadow-lg" />
            <div className="text-center">
              <p className="text-sm font-bold text-ink">Chi Coin Logo</p>
              <p className="text-xs text-ink-muted mt-0.5">PNG · 1024×1024px · Full color</p>
              <a
                href="/chicoin-logo.png"
                download="chicoin-logo.png"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-chi-blue hover:text-chi-blue-light transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                Download PNG
              </a>
            </div>
          </div>
          {/* Dark bg */}
          <div className="rounded-2xl border border-chi-border overflow-hidden flex flex-col items-center gap-4 p-8" style={{ background: '#111827' }}>
            <img src="/chicoin-logo.png" alt="Chi Coin Logo on dark" className="w-28 h-28 object-contain rounded-full shadow-lg" />
            <div className="text-center">
              <p className="text-sm font-bold text-white">On dark background</p>
              <p className="text-xs text-white/40 mt-0.5">Works on dark + light</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-dark rounded-xl border border-chi-border p-4">
          <p className="text-xs text-ink-muted leading-relaxed">
            <strong className="text-ink">Usage guidelines:</strong> Use at original proportions. Do not stretch, recolor, or add effects.
            For SVG or custom size requests: <a href="mailto:invest@chicoin.xyz" className="text-chi-blue hover:underline">invest@chicoin.xyz</a>
          </p>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="mb-10">
        <h3 className="text-base font-black text-ink mb-4">Brand Colors</h3>
        <div className="flex flex-col gap-2">
          {brandColors.map((c, i) => (
            <div key={i} className="flex items-center gap-4 bg-bg-dark rounded-xl border border-chi-border p-3.5">
              <div className="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-chi-border/50" style={{ background: c.hex }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{c.name}</p>
                <p className="text-xs text-ink-muted truncate">{c.use}</p>
              </div>
              <code className="text-xs font-mono text-ink-dim bg-white border border-chi-border px-2.5 py-1 rounded-lg shrink-0">{c.hex}</code>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-faint mt-3 pl-1">Typography: <strong className="text-ink-muted">Inter</strong> (Google Fonts) · Weights 400, 600, 700, 900</p>
      </div>

      {/* Key Facts */}
      <div className="mb-10">
        <h3 className="text-base font-black text-ink mb-4">Key Facts & Figures</h3>
        <div className="bg-bg-dark rounded-2xl border border-chi-border overflow-hidden">
          {keyFacts.map((f, i) => (
            <div key={i} className="flex items-start justify-between px-5 py-3.5 border-b border-chi-border last:border-0 gap-4">
              <span className="text-xs text-ink-muted uppercase tracking-widest font-semibold shrink-0">{f.label}</span>
              <span className="text-sm text-ink font-semibold text-right">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Boilerplate */}
      <div className="mb-10">
        <h3 className="text-base font-black text-ink mb-4">Approved Boilerplate</h3>
        <div className="bg-bg-dark rounded-xl border border-chi-border p-5 mb-2">
          <p className="text-sm text-ink-dim leading-relaxed italic">"{boilerplate}"</p>
        </div>
        <button
          onClick={() => navigator.clipboard?.writeText(boilerplate)}
          className="text-xs font-semibold text-chi-blue hover:text-chi-blue-light transition-colors"
        >
          Copy to clipboard →
        </button>
      </div>

      {/* Press Contact */}
      <div
        className="rounded-2xl overflow-hidden text-center px-8 py-10"
        style={{ background: 'linear-gradient(135deg, #0F5EA8 0%, #111827 100%)' }}
      >
        <p className="text-white font-black text-lg mb-1">Press Contact</p>
        <p className="text-white/60 text-sm mb-5">For interviews, press inquiries, and media partnerships</p>
        <a
          href="mailto:invest@chicoin.xyz?subject=Press%20Inquiry%20%E2%80%94%20Chi%20Coin"
          className="inline-flex items-center gap-2 bg-white text-ink font-semibold text-sm px-7 py-3 rounded-full hover:bg-chi-border transition-colors"
        >
          invest@chicoin.xyz →
        </a>
      </div>
    </PageModal>
  )
}
