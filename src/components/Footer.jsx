import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-left">© 2026 ARK</div>
      <div className="footer-right">
        <a
          href={personalInfo.social.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          GitHub
        </a>
        <a
          href={personalInfo.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          LinkedIn
        </a>
        <a href={`mailto:${personalInfo.social.email}`} aria-label="Email">
          Email
        </a>
      </div>
    </footer>
  );
}
