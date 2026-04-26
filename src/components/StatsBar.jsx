import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function Counter({ to, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const { ref, isInView } = useScrollAnimation()
  const started = useRef(false)

  useEffect(() => {
    if (!isInView) { started.current = false; return }
    if (started.current) return
    started.current = true
    const steps = 60
    const increment = to / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 2000 / steps)
    return () => clearInterval(timer)
  }, [isInView, to])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

const stats = [
  { value: 100,  suffix: 'M',  label: 'Chi Coins · total supply'  },
  { value: 60,   suffix: '%',  label: 'Goes to community treasury' },
  { value: 77,   suffix: '',   label: 'Chicago neighborhoods'      },
  { value: 50,   suffix: 'K+', label: 'Launch funding goal (USDC)' },
]

export default function StatsBar() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 py-6 border-y border-chi-border bg-white/60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-chi-border">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center px-4 py-4">
              <span className={`text-3xl sm:text-4xl font-black tabular-nums ${i % 2 === 0 ? 'text-chi-red' : 'text-chi-blue'}`}>
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="mt-1 text-xs text-ink-muted tracking-wide font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
