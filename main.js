
'use strict';

/* ── DOM References ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const backTop = document.getElementById('backTop');
const idCardScene = document.getElementById('idCardScene');
const allNavLinks = document.querySelectorAll('.nav-link');
const revealEls = document.querySelectorAll('[data-reveal]');

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
  // Clear and retype on viewport entry
  const typingObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      typingObserver.disconnect();
      prompt.innerHTML = '<span class="accent">$</span> <span class="blink-cursor"></span>';
      const span = prompt.querySelector('.blink-cursor');
      const textPart = document.createTextNode('');
      prompt.insertBefore(textPart, span);
      const words = ' ping ark --status --alive';
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

/* ── Click Spark Effect ─────────────────────────────────────── */
function initClickSpark() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let sparks = [];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const sparkColor = '#005eff'; // Matches the accent blue
  const sparkSize = 10;
  const sparkRadius = 15;
  const sparkCount = 8;
  const duration = 400;

  const easeOut = t => t * (2 - t);

  const draw = timestamp => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparks = sparks.filter(spark => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      const eased = easeOut(progress);

      const distance = eased * sparkRadius * 1.5; // extraScale = 1.5
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);

  window.addEventListener('click', e => {
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now
      });
    }
  });
}
initClickSpark();

/* ── Lanyard Physics & Interaction (Vanilla JS Port of Lanyard) ── */
class LanyardSimulation {
  constructor(container, cardElement) {
    this.container = container;
    this.card = cardElement;

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'lanyard-canvas';
    this.container.insertBefore(this.canvas, this.container.firstChild);
    this.ctx = this.canvas.getContext('2d');

    // Simulation parameters
    this.gravity = 0.5;
    this.damping = 0.996;
    this.iterations = 6;

    this.points = [];
    this.constraints = [];

    this.draggedPoint = null;
    this.isDragging = false;

    this.initPhysics();
    this.initEvents();

    // Start animation loop
    this.active = true;
    this.animate();
  }

  initPhysics() {
    const rect = this.container.getBoundingClientRect();
    const w = rect.width || 320;
    const h = 550; // Larger simulation height to accommodate loop hanging below neck

    this.canvas.width = w;
    this.canvas.height = h;

    // Lanyard U-shape loop: Left Anchor -> Clasp -> Right Anchor
    const numPoints = 9;
    const claspIndex = 4;

    const leftAnchorX = w / 2 - 75;
    const rightAnchorX = w / 2 + 75;
    const anchorY = 10;

    this.points = [];
    for (let i = 0; i < numPoints; i++) {
      let x, y, fixed = false;
      if (i === 0) {
        x = leftAnchorX;
        y = anchorY;
        fixed = true;
      } else if (i === numPoints - 1) {
        x = rightAnchorX;
        y = anchorY;
        fixed = true;
      } else {
        const t = i / (numPoints - 1);
        x = leftAnchorX + (rightAnchorX - leftAnchorX) * t;
        y = anchorY + Math.sin(t * Math.PI) * 122;
      }

      this.points.push({
        x, y,
        px: x, py: y,
        fixed,
        isClasp: i === claspIndex
      });
    }

    // Create constraints (links)
    const segmentLength = 28;
    this.constraints = [];
    for (let i = 0; i < numPoints - 1; i++) {
      this.constraints.push({
        p1: this.points[i],
        p2: this.points[i + 1],
        length: segmentLength
      });
    }

    // Card attachment
    const clasp = this.points[claspIndex];
    this.cardNode = {
      x: clasp.x,
      y: clasp.y + 30,
      px: clasp.x,
      py: clasp.y + 30,
      fixed: false,
      isCard: true
    };
    this.points.push(this.cardNode);

    this.constraints.push({
      p1: clasp,
      p2: this.cardNode,
      length: 30 // length of snap clasp
    });
  }

  initEvents() {
    const getMousePos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const startDrag = (e) => {
      if (e.target.closest('a') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('button')) {
        return;
      }

      const pos = getMousePos(e);
      const dist = Math.hypot(pos.x - this.cardNode.x, pos.y - this.cardNode.y);
      if (dist < 100) {
        // Prevent default browser drag selection & ghost image triggers
        e.preventDefault();
        e.stopPropagation();

        // Capture pointer immediately
        e.currentTarget.setPointerCapture(e.pointerId);

        document.body.classList.add("dragging");
        document.body.style.userSelect = "none";
        document.body.style.webkitUserSelect = "none";

        this.isDragging = true;
        this.dragOffset = {
          x: this.cardNode.x - pos.x,
          y: this.cardNode.y - pos.y
        };
        this.mousePos = pos;
      }
    };

    const doDrag = (e) => {
      if (!this.isDragging) return;
      this.mousePos = getMousePos(e);
    };

    const stopDrag = (e) => {
      if (!this.isDragging) return;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) { }

      document.body.classList.remove("dragging");
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      this.isDragging = false;
      this.mousePos = null;
    };

