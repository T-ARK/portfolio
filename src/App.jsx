import { useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ClickSpark from './components/ClickSpark';
import LineSidebar from './components/LineSidebar';
import { useScrollSpy } from './hooks/useScrollSpy';
import { useRevealObserver } from './hooks/useRevealObserver';
import { useClickSoundListener } from './hooks/useClickSoundListener';

const SECTIONS = [
  { id: 'hero', label: 'Overview' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function App() {
  const sectionIds = useMemo(() => SECTIONS.map((s) => s.id), []);
  const sidebarLabels = useMemo(() => SECTIONS.map((s) => s.label), []);

  const { activeSection, isScrolled, showBackTop, lockActive } = useScrollSpy(sectionIds);

  useRevealObserver();
  useClickSoundListener();

  const activeIndex = sectionIds.indexOf(activeSection);
  const currentActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  const handleSidebarClick = (index) => {
    const sectionId = sectionIds[index];
    lockActive(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId) => {
    lockActive(sectionId);
  };

  return (
    <div className="portfolio-app">
      <a href="#main-content" className="skip-to-content">
        // SKIP_TO_CONTENT
      </a>

      <Navbar
        activeSection={activeSection}
        isScrolled={isScrolled}
        onNavClick={handleNavClick}
      />

      {/* Extended technical ruler navigation on the RIGHT */}
      <aside className="line-sidebar-container" aria-label="Quick section navigation">
        <LineSidebar
          items={sidebarLabels}
          accentColor="#005eff"
          textColor="#777777"
          markerColor="#2a2a2a"
          showIndex
          showMarker
          proximityRadius={120}
          maxShift={20}
          falloff="smooth"
          markerLength={46}
          markerGap={8}
          itemGap={24}
          fontSize={0.82}
          smoothing={100}
          side="right"
          defaultActive={currentActiveIndex}
          onItemClick={handleSidebarClick}
        />
      </aside>

      <main id="main-content">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <BackToTop visible={showBackTop} />
      <ClickSpark />
    </div>
  );
}
