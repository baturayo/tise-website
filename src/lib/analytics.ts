/**
 * Visitor counts with GoatCounter (https://www.goatcounter.com): no cookies and no personal data, so no
 * consent banner. The dashboard is at https://<code>.goatcounter.com. The counter goes into the built
 * pages only (vite.config.ts), so visits during development aren't counted.
 */
export const GOATCOUNTER_CODE = 'tisesailing';

interface GoatCounter {
  count(vars: { path: string; title?: string; event?: boolean }): void;
}

declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

/** The script tag that counts a page view. */
export function goatCounterTag(code: string): string {
  return `<script data-goatcounter="https://${code}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`;
}

/** Puts the counter at the end of a page's head. */
export function withAnalytics(html: string, code: string): string {
  const at = html.indexOf('</head>');
  if (at < 0) throw new Error('expected a </head> to put the counter in');
  return `${html.slice(0, at)}  ${goatCounterTag(code)}\n  ${html.slice(at)}`;
}

/**
 * Counts an event rather than a page view, such as a reader reaching the end of a post. Does nothing where
 * the counter isn't loaded: in development, or when a blocker stops it.
 */
export function countEvent(path: string, title: string, w: { goatcounter?: GoatCounter } = window): void {
  w.goatcounter?.count({ path, title, event: true });
}