    // Bind pointer events for unified mouse/touch handling and capture redirection
    this.card.addEventListener('pointerdown', startDrag);
    this.card.addEventListener('pointermove', doDrag);
    this.card.addEventListener('pointerup', stopDrag);
    this.card.addEventListener('pointercancel', stopDrag);

    // Prevent default HTML5 dragging of the card itself
    this.card.addEventListener('dragstart', (e) => e.preventDefault());
  }

  update() {
    const rect = this.container.getBoundingClientRect();
    if (this.canvas.width !== rect.width) {
      this.initPhysics();
    }

    // Verlet Integration
    for (let p of this.points) {
      if (p.fixed) continue;

      // CardNode velocity is not integrated via gravity while dragging,
      // but we maintain its px/py history in the drag block so velocity is preserved!
      if (p === this.cardNode && this.isDragging) continue;

      // Heavier cardNode gravity (2.2) to maximize bounce tension and momentum
      const gravityForce = (p === this.cardNode) ? 2.2 : 0.4;

      const vx = (p.x - p.px) * this.damping;
      const vy = (p.y - p.py) * this.damping;

      p.px = p.x;
      p.py = p.y;

      p.x += vx;
      p.y += vy + gravityForce;
    }

    // Apply spring force pulling cardNode toward mouse pos when dragging
    if (this.isDragging && this.mousePos) {
      // Preserve previous position BEFORE updating current position to calculate exact velocity
      this.cardNode.px = this.cardNode.x;
      this.cardNode.py = this.cardNode.y;

      const targetX = this.mousePos.x + this.dragOffset.x;
      const targetY = this.mousePos.y + this.dragOffset.y;

      // Pull strength coefficient (0.45 creates a responsive trailing attraction)
      this.cardNode.x += (targetX - this.cardNode.x) * 0.45;
      this.cardNode.y += (targetY - this.cardNode.y) * 0.45;
    }

    // Solve constraints (springy, elastic rope)
    for (let k = 0; k < this.iterations; k++) {
      for (let c of this.constraints) {
        const dx = c.p2.x - c.p1.x;
        const dy = c.p2.y - c.p1.y;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) continue;

        // High stiffness (0.85) for fabric strap, and tight stiffness (0.98) for trigger clasp
        const stiffness = (c.p2 === this.cardNode) ? 0.98 : 0.85;
        const diff = (c.length - dist) / dist;

        const p1Fixed = c.p1.fixed;
        const p2Fixed = c.p2.fixed || (c.p2 === this.cardNode && this.isDragging);

        if (p1Fixed && p2Fixed) continue;

        let ratio1 = 0.5;
        let ratio2 = 0.5;

        if (p1Fixed) { ratio1 = 0; ratio2 = 1; }
        else if (p2Fixed) { ratio1 = 1; ratio2 = 0; }

        const offsetX = dx * diff * stiffness;
        const offsetY = dy * diff * stiffness;

        if (!p1Fixed) {
          c.p1.x -= offsetX * ratio1;
          c.p1.y -= offsetY * ratio1;
        }
        if (!p2Fixed) {
          c.p2.x += offsetX * ratio2;
          c.p2.y += offsetY * ratio2;
        }
      }
    }

    // Bound card Node
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (this.cardNode.x < 40) this.cardNode.x = 40;
    if (this.cardNode.x > w - 40) this.cardNode.x = w - 40;
    if (this.cardNode.y > h - 110) this.cardNode.y = h - 110;
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const w = this.canvas.width;
    const anchor = this.points[0]; // Point 0 is (w/2, 30)
    const clasp = this.points[3];  // Point 3 is clasp
    const cardN = this.cardNode;

    // Silver metal gradient for clasp & slider
    const metalGrad = ctx.createLinearGradient(-5, -5, 5, 5);
    metalGrad.addColorStop(0, '#ffffff');
    metalGrad.addColorStop(0.3, '#bbbbbb');
    metalGrad.addColorStop(0.7, '#777777');
    metalGrad.addColorStop(1, '#333333');

    // ── 1. DRAW NECK LOOP (Representing strap going around user's neck) ──
    const neckLeftX = w / 2 - 70;
    const neckRightX = w / 2 + 70;
    const neckY = -15;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw neck loop shadows
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.moveTo(neckLeftX, neckY + 4);
    ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
    ctx.moveTo(neckRightX, neckY + 4);
    ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
    ctx.stroke();

    // Draw neck loop straps
    ctx.lineWidth = 13;
    ctx.strokeStyle = '#0e0e0e';
    ctx.beginPath();
    ctx.moveTo(neckLeftX, neckY);
    ctx.quadraticCurveTo(w / 2, anchor.y, anchor.x, anchor.y);
    ctx.moveTo(neckRightX, neckY);
    ctx.quadraticCurveTo(w / 2, anchor.y, anchor.x, anchor.y);
    ctx.stroke();

    // Draw white stitch dashes on neck straps
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    // Left side stiches
    ctx.moveTo(neckLeftX + 2, neckY);
    ctx.quadraticCurveTo(w / 2, anchor.y - 4, anchor.x, anchor.y - 4);
    ctx.moveTo(neckLeftX - 2, neckY);
    ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
    // Right side stitches
    ctx.moveTo(neckRightX - 2, neckY);
    ctx.quadraticCurveTo(w / 2, anchor.y - 4, anchor.x, anchor.y - 4);
    ctx.moveTo(neckRightX + 2, neckY);
    ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
    ctx.stroke();

    ctx.restore();

    // ── 2. DRAW MAIN HANGING STRAP SHADOW & BAND ──
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Strap shadow
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const p = this.points[i];
      if (i === 0) ctx.moveTo(p.x, p.y + 4);
      else ctx.lineTo(p.x, p.y + 4);
    }
    ctx.stroke();

    // Black fabric main strap
    ctx.lineWidth = 13;
    ctx.strokeStyle = '#0e0e0e';
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const p = this.points[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

    ctx.restore();

    // ── 3. DRAW WHITE EMBROIDERED "ARK" TEXT & STITCHES ──
    ctx.save();
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw details in the center of the 3 main hanging segments
    for (let i = 0; i < 3; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(angle);

      // Dashed embroidery lines on the fabric margins
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(-16, -4.5);
      ctx.lineTo(16, -4.5);
      ctx.moveTo(-16, 4.5);
      ctx.lineTo(16, 4.5);
      ctx.stroke();

      ctx.fillText('ARK', 0, 0.5);
      ctx.restore();
    }
    ctx.restore();

    // ── 4. DRAW SHOULDER MEET/ADJUSTMENT COLLAR CLIP ──
    ctx.save();
    ctx.fillStyle = metalGrad;
    ctx.beginPath();
    // Cylindrical slider clip at Point 0
    ctx.arc(anchor.x, anchor.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // ── 5. DRAW DETAILED METAL TRIGGER SNAP CLASP ──
    const dx = cardN.x - clasp.x;
    const dy = cardN.y - clasp.y;
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.translate(clasp.x, clasp.y);
    ctx.rotate(angle);

    ctx.fillStyle = metalGrad;
    ctx.strokeStyle = metalGrad;

    // A. Swivel loop/D-ring (top)
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 6, Math.PI, 0); // half circle top
    ctx.lineTo(6, 4);
    ctx.lineTo(-6, 4);
    ctx.closePath();
    ctx.stroke();

    // B. Collar collar swivel neck (middle cylinder)
    ctx.beginPath();
    ctx.rect(-3, 4, 6, 5);
    ctx.fill();

    // C. Trigger snap hook base and loop (bottom)
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 16, 7, -Math.PI / 2, Math.PI * 1.5);
    ctx.stroke();

    // Snap gate clip (diagonal thin release hook)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(5.5, 11);
    ctx.lineTo(-4.5, 20);
    ctx.stroke();

    // Lever trigger pin
    ctx.fillStyle = metalGrad;
    ctx.beginPath();
    ctx.arc(-5.5, 13, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  applyTransform() {
    const clasp = this.points[3]; // Point 3 is clasp (Point 4 is cardNode)
    const cardN = this.cardNode;
    const cardWidth = this.card.offsetWidth || 300;

    // Align card's top edge exactly with cardNode (hanging below clasp and trigger clip)
    const x = cardN.x - cardWidth / 2;
    const y = cardN.y;

    // Setting rotation to depend purely on velocity tilt ensures the card sits 100% straight/vertical at rest!
    const vx = cardN.x - cardN.px;
    const tilt = vx * 0.8;

    // Apply translate and rotate, leaving the 3D hover flips intact inside the scene element
    this.card.style.transform = `translate3d(${x}px, ${y}px, 0) rotateZ(${tilt}deg)`;
  }

  animate() {
    if (!this.active) return;

    this.update();
    this.draw();
    this.applyTransform();

    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate Lanyard Simulation
const cardWrapper = document.querySelector('.about-card-wrapper');
if (cardWrapper && idCardScene) {
  const lanyardSim = new LanyardSimulation(cardWrapper, idCardScene);
}

