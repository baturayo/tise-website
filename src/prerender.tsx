import { StrictMode, type ReactNode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { BlogIndex } from './blog/index/BlogIndex';
import { Post } from './blog/post/Post';

/**
 * The site's pages as built: each HTML file and its content, rendered to HTML at build time
 * (scripts/prerender.mjs) so that search engines and link previews that don't run JavaScript see
 * the whole page. In the browser React then renders the page as usual.
 */
const html = (page: ReactNode) => () => renderToString(<StrictMode>{page}</StrictMode>);

export const pages: { file: string; render: () => string }[] = [
  { file: 'index.html', render: html(<App />) },
  { file: 'sailing-blogs/index.html', render: html(<BlogIndex />) },
  { file: 'sailing-blogs/gibraltar-to-las-palmas/index.html', render: html(<Post />) },
];

const EMPTY_ROOT = '<div id="root"></div>';

/** Puts a page's rendered content into its empty root element. */
export function injectRoot(page: string, markup: string): string {
  const at = page.indexOf(EMPTY_ROOT);
  if (at < 0 || page.indexOf(EMPTY_ROOT, at + 1) >= 0) throw new Error(`expected exactly one ${EMPTY_ROOT}`);
  return `${page.slice(0, at)}<div id="root">${markup}</div>${page.slice(at + EMPTY_ROOT.length)}`;
}
