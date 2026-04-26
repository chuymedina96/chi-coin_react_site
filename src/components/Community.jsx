import { motion } from 'framer-motion'
import { useScrollAnimation, fadeUp, stagger, scaleIn } from '../hooks/useScrollAnimation'

const communities = [
  { name: 'South Side Residents',    icon: '🏘️', desc: 'From Englewood to South Shore — the neighborhoods that built Chicago deserve to own it.' },
  { name: 'Black-Owned Businesses',  icon: '✊', desc: 'Merchant network gives Black entrepreneurs access to a community that actively chooses local.' },
  { name: 'Mexican & Latino Families', icon: '🌮', desc: 'Little Village, Pilsen, Back of the Yards — immigrant labor built this city; Chi Coin gives it back.' },
  { name: 'Small Business Owners',   icon: '🛍️', desc: 'Escape credit card fees and bank dependency. Accept Chi Coin, keep more of what you earn.' },
  { name: 'Community Organizers',    icon: '📢', desc: 'Fund your campaigns, mobilize neighbors, and vote on grants through the community DAO.' },
  { name: 'Young Chicagoans',        icon: '🎓', desc: 'Earn Chi Coin through education. Graduate with a community savings account, not just debt.' },
]

const voices = [
  {
    quote: "My abuela used to say the bank always found a reason to say no. Chi Coin gives our community a yes.",
    name: "Maria V.",
    hood: "Little Village",
  },
  {
    quote: "I run a barbershop on 79th. With Chi Coin, my customers keep coming back — and so does the money.",
    name: "DeShawn T.",
    hood: "Chatham",
  },
  {
    quote: "We lost Robert Taylor, we lost Cabrini. We can't lose the economic potential of our people too.",
    name: "James W.",
    hood: "Bronzeville",
  },
]

export default function Community() {
  const { ref: titleRef,  isInView: titleInView  } = useScrollAnimation()
  const { ref: gridRef,   isInView: gridInView   } = useScrollAnimation()
  const { ref: voiceRef,  isInView: voiceInView  } = useScrollAnimation()

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
            Chi Coin doesn't serve a single community — it serves every community that has been
            deliberately excluded from Chicago's prosperity.
          </motion.p>
        </motion.div>

        {/* Community cards */}
        <motion.div
          ref={gridRef}
          variants={stagger}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-24"
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

        {/* Voices section */}
        <motion.div
          ref={voiceRef}
          variants={stagger}
          initial="hidden"
          animate={voiceInView ? 'visible' : 'hidden'}
        >
          <motion.h3 variants={fadeUp} className="text-2xl font-black text-center mb-10 text-ink">
            Voices from the <span className="text-chi-blue-light">community</span>
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-6">
            {voices.map((v, i) => (
              <motion.div key={i} variants={fadeUp} className="glass rounded-2xl p-7 border border-chi-border">
                <div className="text-chi-blue-light text-3xl font-serif mb-4">&ldquo;</div>
                <p className="text-sm text-ink-dim leading-relaxed italic mb-6">{v.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-chi-blue to-chi-blue-light flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {v.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ink">{v.name}</div>
                    <div className="text-xs text-ink-faint">{v.hood}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
