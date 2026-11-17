import { useState, useEffect, useRef, useCallback } from 'react';

export function useScrollSpy(sectionIds, offset = 120) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const manualLockRef = useRef(0);

  const lockActive = useCallback((id) => {
    manualLockRef.current = Date.now() + 1000;
    setActiveSection(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowBackTop(scrollY > 400);

      // If user clicked a navigation item recently, preserve the active selection during smooth scroll
      if (Date.now() < manualLockRef.current) {
        return;
      }

      // Check if user has scrolled to the bottom of the page
      const scrollBottom = window.innerHeight + scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom <= 120) {
        if (sectionIds.length > 0) {
          setActiveSection(sectionIds[sectionIds.length - 1]);
        }
        return;
      }

      // Check contact section specifically in case it's in viewport
      const lastId = sectionIds[sectionIds.length - 1];
      const lastEl = document.getElementById(lastId);
      if (lastEl) {
        const rect = lastEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.6 && rect.bottom >= 100) {
          setActiveSection(lastId);
          return;
        }
      }

      let current = sectionIds[0] || '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - offset;
          if (scrollY >= top) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return { activeSection, isScrolled, showBackTop, lockActive };
}
