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

The crew list is everyone named as an organiser in the calendar, plus the people listed in
`crewMembers`, all titled Executive. List someone there to give them an office (President,
Executive Lead) or a photo, or to show a member who organises nothing this year. People with an
office come first, in list order; everyone else is in alphabetical order. `founder: true` adds
"& founder" to the title:

```ts
export const crewMembers = [
  { name: 'Serdar', fullName: 'Serdar Bilgiç', role: 'President', founder: true },
  { name: 'Özlem', fullName: 'Özlem Tatar', role: 'Executive Lead', photo: '/crew/ozlem.jpg' },
  { name: 'Özge', fullName: 'Özge Bozal' },
];
```

`name` is the first name used for organisers in the calendar; `fullName` is what the crew list shows.

Photos are shown at 4:5 (portrait); 640 × 800 px is plenty.

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
2. Add it to the repository as an Actions **secret** named `WEB3FORMS_KEY` (Settings → Secrets and
   variables → Actions → Secrets, or `gh secret set WEB3FORMS_KEY`), then re-run the deploy. The key
   never goes in the code. The receiving address is kept by Web3Forms and appears nowhere on the
   site; the key itself does end up in the published JavaScript, as with any browser form, but it
   only lets people send messages to that inbox.
3. To try the form locally, put `VITE_WEB3FORMS_KEY=<key>` in `.env.local` (git ignores it).

Without a key the form stays hidden and the section shows the Instagram button instead.

## Logo

The club logo, redrawn as vectors from the original artwork, is in `public/brand/`, on a
transparent background:

| File | Use |
| --- | --- |
| `tise-logo.svg`, `tise-logo.png` | full logo in its own colours, for light backgrounds (the site footer, on a white badge) |
| `tise-logo-white.svg`, `tise-logo-white.png` | full logo with white lettering and hull, for dark backgrounds |
| `tise-logo-compact.svg` | the boat and "TISE", without the club's name (the site menu bar, on a white badge) |
| `tise-mark.svg`, `tise-mark-white.svg` | the boat alone, without lettering (the browser-tab icon) |

The PNGs are 2000 px wide. They are traced from the club's own artwork (a clean PNG of the logo)
and keep its colours exactly: blue `#004496`, wave `#2BD1FF`, flag red `#CE4427`, star gold
`#FFCA05`. The ring on the sail has fifteen stars. "TISE" is traced from the artwork (T, I and E
squared up); the club's name is set in Copperplate Gothic Bold, the typeface of the original, and
converted to outlines, so no font is needed to show the files.

`public/og-image.png` is the picture shown when a link to the site is shared (WhatsApp, iMessage,
LinkedIn and so on): `tise-logo.svg`, unchanged, centred on white at 1200 × 630.

## Publish

The site is on GitHub Pages, at https://tisesailing.com (the domain is registered at GoDaddy; its
DNS points at GitHub Pages).

Every push to `main` runs `.github/workflows/deploy.yml`, which runs the tests, builds the site and
publishes `dist/`. Follow it under the repository's Actions tab; nothing needs installing.

The build uses relative links (`base: './'` in `vite.config.ts`), so the same files work in the
`/tise-website/` folder and on the club's own domain. To use the domain: add it under Settings →
Pages → Custom domain, point its DNS at GitHub Pages, then update `siteUrl` in `src/data/club.ts`.
