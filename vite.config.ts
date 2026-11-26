import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { posts } from './src/blog/data/posts';
import { events2027 } from './src/data/calendar';
import { club } from './src/data/club';
import { buildICS } from './src/lib/ics';
import { GOATCOUNTER_CODE, withAnalytics } from './src/lib/analytics';
import { buildSitemap, sitePages } from './src/lib/sitemap';

/** Generates the subscribable calendar feed (/calendar.ics) from src/data/calendar.ts. */
function calendarFeed(): Plugin {
  const render = () =>
    buildICS(events2027, {
      calName: club.name,
      domain: new URL(club.siteUrl).host,
      stamp: new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
    });
  return {
    name: 'tise-calendar-feed',
    configureServer(server) {
      server.middlewares.use('/calendar.ics', (_req, res) => {
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.end(render());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'calendar.ics', source: render() });
    },
  };
}

/** Generates /sitemap.xml for search engines: the club site, the blog and every post in src/blog/data/posts.ts. */
function sitemap(): Plugin {
  const render = () => buildSitemap(sitePages(club.siteUrl, posts));
  return {
    name: 'tise-sitemap',
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.end(render());
      });
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: render() });
    },
  };
}

/** Adds the visitor counter (src/lib/analytics.ts) to every page of the built site; not in development. */
function analytics(): Plugin {
  return { name: 'tise-analytics', apply: 'build', transformIndexHtml: (html) => withAnalytics(html, GOATCOUNTER_CODE) };
}

/** The pages of the site: the club's one-page site, and the sailing blog (an index and its posts). */
const page = (path: string) => decodeURIComponent(new URL(path, import.meta.url).pathname);

export default defineConfig({
  // relative links, so the same build works on GitHub Pages (/tise-website/) and on the club's own domain
  base: './',
  plugins: [react(), calendarFeed(), sitemap(), analytics()],
  build: {
    rolldownOptions: {
      input: {
        main: page('./index.html'),
        blog: page('./sailing-blogs/index.html'),
        atlantic: page('./sailing-blogs/gibraltar-to-las-palmas/index.html'),
      },
    },
  },
});
