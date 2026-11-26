import { useEffect, type RefObject } from 'react';
import { countEvent } from '../lib/analytics';

/** Counts an event the first time the element comes into view, such as the end of a blog post. */
export function useCountWhenSeen(ref: RefObject<Element | null>, path: string, title: string): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        countEvent(path, title);
        seen.disconnect();
      }
    });
    seen.observe(el);
    return () => seen.disconnect();
  }, [ref, path, title]);
}
