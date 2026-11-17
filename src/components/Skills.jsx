import { skillCategories } from '../data/portfolioData';

export default function Skills() {
  return (
    <section id="skills" className="section section-alt" aria-label="Skills section">
      <div className="container">
        <div className="section-header" data-reveal>
          <div className="section-label">
            <span className="accent">//</span>
            <h2>Skills &amp; Toolkit</h2>
          </div>
          <p className="section-desc">
            My core areas of focus as I build practical software and design structures.
          </p>
        </div>

        <div className="skills-grid">
          {skillCategories.map((cat, index) => (
            <div
              key={cat.title}
              className="terminal-card skill-card"
              data-category={cat.category}
              data-reveal
              data-reveal-delay={Math.min(index + 1, 4)}
            >
              <div className="skill-card-header">
                <h3>{cat.title}</h3>
                <span className="chip-count">{cat.count}</span>
              </div>
              <div className="chip-group">
                {cat.skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
