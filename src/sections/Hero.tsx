import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { CompassRose } from '../components/SeaChart';
import { events2027 } from '../data/calendar';
import { aegean, northSea } from '../data/chartMap';
import { club } from '../data/club';
import { homePort, placeCoords, seasonCourse, turkiyeLeg } from '../data/places';
import { boatPose, swell, type Facing } from '../lib/boat';
import { daysUntil, formatDateRange, getEventStatuses, monthsAtPlace } from '../lib/calendar';
import { cumulativeLengths, formatLatitude, pointAlong, project } from '../lib/chart';
import { gsap } from '../hooks/motion';
import './hero.css';

const m = northSea;
const at = (name: string) => project(m, placeCoords[name].lon, placeCoords[name].lat);

/** Places named on the chart; dx/dy put the label beside the mark. */
const PLACES = [
  { name: homePort.name, note: 'Home port', p: project(m, homePort.lon, homePort.lat), dx: 24, dy: 5, end: false, home: true },
  { name: 'Bruinisse', note: `Zeeland, ${monthsAtPlace(events2027, 'Bruinisse')}`, p: at('Bruinisse'), dx: 12, dy: 2, end: false },
  { name: 'Amsterdam', note: monthsAtPlace(events2027, 'Amsterdam'), p: at('Amsterdam'), dx: -6, dy: 24, end: true },
  { name: 'Nieuwpoort', note: monthsAtPlace(events2027, 'Nieuwpoort'), p: at('Nieuwpoort'), dx: 12, dy: 14, end: false },
  { name: 'Düsseldorf', note: `Boat show, ${monthsAtPlace(events2027, 'Düsseldorf')}`, p: at('Düsseldorf'), dx: -12, dy: 5, end: true },
];

const LABELS = [
  { text: 'North Sea', lon: 3.05, lat: 52.42, water: true },
  { text: 'Belgium', lon: 4.75, lat: 50.68 },
  { text: 'Netherlands', lon: 5.55, lat: 52.08 },
  { text: 'Germany', lon: 6.55, lat: 51.62 },
  { text: 'France', lon: 2.35, lat: 50.66 },
];

const COURSE = seasonCourse.map((c) => project(m, c.lon, c.lat));
const CUM = cumulativeLengths(COURSE);
const TOTAL = CUM[CUM.length - 1];
const PASSED_AT = Object.fromEntries(seasonCourse.flatMap((c, i) => (c.place ? [[c.place, CUM[i]]] : [])));
const COURSE_D = 'M' + COURSE.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L');

const MERIDIANS = [2, 3, 4, 5, 6, 7];
const PARALLELS = [51, 51.5, 52, 52.5];

/** Computers see the whole region; phones see the coast up close. */
const VIEW_WIDE = { x: 0, y: 0, w: m.width, h: m.height };
const VIEW_NARROW = (() => {
  const a = project(m, 2.35, 52.66);
  const b = project(m, 5.25, 50.74);
  return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y };
})();

const MARMARIS = project(aegean, placeCoords['Marmaris / Hisarönü'].lon, placeCoords['Marmaris / Hisarönü'].lat);
const AEGEAN_BOAT = project(aegean, 28.3, 36.72);

function useNarrow() {
  const query = '(max-width: 760px)';
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
}

function inDays(n: number) {
  if (n === 0) return 'today';
  if (n === 1) return 'tomorrow';
  return `in ${n} days`;
}

/** Our boat, keel at 0,0, bow to the right: TISE pennant, white sails, gold hull. */
function Boat() {
  return (
    <g transform="translate(-22 -32.8)">
      <g stroke="#0b1530" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M21.4 2.6 L28.4 4.4 L21.4 6.6 Z" fill="#e30a17" />
        <path d="M20 6 C16.4 12.6 11.6 20 6.6 28.2 H20 Z" fill="#ffffff" />
        <path d="M23 8.6 V28.2 H36.6 C32.6 21.4 28 14.6 23 8.6 Z" fill="#dce7ff" />
        <path d="M2.6 30.4 H41.4 C39.6 34.4 37.2 37 33.4 37 H9.4 C6.6 37 4.4 34.6 2.6 30.4 Z" fill="#ffcc00" />
      </g>
      <rect x="20.6" y="2.2" width="1.8" height="28.4" rx=".9" fill="#0b1530" />
      <path
        d="M-4 38.6 Q0 36.8 4 38.6 T12 38.6 T20 38.6 T28 38.6 T36 38.6 T44 38.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.2"
        opacity=".8"
      />
    </g>
  );
}

