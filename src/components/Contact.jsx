import { useState, useEffect, useRef } from 'react';
import { personalInfo } from '../data/portfolioData';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | transmitting | success | error
  const [typedText, setTypedText] = useState('');
  const promptRef = useRef(null);

  // Terminal Typing Animation with unmount safety
  useEffect(() => {
    const promptEl = promptRef.current;
    if (!promptEl) return;
    let timerId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          const words = ' ping ark --status --alive';
          let idx = 0;
          const type = () => {
            if (idx < words.length) {
              setTypedText((prev) => prev + words[idx]);
              idx++;
              timerId = setTimeout(type, 55 + Math.random() * 35);
            }
          };
          type();
        }
      },
      { threshold: 0.8 }
    );

    observer.observe(promptEl);
    return () => {
      observer.disconnect();
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    setStatus('transmitting');

    try {
      await fetch(personalInfo.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      setFormData({ name: '', email: '', message: '' });
      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Contact form error:', error);
      setStatus('error');

      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  return (
    <section id="contact" className="section" aria-label="Contact section">
      <div className="container">
        <div className="contact-grid-wrapper">
          <div className="contact-info-block" data-reveal>
            <div className="section-label">
              <span className="accent">//</span>
              <h2>Contact</h2>
            </div>
            <p className="contact-tagline">Let's build something useful.</p>
            <p className="contact-desc">
              I am open to internships, software roles, design collaborations, and learning
              opportunities. If you want to talk shop, discuss code, or share interesting projects,
              feel free to send a message.
            </p>

            <div className="contact-links">
              <div className="contact-row">
                <span className="contact-label">Email</span>
                <a
                  href={`mailto:${personalInfo.social.email}`}
                  className="contact-value accent"
                  id="contact-email"
                >
                  {personalInfo.social.email}
                </a>
              </div>
              <div className="contact-row">
                <span className="contact-label">GitHub</span>
                <a
                  href={personalInfo.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value accent"
                  id="contact-github"
                >
                  github.com/T-ARK
                </a>
              </div>
              <div className="contact-row">
                <span className="contact-label">LinkedIn</span>
                <a
                  href={personalInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value accent"
                  id="contact-linkedin"
                >
                  linkedin.com/in/arshid-chandran-p-k
                </a>
              </div>
            </div>

            <div className="terminal-prompt" ref={promptRef} aria-hidden="true">
              <span className="accent">$</span>
              <span>{typedText}</span>
              <span className="blink-cursor"></span>
            </div>
          </div>

          <div className="contact-form-block" data-reveal data-reveal-delay="1">
            <div className="terminal-card form-card">
              <div className="form-header">
                <span className="accent">sys_mailer.sh</span>
                <div className="dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
              </div>

              <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="form-name">NAME</label>
                  <input
                    type="text"
                    id="form-name"
                    name="name"
                    placeholder="Enter name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-email">EMAIL</label>
                  <input
                    type="email"
                    id="form-email"
                    name="email"
                    placeholder="Enter email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="form-message">MESSAGE</label>
                  <textarea
                    id="form-message"
                    name="message"
                    rows="5"
                    placeholder="Write message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="form-submit-btn"
                  disabled={status === 'transmitting'}
                >
                  {status === 'idle' && (
                    <>
                      EXECUTE_SEND <i className="fa-solid fa-paper-plane"></i>
                    </>
                  )}
                  {status === 'transmitting' && (
                    <>
                      TRANSMITTING... <i className="fa-solid fa-spinner fa-spin"></i>
                    </>
                  )}
                  {status === 'success' && (
                    <>
                      MESSAGE_SENT <i className="fa-solid fa-check"></i>
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      SEND_FAILED <i className="fa-solid fa-xmark"></i>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
