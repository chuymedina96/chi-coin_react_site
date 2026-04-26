import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SLIDES, CATEGORIES, COMMUNITY_URL, buildHtmlForSlide } from '../lib/chicagoMaps'

// ── Map iframe (lazy, keeps DOM once rendered) ────────────────────────────────
function MapFrame({ slide, geoData, isActive, onRendered }) {
  const [html, setHtml] = useState(null)

  useEffect(() => {
    if (!isActive && html) return  // already rendered, keep it
    if (!isActive) return           // not active yet, don't render
    if (slide.id === 'chiCoin') { onRendered(); return }
    const built = buildHtmlForSlide(slide.id, geoData)
    if (built) { setHtml(built); onRendered() }
  }, [isActive, geoData.commGeo])

  if (slide.id === 'chiCoin') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-5 text-center px-8"
        style={{ background: 'linear-gradient(135deg, #0F5EA8 0%, #111827 55%, #E53950 100%)' }}>
        <img src="/chicoin-logo.png" alt="Chi Coin" className="w-20 h-20 rounded-full object-cover shadow-2xl ring-4 ring-white/20" />
        <div>
          <h4 className="text-2xl font-black text-white mb-2">Chi Coin Economy Layer</h4>
          <p className="text-white/70 max-w-md leading-relaxed text-sm">
            This is the layer that changes everything. Chi Coin routes value back to every community
            the other 17 maps show has been systematically stripped of it.
          </p>
        </div>
      </div>
    )
  }

  if (!html) {
    const needsData = slide.needsGeo && !geoData.commGeo
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4"
        style={{ background: '#1a1a2e' }}>
        {needsData
          ? <><svg className="animate-spin w-8 h-8 text-chi-blue" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg><p className="text-white/50 text-sm">Loading map data…</p></>
          : <p className="text-white/40 text-sm">Map unavailable</p>
        }
      </div>
    )
  }

  return (
    <iframe
      srcDoc={html}
      title={slide.title}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  )
}

// ── Main modal ────────────────────────────────────────────────────────────────
export default function MapCarouselModal({ isOpen, onClose, startAt = 0 }) {
  const [commGeo, setCommGeo] = useState(null)
  const [activeCat, setActiveCat] = useState('all')
  const [activeIdx, setActiveIdx] = useState(startAt)
  const [rendered,  setRendered]  = useState(new Set())

  const geoData = useMemo(() => ({ commGeo }), [commGeo])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Fetch GeoJSON when modal opens (browser cache means fast after first load)
  useEffect(() => {
    if (!isOpen) return
    if (!commGeo) {
      fetch(COMMUNITY_URL, { headers:{ Accept:'application/json' } })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => d?.features?.length && setCommGeo(d))
        .catch(() => {})
    }
    // HOLC is self-fetching inside the iframe — no React fetch needed
  }, [isOpen])

  // Reset to startAt whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveIdx(startAt)
      setActiveCat('all')
      setRendered(new Set())
    }
  }, [isOpen, startAt])

  // ESC key
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  const slides = useMemo(
    () => activeCat === 'all' ? SLIDES : SLIDES.filter(s => s.cat === activeCat),
    [activeCat]
  )

  const current = slides[Math.min(activeIdx, slides.length - 1)]

  const goTo = useCallback((idx) => {
    setActiveIdx(Math.max(0, Math.min(slides.length - 1, idx)))
  }, [slides.length])

  // Arrow keys inside modal
  useEffect(() => {
    if (!isOpen) return
    const fn = (e) => {
      if (e.key === 'ArrowLeft')  goTo(activeIdx - 1)
      if (e.key === 'ArrowRight') goTo(activeIdx + 1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, activeIdx, goTo])

  const selectCat = useCallback((cat) => {
    setActiveCat(cat)
    setActiveIdx(0)
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-3"
          style={{ background: 'rgba(17,24,39,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-[#111827] rounded-3xl w-full max-w-6xl flex flex-col overflow-hidden shadow-2xl"
            style={{ height: '92vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <img src="/chicoin-logo.png" alt="Chi Coin" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Chi Coin · Civic Data</p>
                  <h3 className="text-sm font-black text-white leading-tight">
                    {current?.title || '18 Chicago Maps'}
                  </h3>
                </div>
                {current && (
                  <span className="text-[9px] font-bold px-2 py-1 rounded-full ml-1"
                    style={{ color: current.color, background: current.color + '22', border: `1px solid ${current.color}44` }}>
                    {current.year}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white/30 bg-white/8 px-3 py-1 rounded-full">
                  {activeIdx + 1} / {slides.length}
                </span>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Category filter ────────────────────────────────────── */}
            <div className="flex gap-2 px-6 py-3 border-b border-white/8 overflow-x-auto shrink-0 no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => selectCat(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeCat === cat.id
                      ? 'bg-white text-ink'
                      : 'bg-white/8 text-white/50 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* ── Map area + nav ─────────────────────────────────────── */}
            <div className="flex-1 relative min-h-0">
              {/* Prev */}
              <button
                onClick={() => goTo(activeIdx - 1)}
                disabled={activeIdx === 0}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              {/* Maps */}
              <div className="w-full h-full relative">
                {slides.map((slide, i) => {
                  const shouldRender = rendered.has(slide.id) || i === activeIdx
                  if (!shouldRender) return null
                  return (
                    <div
                      key={slide.id}
                      className="absolute inset-0"
                      style={{
                        visibility: i === activeIdx ? 'visible' : 'hidden',
                        pointerEvents: i === activeIdx ? 'auto' : 'none',
                      }}
                    >
                      <MapFrame
                        slide={slide}
                        geoData={geoData}
                        isActive={i === activeIdx}
                        onRendered={() => setRendered(prev => new Set([...prev, slide.id]))}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Next */}
              <button
                onClick={() => goTo(activeIdx + 1)}
                disabled={activeIdx === slides.length - 1}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>

            {/* ── Footer: description + dots ─────────────────────────── */}
            <div className="shrink-0 px-6 pt-3 pb-4 border-t border-white/8 bg-[#0d1520]">
              {current && (
                <p className="text-xs text-white/50 leading-relaxed mb-3 max-w-3xl">{current.desc}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      onClick={() => goTo(i)}
                      className="h-1.5 rounded-full transition-all duration-200"
                      style={{
                        width: i === activeIdx ? '20px' : '6px',
                        background: i === activeIdx ? (current?.color || '#0F5EA8') : 'rgba(255,255,255,0.2)',
                      }}
                      title={slide.title}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-white/25">← → arrow keys to navigate · click map to interact</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
