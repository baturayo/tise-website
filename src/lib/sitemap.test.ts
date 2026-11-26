import { describe, expect, it } from 'vitest';
import type { BlogPost } from '../blog/data/posts';
import { buildSitemap, sitePages } from './sitemap';

const post = (slug: string, date: string, published: string): BlogPost => ({
  slug,
  title: slug,
  date,
  when: date,
  published,
  author: 'A sailor',
  summary: '',
});

describe('sitePages', () => {
  it('lists the club site, the blog and every post, newest first, as full URLs', () => {
    const list = sitePages('https://tisesailing.com', [post('gibraltar', '2026-11-05', '2026-11-26'), post('regatta', '2027-04-10', '2027-04-20')]);
    expect(list.map((p) => p.loc)).toEqual([
      'https://tisesailing.com/',
      'https://tisesailing.com/sailing-blogs/',
      'https://tisesailing.com/sailing-blogs/regatta/',
      'https://tisesailing.com/sailing-blogs/gibraltar/',
    ]);
  });

  it('dates each post by when it was published, and the blog by its newest post', () => {
    const list = sitePages('https://tisesailing.com/', [post('gibraltar', '2026-11-05', '2026-11-26'), post('regatta', '2027-04-10', '2027-04-20')]);
    expect(list.map((p) => p.lastmod)).toEqual([undefined, '2027-04-20', '2027-04-20', '2026-11-26']);
  });

  it('still lists the club site and the blog when there are no posts', () => {
    expect(sitePages('https://tisesailing.com', []).map((p) => p.loc)).toEqual(['https://tisesailing.com/', 'https://tisesailing.com/sailing-blogs/']);
  });
});

describe('buildSitemap', () => {
  it('writes a sitemap search engines can read', () => {
    const xml = buildSitemap([{ loc: 'https://tisesailing.com/' }, { loc: 'https://tisesailing.com/sailing-blogs/a/', lastmod: '2026-11-26' }]);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')).toBe(true);
    expect(xml).toContain('<url><loc>https://tisesailing.com/</loc></url>');
    expect(xml).toContain('<url><loc>https://tisesailing.com/sailing-blogs/a/</loc><lastmod>2026-11-26</lastmod></url>');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('escapes characters that would break the XML', () => {
    expect(buildSitemap([{ loc: 'https://tisesailing.com/?a=1&b=2' }])).toContain('<loc>https://tisesailing.com/?a=1&amp;b=2</loc>');
  });
});
