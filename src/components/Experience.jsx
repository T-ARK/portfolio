import { experiences } from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="section section-alt" aria-label="Experience section">
      <div className="container">
        <div className="section-header" data-reveal>
          <div className="section-label">
            <span className="accent">//</span>
            <h2>Internships</h2>
          </div>
          <p className="section-desc">My practical learning records and industry exposure.</p>
        </div>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <div
              className="timeline-item"
              id={exp.id}
              key={exp.id}
              data-reveal
              data-reveal-delay={Math.min(index + 1, 4)}
            >
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <p className="timeline-company accent">{exp.company}</p>
                  </div>
                  <div className="timeline-date">{exp.date}</div>
                </div>

                <ul className="timeline-points">
                  {exp.points.map((point, pIndex) => (
                    <li key={pIndex}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
