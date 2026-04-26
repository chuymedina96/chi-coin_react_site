import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger } from '../hooks/useScrollAnimation'
import { SLIDES, CATEGORIES, COMMUNITY_URL, buildHtmlForSlide } from '../lib/chicagoMaps'

export default function CivicMaps() {
  const [commGeo,  setCommGeo]  = useState(null)
  const [geoError, setGeoError] = useState(false)
  const [activeCat, setActiveCat] = useState('all')
  const [activeIdx, setActiveIdx] = useState(0)
  const [rendered,  setRendered]  = useState(new Set(['holc']))

  const { ref: titleRef, isInView: titleInView } = useScrollAnimation()

  useEffect(() => {
    fetch(COMMUNITY_URL, { headers:{ Accept:'application/json' } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => d?.features?.length ? setCommGeo(d) : setGeoError(true))
      .catch(() => setGeoError(true))
    // HOLC is now self-fetching inside the iframe — no React fetch needed
  }, [])

  const slides = useMemo(
    () => activeCat === 'all' ? SLIDES : SLIDES.filter(s => s.cat === activeCat),
    [activeCat]
  )
  const current = slides[activeIdx] ?? slides[0]

  const markRendered = useCallback((idx, sl) => {
    const ids = [idx-1,idx,idx+1].filter(i=>i>=0&&i<sl.length).map(i=>sl[i].id)
    setRendered(prev => { const n=new Set(prev); ids.forEach(id=>n.add(id)); return n })
  }, [])

  const goTo = useCallback((idx) => {
    const c = Math.max(0, Math.min(slides.length-1, idx))
    setActiveIdx(c)
    markRendered(c, slides)
  }, [slides, markRendered])

  const selectCat = useCallback((cat) => {
    setActiveCat(cat)
    setActiveIdx(0)
    const sl = cat === 'all' ? SLIDES : SLIDES.filter(s => s.cat === cat)
    markRendered(0, sl)
  }, [markRendered])

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'ArrowLeft')  goTo(activeIdx - 1)
      if (e.key === 'ArrowRight') goTo(activeIdx + 1)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [activeIdx, goTo])

  function buildHtml(id) {
    if (id === 'chiCoin') return null
    return buildHtmlForSlide(id, { commGeo })
  }

  function needsLoading(slide) {
    return slide.needsGeo && !commGeo && !geoError
  }

  return (
    <section id="civic-maps" className="relative py-32 overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-chi-blue/5 top-0 right-[-150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.p variants={fadeUp} className="text-chi-blue text-xs tracking-widest uppercase font-semibold mb-4">
            Civic Data Intelligence
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-ink">
            18 maps that tell
            <span className="text-gradient"> Chicago's real story.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim leading-relaxed">
            Every dataset is built into the Chi Coin app — interactive, searchable,
            available in English and Spanish. Data is power. We put it in the community's hands.
          </motion.p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => selectCat(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeCat === cat.id
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink-muted border-chi-border hover:border-ink hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Slide title */}
        {current && (
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: current.color }} />
              <h3 className="text-base font-black text-ink truncate">{current.title}</h3>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0"
                style={{ color: current.color, borderColor: current.color+'44', background: current.color+'15' }}>
                {current.year}
              </span>
            </div>
            <span className="text-xs font-bold text-ink-muted bg-bg-dark border border-chi-border px-3 py-1 rounded-full shrink-0 ml-4">
              {activeIdx + 1} / {slides.length}
            </span>
          </div>
        )}

        {/* Map carousel */}
        <div className="relative">
          {/* Prev */}
          <button
            onClick={() => goTo(activeIdx - 1)}
            disabled={activeIdx === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white border border-chi-border shadow-md flex items-center justify-center text-ink-muted hover:text-ink hover:border-chi-border-soft transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* Map frame */}
          <div className="rounded-2xl overflow-hidden border border-chi-border shadow-xl h-72 sm:h-96 lg:h-[500px]">
            {current?.id === 'chiCoin' ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-center px-8"
                style={{ background: 'linear-gradient(135deg, #0F5EA8 0%, #111827 55%, #E53950 100%)' }}>
                <img src="/chicoin-logo.png" alt="Chi Coin" className="w-24 h-24 rounded-full object-cover shadow-2xl ring-4 ring-white/20" />
                <div>
                  <h4 className="text-2xl font-black text-white mb-2">Chi Coin Economy Layer</h4>
                  <p className="text-white/70 max-w-md leading-relaxed text-sm">
                    This is the layer that changes everything. Chi Coin routes value back to every community
                    that every other map shows has been systematically stripped of it.
                  </p>
                </div>
                <a href="#invest" className="bg-white text-ink font-semibold text-sm px-7 py-3 rounded-full hover:bg-chi-border transition-colors">
                  Support the launch →
                </a>
              </div>
            ) : needsLoading(current) ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: '#1a1a2e' }}>
                <svg className="animate-spin w-8 h-8 text-chi-blue" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                <p className="text-white/50 text-sm">Loading map data…</p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {slides.map((slide, i) => {
                  if (slide.id === 'chiCoin') return null
                  if (!rendered.has(slide.id) && i !== activeIdx) return null
                  const html = buildHtml(slide.id)
                  if (!html) return null
                  return (
                    <iframe
                      key={slide.id}
                      srcDoc={html}
                      title={slide.title}
                      className="absolute inset-0 w-full h-full border-0"
                      style={{
                        visibility: i === activeIdx ? 'visible' : 'hidden',
                        pointerEvents: i === activeIdx ? 'auto' : 'none',
                      }}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => goTo(activeIdx + 1)}
            disabled={activeIdx === slides.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white border border-chi-border shadow-md flex items-center justify-center text-ink-muted hover:text-ink hover:border-chi-border-soft transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        {/* Description */}
        {current && (
          <p className="mt-5 px-1 text-sm text-ink-dim leading-relaxed max-w-3xl">{current.desc}</p>
        )}

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-6 flex-wrap">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              className="h-2 rounded-full transition-all duration-200"
              style={{
                width: i === activeIdx ? '20px' : '8px',
                background: i === activeIdx ? (current?.color || '#0F5EA8') : '#D8E0E8',
              }}
              title={slide.title}
            />
          ))}
        </div>

        <p className="text-center text-[10px] text-ink-faint mt-4">
          ← → arrow keys · click any map to explore · full interactive version in the Chi Coin app
        </p>
      </div>
    </section>
  )
}
