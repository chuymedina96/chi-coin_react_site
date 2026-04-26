import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Bridge Chicago is highlighted — first impression for investors
const links = [
  { label: 'Bridge Chicago',  href: '#bridging',     hot: true  },
  { label: 'The Problem',     href: '#problem'                  },
  { label: 'Solution',        href: '#solution'                 },
  { label: 'App Features',    href: '#how-it-works'             },
  { label: 'Tokenomics',      href: '#tokenomics'               },
  { label: 'Roadmap',         href: '#roadmap'                  },
  { label: 'Invest',          href: '#invest'                   },
]

// Desktop link with animated sliding underline
function NavLink({ label, href, hot }) {
  return (
    <a
      href={href}
      className={`relative group font-medium text-sm py-1 transition-colors duration-200 flex items-center gap-1.5 ${
        hot ? 'text-chi-red hover:text-chi-red-light' : 'text-ink-muted hover:text-ink'
      }`}
    >
      {hot && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-chi-red"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      )}
      {label}
      {/* Sliding underline — chi-red for hot link, chi-blue for others */}
      <span
        className={`absolute -bottom-0.5 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-full ${
          hot ? 'bg-chi-red' : 'bg-chi-blue'
        }`}
      />
    </a>
  )
}

export default function Nav({ onDonate }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-chi-border shadow-md shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/chicoin-logo.png"
            alt="Chi Coin"
            className="w-9 h-9 rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform duration-200"
          />
          <span className="font-black text-lg tracking-tight text-ink">
            Chi<span className="text-chi-red">Coin</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-7">
          {links.map(l => (
            <li key={l.href}>
              <NavLink {...l} />
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center shrink-0">
          <button
            onClick={onDonate}
            className="btn-primary text-xs px-5 py-2.5 hover:scale-105"
          >
            Donate Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 ml-auto"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-ink transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden bg-white border-t border-chi-border shadow-xl"
          >
            <ul className="px-5 pt-3 pb-5 flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 + 0.05 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 py-3 border-b border-chi-border/50 last:border-0 transition-colors ${
                      l.hot
                        ? 'text-chi-red font-bold text-base hover:text-chi-red-light'
                        : 'text-ink-dim font-medium text-base hover:text-ink'
                    }`}
                  >
                    {l.hot && (
                      <span className="w-2 h-2 rounded-full bg-chi-red shrink-0" />
                    )}
                    {!l.hot && (
                      <span className="w-2 h-2 rounded-full bg-chi-border shrink-0" />
                    )}
                    {l.label}
                    <svg className="ml-auto w-4 h-4 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.04 + 0.1 }}
                className="pt-4"
              >
                <button
                  onClick={() => { setOpen(false); onDonate?.() }}
                  className="btn-primary w-full justify-center py-3.5 text-sm"
                >
                  Donate Now
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
