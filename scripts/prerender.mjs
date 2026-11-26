// After `vite build`: fills each built page's empty root with the page rendered to HTML
// (src/prerender.tsx), so search engines and link previews that don't run JavaScript see the
// whole page. In the browser React renders the page as before.
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
  logLevel: 'error',
  // the build's relative base (vite.config.ts); the dev server would otherwise use '/'
  define: { 'import.meta.env.BASE_URL': JSON.stringify('./') },
});
try {
  const { pages, injectRoot } = await vite.ssrLoadModule('/src/prerender.tsx');
  for (const page of pages) {
    const file = new URL(`../dist/${page.file}`, import.meta.url);
    await writeFile(file, injectRoot(await readFile(file, 'utf8'), page.render()));
    console.log(`prerendered dist/${page.file}`);
  }
} finally {
  await vite.close();
}
