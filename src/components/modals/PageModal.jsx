import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageModal({ isOpen, onClose, title, subtitle, badge, children }) {
  const contentRef = useRef(null)
  const [progress, setProgress] = useState(0)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  // Reset scroll + progress when modal opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0
      setProgress(0)
    }
  }, [isOpen])

  function handleScroll() {
    const el = contentRef.current
    if (!el) return
    const total = el.scrollHeight - el.clientHeight
    setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(17,24,39,0.65)', backdropFilter: 'blur(10px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white rounded-3xl shadow-2xl shadow-black/25 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Chicago flag top stripe */}
            <div className="flex h-1.5 shrink-0">
              <div className="flex-1 bg-chi-blue-light" />
              <div className="w-6 bg-white" />
              <div className="flex-1 bg-chi-red" />
              <div className="w-6 bg-white" />
              <div className="flex-1 bg-chi-blue-light" />
            </div>

            {/* Header */}
            <div className="shrink-0 px-7 pt-5 pb-4 flex items-center justify-between border-b border-chi-border bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/chicoin-logo.png"
                  alt="Chi Coin"
                  className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
                />
                <div className="min-w-0">
                  {badge && (
                    <p className="text-[10px] font-bold text-chi-red uppercase tracking-widest mb-0.5">{badge}</p>
                  )}
                  <h2 className="text-base font-black text-ink leading-tight truncate">{title}</h2>
                  {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 w-9 h-9 rounded-full bg-bg-dark border border-chi-border flex items-center justify-center text-ink-muted hover:text-chi-red hover:border-chi-red/40 transition-all shrink-0"
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Scroll progress bar */}
            <div className="h-0.5 bg-chi-border shrink-0">
              <div
                className="h-0.5 bg-gradient-to-r from-chi-red to-chi-blue transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Scrollable content — this is the ONLY scrolling element */}
            <div
              ref={contentRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overscroll-contain"
            >
              <div className="px-7 py-8">
                {children}
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-chi-border px-7 py-3.5 flex items-center justify-between bg-bg-dark">
              <div className="flex items-center gap-2">
                <img src="/chicoin-logo.png" alt="" className="w-4 h-4 rounded-full object-cover opacity-70" />
                <p className="text-[11px] text-ink-faint">Chi Coin · Bridging Chicago Neighborhoods</p>
              </div>
              <a
                href="mailto:invest@chicoin.xyz"
                className="text-[11px] font-semibold text-chi-blue hover:text-chi-blue-light transition-colors"
              >
                invest@chicoin.xyz
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
