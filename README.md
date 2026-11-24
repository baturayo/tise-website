# TISE Sailing Club website

One-page static site built as a sea chart: it opens on a chart of the waters the club sails, where a
boat leaves Brussels and sails the season's course as you scroll. Below deck, at the chart table,
are who we are, the crew and the founders; then the 2027 plan as a voyage, with a header linking
every section. Built with Vite, React, TypeScript and GSAP.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # calendar, calendar-feed, crew and chart tests
npm run build    # static site in dist/
```

Add `?reduced-motion` to the URL to preview the calm version people get when their phone
asks for less motion.

## Edit the content

| What | Where |
|---|---|
| Activities (website **and** the subscribable calendar) | `src/data/calendar.ts` |
| Club facts, Instagram, founders | `src/data/club.ts` |
| Crew, roles and photos | `crewMembers` in `src/data/club.ts`; put photos in `public/crew/` |
| Waypoint positions on the 2027 chart | `src/data/places.ts` (one per `place` in the calendar) |
| Site address (domain) | `siteUrl` in `src/data/club.ts` |

The crew shown inside the boat is everyone named as an organiser in the calendar, plus the
people listed in `crewMembers`, all titled Organizer. List someone there to give them another
title (President) or a photo, or to show a member who organises nothing this year. People with
a title come first, in list order; everyone else is in alphabetical order:

```ts
export const crewMembers = [
  { name: 'Özlem', fullName: 'Özlem Tatar', role: 'President' },
  { name: 'Serdar', fullName: 'Serdar Bilgiç', photo: '/crew/serdar.jpg' },
  { name: 'Özge', fullName: 'Özge Bozal' },
];
```

`name` is the first name used for organisers in the calendar; `fullName` is what the crew list shows.

Above each photo the person's first name is spelled in International Code of Signals flags
(`src/components/SignalFlag.tsx`, letters from `src/lib/signal.ts`). Turkish letters fly as their
plain flag (Ö as O, Ç as C, Ğ as G, Ş as S, Ü as U, ı and İ as I). Photos are square; 480 px is plenty.

## Photos and the chart

The photos and the Bosphorus chart in `public/photos/` come from Wikimedia Commons; their credits
are shown in the footer (`src/data/credits.ts`) and must stay there. To swap one, replace the
file(s) keeping the names and sizes, and update its credit.

The coastlines of the opening chart are generated from Natural Earth (public domain) into
`src/data/chartMap.ts` by `scripts/build-chart-map.py`; the steps are at the top of that script.
The places, the season's course drawn on the chart and the home port are in `src/data/places.ts`.

## Calendar subscription

`npm run build` writes `dist/calendar.ics` from `src/data/calendar.ts`. People subscribe from
the "Follow the plan in your calendar" buttons (iPhone & Mac, Google Calendar, Outlook, or a
plain download). Calendar apps re-check the feed every few hours, so after you change an
activity and redeploy, subscribers see the change without doing anything.

## Contact form

The form in "Come and sail with us" sends messages by email through Web3Forms (free, 250 messages a
month). Messages go to the inbox the access key was made for; that address never appears on the site.

1. Get a key at https://web3forms.com: enter the inbox that should receive the messages, and the key
   arrives by email.
2. Add it to the repository as an Actions **variable** named `WEB3FORMS_KEY` (Settings → Secrets and
   variables → Actions → Variables), then re-run the deploy. Web3Forms says the key may be public.
3. To try the form locally, put `VITE_WEB3FORMS_KEY=<key>` in `.env.local` (git ignores it).

Without a key the form stays hidden and the section shows the Instagram button instead.

## Publish

The site is on GitHub Pages: https://baturayo.github.io/tise-website/

Every push to `main` runs `.github/workflows/deploy.yml`, which runs the tests, builds the site and
publishes `dist/`. Follow it under the repository's Actions tab; nothing needs installing.

The build uses relative links (`base: './'` in `vite.config.ts`), so the same files work in the
`/tise-website/` folder and on the club's own domain. To use the domain: add it under Settings →
Pages → Custom domain, point its DNS at GitHub Pages, then update `siteUrl` in `src/data/club.ts`.
