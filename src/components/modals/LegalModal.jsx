import { useState, useEffect } from 'react'
import PageModal from './PageModal'

const TABS = ['Privacy Policy', 'Terms of Service', 'Risk Disclosure']

function P({ children }) {
  return <p className="text-sm text-ink-dim leading-relaxed mb-4">{children}</p>
}
function H({ children }) {
  return <h4 className="text-sm font-bold text-ink mt-6 mb-2 flex items-center gap-2">
    <div className="w-1 h-4 rounded-full bg-chi-blue shrink-0" />
    {children}
  </h4>
}

function Privacy() {
  return (
    <div>
      <div className="bg-soft-blue/40 rounded-xl border border-chi-blue/20 px-5 py-4 mb-6">
        <p className="text-xs text-chi-blue font-semibold">Last updated: April 2026 · Chicago, IL</p>
      </div>
      <P>Chi Coin ("we," "our," or "us") is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights.</P>
      <H>Information We Collect</H>
      <P>When you use our website or application, we may collect: your name and email address (when donating or signing up), wallet address (when connecting to the app), transaction data from your Chi Coin service usage, and device and usage information for analytics.</P>
      <H>How We Use Your Information</H>
      <P>We use collected information to process contributions and send receipts, operate and improve the Chi Coin platform, communicate project updates and governance proposals, comply with applicable laws, and prevent fraud.</P>
      <H>On-Chain Data</H>
      <P>Blockchain transactions are public by nature. When you interact with the CHI smart contract on Base L2, your wallet address and transaction data are permanently recorded on-chain. We do not control this data and cannot delete it.</P>
      <H>We Do Not Sell Your Data</H>
      <P>We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who help operate the platform under strict confidentiality agreements.</P>
      <H>Your Rights</H>
      <P>You may request access to, correction of, or deletion of your personal data by contacting us at invest@chicoin.xyz. Note that on-chain data cannot be deleted.</P>
      <H>Contact</H>
      <P>Privacy questions: <a href="mailto:invest@chicoin.xyz" className="text-chi-blue hover:underline">invest@chicoin.xyz</a></P>
    </div>
  )
}

function Terms() {
  return (
    <div>
      <div className="bg-soft-blue/40 rounded-xl border border-chi-blue/20 px-5 py-4 mb-6">
        <p className="text-xs text-chi-blue font-semibold">Last updated: April 2026 · Chicago, IL</p>
      </div>
      <P>By accessing the Chi Coin website or application, you agree to these Terms. If you do not agree, do not use the platform.</P>
      <H>Eligibility</H>
      <P>You must be at least 18 years old and legally permitted to participate in cryptocurrency activities in your jurisdiction. Chi Coin is not available where such activities are prohibited by law.</P>
      <H>Nature of Chi Coin</H>
      <P>Chi Coin (CHI) is a community utility token for use within the Chi Coin local economy platform. It is not a security, investment contract, or financial instrument. Participation does not constitute an investment in a common enterprise.</P>
      <H>Contributions</H>
      <P>Contributions made through the platform support Chi Coin's launch and operations. Contributors receive Chi Coins allocated per their selected tier. Contributions are generally non-refundable. Token distribution occurs at launch.</P>
      <H>No Investment Advice</H>
      <P>Nothing on this website constitutes investment, financial, legal, or tax advice. You are solely responsible for your own decisions. Consult qualified professionals before making financial decisions.</P>
      <H>Prohibited Conduct</H>
      <P>You may not use Chi Coin to engage in fraud, money laundering, or market manipulation. You may not attempt to circumvent the smart contract's anti-manipulation rules (1% wallet cap, 0.5% transaction cap).</P>
      <H>Governance</H>
      <P>DAO participation is subject to the community's adopted governance framework. 1-person-1-vote rules apply. Token-weighted voting is explicitly excluded from Chi Coin's governance model.</P>
      <H>Limitation of Liability</H>
      <P>Chi Coin and its team are not liable for losses related to cryptocurrency price volatility, smart contract bugs, AMM pool depth, or market conditions. Participate only with funds you can afford to lose.</P>
      <H>Contact</H>
      <P><a href="mailto:invest@chicoin.xyz" className="text-chi-blue hover:underline">invest@chicoin.xyz</a> · Chi Coin · Chicago, IL</P>
    </div>
  )
}

