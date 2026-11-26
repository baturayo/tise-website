import type { BlogPost } from '../blog/data/posts';
import { newestFirst } from '../blog/lib/posts';

export interface SitePage {
  /** the page's full address */
  loc: string;
  /** when it last changed (ISO date), if we know */
  lastmod?: string;
}

/** Every page of the site, for the sitemap: the club site, the blog, and each post, newest first. */
export function sitePages(siteUrl: string, posts: BlogPost[]): SitePage[] {
  const root = siteUrl.replace(/\/$/, '');
  const list = newestFirst(posts);
  const latest = list.map((p) => p.published).sort().at(-1);
  return [
    { loc: `${root}/` },
    { loc: `${root}/sailing-blogs/`, lastmod: latest },
    ...list.map((p) => ({ loc: `${root}/sailing-blogs/${p.slug}/`, lastmod: p.published })),
  ];
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The sitemap (sitemaps.org) that tells search engines which pages there are. */
export function buildSitemap(pages: SitePage[]): string {
  const urls = pages.map((p) => `  <url><loc>${escape(p.loc)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`);
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, '</urlset>', ''].join('\n');
}
