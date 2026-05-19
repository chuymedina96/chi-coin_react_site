import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger, slideLeft, slideRight } from '../hooks/useScrollAnimation'
import { holcHtml } from '../lib/chicagoMaps'
import MapCarouselModal from './MapCarouselModal'

const problems = [
  {
    stat: '73%',
    label: 'of South Side zip codes were redlined in the 1930s',
    detail: 'Federal housing maps from the late 1930s labeled Black and immigrant neighborhoods as "hazardous," cutting off entire communities from mortgages for generations.',
    accent: 'border-chi-red/30 bg-soft-red',
    statColor: 'text-chi-red',
  },
  {
    stat: '$31K',
    label: 'median income in Englewood vs. $110K in Lincoln Park',
    detail: 'That is an $80,000 difference between two neighborhoods a 20-minute train ride apart. Not a coincidence. The result of deliberate policy choices that still play out today.',
    accent: 'border-chi-border bg-bg-card-2',
    statColor: 'text-ink',
  },
  {
    stat: '3×',
    label: 'more likely to be denied a bank loan on the South & West Sides',
    detail: 'When mainstream banks say no, payday lenders charge over 300% APR to fill the gap. That is not a market failure. That is what happens when communities are systematically excluded.',
    accent: 'border-chi-blue/30 bg-soft-blue',
    statColor: 'text-chi-blue',
  },
  {
    stat: '14 yrs',
    label: 'life expectancy gap between zip codes 8 miles apart',
    detail: 'Where you live in Chicago shapes how long you live. Pollution, food access, and decades of disinvestment stack up. That gap does not close on its own.',
    accent: 'border-chi-red/20 bg-soft-red',
    statColor: 'text-chi-red',
  },
]

export default function TheProblem() {
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation()
  const { ref: gridRef,  isInView: gridInView  } = useScrollAnimation()
  const { ref: mapRef,   isInView: mapInView   } = useScrollAnimation()

  const [modalOpen, setModalOpen] = useState(false)
  // holcHtml is self-fetching inside the iframe — no React-level fetch needed
  const mapHtml = useState(() => holcHtml())[0]

  return (
    <section id="problem" className="relative py-32 overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-chi-red/6 top-0 right-[-150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Section header */}
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="max-w-3xl mb-20"
        >
          <motion.p variants={fadeUp} className="text-chi-red text-xs tracking-widest uppercase font-semibold mb-4">
            The Problem
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-ink">
            Chicago's wealth gap is
            <span className="text-gradient"> not an accident</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim leading-relaxed">
            The racial wealth gap in Chicago is not a mystery. It is the result of deliberate
            policy choices that targeted Black and Latino/a communities for decades. Redlining,
            urban renewal, and systematic disinvestment did not happen to these neighborhoods.
            They were done to them. Chi Coin is part of the movement to change that.
          </motion.p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
        >
          {problems.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`glass rounded-2xl p-6 border ${p.accent} hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className={`text-4xl font-black mb-2 ${p.statColor}`}>{p.stat}</div>
              <div className="text-sm font-semibold text-ink mb-3 leading-snug">{p.label}</div>
              <div className="text-xs text-ink-muted leading-relaxed">{p.detail}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Map + callout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── HOLC Map (real Leaflet iframe) ──────────────────────── */}
          <motion.div
            ref={mapRef}
            variants={slideLeft}
            initial="hidden"
            animate={mapInView ? 'visible' : 'hidden'}
          >
            <div className="rounded-3xl overflow-hidden border border-chi-border shadow-xl relative h-72 sm:h-96 md:h-[460px]">
              {/* Leaflet map — self-fetching from /holc-chicago-1940.geojson (same origin) */}
              <iframe
                srcDoc={mapHtml}
                title="HOLC Redlining Map · Chicago 1940"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />

              {/* Expand button */}
              <button
                onClick={() => setModalOpen(true)}
                className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 hover:bg-black/90 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
                title="Expand map and browse all 18 maps"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/>
                </svg>
                Expand · Browse all 18 maps
              </button>

              {/* Label */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-black/70 text-white text-[10px] font-semibold px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-chi-red animate-pulse" />
                HOLC Redlining Map · Chicago 1940
              </div>
            </div>

            {/* "View all 18 maps" nudge below the map */}
            <button
                onClick={() => setModalOpen(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-chi-border bg-bg-dark hover:bg-white hover:border-chi-blue text-ink-muted hover:text-chi-blue text-xs font-semibold transition-all duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/>
                </svg>
                Browse all 18 civic data maps →
              </button>
          </motion.div>

          {/* Right side copy */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            animate={mapInView ? 'visible' : 'hidden'}
            className="flex flex-col gap-6"
          >
            <h3 className="text-3xl font-black leading-tight text-ink">
              The 1940 map still shapes
              <span className="text-chi-red"> who builds wealth</span> today
            </h3>
            <p className="text-ink-dim leading-relaxed">
              The federal government graded neighborhoods A through D. Areas marked red were predominantly
              Black and immigrant. That grade locked entire communities out of federally backed mortgages,
              the main tool for generational wealth building in 20th century America.
            </p>
            <p className="text-ink-dim leading-relaxed">
              The same zip codes marked red in 1940 have the highest poverty rates, lowest life expectancy,
              and least banking access today. Structural racism does not disappear on its own.
              Chi Coin is part of building the infrastructure for communities to reclaim what was taken.
            </p>
            {[
              'Redlining locked Black and Latino/a families out of home ownership and generational wealth for decades',
              'The demolition of the Robert Taylor Homes and Cabrini-Green concentrated poverty with no real plan for residents',
              'Loan denial rates for Black and Latino/a small business owners remain significantly higher today',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-chi-red mt-2 shrink-0" />
                <span className="text-sm text-ink-dim">{item}</span>
              </div>
            ))}

            {/* Interactive hint */}
            <div className="glass rounded-xl border border-chi-blue/20 p-4 bg-soft-blue/30">
              <div className="flex items-start gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F5EA8" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                <p className="text-xs text-chi-blue leading-relaxed">
                  <strong>Click any area on the map</strong> to see its HOLC grade and historical context.
                  Use the expand button to browse all 18 civic datasets — poverty, income, life expectancy, gun violence, and more.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-screen map carousel modal */}
      <MapCarouselModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        startAt={0}
      />
    </section>
  )
}
