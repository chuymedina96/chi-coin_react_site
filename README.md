# Chi Coin — Investor Website

> **Bridging Chicago Neighborhoods** · A Chicago-first civic economy for neighborhood trade, local business, and stronger block-to-block connection.

This is the investor-facing website for **Chi Coin (CHI)** — a community currency built on Base L2 (Ethereum Layer 2) designed to rebuild economic circulation in Chicago's historically redlined neighborhoods. The site is built as a single-page React application with interactive maps, animated data visualizations, a live donation system, and a full investor pitch deck.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Sources](#data-sources)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Key Features](#key-features)
- [Stripe Integration](#stripe-integration)
- [Deployment](#deployment)

---

## Overview

The website serves three audiences:

| Audience | What they find |
|---|---|
| **Investors / Philanthropists** | Pitch deck, whitepaper, tokenomics, treasury vision, donation tiers |
| **Community members** | App feature previews, neighborhood maps, civic data, governance info |
| **Press / Researchers** | Press kit, boilerplate, brand assets, data citations |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev) + [Vite 5](https://vitejs.dev) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com) with custom design tokens |
| **Animation** | [Framer Motion 11](https://www.framer.com/motion/) |
| **Maps** | [Leaflet 1.9](https://leafletjs.com) via inline `<iframe srcDoc>` (no react-leaflet dependency) |
| **Map tiles** | [CartoDB Positron](https://carto.com/basemaps/) (light) and [CartoDB Dark Matter](https://carto.com/basemaps/) (dark, for civic data maps) |
| **Payments** | [Stripe JS](https://stripe.com/docs/js) + [@stripe/react-stripe-js](https://github.com/stripe/react-stripe-js) |
| **Build tool** | Vite with `@vitejs/plugin-react` |
| **PostCSS** | Autoprefixer + Tailwind |
| **Package manager** | npm |
| **Node requirement** | Node 18+ (Vite 5 requires Node 18+) |

---

## Project Structure

```
web/
├── public/
│   ├── chicoin-logo.png          # Official Chi Coin logo (1024×1024)
│   ├── holc-chicago-1940.geojson # 1940 HOLC redlining GeoJSON (local copy, 703 polygons)
│   ├── IMG_4090.PNG              # Real app screenshot — Community DAO screen
│   └── landingChiCoin.PNG        # Real app screenshot — Landing/login screen
│
├── src/
│   ├── App.jsx                   # Root component, modal state management
│   ├── main.jsx                  # React entry point
│   │
│   ├── components/
│   │   ├── Nav.jsx               # Fixed navigation with "Bridge Chicago" link + hover animations
│   │   ├── Hero.jsx              # Landing section with real app screenshots
│   │   ├── StatsBar.jsx          # Animated stat counters (100M CHI, 77 neighborhoods, etc.)
│   │   ├── BridgingNeighborhoods.jsx  # Interactive Leaflet map + live transaction animation
│   │   ├── TheProblem.jsx        # Redlining stats + embedded HOLC map + expand modal
│   │   ├── CivicMaps.jsx         # 18-map carousel (Leaflet, zoomable, category filter)
│   │   ├── Solution.jsx          # 4-pillar solution overview
│   │   ├── HowItWorks.jsx        # App feature tabs with phone mockups
│   │   ├── Tokenomics.jsx        # CHI allocation donut chart + protection rules
│   │   ├── Roadmap.jsx           # 4-phase roadmap cards
│   │   ├── Community.jsx         # Community cards + voices section
│   │   ├── TreasuryVision.jsx    # $50K → $900K treasury math + price projection table
│   │   ├── Invest.jsx            # Fundraising progress bar + 4 donation tiers
│   │   ├── Footer.jsx            # Footer with wired modal links
│   │   ├── DonateModal.jsx       # Stripe Elements donation modal (demo mode without keys)
│   │   ├── MapCarouselModal.jsx  # Full-screen 18-map carousel modal
│   │   │
│   │   └── modals/
│   │       ├── PageModal.jsx     # Reusable modal shell (scroll progress bar, flag stripe)
│   │       ├── PitchDeckModal.jsx     # Full investor pitch deck
│   │       ├── WhitepaperModal.jsx    # Technical + economic whitepaper
│   │       ├── AboutModal.jsx         # Mission and story
│   │       ├── TeamModal.jsx          # Team + open roles
│   │       ├── PressKitModal.jsx      # Logo, brand colors, boilerplate
│   │       └── LegalModal.jsx         # Privacy Policy / Terms / Risk Disclosure (tabbed)
│   │
│   ├── data/
│   │   └── chicagoMapData.js     # All 18 civic datasets (see Data Sources below)
│   │
│   ├── lib/
│   │   ├── chicagoMaps.js        # Leaflet HTML builders for all 18 maps + SLIDES metadata
│   │   └── stripe.js             # Stripe setup + createPaymentIntent (demo/live toggle)
│   │
│   ├── hooks/
│   │   └── useScrollAnimation.js # Framer Motion scroll-triggered animation helpers
│   │
│   └── index.css                 # Tailwind base + custom utilities (.glass, .btn-*, .orb)
│
├── .env.example                  # Environment variable template
├── tailwind.config.js            # Design tokens (chi-blue, chi-red, ink-*, soft-*, etc.)
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

---

## Data Sources

### HOLC Redlining Map (1940)
- **File:** `public/holc-chicago-1940.geojson` (local static file, 703 neighborhood polygons)
- **Original source:** [Mapping Inequality — University of Richmond](https://dsl.richmond.edu/panorama/redlining/)
- **License:** Public domain
- **How it's used:** Embedded in `TheProblem.jsx` as an interactive Leaflet choropleth. The local file avoids CORS issues that block browser fetches from `dsl.richmond.edu`.

### Chicago Community Area GeoJSON (77 areas)
- **URL:** `https://data.cityofchicago.org/resource/igwz-8jzy.geojson?$limit=100`
- **Source:** [City of Chicago Data Portal](https://data.cityofchicago.org/) (Socrata, open data)
- **License:** Public domain
- **How it's used:** Choropleth base for 6 of the 18 civic maps (poverty, income, home ownership, transit, parks, shootings)

### Civic Datasets (`src/data/chicagoMapData.js`)

All 18 maps and their data sources:

| Map | Dataset | Source |
|---|---|---|
| HOLC Redlining | 1940 HOLC grades | Mapping Inequality / U. of Richmond |
| Demolished CHA Housing | Unit counts, demolition years | CHA; UIC Natl. Ctr. for Poverty Research |
| Poverty Rate | % below poverty line by community area | U.S. Census ACS 2020 5-Year |
| Median Household Income | Median income by community area | U.S. Census ACS 2020 5-Year |
| Home Ownership Rate | % owner-occupied by community area | U.S. Census ACS 2020 5-Year |
| Eviction Filing Rate | Per 100 renter households by ZIP | [Princeton Eviction Lab](https://evictionlab.org/) 2018 |
| TIF District Revenue | Annual increment revenue, $M | City of Chicago Annual TIF Reports |
| Banks vs Predatory Lenders | Branch locations | FDIC BankFind; IDFPR Registry |
| Life Expectancy | Years by ZIP code | CDPH Community Health Atlas 2018 |
| Children with Elevated Blood Lead | % under 6 by ZIP | CDPH CLPPP 2019 |
| Asthma ER Visit Rate | Per 10,000, age-adjusted by ZIP | CDPH Community Health Atlas 2019 |
| Industrial Pollution Sites | EPA EJSCREEN; Illinois EPA | EPA EJSCREEN; IL EPA |
| CPS School Closures 2013 | 47 schools closed May 2013 | Chicago Board of Education |
| CTA Transit Access Score | Weighted stops + frequency | CTA GTFS; CMAP 2023 |
| Food Desert Map | Low-income, low-access ZIPs | USDA Food Access Research Atlas 2019 |
| Park Access | Acres per 1,000 residents | Chicago Park District 2023 |
| Gun Violence Rate | Per 10,000 residents by community area | CPD CLEAR database 2023 |
| Chi Coin Economy Layer | Conceptual overlay | Chi Coin |

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# ── Stripe ─────────────────────────────────────────────────────────────────
# Get your keys at https://dashboard.stripe.com/apikeys
# Use pk_test_... for development, pk_live_... for production
VITE_STRIPE_PK=pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY

# ── Backend (for creating Stripe PaymentIntents) ───────────────────────────
# Your backend must expose POST /api/create-payment-intent
# See src/lib/stripe.js for the expected request/response shape
VITE_API_URL=http://localhost:3001
```

> **Note:** The site runs in **demo mode** if these variables are not set — the donation form shows a full UI but does not process real charges.

---

## Getting Started

### Prerequisites

- **Node 18+** — Vite 5 requires Node 18 or newer
- **npm 8+**

### Install

```bash
# From the repo root
cd web
npm install
```

### Run development server

```bash
npm run dev
# → http://localhost:5173
```

### Build for production

```bash
npm run build
# Output: web/dist/
```

### Preview production build locally

```bash
npm run preview
# → http://localhost:4173
```

---

## Available Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR at `localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the `dist/` build locally |

---

## Key Features

### Interactive Chicago Map (`BridgingNeighborhoods.jsx`)
- Real Leaflet map with CartoDB Positron tiles (zoomable, pannable)
- Chicago community area polygon outlines colored by neighborhood group (Latino = red, Black = blue)
- Animated transaction preview: 2–3 simultaneous bookings fire every 6.5 seconds
- Each transaction progressively draws a route line, then sends `$` and `₡` particles toward the provider, then branches fees to the DAO Treasury (Museum Campus) and Liquidity Reserve (Navy Pier)
- Buyer/provider names appear in a scrollable live feed on the right

### 18-Map Civic Data Carousel (`CivicMaps.jsx` + `src/lib/chicagoMaps.js`)
- Each map is a self-contained Leaflet HTML document injected via `<iframe srcDoc>`
- Community area choropleth maps fetch from the Chicago Data Portal live
- ZIP-code maps render from bundled data (no network dependency)
- Category filter (History / Economy / Health / Community / Chi Coin)
- Click any map to expand into a full-screen `MapCarouselModal`

### HOLC Redlining Map (`TheProblem.jsx`)
- Embedded inline in the "The Problem" section (not just an icon placeholder)
- Click neighborhoods for grade + historical context popup
- "Expand · Browse all 18 maps" button opens the full carousel modal

### Donation System (`DonateModal.jsx` + `src/lib/stripe.js`)
- 4 tiers: Community ($100), Neighbor ($1,000), Block Club ($10,000), Institutional (custom)
- Stripe Elements `CardElement` wired and ready — add `VITE_STRIPE_PK` + backend to go live
- Demo mode: full UI, simulated processing, success screen — no charge without keys

### Investor Modals (all in `src/components/modals/`)
- Every footer link opens a real modal, not a dead `#` link
- **Pitch Deck** — problem, solution, 6-layer architecture, market opportunity, tokenomics, $50K ask, treasury projections, roadmap, investment tiers
- **Whitepaper** — technical spec, AMM mechanics, fee architecture, governance, replication framework
- **Press Kit** — logo download, brand colors + hex codes, key facts, approved boilerplate
- **Legal** — Privacy Policy, Terms of Service, Risk Disclosure (tabbed within one modal)

---

## Stripe Integration

The donation modal runs in **demo mode** by default (no keys needed to develop locally).

To go live:

1. **Add `VITE_STRIPE_PK`** to `.env.local` — your Stripe publishable key (safe to expose in frontend)

2. **Create a backend endpoint** `POST /api/create-payment-intent`:

   ```js
   // Expected request body:
   { amountCents: 10000, tier: 'community', email: '...', name: '...' }

   // Expected response:
   { clientSecret: 'pi_..._secret_...' }
   ```

   The backend must use your **secret key** (never expose in frontend) to call `stripe.paymentIntents.create(...)`. Works with any backend: Express, Fastify, Vercel Edge Functions, Railway, Render, etc.

3. **Add `VITE_API_URL`** to `.env.local` pointing at your backend.

4. The `createPaymentIntent` function in `src/lib/stripe.js` will automatically switch from demo mode to live mode when `VITE_API_URL` is set.

---

## Deployment

The site is a standard Vite SPA — deploy `dist/` to any static host.

### Recommended platforms

| Platform | Config needed |
|---|---|
| **Vercel** | Zero config — auto-detects Vite, set env vars in dashboard |
| **Netlify** | Zero config — set env vars in dashboard, add `_redirects` for SPA routing |
| **Railway** | Add a static site service pointing to `dist/` |
| **GitHub Pages** | Set `base` in `vite.config.js` if deploying to a subpath |

### SPA routing note

If deploying to a host that doesn't natively handle client-side routing, add a redirect rule:

```
# Netlify — public/_redirects
/*  /index.html  200

# Vercel — vercel.json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Design System

Custom Tailwind tokens (defined in `tailwind.config.js`):

| Token | Value | Usage |
|---|---|---|
| `chi-blue` | `#0F5EA8` | Primary blue — buttons, links |
| `chi-blue-light` | `#41B6E6` | Sky blue — secondary accents |
| `chi-red` | `#E53950` | Primary red — CTAs, highlights |
| `bg-dark` | `#EEF2F6` | Page background (light gray-blue) |
| `bg-card` | `#FFFFFF` | Card backgrounds |
| `soft-blue` | `#EAF6FC` | Blue tinted card backgrounds |
| `soft-red` | `#FCECEF` | Red tinted card backgrounds |
| `ink` | `#111827` | Primary text |
| `ink-dim` | `#4B5563` | Secondary text |
| `ink-muted` | `#66768A` | Caption text |
| `chi-border` | `#D8E0E8` | Default border color |

All colors match the Chi Coin React Native app's `src/theme.js` exactly.

---

## Related Repositories

| Repo | Description |
|---|---|
| `EastsideCoin/eastside_coin` | Django backend API + Chi Coin strategy document |
| `EastsideCoin/eastside_coin/mobile` | React Native (Expo) iOS/Android app |

The `holc-chicago-1940.geojson` in `public/` was copied from `eastside_coin/app/static/holc/chicago_1940.geojson` in the backend repo — the backend serves this file via `GET /holc/chicago/` to avoid CORS issues in the mobile app.

---

## License

Chi Coin · Chicago, IL · 2025  
Contact: [invest@chicoin.xyz](mailto:invest@chicoin.xyz)
