import { useState, useEffect, useRef } from 'react';
import { navLinks, personalInfo } from '../data/portfolioData';
import { toggleSound, isSoundEnabled, playClickSound } from '../utils/sound';

export default function Navbar({ activeSection, isScrolled, onNavClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const navRef = useRef(null);

  // Toggle body scroll lock when mobile nav opens
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close mobile nav on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleToggleSound = (e) => {
    e.stopPropagation();
    const next = toggleSound();
    setSoundOn(next);
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    playClickSound();
    setMenuOpen(false);
    const targetId = href.replace('#', '');
    onNavClick?.(targetId);
    const target = document.querySelector(href);
    if (target) {
      const offset = navRef.current ? navRef.current.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="navbar"
      ref={navRef}
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="nav-brand">
        ARK<span className="accent">.</span>
      </div>

      <div className="nav-mobile-controls">
        <button
          className={`sound-toggle-btn ${soundOn ? 'active' : ''}`}
          onClick={handleToggleSound}
          aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
          title={soundOn ? 'Sound: ON' : 'Sound: OFF'}
        >
          <i className={soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'}></i>
        </button>

        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          id="navToggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => {
            playClickSound();
            setMenuOpen((prev) => !prev);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks" role="list">
        {navLinks.map((link) => {
          const isActive = activeSection === link.href.replace('#', '');
          return (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          );
        })}

        <li className="nav-mobile-only">
          <a
            href={personalInfo.resumeUrl}
            className="btn-outline mobile-resume-btn"
            download
            onClick={() => {
              playClickSound();
              setMenuOpen(false);
            }}
          >
            resume_pdf <i className="fa-solid fa-download"></i>
          </a>
        </li>
      </ul>

      <div className="nav-desktop-actions">
        <a
          href={personalInfo.resumeUrl}
          className="btn-outline"
          download
          onClick={() => playClickSound()}
        >
          resume_pdf
        </a>

        <button
          className={`sound-toggle-btn ${soundOn ? 'active' : ''}`}
          onClick={handleToggleSound}
          aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
          title={soundOn ? 'Sound: ON' : 'Sound: OFF'}
        >
          <i className={soundOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'}></i>
        </button>
      </div>
    </nav>
  );
}
