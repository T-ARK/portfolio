import { personalInfo } from '../data/portfolioData';
import LanyardCard from './LanyardCard';

export default function About() {
  return (
    <section id="about" className="section" aria-label="About section">
      <div className="container">
        <div className="about-grid">
          <div className="about-text" data-reveal>
            <div className="section-label">
              <span className="accent">//</span>
              <h2>About Me</h2>
            </div>
            <p className="about-tagline accent">{personalInfo.tagline}</p>
            <div className="about-paragraphs">
              {personalInfo.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div data-reveal data-reveal-delay="1">
            <LanyardCard />
          </div>
        </div>
      </div>
    </section>
  );
}
