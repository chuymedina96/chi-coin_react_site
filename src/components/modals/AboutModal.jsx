import PageModal from './PageModal'

export default function AboutModal({ isOpen, onClose }) {
  return (
    <PageModal
      isOpen={isOpen}
      onClose={onClose}
      badge="About Chi Coin"
      title="Our Mission"
      subtitle="Bridging Chicago Neighborhoods · Founded 2025"
    >
      {/* Hero cover */}
      <div
        className="rounded-2xl overflow-hidden mb-10 text-center px-8 py-12"
        style={{ background: 'linear-gradient(135deg, #0F5EA8 0%, #111827 55%, #E53950 100%)' }}
      >
        <img src="/chicoin-logo.png" alt="Chi Coin" className="w-20 h-20 rounded-full object-cover mx-auto mb-5 shadow-xl ring-4 ring-white/15" />
        <h2 className="text-3xl font-black text-white mb-3">Building a new economy for a great American city.</h2>
        <p className="text-white/70 max-w-md mx-auto leading-relaxed text-sm">
          Local economic infrastructure connecting Black and Latino neighbors —
          so they can trade together, build wealth together, and make Chicago stronger, block by block.
        </p>
      </div>

      {/* The Story */}
      <div className="mb-10">
        <h3 className="text-lg font-black text-ink mb-5">The Story</h3>
        <div className="flex flex-col gap-4">
          {[
            'Chi Coin started from a simple observation: wealth leaks out of Chicago\'s South and West Side neighborhoods constantly. Residents buy groceries from national chains. They book services through outside apps that take 30% cuts. Every dollar spent leaves the community within hours and doesn\'t come back.',
            'This isn\'t an accident. Federal redlining policy — applied systematically across 239 American cities between 1935 and 1940 — deliberately denied Black and immigrant neighborhoods access to the mortgage credit that built generational wealth for everyone else. The damage compounds.',
            'Chi Coin is local economic infrastructure — a marketplace where neighbors book each other\'s services, pay in USD + CHI, and keep value circulating inside the community. When neighbors spend with each other, Chicago grows stronger.',
            'The community treasury — 60% of all 100 million Chi Coins — is governed entirely by the people it serves. No outside investors control what happens to it. Neighborhood councils vote. Proposals go on-chain. The community decides.',
          ].map((p, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-0.5 rounded-full bg-chi-border shrink-0 mt-1 mb-1" />
              <p className="text-sm text-ink-dim leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Principles */}
      <div className="mb-10">
        <h3 className="text-lg font-black text-ink mb-5">Core Principles</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: 'Community first',       body: 'The treasury is owned by the community. Always. 60% of all CHI goes directly to DAO governance.',         accent: 'chi-red'        },
            { title: 'Workers are protected', body: 'USD + CHI pricing means providers never have to accept crypto-only payments. Real cash, immediately.',    accent: 'chi-blue'       },
            { title: 'Real local commerce',    body: 'A parallel economy with real utility, real transactions, real value — neighbors buying from neighbors.',    accent: 'chi-red'        },
            { title: 'Wealth stays local',    body: 'CHI circulates between neighbors. When you spend it on a haircut, it comes back as your neighbor\'s income.', accent: 'chi-blue'  },
            { title: 'No whales',             body: '1% max wallet cap. 1-person-1-vote governance. Money cannot buy political power here.',                    accent: 'chi-blue-light' },
            { title: 'Chicago proves it',     body: 'Then other cities build their own. The goal is a model for self-determination — not a monopoly.',          accent: 'chi-blue-light' },
          ].map((v, i) => (
            <div key={i} className="bg-bg-dark rounded-xl border border-chi-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full bg-${v.accent} shrink-0`} />
                <p className="text-sm font-bold text-ink">{v.title}</p>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vision quote */}
      <div className="bg-bg-dark rounded-2xl border border-chi-blue/20 p-7 text-center">
        <p className="text-base font-light text-ink italic leading-relaxed mb-4 max-w-lg mx-auto">
          "Eastside Coin proves the concept at the hyperlocal level.
          Chi Coin scales it at the Chicago level.
          The long-term mission is a starter-kit model so other cities can
          build their own community-owned local economies."
        </p>
        <p className="text-xs text-ink-faint mb-5">Chi Coin Strategy Document · April 2026</p>
        <a
          href="mailto:invest@chicoin.xyz?subject=Chi%20Coin%20%E2%80%94%20Get%20Involved"
          className="inline-flex items-center gap-2 bg-chi-blue text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-chi-blue-light transition-colors"
        >
          Get Involved →
        </a>
      </div>
    </PageModal>
  )
}
