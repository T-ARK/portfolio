import { useEffect, useRef, useState } from 'react';
import { personalInfo, heroMetrics } from '../data/portfolioData';

export default function Hero() {
  const [animated, setAnimated] = useState(false);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCtaClick = (e) => {
    e.preventDefault();
    const target = document.querySelector('#projects');
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero" aria-label="Hero section">
      <div className="hero-glow"></div>
      <div className="geo-line geo-line-1"></div>
      <div className="geo-line geo-line-2"></div>

      <div className="hero-grid">
        <div className="hero-text" data-reveal>
          <div className="status-badge">
            <span className="pulse-dot"></span>
            PORTFOLIO '2026 // SYSTEM ONLINE
          </div>

          <h1 className="hero-title">
            ARSHID<br />
            CHANDRAN<br />
            <span className="accent glitch" data-text={personalInfo.glitchSuffix}>
              {personalInfo.glitchSuffix}
            </span>
          </h1>

          <p className="hero-desc">{personalInfo.heroDesc}</p>

          <div className="hero-cta">
            <a
              href="#projects"
              className="btn-primary"
              id="hero-cta-btn"
              onClick={handleCtaClick}
            >
              SELECTED WORKS <i className="fa-solid fa-arrow-right"></i>
            </a>

            <div className="social-icons">
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github"></i>
              </a>
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href={`mailto:${personalInfo.social.email}`} aria-label="Email">
                <i className="fa-regular fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-dashboard" aria-hidden="true" data-reveal data-reveal-delay="1">
          <div className="terminal-card dashboard-card" ref={dashboardRef}>
            <div className="dashboard-badge">2.0.1 // PORT_8080</div>
            <div className="dashboard-header">
              <span className="accent-sm">SYS_STATUS : STABLE</span>
              <span className="accent-sm">UPTIME : 100%</span>
            </div>
            <div className="divider"></div>

            <div className="metrics">
              {heroMetrics.map((metric) => (
                <div className="metric" key={metric.label}>
                  <div className="metric-label">
                    <span>{metric.label}</span>
                    <span className="accent">{metric.value}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: animated ? `${metric.percent}%` : '0%',
                        transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-footer">
              <div className="big-num">08</div>
              <div className="big-label">Selected_Works</div>
            </div>

            <div className="corner-tl"></div>
            <div className="corner-br"></div>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span>SCROLL</span>
        <i className="fa-solid fa-arrow-down"></i>
      </div>
    </section>
  );
}
