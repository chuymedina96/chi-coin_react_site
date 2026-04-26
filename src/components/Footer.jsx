const socials = [
  {
    label: 'Twitter / X',
    href: 'https://x.com/chicoinchi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/chicoinchi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/chicoin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/chicoin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/>
      </svg>
    ),
  },
]

export default function Footer({ onDonate, onModal, onLegal }) {
  // Links config — each item has either href (scroll) or modal (opens a modal)
  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'How It Works',   href: '#how-it-works' },
        { label: 'Tokenomics',     href: '#tokenomics'   },
        { label: 'Roadmap',        href: '#roadmap'      },
        { label: 'Community',      href: '#community'    },
        { label: 'Treasury Vision',href: '#invest'       },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About',     modal: 'about'     },
        { label: 'Team',      modal: 'team'      },
        { label: 'Press Kit', modal: 'press-kit' },
        { label: 'Blog',      href: '#'          },
      ],
    },
    {
      title: 'Invest',
      links: [
        { label: 'Pitch Deck',  modal: 'pitch-deck'  },
        { label: 'Whitepaper',  modal: 'whitepaper'  },
        { label: 'Tokenomics',  href:  '#tokenomics' },
        { label: 'Contact',     href:  'mailto:invest@chicoin.xyz' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy',   legal: 'Privacy Policy'   },
        { label: 'Terms of Service', legal: 'Terms of Service' },
        { label: 'Risk Disclosure',  legal: 'Risk Disclosure'  },
      ],
    },
  ]

  function renderLink(link) {
    const cls = 'text-sm text-ink-faint hover:text-ink transition-colors cursor-pointer'

    if (link.modal) {
      return (
        <button onClick={() => onModal?.(link.modal)} className={cls}>
          {link.label}
        </button>
      )
    }
    if (link.legal) {
      return (
        <button onClick={() => onLegal?.(link.legal)} className={cls}>
          {link.label}
        </button>
      )
    }
    return (
      <a href={link.href} className={cls}>
        {link.label}
      </a>
    )
  }

  return (
    <footer className="relative border-t border-chi-border pt-16 pb-8 overflow-hidden bg-white/60">
      <div className="orb w-[400px] h-[400px] bg-chi-blue/5 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <img src="/chicoin-logo.png" alt="Chi Coin" className="w-10 h-10 rounded-full object-cover shadow-sm" />
              <span className="font-black text-lg tracking-tight text-ink">
                Chi<span className="text-chi-red">Coin</span>
              </span>
            </a>
            <p className="text-sm font-semibold text-ink-dim leading-relaxed max-w-xs mb-1">
              Bridging Chicago Neighborhoods.
            </p>
            <p className="text-xs text-ink-faint leading-relaxed max-w-xs mb-6">
              Rebuilding wealth in neighborhoods deliberately excluded from prosperity since 1940.
            </p>
            <div className="flex items-center gap-3 mb-6">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass border border-chi-border flex items-center justify-center text-ink-muted hover:text-chi-blue hover:border-chi-blue/35 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <button onClick={onDonate} className="btn-primary text-xs px-5 py-2.5">
              Support the Launch
            </button>
          </div>

          {/* Link columns */}
          {sections.map(section => (
            <div key={section.title}>
              <div className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-4">
                {section.title}
              </div>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link, i) => (
                  <li key={i}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-chi-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/chicoin-logo.png" alt="Chi Coin" className="w-5 h-5 rounded-full object-cover" />
            <p className="text-xs text-ink-faint">© 2025 Chi Coin. All rights reserved. Chicago, IL.</p>
          </div>
          <p className="text-xs text-ink-faint text-center sm:text-right max-w-md">
            Chi Coin is a community currency project. This is not financial advice.
            Cryptocurrency investments carry risk. Please invest responsibly.
          </p>
        </div>
      </div>
    </footer>
  )
}
