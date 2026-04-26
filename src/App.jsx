import { useState } from 'react'
import Nav                    from './components/Nav'
import Hero                   from './components/Hero'
import StatsBar                from './components/StatsBar'
import TheProblem              from './components/TheProblem'
import CivicMaps               from './components/CivicMaps'
import Solution                from './components/Solution'
import HowItWorks              from './components/HowItWorks'
import BridgingNeighborhoods   from './components/BridgingNeighborhoods'
import Tokenomics              from './components/Tokenomics'
import Roadmap                 from './components/Roadmap'
import Community               from './components/Community'
import TreasuryVision          from './components/TreasuryVision'
import Invest                  from './components/Invest'
import Footer                  from './components/Footer'

import DonateModal     from './components/DonateModal'
import PitchDeckModal  from './components/modals/PitchDeckModal'
import WhitepaperModal from './components/modals/WhitepaperModal'
import AboutModal      from './components/modals/AboutModal'
import TeamModal       from './components/modals/TeamModal'
import PressKitModal   from './components/modals/PressKitModal'
import LegalModal      from './components/modals/LegalModal'

export default function App() {
  // Donate modal
  const [donateOpen, setDonateOpen] = useState(false)
  const [donateTier, setDonateTier] = useState('community')
  function openDonate(tier = 'community') { setDonateTier(tier); setDonateOpen(true) }

  // Page modals — one state drives all of them
  const [modal,      setModal]      = useState(null)  // null | string key
  const [legalTab,   setLegalTab]   = useState('Privacy Policy')

  function openModal(key) { setModal(key) }
  function closeModal()   { setModal(null) }

  function openLegal(tab) { setLegalTab(tab); setModal('legal') }

  return (
    <div className="relative bg-bg-dark overflow-x-hidden">
      <Nav onDonate={() => openDonate()} />
      <main>
        <Hero onDonate={() => openDonate()} />
        <StatsBar />
        <BridgingNeighborhoods />
        <TheProblem />
        <CivicMaps />
        <Solution />
        <HowItWorks />
        <Tokenomics />
        <Roadmap />
        <Community />
        <TreasuryVision />
        <Invest onDonate={openDonate} />
      </main>
      <Footer
        onDonate={() => openDonate()}
        onModal={openModal}
        onLegal={openLegal}
      />

      {/* Donate */}
      <DonateModal
        isOpen={donateOpen}
        onClose={() => setDonateOpen(false)}
        initialTier={donateTier}
      />

      {/* Page modals */}
      <PitchDeckModal  isOpen={modal === 'pitch-deck'}  onClose={closeModal} />
      <WhitepaperModal isOpen={modal === 'whitepaper'}  onClose={closeModal} />
      <AboutModal      isOpen={modal === 'about'}       onClose={closeModal} />
      <TeamModal       isOpen={modal === 'team'}        onClose={closeModal} />
      <PressKitModal   isOpen={modal === 'press-kit'}   onClose={closeModal} />
      <LegalModal
        isOpen={modal === 'legal'}
        onClose={closeModal}
        initialTab={legalTab}
      />
    </div>
  )
}
