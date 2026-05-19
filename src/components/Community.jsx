import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger, scaleIn } from '../hooks/useScrollAnimation'

const communities = [
  {
    name: 'South Side Residents',
    icon: '🏘️',
    desc: 'From Englewood to South Shore, the historically disinvested neighborhoods that built this city deserve to own a piece of its future.',
  },
  {
    name: 'Black-Owned Businesses',
    icon: '✊',
    desc: 'Black entrepreneurs have always built in spite of the system, not because of it. Chi Coin gives them a network that actually invests back.',
  },
  {
    name: 'Latino/a Families',
    icon: '🌮',
    desc: 'Little Village, Pilsen, Back of the Yards. Latino/a working-class labor built this city. It is past time that wealth stayed in these communities.',
  },
  {
    name: 'Small Business Owners',
    icon: '🛍️',
    desc: 'No more losing a cut to credit card processors and big banks. Accept Chi Coin, keep more of what you earn, and reinvest in your block.',
  },
  {
    name: 'Community Organizers',
    icon: '📢',
    desc: 'Fund your work, mobilize your neighbors, and vote on where community money goes. Power built by the people who show up.',
  },
  {
    name: 'Young Chicagoans',
    icon: '🎓',
    desc: 'Earn Chi Coin through financial literacy. Graduate with something real in your pocket and a community economy to plug into.',
  },
]

export default function Community() {
  const { ref: titleRef, isInView: titleInView } = useScrollAnimation()
  const { ref: gridRef,  isInView: gridInView  } = useScrollAnimation()

  return (
    <section id="community" className="relative py-32 overflow-hidden">
      <div className="orb w-[600px] h-[600px] bg-chi-blue/8 bottom-0 right-[-200px] pointer-events-none" />
      <div className="orb w-[300px] h-[300px] bg-soft-blue top-10 left-[-100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          ref={titleRef}
          variants={stagger}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <motion.p variants={fadeUp} className="text-chi-blue-light text-xs tracking-widest uppercase font-semibold mb-4">
            Community
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-ink">
            Built for the people
            <span className="text-gradient"> who built Chicago</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-ink-dim">
            Chi Coin is for BIPOC neighborhoods, working-class families, and small business
            owners across Chicago who have been deliberately disinvested for generations.
            That changes now.
          </motion.p>
        </motion.div>

        {/* Community cards */}
        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {communities.map((c, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              className="glass rounded-2xl p-7 border border-chi-border hover:border-chi-blue/35 transition-all duration-300 group"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-base font-bold text-ink mb-2">{c.name}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
