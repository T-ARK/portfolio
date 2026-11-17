import { projects } from '../data/portfolioData';
import GlareHover from './GlareHover';

export default function Projects() {
  return (
    <section id="projects" className="section" aria-label="Projects section">
      <div className="container">
        <div className="section-header" data-reveal>
          <div className="section-label">
            <span className="accent">//</span>
            <h2>Selected Works</h2>
          </div>
          <p className="section-desc">
            Practical projects created to demonstrate programming logic, layout design, and UI layouts.
          </p>
        </div>

        <div className="projects-list">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="terminal-card project-card"
              id={project.id}
              data-reveal
              data-reveal-delay={Math.min(index + 1, 4)}
            >
              <div className="project-inner">
                <div className="project-visual" aria-hidden="true">
                  <GlareHover
                    className="visual-img-container"
                    width="100%"
                    height="auto"
                    borderRadius="var(--radius)"
                    borderColor="var(--border)"
                    background="#060911"
                    mode="hover"
                    variant="streak"
                    glareColor="#ffffff"
                    glareOpacity={0.45}
                    glareSize={28}
                    softness={0.6}
                    glareAngle={-45}
                    blendMode="screen"
                    rimGlint={true}
                    transitionDuration={650}
                    style={{ aspectRatio: '16 / 9' }}
                  >
                    <picture className="project-picture">
                      {project.imageWebp && (
                        <source type="image/webp" srcSet={project.imageWebp} />
                      )}
                      <img
                        src={project.image}
                        alt={project.alt}
                        className="project-visual-img"
                        loading="lazy"
                        decoding="async"
                        width="1672"
                        height="941"
                      />
                    </picture>
                  </GlareHover>
                </div>

                <div className="project-info">
                  <div className="project-category">{project.category}</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>

                  <ul className="project-features">
                    {project.features.map((feature, fIndex) => (
                      <li key={fIndex}>
                        <span className="accent">▹</span> {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="chip-group">
                    {project.tags.map((tag) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.contributors && project.contributors.length > 0 && (
                    <div className="project-contributors">
                      <span className="contributors-label">
                        {project.contributorsLabel || "PROJECT CONTRIBUTORS:"}
                        <span className="contributors-count-badge">
                          [{String(project.contributors.length).padStart(2, '0')}]
                        </span>
                      </span>
                      <div className="contributors-avatars">
                        {project.contributors.map((c, cIdx) => (
                          <a
                            key={cIdx}
                            href={c.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contributor-avatar-link"
                            title={`${c.name} — ${c.role}`}
                          >
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="contributor-avatar-img"
                              loading="lazy"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="project-actions">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary project-live-btn"
                        aria-label={`${project.title} live demo`}
                      >
                        LIVE DEMO <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </a>
                    )}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                      aria-label={`${project.title} repository`}
                    >
                      <i className="fa-brands fa-github"></i> Source Code
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
