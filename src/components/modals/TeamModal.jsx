import PageModal from './PageModal'

const team = [
  {
    name: 'Founder',
    role: 'Founder & CEO',
    hood: 'Chicago, IL',
    bio: 'Built Chi Coin from the ground up — from the smart contract design to the community strategy. Deeply connected to the South Side and committed to building economic infrastructure that outlasts any single leader.',
    initials: 'F',
    color: 'chi-red',
    filled: true,
  },
  {
    name: 'Coming Soon',
    role: 'Head of Community',
    hood: 'South Side, Chicago',
    bio: 'Leads neighborhood outreach, merchant onboarding, and community governance. The connective tissue between the technology and the people it serves.',
    initials: '?',
    color: 'chi-blue',
    filled: false,
  },
  {
    name: 'Coming Soon',
    role: 'Lead Developer',
    hood: 'Chicago, IL',
    bio: 'Responsible for the mobile app (React Native), smart contract integration, and the services marketplace platform.',
    initials: '?',
    color: 'chi-blue-light',
    filled: false,
  },
  {
    name: 'Coming Soon',
    role: 'Blockchain Engineer',
    hood: 'Remote',
    bio: 'Architects the on-chain infrastructure — the CHI token contract, AMM integration on Base L2, DAO governance system, and treasury mechanics.',
    initials: '?',
    color: 'chi-red',
    filled: false,
  },
]

const openRoles = [
  { role: 'Community Organizer',      desc: 'Neighborhood outreach, merchant recruitment, DAO coordination' },
  { role: 'Growth & Partnerships',    desc: 'Investor relations, grant writing, strategic partnerships' },
  { role: 'Financial Education Lead', desc: 'Curriculum development for in-app financial literacy modules' },
  { role: 'Legal / Compliance',       desc: 'Token offering compliance, smart contract legal review' },
]

export default function TeamModal({ isOpen, onClose }) {
  return (
    <PageModal
      isOpen={isOpen}
      onClose={onClose}
      badge="The Team"
      title="Who's Building Chi Coin"
      subtitle="Rooted in Chicago. Building for Chicago."
    >
      {/* Intro */}
      <div className="bg-bg-dark rounded-2xl border border-chi-border p-6 mb-8">
        <p className="text-sm text-ink-dim leading-relaxed">
          Chi Coin is built by Chicagoans, for Chicagoans. The team combines community organizing
          experience, software engineering depth, and a personal stake in the South and West Sides'
          economic future. Small, focused, and fully aligned with the communities we serve.
        </p>
      </div>

      {/* Team cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {team.map((m, i) => (
          <div key={i} className={`rounded-2xl border p-6 ${m.filled ? 'border-chi-border bg-bg-dark' : 'border-dashed border-chi-border bg-bg-dark/50'}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                m.filled
                  ? `bg-${m.color} text-white shadow-lg`
                  : `bg-chi-border text-ink-faint`
              }`}>
                {m.initials}
              </div>
              <div>
                <p className="font-black text-ink leading-tight">{m.name}</p>
                <p className={`text-xs font-bold mt-0.5 ${m.filled ? `text-${m.color}` : 'text-ink-faint'}`}>{m.role}</p>
                <p className="text-xs text-ink-faint mt-0.5">{m.hood}</p>
              </div>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">{m.bio}</p>
          </div>
        ))}
      </div>

      {/* Advisors */}
      <div className="mb-10">
        <h3 className="text-base font-black text-ink mb-4">Advisors</h3>
        <div className="rounded-2xl border border-dashed border-chi-border bg-bg-dark p-6 text-center">
          <p className="text-sm text-ink-muted mb-4 max-w-md mx-auto">
            We're building our advisory board. If you have experience in community finance,
            blockchain infrastructure, civic tech, or impact investing — we want to talk.
          </p>
          <a
            href="mailto:invest@chicoin.xyz?subject=Chi%20Coin%20Advisory%20Interest"
            className="inline-flex items-center gap-2 border border-chi-blue text-chi-blue px-5 py-2 rounded-full text-sm font-semibold hover:bg-soft-blue transition-colors"
          >
            Express interest →
          </a>
        </div>
      </div>

      {/* Open roles */}
      <div>
        <h3 className="text-base font-black text-ink mb-4">Open Roles</h3>
        <div className="flex flex-col gap-2">
          {openRoles.map((r, i) => (
            <div key={i} className="flex items-center justify-between bg-bg-dark rounded-xl border border-chi-border px-5 py-4 gap-4">
              <div>
                <p className="text-sm font-bold text-ink mb-0.5">{r.role}</p>
                <p className="text-xs text-ink-muted">{r.desc}</p>
              </div>
              <a
                href={`mailto:invest@chicoin.xyz?subject=Chi%20Coin%20%E2%80%94%20${encodeURIComponent(r.role)}`}
                className="text-xs font-semibold text-chi-blue hover:text-chi-blue-light transition-colors whitespace-nowrap shrink-0"
              >
                Apply →
              </a>
            </div>
          ))}
        </div>
      </div>
    </PageModal>
  )
}
