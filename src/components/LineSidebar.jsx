import { useRef, useState, useCallback, useEffect } from 'react';
import './LineSidebar.css';

const FALLOFF_CURVES = {
  linear: (p) => p,
  smooth: (p) => p * p * (3 - 2 * p),
  sharp: (p) => p * p * p,
};

const DEFAULT_ITEMS = [
  'Overview',
  'About',
  'Skills',
  'Projects',
  'Experience',
  'Contact',
];

export default function LineSidebar({
  items = DEFAULT_ITEMS,
  accentColor = '#005eff',
  textColor = '#888888',
  markerColor = '#333333',
  showIndex = true,
  showMarker = true,
  proximityRadius = 110,
  maxShift = 24,
  falloff = 'smooth',
  markerLength = 48,
  markerGap = 8,
  itemGap = 28,
  fontSize = 0.85,
  smoothing = 100,
  defaultActive = 0,
  onItemClick,
  className = '',
  side = 'right',
}) {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const targetsRef = useRef([]);
  const currentRef = useRef([]);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const activeRef = useRef(defaultActive);
  const smoothingRef = useRef(smoothing);
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  // Sync with external active index (e.g. scroll spy)
  useEffect(() => {
    if (defaultActive !== null && defaultActive !== undefined) {
      setActiveIndex(defaultActive);
    }
  }, [defaultActive]);

  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  // Single rAF loop that eases every element's --effect toward its target
  const runFrame = useCallback((now) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const elements = elementsRef.current;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (!el) continue;
      const isItemActive = el.dataset.itemIndex !== undefined && Number(el.dataset.itemIndex) === activeRef.current;
      const target = Math.max(
        targetsRef.current[i] || 0,
        isItemActive ? 1 : 0
      );
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty('--effect', value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const elements = elementsRef.current;

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(
          Math.max(0, 1 - distance / proximityRadius)
        );
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop]
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index, label) => {
      setActiveIndex(index);
      onItemClick?.(index, label);
    },
    [onItemClick]
  );

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    []
  );

  // Ruler tick configurations
  const TOP_TICKS = [
    { type: 'major', label: '00' },
    { type: 'minor' },
    { type: 'mid' },
    { type: 'minor' },
    { type: 'sub' },
    { type: 'minor' },
    { type: 'mid' },
    { type: 'minor' },
  ];

  const GAP_TICKS = [
    { type: 'minor' },
    { type: 'mid' },
    { type: 'minor' },
    { type: 'sub' },
    { type: 'minor' },
    { type: 'mid' },
    { type: 'minor' },
  ];

  const BOTTOM_TICKS = [
    { type: 'minor' },
    { type: 'mid' },
    { type: 'minor' },
    { type: 'sub' },
    { type: 'minor' },
    { type: 'mid' },
    { type: 'minor' },
    { type: 'major', label: '99' },
  ];

  let elementCounter = 0;

  return (
    <nav
      className={`line-sidebar line-sidebar--${side}${showMarker ? ' line-sidebar--markers' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--accent-color': accentColor,
        '--text-color': textColor,
        '--marker-color': markerColor,
        '--marker-length': `${markerLength}px`,
        '--marker-gap': `${markerGap}px`,
        '--max-shift': `${maxShift}px`,
        '--item-gap': `${itemGap}px`,
        '--font-size': `${fontSize}rem`,
        '--smoothing': `${smoothing}ms`,
      }}
    >
      <div
        ref={containerRef}
        className="line-sidebar__container"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Continuous vertical ruler hairline spine */}
        <div className="line-sidebar__ruler-spine" aria-hidden="true" />

        {/* Top Ruler Header Scale */}
        <div className="line-sidebar__ruler-block line-sidebar__ruler-block--top" aria-hidden="true">
          <div className="line-sidebar__ruler-tag">SYS_SCALE // 0.0</div>
          {TOP_TICKS.map((t, idx) => {
            const elIndex = elementCounter++;
            return (
              <div
                key={`top-tick-${idx}`}
                ref={(el) => {
                  elementsRef.current[elIndex] = el;
                }}
                className={`line-sidebar__ruler-tick line-sidebar__ruler-tick--${t.type}`}
              >
                {t.label && <span className="line-sidebar__tick-num">{t.label}</span>}
              </div>
            );
          })}
        </div>

        {/* Navigation Items with Intermediary Ruler Lines */}
        <ul className="line-sidebar__list" role="list">
          {items.map((label, index) => {
            const itemElIndex = elementCounter++;
            const isLast = index === items.length - 1;

            return (
              <li key={`group-${label}-${index}`} className="line-sidebar__group">
                {/* Main Nav Entry */}
                <div
                  ref={(el) => {
                    elementsRef.current[itemElIndex] = el;
                  }}
                  data-item-index={index}
                  className="line-sidebar__item"
                  aria-current={activeIndex === index ? 'true' : undefined}
                  onClick={() => handleClick(index, label)}
                >
                  <span className="line-sidebar__label">
                    <span className="line-sidebar__text">{label}</span>
                    {showIndex && (
                      <span className="line-sidebar__index">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </span>
                  {showMarker && (
                    <span className="line-sidebar__marker" aria-hidden="true" />
                  )}
                </div>

                {/* Ruler lines filling the empty space between items */}
                {!isLast && (
                  <div className="line-sidebar__ruler-block line-sidebar__ruler-block--gap" aria-hidden="true">
                    {GAP_TICKS.map((g, gIdx) => {
                      const gapElIndex = elementCounter++;
                      return (
                        <div
                          key={`gap-tick-${index}-${gIdx}`}
                          ref={(el) => {
                            elementsRef.current[gapElIndex] = el;
                          }}
                          className={`line-sidebar__ruler-tick line-sidebar__ruler-tick--${g.type}`}
                        />
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Bottom Ruler Footer Scale */}
        <div className="line-sidebar__ruler-block line-sidebar__ruler-block--bottom" aria-hidden="true">
          {BOTTOM_TICKS.map((b, idx) => {
            const elIndex = elementCounter++;
            return (
              <div
                key={`bottom-tick-${idx}`}
                ref={(el) => {
                  elementsRef.current[elIndex] = el;
                }}
                className={`line-sidebar__ruler-tick line-sidebar__ruler-tick--${b.type}`}
              >
                {b.label && <span className="line-sidebar__tick-num">{b.label}</span>}
              </div>
            );
          })}
          <div className="line-sidebar__ruler-tag">DATUM // 100%</div>
        </div>
      </div>
    </nav>
  );
}
