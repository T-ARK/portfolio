import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import { playClickSound } from '../utils/sound';

export default function LanyardCard() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const hasDraggedRef = useRef(false);
  const nudgeRef = useRef(null);

  // Elastic Lanyard Physics & Verlet Rope Simulation
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!container || !canvas || !scene) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;
    let animId = null;

    // Canvas & dimensions
    let w = 320;
    let h = 550;

    // Anchor points (neck collar)
    let leftAnchor = { x: 110, y: 12 };
    let rightAnchor = { x: 210, y: 12 };
    let restX = 160;
    let restY = 150; // Rest position of card top

    // Card spring-mass state (elastic core)
    const card = {
      x: restX,
      y: restY,
      vx: 0,
      vy: 0,
      angle: 0,
      angularVel: 0,
    };

    // Intermediate rope strand points for realistic elastic wave ripple
    const leftStrand = [];
    const rightStrand = [];
    const NUM_SEGMENTS = 4; // 3 intermediate points per side

    // Pointer & drag tracking
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let mousePos = null;
    let pointerHistory = [];
    let startPointerPos = { x: 0, y: 0 };

    const initPhysics = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width || 320;
      h = Math.min(560, Math.max(480, window.innerHeight * 0.65));

      canvas.width = w;
      canvas.height = h;

      const anchorSpacing = Math.min(65, Math.max(38, w * 0.19));
      leftAnchor = { x: w / 2 - anchorSpacing, y: 12 };
      rightAnchor = { x: w / 2 + anchorSpacing, y: 12 };
      restX = w / 2;
      restY = Math.min(155, Math.max(130, h * 0.28));

      card.x = restX;
      card.y = restY;
      card.vx = 0;
      card.vy = 0;
      card.angle = 0;
      card.angularVel = 0;

      // Initialize intermediate strand points
      leftStrand.length = 0;
      rightStrand.length = 0;

      const claspY = restY - 30;
      for (let i = 1; i < NUM_SEGMENTS; i++) {
        const t = i / NUM_SEGMENTS;
        const lx = leftAnchor.x + (restX - leftAnchor.x) * t;
        const ly = leftAnchor.y + (claspY - leftAnchor.y) * t + Math.sin(t * Math.PI) * 18;
        leftStrand.push({ x: lx, y: ly, px: lx, py: ly });

        const rx = rightAnchor.x + (restX - rightAnchor.x) * t;
        const ry = rightAnchor.y + (claspY - rightAnchor.y) * t + Math.sin(t * Math.PI) * 18;
        rightStrand.push({ x: rx, y: ry, px: rx, py: ry });
      }
    };

    initPhysics();

    // Expose a pluck / elastic nudge function (triggered on card flip / hover)
    nudgeRef.current = (impulseY = 20, impulseAngle = 4) => {
      card.vy += impulseY;
      card.angularVel += impulseAngle;
    };

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrag = (e) => {
      // Don't intercept clicks on buttons or links inside the card
      if (
        e.target.closest('a') ||
        e.target.closest('input') ||
        e.target.closest('textarea') ||
        e.target.closest('button')
      ) {
        return;
      }

      const pos = getMousePos(e);
      // Grab anywhere near card or clasp
      const dist = Math.hypot(pos.x - card.x, pos.y - card.y);
      if (dist < 140) {
        e.preventDefault();
        e.stopPropagation();

        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}

        document.body.classList.add('dragging');
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        isDragging = true;
        hasDraggedRef.current = false;
        startPointerPos = { x: pos.x, y: pos.y };
        dragOffset = {
          x: card.x - pos.x,
          y: card.y - pos.y,
        };
        mousePos = pos;
        pointerHistory = [{ x: pos.x, y: pos.y, t: performance.now() }];
      }
    };

    const doDrag = (e) => {
      if (!isDragging) return;
      const pos = getMousePos(e);
      mousePos = pos;

      const totalDist = Math.hypot(pos.x - startPointerPos.x, pos.y - startPointerPos.y);
      if (totalDist > 6) {
        hasDraggedRef.current = true;
      }

      const now = performance.now();
      pointerHistory.push({ x: pos.x, y: pos.y, t: now });
      if (pointerHistory.length > 5) pointerHistory.shift();
    };

    const stopDrag = (e) => {
      if (!isDragging) return;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}

      document.body.classList.remove('dragging');
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';

      // Calculate flick velocity from pointer history for realistic throwing / slingshot recoil
      let flickVx = 0;
      let flickVy = 0;
      if (pointerHistory.length >= 2) {
        const oldest = pointerHistory[0];
        const newest = pointerHistory[pointerHistory.length - 1];
        const dt = Math.max(16, newest.t - oldest.t);
        flickVx = ((newest.x - oldest.x) / dt) * 16.67; // px per 60hz frame
        flickVy = ((newest.y - oldest.y) / dt) * 16.67;
      }

      // Bound release flick velocities
      flickVx = Math.max(-28, Math.min(28, flickVx));
      flickVy = Math.max(-32, Math.min(28, flickVy));

      // Impart velocity + stored elastic spring kick!
      card.vx = card.vx * 0.4 + flickVx * 0.9;
      card.vy = card.vy * 0.4 + flickVy * 0.9;

      isDragging = false;
      mousePos = null;
      pointerHistory = [];
    };

    const handleDragStart = (e) => e.preventDefault();

    scene.addEventListener('pointerdown', startDrag);
    scene.addEventListener('pointermove', doDrag);
    scene.addEventListener('pointerup', stopDrag);
    scene.addEventListener('pointercancel', stopDrag);
    scene.addEventListener('dragstart', handleDragStart);

    // ============================================================
    // PHYSICS ENGINE — HOOKE'S SPRING TENSION & ELASTIC BOUNCE
    // ============================================================
    const updatePhysics = () => {
      const rect = container.getBoundingClientRect();
      if (Math.abs(canvas.width - rect.width) > 4) {
        initPhysics();
      }

      // 1. CARD SPRING-MASS DYNAMICS
      if (isDragging && mousePos) {
        // Elastic spring pull towards cursor (creates tactile drag resistance)
        const targetX = mousePos.x + dragOffset.x;
        const targetY = mousePos.y + dragOffset.y;

        const prevX = card.x;
        const prevY = card.y;

        // Pull coefficient (0.42 provides responsive tracking while stretching smoothly)
        card.x += (targetX - card.x) * 0.42;
        card.y += (targetY - card.y) * 0.42;

        card.vx = card.x - prevX;
        card.vy = card.y - prevY;
      } else {
        // Natural Elastic Spring Recoil (Hooke's Law: F = -k * displacement - c * velocity)
        const dispX = card.x - restX;
        const dispY = card.y - restY;

        // Spring stiffness & damping coefficients for elastic bounce
        const springK = 0.052; // Higher value = snappier, firmer rubber band snap
        const damping = 0.948; // Preserves ~5-6 visible oscillations before settling
        const gravity = 0.58;  // Hanging weight of the badge

        const fx = -springK * dispX;
        const fy = -springK * dispY + gravity;

        card.vx = (card.vx + fx) * damping;
        card.vy = (card.vy + fy) * damping;

        card.x += card.vx;
        card.y += card.vy;
      }

      // 2. ROTATIONAL INERTIA & ANGULAR SPRING
      // Target tilt responds to horizontal velocity and lateral displacement
      const targetAngle = Math.max(
        -32,
        Math.min(32, card.vx * 1.6 + (card.x - restX) * 0.075)
      );
      const angularSpringK = 0.082;
      const angularDamping = 0.885;

      card.angularVel =
        (card.angularVel + (targetAngle - card.angle) * angularSpringK) * angularDamping;
      card.angle += card.angularVel;

      // 3. BOUNDARY CONSTRAINTS
      const minX = 40;
      const maxX = w - 40;
      const minY = 35;
      const maxY = h - 90;

      if (card.x < minX) {
        card.x = minX;
        card.vx = -card.vx * 0.5;
      } else if (card.x > maxX) {
        card.x = maxX;
        card.vx = -card.vx * 0.5;
      }

      if (card.y < minY) {
        card.y = minY;
        card.vy = -card.vy * 0.5;
      } else if (card.y > maxY) {
        card.y = maxY;
        card.vy = -card.vy * 0.5;
      }

      // 4. STRAND SIMULATION (Elastic wave & catenary follower)
      const claspPos = { x: card.x, y: card.y - 30 };

      const updateStrand = (strand, anchor) => {
        const count = strand.length;
        for (let i = 0; i < count; i++) {
          const p = strand[i];
          const t = (i + 1) / (count + 1);

          // Verlet momentum
          const vx = (p.x - p.px) * 0.91;
          const vy = (p.y - p.py) * 0.91;
          p.px = p.x;
          p.py = p.y;
          p.x += vx;
          p.y += vy + 0.38; // gravity on strap

          // Natural elastic catenary target between anchor and clasp
          const targetX = anchor.x + (claspPos.x - anchor.x) * t;
          const targetY = anchor.y + (claspPos.y - anchor.y) * t + Math.sin(t * Math.PI) * 14;

          // Elastic spring attraction to catenary
          p.x += (targetX - p.x) * 0.28;
          p.y += (targetY - p.y) * 0.28;
        }
      };

      updateStrand(leftStrand, leftAnchor);
      updateStrand(rightStrand, rightAnchor);
    };

    // ============================================================
    // CANVAS RENDERING — ELASTIC STRAPS, STITCHES & CHROME CLASP
    // ============================================================
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const claspPos = { x: card.x, y: card.y - 30 };

      // Chrome metallic gradient for clasps & rings
      const metalGrad = ctx.createLinearGradient(-8, -8, 8, 8);
      metalGrad.addColorStop(0, '#ffffff');
      metalGrad.addColorStop(0.25, '#c5cbd4');
      metalGrad.addColorStop(0.65, '#6a7280');
      metalGrad.addColorStop(1, '#2c3340');

      // 1. DRAW TOP NECK LOOP (Representing strap looping behind user's neck)
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const neckLeftX = w / 2 - 68;
      const neckRightX = w / 2 + 68;
      const neckY = -12;

      // Neck drop shadow
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.moveTo(neckLeftX, neckY + 4);
      ctx.quadraticCurveTo(w / 2, leftAnchor.y + 4, leftAnchor.x, leftAnchor.y + 4);
      ctx.moveTo(neckRightX, neckY + 4);
      ctx.quadraticCurveTo(w / 2, rightAnchor.y + 4, rightAnchor.x, rightAnchor.y + 4);
      ctx.stroke();

      // Neck main strap
      ctx.lineWidth = 13;
      ctx.strokeStyle = '#0b0f17';
      ctx.beginPath();
      ctx.moveTo(neckLeftX, neckY);
      ctx.quadraticCurveTo(w / 2, leftAnchor.y, leftAnchor.x, leftAnchor.y);
      ctx.moveTo(neckRightX, neckY);
      ctx.quadraticCurveTo(w / 2, rightAnchor.y, rightAnchor.x, rightAnchor.y);
      ctx.stroke();

      // Cyber stitching on neck loop
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 1.1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(neckLeftX + 2, neckY);
      ctx.quadraticCurveTo(w / 2, leftAnchor.y - 3, leftAnchor.x, leftAnchor.y - 3);
      ctx.moveTo(neckRightX - 2, neckY);
      ctx.quadraticCurveTo(w / 2, rightAnchor.y - 3, rightAnchor.x, rightAnchor.y - 3);
      ctx.stroke();
      ctx.restore();

      // 2. HELPER TO DRAW A STRAND (Left & Right)
      const renderStrand = (anchor, strand) => {
        const fullPoints = [anchor, ...strand, claspPos];

        // Elastic stretch factor: strap thins slightly when under extreme tension
        const currentLength = Math.hypot(claspPos.x - anchor.x, claspPos.y - anchor.y);
        const stretchRatio = Math.min(1.5, Math.max(0.85, currentLength / 140));
        const strapWidth = Math.max(9, 13 - (stretchRatio - 1) * 6);

        // A. Strap Shadow
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = strapWidth + 2;
        ctx.strokeStyle = 'rgba(0,0,0,0.38)';
        ctx.beginPath();
        ctx.moveTo(fullPoints[0].x, fullPoints[0].y + 4);
        for (let i = 1; i < fullPoints.length - 1; i++) {
          const xc = (fullPoints[i].x + fullPoints[i + 1].x) / 2;
          const yc = (fullPoints[i].y + 4 + (fullPoints[i + 1].y + 4)) / 2;
          ctx.quadraticCurveTo(fullPoints[i].x, fullPoints[i].y + 4, xc, yc);
        }
        ctx.lineTo(claspPos.x, claspPos.y + 4);
        ctx.stroke();

        // B. Dark Cyber Fabric Strap
        ctx.lineWidth = strapWidth;
        ctx.strokeStyle = '#0b0f17';
        ctx.beginPath();
        ctx.moveTo(fullPoints[0].x, fullPoints[0].y);
        for (let i = 1; i < fullPoints.length - 1; i++) {
          const xc = (fullPoints[i].x + fullPoints[i + 1].x) / 2;
          const yc = (fullPoints[i].y + fullPoints[i + 1].y) / 2;
          ctx.quadraticCurveTo(fullPoints[i].x, fullPoints[i].y, xc, yc);
        }
        ctx.lineTo(claspPos.x, claspPos.y);
        ctx.stroke();

        // C. Subtle Neon Blue Outer Rail
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0, 94, 255, 0.35)';
        ctx.stroke();

        // D. White Embroidered Stitch Lines
        ctx.strokeStyle = 'rgba(255,255,255,0.42)';
        ctx.lineWidth = 1.0;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.restore();

        // E. Embroidered "ARK" Text on Midpoint Segment
        if (fullPoints.length >= 3) {
          const midIdx = Math.floor(fullPoints.length / 2);
          const pA = fullPoints[midIdx - 1];
          const pB = fullPoints[midIdx];

          const midX = (pA.x + pB.x) / 2;
          const midY = (pA.y + pB.y) / 2;
          const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x);

          ctx.save();
          ctx.translate(midX, midY);
          ctx.rotate(angle);
          ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ARK', 0, 0);
          ctx.restore();
        }
      };

      // Draw both hanging strands
      renderStrand(leftAnchor, leftStrand);
      renderStrand(rightAnchor, rightStrand);

      // 3. COLLAR ADJUSTMENT CLIPS (At Neck Anchors)
      const drawCollarClip = (pt) => {
        ctx.save();
        ctx.fillStyle = metalGrad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1a1f2c';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      };

      drawCollarClip(leftAnchor);
      drawCollarClip(rightAnchor);

      // 4. METALLIC CLASP & TRIGGER HOOK ASSEMBLY
      const dx = card.x - claspPos.x;
      const dy = card.y - claspPos.y;
      const claspAngle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(claspPos.x, claspPos.y);
      ctx.rotate(claspAngle - Math.PI / 2); // Orient towards card

      ctx.fillStyle = metalGrad;
      ctx.strokeStyle = metalGrad;

      // Swivel D-Ring (top)
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, 0, 6, Math.PI, 0);
      ctx.lineTo(6, 4);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.stroke();

      // Swivel Barrel (middle cylinder)
      ctx.beginPath();
      ctx.rect(-3.5, 4, 7, 6);
      ctx.fill();
      ctx.strokeStyle = '#181e28';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Snap Hook Loop
      ctx.fillStyle = metalGrad;
      ctx.strokeStyle = metalGrad;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(0, 16, 7.5, -Math.PI / 2, Math.PI * 1.5);
      ctx.stroke();

      // Trigger Lever Pin
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(5.5, 11);
      ctx.lineTo(-4.5, 20);
      ctx.stroke();

      ctx.fillStyle = metalGrad;
      ctx.beginPath();
      ctx.arc(-5.5, 13, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Card slot attachment rivet
      ctx.beginPath();
      ctx.arc(0, 28, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#005eff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    // 5. DOM TRANSFORM UPDATE
    const applyTransform = () => {
      const cardWidth = scene.offsetWidth || 300;
      const x = card.x - cardWidth / 2;
      const y = card.y;

      // Hardware accelerated 3D transform with dynamic elastic rotation tilt
      scene.style.transform = `translate3d(${x}px, ${y}px, 0) rotateZ(${card.angle}deg)`;
    };

    // 6. ANIMATION LOOP
    const animate = () => {
      if (!active) return;
      updatePhysics();
      draw();
      applyTransform();
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      active = false;
      if (animId) cancelAnimationFrame(animId);
      scene.removeEventListener('pointerdown', startDrag);
      scene.removeEventListener('pointermove', doDrag);
      scene.removeEventListener('pointerup', stopDrag);
      scene.removeEventListener('pointercancel', stopDrag);
      scene.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Card click (flip): Only flip if user didn't drag it!
  const handleCardClick = () => {
    if (hasDraggedRef.current) return;
    playClickSound();
    setIsFlipped((prev) => !prev);
    // Impart a snappy downward elastic pluck when card flips!
    if (nudgeRef.current) {
      nudgeRef.current(22, (Math.random() > 0.5 ? 4.5 : -4.5));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playClickSound();
      setIsFlipped((prev) => !prev);
      if (nudgeRef.current) {
        nudgeRef.current(22, (Math.random() > 0.5 ? 4.5 : -4.5));
      }
    }
  };

  return (
    <div className="about-card-wrapper" ref={containerRef}>
      {/* Elastic Canvas Simulation */}
      <canvas ref={canvasRef} className="lanyard-canvas" aria-hidden="true" />

      {/* ID Card Scene with Elastic Spring Physics */}
      <div
        className="id-card-scene"
        id="idCardScene"
        ref={sceneRef}
        role="button"
        tabIndex={0}
        aria-label="ID Card — drag to stretch elastically, click or hover to flip"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
      >
        <div
          className="id-card"
          ref={cardRef}
          style={{ transform: isFlipped ? 'rotateY(180deg)' : undefined }}
        >
          {/* FRONT */}
          <div className="id-card-face id-card-front" aria-label="ID Card front">
            <div className="id-card-header">
              <span className="id-label">{personalInfo.personnelId}</span>
              <span className="pulse-dot small"></span>
            </div>
            <div className="id-card-body">
              <div className="avatar-wrapper glare-hover">
                <div className="avatar-border"></div>
                <img
                  src={personalInfo.profileImage}
                  alt={`${personalInfo.fullName} - Data Science Student and Web Developer at St Thomas College Kannur`}
                  className="avatar-img"
                  loading="lazy"
                  width="500"
                  height="500"
                />
                <div className="avatar-badge"></div>
              </div>
              <div className="id-name">Arshid Chandran</div>
              <div className="id-role accent">{personalInfo.role}</div>
              <div className="id-status">
                <span className="accent">●</span>
                {personalInfo.status}
              </div>
              <div className="barcode" aria-hidden="true">
                <div className="barcode-bars">
                  <div style={{ width: '1px', height: '100%' }}></div>
                  <div style={{ width: '3px', height: '100%' }}></div>
                  <div style={{ width: '1px', height: '75%' }}></div>
                  <div style={{ width: '2px', height: '100%' }}></div>
                  <div style={{ width: '1px', height: '50%' }}></div>
                  <div style={{ width: '4px', height: '100%' }}></div>
                  <div style={{ width: '1px', height: '100%' }}></div>
                  <div style={{ width: '2px', height: '75%' }}></div>
                  <div style={{ width: '1px', height: '100%' }}></div>
                  <div style={{ width: '3px', height: '100%' }}></div>
                  <div style={{ width: '1px', height: '50%' }}></div>
                  <div style={{ width: '2px', height: '100%' }}></div>
                  <div style={{ width: '1px', height: '100%' }}></div>
                  <div style={{ width: '4px', height: '100%' }}></div>
                  <div style={{ width: '1px', height: '75%' }}></div>
                  <div style={{ width: '2px', height: '100%' }}></div>
                  <div style={{ width: '3px', height: '100%' }}></div>
                  <div style={{ width: '1px', height: '50%' }}></div>
                </div>
                <span className="barcode-text">{personalInfo.barcode}</span>
              </div>
            </div>
            <div className="id-card-footer-bar"></div>
          </div>

          {/* BACK */}
          <div className="id-card-face id-card-back" aria-label="ID Card back — README">
            <div className="readme-header">
              <div className="dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="readme-title">README.md — utf-8</span>
            </div>
            <div className="readme-body">
              <div className="readme-line">
                <span className="ln">01</span>
                <span className="accent readme-h1"># Arshid Chandran</span>
              </div>
              <div className="readme-line">
                <span className="ln">02</span>
                <span className="readme-italic">CS &amp; Data Science @ STM Kannur</span>
              </div>
              <div className="readme-line">
                <span className="ln">03</span>
                <span className="readme-muted">
                  Building simple responsive websites and programming in C++, Java, &amp; Python.
                </span>
              </div>
              <div className="readme-line">
                <span className="ln">04</span>
                <span className="accent readme-h2">## ./now</span>
              </div>
              <div className="readme-line">
                <span className="ln">05</span>
                <span className="readme-muted">- Sharpening readable code and logic fundamentals</span>
              </div>
              <div className="readme-line">
                <span className="ln">06</span>
                <span className="readme-muted">- Experimenting with HTML/CSS layouts &amp; animations</span>
              </div>
              <div className="readme-line">
                <span className="ln">07</span>
                <span className="readme-muted">- Pursuing computer science &amp; analytics workflows</span>
              </div>
              <div className="readme-line">
                <span className="ln">08</span>
                <span className="readme-muted">- Exploring database systems and data modeling</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="flip-hint" aria-hidden="true">
        <i className="fa-solid fa-arrows-up-down"></i> drag to stretch &bull; <i className="fa-solid fa-rotate"></i> hover or tap to flip
      </p>
    </div>
  );
}
