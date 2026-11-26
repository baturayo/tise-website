import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { events2027 } from './src/data/calendar';
import { club } from './src/data/club';
import { buildICS } from './src/lib/ics';

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

/** The pages of the site: the club's one-page site, and the sailing blog (an index and its posts). */
const page = (path: string) => decodeURIComponent(new URL(path, import.meta.url).pathname);

export default defineConfig({
  // relative links, so the same build works on GitHub Pages (/tise-website/) and on the club's own domain
  base: './',
  plugins: [react(), calendarFeed()],
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