/**
 * The opening screen: a sea chart of the waters the club sails. As the page scrolls, the boat leaves
 * Brussels and sails the season's course; the Türkiye inset lights up for the July flotilla.
 */
export function Hero({ today, motion }: { today: string; motion: boolean }) {
  const narrow = useNarrow();
  const view = narrow ? VIEW_NARROW : VIEW_WIDE;
  const noteGap = narrow ? 22 : 15;
  const section = useRef<HTMLElement>(null);
  const boat = useRef<SVGGElement>(null);
  const hull = useRef<SVGGElement>(null);
  const sailed = useRef<SVGPathElement>(null);
  const inset = useRef<HTMLElement>(null);

  const statuses = getEventStatuses(events2027, today);
  const now = events2027.find((e) => statuses[e.id] === 'now');
  const next = events2027.find((e) => statuses[e.id] === 'next');
  const highlight = now ?? next;

  useLayoutEffect(() => {
    const sectionEl = section.current;
    const boatEl = boat.current;
    const hullEl = hull.current;
    const sailedEl = sailed.current;
    const insetEl = inset.current;
    if (!sectionEl || !boatEl || !hullEl || !sailedEl || !insetEl) return;
    const stops = [...sectionEl.querySelectorAll<SVGGElement>('[data-place]')];
    let facing: Facing = 1;

    const place = (progress: number) => {
      const len = progress * TOTAL;
      const at = pointAlong(COURSE, CUM, len);
      // courses run every way on a chart, so the boat only faces east or west and leans a little
      const pose = boatPose(at.dx, at.dy * 0.25, facing);
      facing = pose.facing;
      const sea = swell(len * 3);
      boatEl.setAttribute('transform', `translate(${at.x.toFixed(1)} ${(at.y + sea.lift).toFixed(1)})`);
      hullEl.style.transform = `scaleX(${pose.facing}) rotate(${(sea.roll * 0.8).toFixed(2)}deg)`;
      sailedEl.setAttribute(
        'd',
        'M' + [...COURSE.slice(0, at.index), at].map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join('L'),
      );
      for (const g of stops) {
        const reached = PASSED_AT[g.dataset.place!];
        g.classList.toggle('is-passed', reached !== undefined && reached <= len + 0.5);
      }
      insetEl.classList.toggle('is-active', len > CUM[turkiyeLeg[0]] && len < CUM[turkiyeLeg[1]]);
    };

    place(0);
    if (!motion) return;
    const voyage = { progress: 0 };
    const tween = gsap.to(voyage, {
      progress: 1,
      ease: 'none',
      onUpdate: () => place(voyage.progress),
      // the whole voyage takes 0.64 screen heights of scrolling (was 1.6, sped up 2.5 times)
      scrollTrigger: { trigger: sectionEl, start: 'top top', end: '+=64%', pin: true, scrub: 0.8 },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [motion]);

  const rose = project(m, 2.55, 52.3);

  return (
    <section className="hero" id="deck" ref={section} aria-labelledby="hero-title">
      <div className="hero__stage">
        <div className="chart__scale chart__scale--left" aria-hidden="true" />
        <div className="chart__scale chart__scale--right" aria-hidden="true" />

        <svg
          className="hero__map"
          viewBox={`${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}`}
          style={{ '--map-ratio': `${view.w} / ${view.h}` } as CSSProperties}
          role="img"
          aria-label="Chart of the waters the club sails: from Brussels to Zeeland, Amsterdam and Nieuwpoort, with the boat show in Düsseldorf and a summer flotilla in Türkiye"
        >
          <g className="hero__halo">
            <path d={m.land} strokeWidth="26" />
            <path d={m.land} strokeWidth="14" />
            <path d={m.land} strokeWidth="6" />
          </g>
          <path className="hero__land" d={m.land} />
          {m.lakes && <path className="hero__lake" d={m.lakes} />}

          <g className="hero__grat" aria-hidden="true">
            {MERIDIANS.map((lon) => {
              const { x } = project(m, lon, 52);
              return (
                <g key={lon}>
                  <line x1={x} x2={x} y1={0} y2={m.height} />
                  <text x={x + 4} y={view.y + 16}>
                    {lon}°E
                  </text>
                </g>
              );
            })}
            {PARALLELS.map((lat) => {
              const { y } = project(m, 3, lat);
              return (
                <g key={lat}>
                  <line x1={0} x2={m.width} y1={y} y2={y} />
                  <text x={view.x + view.w - 6} y={y - 5} textAnchor="end">
                    {formatLatitude(lat)}
                  </text>
                </g>
              );
            })}
          </g>

          <CompassRose className="hero__rose" x={rose.x - 70} y={rose.y - 70} size={140} />

          {LABELS.map((l) => {
            const p = project(m, l.lon, l.lat);
            return (
              <text key={l.text} className={l.water ? 'hero__water' : 'hero__country'} x={p.x} y={p.y}>
                {l.text}
              </text>
            );
          })}

          <path className="hero__ahead" d={COURSE_D} />
          <path className="hero__sailed" ref={sailed} />

          {PLACES.map((pl) => (
            <g key={pl.name} className={`hero__place${pl.home ? ' hero__place--home' : ''}`} data-place={pl.name}>
              <circle cx={pl.p.x} cy={pl.p.y} r={pl.home ? 6 : 4.5} />
              <text className="hero__place-name" x={pl.p.x + pl.dx} y={pl.p.y + pl.dy} textAnchor={pl.end ? 'end' : 'start'}>
                {pl.name}
              </text>
              <text
                className="hero__place-note"
                x={pl.p.x + pl.dx}
                y={pl.p.y + pl.dy + noteGap}
                textAnchor={pl.end ? 'end' : 'start'}
              >
                {pl.note}
              </text>
            </g>
          ))}

          <g ref={boat} className="hero__boat">
            <g ref={hull} className="hero__hull">
              <Boat />
            </g>
          </g>
        </svg>

        <div className="hero__copy">
          <h1 id="hero-title">{club.name}</h1>
          <p className="hero__tag">
            {club.fullName}, sailing together from {club.city} since {club.founded}
          </p>
          <p className="hero__lede">
            Weekends on the Belgian and Dutch coast, a summer flotilla in Türkiye, and good company ashore. Beginners and
            skippers alike.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary hero__cta" href="#join">
              Sail with us
            </a>
            {highlight && (
              <a className="hero__next" href="#voyage">
                {now ? 'Happening now' : `Next ${inDays(daysUntil(highlight.start, today))}`}:{' '}
                <strong>{highlight.title}</strong>, {formatDateRange(highlight.start, highlight.end)}
              </a>
            )}
          </div>
        </div>

        <figure className="hero__inset" ref={inset}>
          <svg viewBox={`0 0 ${aegean.width} ${aegean.height}`} aria-hidden="true">
            <g className="hero__halo">
              <path d={aegean.land} strokeWidth="18" />
              <path d={aegean.land} strokeWidth="8" />
            </g>
            <path className="hero__land" d={aegean.land} />
            <g className="hero__place hero__place--far">
              <circle cx={MARMARIS.x} cy={MARMARIS.y} r={7} />
              <text className="hero__place-name hero__place-name--inset" x={MARMARIS.x + 16} y={MARMARIS.y - 8}>
                Marmaris
              </text>
            </g>
            <g transform={`translate(${AEGEAN_BOAT.x} ${AEGEAN_BOAT.y}) scale(1.4)`}>
              <Boat />
            </g>
          </svg>
          <figcaption>
            <strong>Türkiye</strong> Summer flotilla, {monthsAtPlace(events2027, 'Marmaris / Hisarönü')}
          </figcaption>
        </figure>

        <p className="hero__cue" aria-hidden="true">
          Scroll to set sail
        </p>
      </div>
    </section>
  );
}
