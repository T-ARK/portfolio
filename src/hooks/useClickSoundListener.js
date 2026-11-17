import { useEffect } from 'react';
import { playClickSound } from '../utils/sound';

export function useClickSoundListener() {
  useEffect(() => {
    const handleGlobalClick = (e) => {
      // Matches buttons, navigation links, tags, and interactive cards
      const interactive = e.target.closest(
        'button, a, input[type="submit"], input[type="button"], [role="button"], .chip, .line-sidebar__item, .project-link, .form-submit-btn, .back-top, .nav-toggle, .btn-primary, .btn-outline'
      );
      if (interactive) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, []);
}
