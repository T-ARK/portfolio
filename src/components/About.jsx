import { personalInfo } from '../data/portfolioData';
import Lanyard from './Lanyard';

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

          <div data-reveal data-reveal-delay="1" className="about-card-wrapper">
            <div className="lanyard-container">
              <Lanyard
                frontImage="/card-front.png"
                backImage="/card-back.png"
                strapImage="/band.png"
                cardColor="#0b0f19"
                finish="smooth"
                metal="silver"
                gravity={0.9}
                damping={0.5}
                elasticity={0.65}
                breeze={0.35}
                interactive={true}
                intro={true}
                strapLength={0.16}
                size={0.65}
              />
            </div>
            <p className="flip-hint" aria-hidden="true">
              <i className="fa-solid fa-arrows-up-down"></i> drag to swing &bull; click to flip
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