function Risk() {
  return (
    <div>
      <div className="bg-soft-red/40 rounded-xl border border-chi-red/25 px-5 py-4 mb-6 flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E53950" strokeWidth="2" className="shrink-0 mt-0.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p className="text-sm text-chi-red leading-relaxed">
          <strong>Cryptocurrency investments carry substantial risk of loss.</strong> Read this disclosure carefully. Only contribute what you can afford to lose entirely.
        </p>
      </div>
      <P>This Risk Disclosure informs you of material risks associated with Chi Coin (CHI) and the Chi Coin ecosystem.</P>

      {[
        { title: '1. Price Volatility', body: 'CHI is a cryptocurrency token. Its price is highly volatile and can decline significantly in short periods. The initial launch price of $0.01/CHI is set by the AMM seed ratio and does not guarantee any future value. You may lose all of your contribution.' },
        { title: '2. Liquidity Risk', body: 'The CHI/USDC AMM pool will have limited depth at launch ($50,000 USDC minimum). Large trades create significant price slippage. The treasury\'s mark-to-market value does not represent the amount safely liquidatable without moving the price substantially.' },
        { title: '3. Smart Contract Risk', body: 'Smart contracts may contain bugs or vulnerabilities despite auditing. An exploit could result in loss of funds. The Base L2 network itself carries infrastructure risk. Audit reports will be published before launch, but no audit eliminates all risk.' },
        { title: '4. Regulatory Risk', body: 'The legal status of cryptocurrencies is uncertain and evolving. Regulatory changes could restrict or prohibit Chi Coin\'s operation. We make no representation about the legal status of CHI in any jurisdiction. Consult a legal advisor.' },
        { title: '5. Governance Risk', body: 'DAO governance decisions are made by community vote. Decisions may be made that you disagree with or that negatively affect the token economy. The DAO may vote to change fee structures, treasury deployment strategies, or other parameters.' },
        { title: '6. Market Adoption Risk', body: 'Chi Coin\'s value depends on real economic activity. If merchant adoption is lower than expected, CHI may lose value or become illiquid. There is no guarantee the app achieves its usage targets.' },
        { title: '7. No FDIC/SIPC Insurance', body: 'Cryptocurrency holdings are not insured by the FDIC, SIPC, or any government agency. If CHI loses value or becomes worthless, there is no government protection for your loss.' },
        { title: '8. Not a Security', body: 'Chi Coin is intended as a utility token, not a security or investment contract. However, regulatory bodies may reach different conclusions, which could adversely affect the token.' },
      ].map((r, i) => (
        <div key={i}>
          <H>{r.title}</H>
          <P>{r.body}</P>
        </div>
      ))}

      <H>Contact</H>
      <P>Questions: <a href="mailto:invest@chicoin.xyz" className="text-chi-blue hover:underline">invest@chicoin.xyz</a></P>
    </div>
  )
}

export default function LegalModal({ isOpen, onClose, initialTab = 'Privacy Policy' }) {
  const [active, setActive] = useState(initialTab)

  useEffect(() => {
    if (isOpen) setActive(initialTab)
  }, [isOpen, initialTab])

  return (
    <PageModal
      isOpen={isOpen}
      onClose={onClose}
      badge="Legal"
      title={active}
      subtitle="Chi Coin · Chicago, IL"
    >
      {/* Tab bar */}
      <div className="flex gap-1 p-1.5 bg-bg-dark rounded-2xl border border-chi-border mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
              active === tab
                ? 'bg-white text-ink shadow-sm border border-chi-border'
                : 'text-ink-muted hover:text-ink hover:bg-white/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === 'Privacy Policy'   && <Privacy />}
      {active === 'Terms of Service' && <Terms />}
      {active === 'Risk Disclosure'  && <Risk />}
    </PageModal>
  )
}
