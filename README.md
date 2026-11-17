# Arshid Chandran P K (ARK) — React Portfolio

A modern, cyber-terminal-themed portfolio built with **React** and **Vite**, converted from the original static HTML/CSS/JS codebase.

---

## ⚡ Highlights & Features

- **Interactive Lanyard Physics & 3D ID Card**:
  - Full Verlet-integration physics rope simulation rendered on `<canvas>`.
  - Embroidered "ARK" strap with metal clasp and spring constraints.
  - Interactive 3D flip card (front ID with barcode, rear `README.md` terminal editor) triggered via hover, touch, or keyboard navigation.
- **Cyber-Terminal Aesthetic**:
  - Live animated dashboard cards with hardware metric meters (CPU, Memory, Compiling).
  - Terminal auto-typing prompt (`ping ark --status --alive`) triggered upon viewport entry.
  - Glitch text effect on header name (`P K_`).
  - Screen-space Click Spark particle effects matching the accent blue palette (`#005eff`).
- **Interactive Contact Workflow**:
  - Direct integration with Google Apps Script mailer backend (`no-cors` JSON transmission).
  - State feedback animations (`TRANSMITTING...`, `MESSAGE_SENT`, `SEND_FAILED`).
- **React Bits UI Components**:
  - `<LineSidebar />`: Right-pinned technical drafting ruler navigation with proximity scaling and interactive tick markers.
  - `<GlareHover />`: High-performance rAF sheen sweep glare effect on project showcase cards.
- **Audio Feedback**:
  - Interactive tactile click sound effect (`dew.wav`) on interactive buttons powered by Web Audio API.
- **Modern React Component Architecture**:
  - Clean separation of concerns with dedicated components (`Navbar`, `Hero`, `About`, `LanyardCard`, `Skills`, `Projects`, `Experience`, `Contact`, `Footer`, `BackToTop`, `ClickSpark`, `LineSidebar`, `GlareHover`).
  - Centralized portfolio configuration and content in [`src/data/portfolioData.js`](file:///home/ark123/Downloads/portfolio-main/src/data/portfolioData.js).
  - Custom hooks: `useScrollSpy`, `useRevealObserver`, `useClickSoundListener`.
- **Production-Ready & SEO Optimized**:
  - 8 real projects showcased with multi-contributor avatar stacks (NASA Space Apps AstroCare & SQL Database Migrator).
  - Next-gen WebP image delivery saving 89.2% payload with responsive `<picture>` fallback.
  - Google Site Verification, Open Graph, Twitter Cards, SVG Favicon, and Schema.org JSON-LD structured data.
  - WCAG-compliant skip-to-content accessibility link and reduced-motion support.
  - Blazing fast builds powered by Vite.

---

## 📁 Project Structure

```text
portfolio-main/
├── public/                 # Static assets (images, PDF, robots, sitemap)
│   ├── assets/images/      # Profile & project images
│   ├── resume.pdf          # Downloadable resume
│   ├── robots.txt          # Search engine crawlers
│   └── sitemap.xml         # SEO sitemap
├── src/
│   ├── components/         # React modular components
│   │   ├── About.jsx       # About section with bio
│   │   ├── BackToTop.jsx   # Floating back-to-top button
│   │   ├── ClickSpark.jsx  # Interactive canvas spark particles
│   │   ├── Contact.jsx     # Terminal contact form & typing prompt
│   │   ├── Experience.jsx  # Internships timeline
│   │   ├── Footer.jsx      # Footer & external links
│   │   ├── Hero.jsx        # Hero with glitch & metrics dashboard
│   │   ├── LanyardCard.jsx # Verlet physics lanyard & 3D ID card
│   │   ├── Navbar.jsx      # Responsive navigation with scroll spy
│   │   ├── Projects.jsx    # Selected works showcase
│   │   └── Skills.jsx      # Categorized skill cards
│   ├── data/
│   │   └── portfolioData.js # All portfolio content & links
│   ├── hooks/
│   │   ├── useRevealObserver.js # Scroll-reveal animation hook
│   │   └── useScrollSpy.js      # Active section & scroll position hook
│   ├── App.jsx             # Main application orchestrator
│   ├── index.css           # Terminal styles, variables & animations
│   └── main.jsx            # React root mount
├── index.html              # Entry HTML with meta & fonts
├── package.json            # Scripts & dependencies
├── vite.config.js          # Vite configuration
└── README.md
```

---

## 🚀 Getting Started

### 1. Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
Compile and bundle the production assets into `dist/`:
```bash
npm run build
```

### 3. Preview Production Build
Preview the generated production build locally:
```bash
npm run preview
```

---

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **HTML5 Canvas / Verlet Physics**
- **Custom Cyber CSS & Keyframe Animations**
- **FontAwesome 6 & JetBrains Mono Font**
