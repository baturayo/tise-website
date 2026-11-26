import { describe, expect, it } from 'vitest';
import { posts } from './blog/data/posts';
import { injectRoot, pages } from './prerender';

describe('the pages, rendered at build time', () => {
  it('render without a browser, with their content in the HTML', () => {
    const headline: Record<string, string> = {
      'index.html': 'TISE',
      'sailing-blogs/index.html': 'Gibraltar to Las Palmas',
      'sailing-blogs/gibraltar-to-las-palmas/index.html': 'Day by day',
    };
    for (const page of pages) {
      const html = page.render();
      expect(html, page.file).toContain(headline[page.file]);
      expect(html.length, page.file).toBeGreaterThan(5000);
    }
  });

  it('include every post on the blog', () => {
    for (const p of posts) expect(pages.map((page) => page.file)).toContain(`sailing-blogs/${p.slug}/index.html`);
  });
});

describe('injectRoot', () => {
  it('puts the rendered content into the empty root', () => {
    expect(injectRoot('<body><div id="root"></div></body>', '<h1>Hi</h1>')).toBe('<body><div id="root"><h1>Hi</h1></div></body>');
  });

  it('refuses a page without exactly one empty root', () => {
    expect(() => injectRoot('<body></body>', 'x')).toThrow();
    expect(() => injectRoot('<div id="root"></div><div id="root"></div>', 'x')).toThrow();
  });
});
