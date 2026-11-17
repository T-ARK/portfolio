import { useEffect, useRef, useState } from 'react';
import { personalInfo } from '../data/portfolioData';
import { playClickSound } from '../utils/sound';

export default function LanyardCard() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // Lanyard Verlet Physics Simulation
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!container || !canvas || !scene) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;
    let animId = null;

    // Simulation params
    const gravity = 0.5;
    const damping = 0.996;
    const iterations = 6;

    let points = [];
    let constraints = [];
    let cardNode = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let mousePos = null;

    const initPhysics = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width || 320;
      const h = Math.min(550, Math.max(460, window.innerHeight * 0.65));

      canvas.width = w;
      canvas.height = h;

      const numPoints = 9;
      const claspIndex = 4;

      const anchorSpacing = Math.min(75, Math.max(35, w * 0.22));
      const leftAnchorX = w / 2 - anchorSpacing;
      const rightAnchorX = w / 2 + anchorSpacing;
      const anchorY = 10;

      points = [];
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

        points.push({
          x,
          y,
          px: x,
          py: y,
          fixed,
          isClasp: i === claspIndex,
        });
      }

      const segmentLength = 28;
      constraints = [];
      for (let i = 0; i < numPoints - 1; i++) {
        constraints.push({
          p1: points[i],
          p2: points[i + 1],
          length: segmentLength,
        });
      }

      const clasp = points[claspIndex];
      cardNode = {
        x: clasp.x,
        y: clasp.y + 30,
        px: clasp.x,
        py: clasp.y + 30,
        fixed: false,
        isCard: true,
      };
      points.push(cardNode);

      constraints.push({
        p1: clasp,
        p2: cardNode,
        length: 30,
      });
    };

    initPhysics();

    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrag = (e) => {
      if (
        e.target.closest('a') ||
        e.target.closest('input') ||
        e.target.closest('textarea') ||
        e.target.closest('button')
      ) {
        return;
      }

      const pos = getMousePos(e);
      if (!cardNode) return;
      const dist = Math.hypot(pos.x - cardNode.x, pos.y - cardNode.y);
      if (dist < 100) {
        e.preventDefault();
        e.stopPropagation();

        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}

        document.body.classList.add('dragging');
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        isDragging = true;
        dragOffset = {
          x: cardNode.x - pos.x,
          y: cardNode.y - pos.y,
        };
        mousePos = pos;
      }
    };

    const doDrag = (e) => {
      if (!isDragging) return;
      mousePos = getMousePos(e);
    };

    const stopDrag = (e) => {
      if (!isDragging) return;

      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}

      document.body.classList.remove('dragging');
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';

      isDragging = false;
      mousePos = null;
    };

    const handleDragStart = (e) => e.preventDefault();

    scene.addEventListener('pointerdown', startDrag);
    scene.addEventListener('pointermove', doDrag);
    scene.addEventListener('pointerup', stopDrag);
    scene.addEventListener('pointercancel', stopDrag);
    scene.addEventListener('dragstart', handleDragStart);

    const updatePhysics = () => {
      const rect = container.getBoundingClientRect();
      if (canvas.width !== rect.width) {
        initPhysics();
      }

      // Verlet Integration
      for (const p of points) {
        if (p.fixed) continue;
        if (p === cardNode && isDragging) continue;

        const gravityForce = p === cardNode ? 2.2 : 0.4;
        const vx = (p.x - p.px) * damping;
        const vy = (p.y - p.py) * damping;

        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + gravityForce;
      }

      if (isDragging && mousePos && cardNode) {
        cardNode.px = cardNode.x;
        cardNode.py = cardNode.y;
        const targetX = mousePos.x + dragOffset.x;
        const targetY = mousePos.y + dragOffset.y;
        cardNode.x += (targetX - cardNode.x) * 0.45;
        cardNode.y += (targetY - cardNode.y) * 0.45;
      }

      // Constraints
      for (let k = 0; k < iterations; k++) {
        for (const c of constraints) {
          const dx = c.p2.x - c.p1.x;
          const dy = c.p2.y - c.p1.y;
          const dist = Math.hypot(dx, dy);
          if (dist === 0) continue;

          const stiffness = c.p2 === cardNode ? 0.98 : 0.85;
          const diff = (c.length - dist) / dist;

          const p1Fixed = c.p1.fixed;
          const p2Fixed = c.p2.fixed || (c.p2 === cardNode && isDragging);

          if (p1Fixed && p2Fixed) continue;

          let ratio1 = 0.5;
          let ratio2 = 0.5;
          if (p1Fixed) {
            ratio1 = 0;
            ratio2 = 1;
          } else if (p2Fixed) {
            ratio1 = 1;
            ratio2 = 0;
          }

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

      const w = canvas.width;
      const h = canvas.height;
      if (cardNode) {
        if (cardNode.x < 40) cardNode.x = 40;
        if (cardNode.x > w - 40) cardNode.x = w - 40;
        if (cardNode.y > h - 110) cardNode.y = h - 110;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (points.length < 5 || !cardNode) return;

      const w = canvas.width;
      const anchor = points[0];
      const clasp = points[3];
      const cardN = cardNode;

      const metalGrad = ctx.createLinearGradient(-5, -5, 5, 5);
      metalGrad.addColorStop(0, '#ffffff');
      metalGrad.addColorStop(0.3, '#bbbbbb');
      metalGrad.addColorStop(0.7, '#777777');
      metalGrad.addColorStop(1, '#333333');

      // 1. NECK LOOP
      const neckLeftX = w / 2 - 70;
      const neckRightX = w / 2 + 70;
      const neckY = -15;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.moveTo(neckLeftX, neckY + 4);
      ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
      ctx.moveTo(neckRightX, neckY + 4);
      ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
      ctx.stroke();

      ctx.lineWidth = 13;
      ctx.strokeStyle = '#0e0e0e';
      ctx.beginPath();
      ctx.moveTo(neckLeftX, neckY);
      ctx.quadraticCurveTo(w / 2, anchor.y, anchor.x, anchor.y);
      ctx.moveTo(neckRightX, neckY);
      ctx.quadraticCurveTo(w / 2, anchor.y, anchor.x, anchor.y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(neckLeftX + 2, neckY);
      ctx.quadraticCurveTo(w / 2, anchor.y - 4, anchor.x, anchor.y - 4);
      ctx.moveTo(neckLeftX - 2, neckY);
      ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
      ctx.moveTo(neckRightX - 2, neckY);
      ctx.quadraticCurveTo(w / 2, anchor.y - 4, anchor.x, anchor.y - 4);
      ctx.moveTo(neckRightX + 2, neckY);
      ctx.quadraticCurveTo(w / 2, anchor.y + 4, anchor.x, anchor.y + 4);
      ctx.stroke();
      ctx.restore();

      // 2. MAIN HANGING STRAP
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const p = points[i];
        if (i === 0) ctx.moveTo(p.x, p.y + 4);
        else ctx.lineTo(p.x, p.y + 4);
      }
      ctx.stroke();

      ctx.lineWidth = 13;
      ctx.strokeStyle = '#0e0e0e';
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const p = points[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();

      // 3. WHITE EMBROIDERED "ARK" TEXT & STITCHES
      ctx.save();
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < 3; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const angle = Math.atan2(dy, dx);

        ctx.save();
        ctx.translate(midX, midY);
        ctx.rotate(angle);

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

      // 4. SHOULDER COLLAR CLIP
      ctx.save();
      ctx.fillStyle = metalGrad;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 5. TRIGGER SNAP CLASP
      const dx = cardN.x - clasp.x;
      const dy = cardN.y - clasp.y;
      const angle = Math.atan2(dy, dx);

      ctx.save();
      ctx.translate(clasp.x, clasp.y);
      ctx.rotate(angle);

      ctx.fillStyle = metalGrad;
      ctx.strokeStyle = metalGrad;

      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 6, Math.PI, 0);
      ctx.lineTo(6, 4);
      ctx.lineTo(-6, 4);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(-3, 4, 6, 5);
      ctx.fill();

      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 16, 7, -Math.PI / 2, Math.PI * 1.5);
      ctx.stroke();

      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(5.5, 11);
      ctx.lineTo(-4.5, 20);
      ctx.stroke();

      ctx.fillStyle = metalGrad;
      ctx.beginPath();
      ctx.arc(-5.5, 13, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const applyTransform = () => {
      if (!cardNode) return;
      const cardWidth = scene.offsetWidth || 300;
      const x = cardNode.x - cardWidth / 2;
      const y = cardNode.y;
      const vx = cardNode.x - cardNode.px;
      const tilt = vx * 0.8;

      scene.style.transform = `translate3d(${x}px, ${y}px, 0) rotateZ(${tilt}deg)`;
    };

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

  const handleCardClick = () => {
    playClickSound();
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playClickSound();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div className="about-card-wrapper" ref={containerRef}>
      {/* Simulation Canvas */}
      <canvas ref={canvasRef} className="lanyard-canvas" aria-hidden="true" />

      {/* ID Card Scene */}
      <div
        className="id-card-scene"
        id="idCardScene"
        ref={sceneRef}
        role="button"
        tabIndex={0}
        aria-label="ID Card — press Enter or Space to flip"
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
        <i className="fa-solid fa-rotate"></i> hover or tap to flip
      </p>
    </div>
  );
}
