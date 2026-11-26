import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { posts } from './blog/data/posts';
import { club } from './data/club';

const read = (path: string) => new TextDecoder().decode(readFileSync(new URL(`../${path}`, import.meta.url)));
const site = club.siteUrl.replace(/\/$/, '');

/** Each page's HTML file, and the address it should be known by. */
const pages = [
  { file: 'index.html', url: `${site}/` },
  { file: 'sailing-blogs/index.html', url: `${site}/sailing-blogs/` },
  ...posts.map((p) => ({ file: `sailing-blogs/${p.slug}/index.html`, url: `${site}/sailing-blogs/${p.slug}/` })),
];

const meta = (html: string, attr: 'name' | 'property', key: string) =>
  html.match(new RegExp(`<meta\\s+${attr}="${key}"\\s+content="([^"]*)"`))?.[1];
const jsonLd = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

describe('every page', () => {
  for (const { file, url } of pages) {
    describe(file, () => {
      const html = read(file);

      it('can be indexed', () => {
        expect(html).not.toMatch(/noindex/i);
      });

      it('names its canonical address, and shares it in link previews', () => {
        expect(html).toContain(`<link rel="canonical" href="${url}" />`);
        expect(meta(html, 'property', 'og:url')).toBe(url);
      });

      it('has a title, a description and a preview image', () => {
        expect(html).toMatch(/<title>[^<]{10,70}<\/title>/);
        const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? '';
        expect(description.length).toBeGreaterThan(50);
        expect(meta(html, 'property', 'og:image')).toMatch(new RegExp(`^${site}/`));
      });

      it('describes itself to search engines in valid structured data', () => {
        expect(jsonLd(html).length).toBeGreaterThan(0);
      });
    });
  }
});

describe('each blog post', () => {
  for (const p of posts) {
    it(`${p.slug} is described as the blog post it is`, () => {
      const html = read(`sailing-blogs/${p.slug}/index.html`);
      const article = jsonLd(html).find((d) => d['@type'] === 'BlogPosting');
      expect(article).toMatchObject({
        headline: p.title,
        datePublished: p.published,
        author: { '@type': 'Person', name: p.author },
        mainEntityOfPage: `${site}/sailing-blogs/${p.slug}/`,
      });
      expect(meta(html, 'property', 'article:published_time')).toBe(p.published);
    });
  }
});

describe('the blog index', () => {
  it('lists every post in its structured data', () => {
    const blog = jsonLd(read('sailing-blogs/index.html')).find((d) => d['@type'] === 'Blog');
    expect(blog.blogPost.map((b: { url: string }) => b.url).sort()).toEqual(posts.map((p) => `${site}/sailing-blogs/${p.slug}/`).sort());
  });
});

describe('robots.txt', () => {
  it('lets search engines in and points them to the sitemap', () => {
    const robots = read('public/robots.txt');
    expect(robots).toMatch(/User-agent: \*\s+Allow: \//);
    expect(robots).toContain(`Sitemap: ${site}/sitemap.xml`);
  });
});
