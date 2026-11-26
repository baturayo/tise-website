import { useLayoutEffect, type ReactNode } from 'react';

/**
 * Shows the page once React has rendered it. Each page's HTML comes with its content rendered at
 * build time, hidden by the `js-pending` class in its head so that it doesn't flash before the app
 * takes over (see scripts/prerender.mjs).
 */
export function Revealed({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    document.documentElement.classList.remove('js-pending');
  }, []);
  return children;
}
