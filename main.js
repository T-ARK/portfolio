/* ============================================================
   JISHNU // 104 — Portfolio JS
   ============================================================ */

'use strict';

/* ── DOM References ─────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const backTop   = document.getElementById('backTop');
const idCardScene = document.getElementById('idCardScene');
const allNavLinks = document.querySelectorAll('.nav-link');
const revealEls   = document.querySelectorAll('[data-reveal]');

/* ── Navbar scroll effect ───────────────────────────────────── */
function onScroll() {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Back to top visibility
  backTop.classList.toggle('visible', window.scrollY > 400);

  // Active nav link based on section
  let current = '';
  document.querySelectorAll('section[id]').forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.id;
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run on load

/* ── Mobile navigation ──────────────────────────────────────── */
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
  // Prevent body scroll when nav is open
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }
});

/* ── Back to top ────────────────────────────────────────────── */
backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Scroll Reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Animate elements on load ───────────────────────────────── */
// Add data-reveal to major sections automatically
const autoReveal = [
  '.hero-text',
  '.hero-dashboard',
  '.about-text',
  '.about-card-wrapper',
  '.skill-card',
  '.project-card',
  '.timeline-item',
  '.contact-wrapper',
];

autoReveal.forEach((selector, sIdx) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (!el.hasAttribute('data-reveal')) {
      el.setAttribute('data-reveal', '');
      const delay = Math.min(i, 4);
      if (delay > 0) el.setAttribute('data-reveal-delay', delay);
      revealObserver.observe(el);
    }
  });
});

/* ── ID Card — touch / keyboard flip ───────────────────────── */
if (idCardScene) {
  // Touch: tap to flip
  let flipped = false;
  idCardScene.addEventListener('click', () => {
    flipped = !flipped;
    idCardScene.querySelector('.id-card').style.transform =
      flipped ? 'rotateY(180deg)' : '';
  });

  // Keyboard accessibility
  idCardScene.setAttribute('tabindex', '0');
  idCardScene.setAttribute('role', 'button');
  idCardScene.setAttribute('aria-label', 'ID Card — press Enter or Space to flip');
  idCardScene.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      idCardScene.click();
    }
  });
}

/* ── Typed cursor in terminal prompt ───────────────────────── */
const prompt = document.querySelector('.terminal-prompt');
if (prompt) {
  const base = '$ ping jishnu --hire --urgent';
  let i = 0;
  const textNode = prompt.firstChild;
  // Clear and retype on viewport entry
  const typingObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      typingObserver.disconnect();
      prompt.innerHTML = '<span class="accent">$</span> <span class="blink-cursor"></span>';
      const span = prompt.querySelector('.blink-cursor');
      const textPart = document.createTextNode('');
      prompt.insertBefore(textPart, span);
      // Remove the leading "$" text we set and keep accent span
      const words = ' ping jishnu --hire --urgent';
      let idx = 0;
      const type = () => {
        if (idx < words.length) {
          textPart.nodeValue += words[idx];
          idx++;
          setTimeout(type, 55 + Math.random() * 35);
        }
      };
      type();
    }
  }, { threshold: 0.8 });
  typingObserver.observe(prompt);
}

/* ── Skill card category filter animation ──────────────────── */
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.background = 'rgba(212,255,0,0.08)';
  });
  chip.addEventListener('mouseleave', () => {
    chip.style.background = '';
  });
});

/* ── Progress bars animate on view ─────────────────────────── */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          bar.style.transition = 'width 1.2s cubic-bezier(0.4,0,0.2,1)';
          bar.style.width = w;
        });
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.dashboard-card').forEach(card => barObserver.observe(card));

/* ── Smooth href fix for internal anchors ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
