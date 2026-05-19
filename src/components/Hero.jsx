import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fadeUp, stagger } from '../hooks/useScrollAnimation'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden noise pt-16">
      {/* Orbs */}
      <motion.div style={{ y }} className="absolute inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-chi-red/10 top-[-200px] left-[-200px]" />
        <div className="orb w-[500px] h-[500px] bg-chi-blue/12 bottom-[-100px] right-[-150px]" />
        <div className="orb w-[200px] h-[200px] bg-soft-blue top-1/3 left-1/3" />
      </motion.div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-6 items-center min-h-[calc(100vh-64px)]">

          {/* Left: text */}
          <motion.div
            style={{ opacity }}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 py-16 lg:py-0"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-chi-red/40 bg-soft-red text-chi-red text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-chi-red animate-pulse" />
                Chicago · Community Economy · Base L2
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.92] tracking-tight">
              <span className="text-ink block">The Community</span>
              <span className="text-ink block">Currency of</span>
              <span className="text-gradient block mt-1">Chicago.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p variants={fadeUp} className="text-lg text-ink-dim leading-relaxed max-w-lg font-light">
              Chi Coin is a community currency built for the Black, Latino/a,
              and working-class neighborhoods of Chicago's South and West Sides.
              Neighbors trading with neighbors. Money staying home.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start gap-4">
              <a href="#invest" className="btn-primary text-sm px-8 py-4">
                Support the Launch
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#how-it-works" className="btn-outline text-sm px-8 py-4">
                See the App
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['#E53950','#0F5EA8','#41B6E6','#A7283A'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-bg-dark" style={{ background: c }} />
                ))}
              </div>
              <p className="text-xs text-ink-faint">
                Built for Chicago's <span className="text-ink-dim">South &amp; West Sides</span>
              </p>
            </motion.div>
          </motion.div>

          {/* Right: real app screenshots (visible from md up) */}
          <motion.div style={{ opacity }} className="hidden md:flex items-center justify-center relative py-8 lg:py-16">

            {/* Background phone — DAO / Community proposals screen */}
            <motion.div
              initial={{ opacity: 0, y: 80, rotate: -6 }}
              animate={{ opacity: 0.65, y: 0, rotate: -6 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-2 top-8 scale-90"
            >
              <div className="w-48 rounded-[2.5rem] border-2 border-chi-border shadow-2xl shadow-black/12 overflow-hidden bg-white">
                <img
                  src="/IMG_4090.PNG"
                  alt="Chi Coin Community DAO"
                  className="w-full block"
                  style={{ display: 'block' }}
                />
              </div>
              {/* Label badge */}
              <div className="absolute -bottom-2 -right-2 bg-chi-red text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md">
                Community DAO
              </div>
            </motion.div>

            {/* Primary phone — landing / login screen */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ duration: 1, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10"
            >
              <div className="w-56 sm:w-64 rounded-[2.5rem] border-2 border-chi-border shadow-2xl shadow-black/15 overflow-hidden bg-white">
                <img
                  src="/landingChiCoin.PNG"
                  alt="Chi Coin App — Landing Screen"
                  className="w-full block"
                />
              </div>
              {/* Label badge */}
              <div className="absolute -bottom-2 -left-2 bg-chi-blue text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md">
                iOS App
              </div>
              {/* Glow */}
              <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-3/4 h-10 bg-chi-blue/15 blur-2xl rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-ink-faint text-[10px] tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-ink-faint/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
