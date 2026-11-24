import { useLayoutEffect, useRef } from 'react';
import { EventCard, kindLabels } from '../components/EventCard';
import { SeaChart } from '../components/SeaChart';
import { SubscribeBar } from '../components/SubscribeBar';
import { calendarYear, countryNames, events2027, type EventKind } from '../data/calendar';
import { daysUntil, getEventStatuses, parseISODate } from '../lib/calendar';
import { boatPose, swell, wakeStrength, waterShift, type Facing } from '../lib/boat';
import { gsap } from '../hooks/motion';
import './voyage.css';

const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Sea colour for each month of the year: winter indigo, spring teal, summer ocean, autumn rust. */
const SEASON: Record<number, string> = {
  1: '#13233f',
  2: '#152a47',
  3: '#123342',
  4: '#113a43',
  5: '#123d40',
  6: '#103a4c',
  7: '#0f3b52',
  8: '#11364c',
  9: '#2b2a3a',
  10: '#30263a',
  11: '#1c2240',
  12: '#161d38',
};

function seasonGradient(): string {
  const n = events2027.length;
  const stops = events2027.map((e, i) => {
    const { y, m } = parseISODate(e.start);
    const colour = y < calendarYear ? '#11203a' : SEASON[m];
    return `${colour} ${(18 + (76 * i) / (n - 1)).toFixed(1)}%`;
  });
  return `linear-gradient(180deg, #0e1b2c 0%, #11203a 10%, ${stops.join(', ')}, #161d38 100%)`;
}

/** The foam spreading out behind the stern while the boat is moving. */
function SternWake() {
  return (
    <svg viewBox="0 0 32 12" aria-hidden="true">
      <path
        d="M32 5 Q20 4 2 1.2 M32 7 Q20 8 2 10.8 M24 6 H14 M10 6 H6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The anchor where the season's route ends. */
function Anchor() {
  return (
    <svg viewBox="0 0 32 40" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="4.6" r="3" />
        <path d="M16 7.6 V36 M9.5 13 H22.5" />
        <path d="M4.2 25.4 C5 32.2 10 36 16 36 C22 36 27 32.2 27.8 25.4" />
        <path d="M1.6 28.2 L4.2 24.6 L7.6 27 M24.4 27 L27.8 24.6 L30.4 28.2" />
      </g>
    </svg>
  );
}

/** Our boat on the chart, seen from the side with the bow to the right: TISE pennant, white sails, gold hull. */
function Sailboat() {
  return (
    <svg viewBox="0 0 44 40" aria-hidden="true">
      <g stroke="#0b1530" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M21.4 2.6 L28.4 4.4 L21.4 6.6 Z" fill="#e30a17" />
        <path d="M20 6 C16.4 12.6 11.6 20 6.6 28.2 H20 Z" fill="#ffffff" />
        <path d="M23 8.6 V28.2 H36.6 C32.6 21.4 28 14.6 23 8.6 Z" fill="#dce7ff" />
        <path d="M2.6 30.4 H41.4 C39.6 34.4 37.2 37 33.4 37 H9.4 C6.6 37 4.4 34.6 2.6 30.4 Z" fill="#ffcc00" />
      </g>
      <rect x="20.6" y="2.2" width="1.8" height="28.4" rx=".9" fill="#0b1530" />
      {/* bow wave */}
      <path
        d="M39.6 36.6 Q42 35.6 43.6 33.2 M44.8 35.6 Q46.4 34.8 47.4 32.8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity=".9"
      />
    </svg>
  );
}

export function Voyage({ today, motion }: { today: string; motion: boolean }) {
  const statuses = getEventStatuses(events2027, today);
  const route = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const wake = useRef<SVGPathElement>(null);
  const ahead = useRef<SVGPathElement>(null);
  const boat = useRef<HTMLDivElement>(null);
  const hull = useRef<HTMLDivElement>(null);
  const rock = useRef<HTMLDivElement>(null);
  const water = useRef<HTMLSpanElement>(null);
  const stern = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);

  // Draw the route through every buoy, then sail the boat along it with the scroll.
  useLayoutEffect(() => {
    const routeEl = route.current;
    const svgEl = svg.current;
    const wakeEl = wake.current;
    const aheadEl = ahead.current;
    const boatEl = boat.current;
    const hullEl = hull.current;
    const anchorEl = anchor.current;
    const rockEl = rock.current;
    const waterEl = water.current;
    const sternEl = stern.current;
    if (!routeEl || !svgEl || !wakeEl || !aheadEl || !boatEl || !hullEl || !anchorEl || !rockEl || !waterEl || !sternEl)
      return;

    let total = 0;
    let height = 0;
    let progress = 0;
    let facing: Facing = 1;
    let lastLen: number | undefined;
    let calm = 0;

    const build = () => {
      const rb = routeEl.getBoundingClientRect();
      const pts = [...routeEl.querySelectorAll<HTMLElement>('.stop__buoy')].map((b) => {
        const r = b.getBoundingClientRect();
        return { x: r.left + r.width / 2 - rb.left, y: r.top + r.height / 2 - rb.top };
      });
      if (!pts.length) return;
      const width = routeEl.clientWidth;
      height = routeEl.clientHeight;
      svgEl.setAttribute('viewBox', `0 0 ${width} ${height}`);
      const all = [{ x: pts[0].x, y: 0 }, ...pts, { x: pts[pts.length - 1].x, y: height }];
      let d = `M${all[0].x},${all[0].y}`;
      for (let i = 1; i < all.length; i++) {
        const a = all[i - 1];
        const b = all[i];
        const my = (b.y - a.y) / 2;
        d += ` C${a.x},${a.y + my} ${b.x},${b.y - my} ${b.x},${b.y}`;
      }
      wakeEl.setAttribute('d', d);
      aheadEl.setAttribute('d', d);
      total = wakeEl.getTotalLength();
      anchorEl.style.transform = `translate(${pts[pts.length - 1].x}px, ${height}px) translate(-50%, 0)`;
      wakeEl.style.strokeDasharray = `${total}`;
    };

    // point on the route at a given height (the route only ever moves downwards)
    const lengthAtY = (y: number) => {
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        if (wakeEl.getPointAtLength(mid).y < y) lo = mid;
        else hi = mid;
      }
      return lo;
    };

    const place = (p: number) => {
      progress = p;
      if (!total) return;
      const len = lengthAtY(p * height);
      const pt = wakeEl.getPointAtLength(len);
      const ahead = wakeEl.getPointAtLength(Math.min(total, len + 12));
      const pose = boatPose(ahead.x - pt.x, ahead.y - pt.y, facing);
      const sea = swell(len);
      facing = pose.facing;
      // the keel sits on the route; the boat turns to face where it is going, tacking at each mark
      boatEl.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -82%)`;
      hullEl.style.transform = `scaleX(${pose.facing})`;
      // inside the turned boat: it rocks over the swell while the water slides back past the hull
      rockEl.style.transform = `translateY(${sea.lift}px) rotate(${pose.heel * pose.facing + sea.roll}deg)`;
      // at half speed, so one frame never slides close to a whole wave (which would look like it runs backwards)
      waterEl.style.transform = `translateX(${waterShift(len * 0.45, 16)}px)`;
      // a wake while it is sailing, fading out once the scrolling stops (none on the first placing)
      if (motion && lastLen !== undefined) {
        sternEl.style.opacity = String(wakeStrength(len - lastLen));
        window.clearTimeout(calm);
        calm = window.setTimeout(() => (sternEl.style.opacity = '0'), 160);
      }
      lastLen = len;
      wakeEl.style.strokeDashoffset = `${total - len}`;
    };

    // Without scroll animation the boat waits at the next activity.
    const restingProgress = () => {
      const nextBuoy = routeEl.querySelector<HTMLElement>('.stop--next .stop__buoy, .stop--now .stop__buoy');
      if (!nextBuoy || !height) return 1;
      const rb = routeEl.getBoundingClientRect();
      const r = nextBuoy.getBoundingClientRect();
      return (r.top + r.height / 2 - rb.top) / height;
    };

    build();
    let tween: ReturnType<typeof gsap.to> | undefined;
    if (motion) {
      // the boat glides after the scroll and catches up, rather than being glued to it
      const voyage = { p: 0 };
      tween = gsap.to(voyage, {
        p: 1,
        ease: 'none',
        onUpdate: () => place(voyage.p),
        scrollTrigger: {
          trigger: routeEl,
          start: 'top 55%',
          end: 'bottom 55%',
          scrub: 0.9,
          onRefresh: () => {
            build();
            place(voyage.p);
          },
        },
      });
      place(voyage.p);
    } else {
      place(restingProgress());
    }

    const ro = new ResizeObserver(() => {
      build();
      place(motion ? progress : restingProgress());
    });
    ro.observe(routeEl);
    return () => {
      ro.disconnect();
      window.clearTimeout(calm);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [motion, today]);

  const countries = [...new Set(events2027.map((e) => countryNames[e.country]))];
  const kinds = [...new Set(events2027.map((e) => e.kind))] as EventKind[];

  return (
    <section
      className="voyage"
      id="voyage"
      aria-labelledby="voyage-title"
      style={{ backgroundImage: seasonGradient() }}
    >
      <SeaChart motion={motion} />
      <header className="voyage__head wrap">
        <div className="voyage__intro">
          <h2 id="voyage-title">The {calendarYear} voyage</h2>
          <p>
            {events2027.length} activities across {countries.length} countries, from a classroom introduction to sailing
            to a week-long summer flotilla in Türkiye.
          </p>
          <ul className="legend" aria-label="Kinds of activity">
            {kinds.map((k) => (
              <li key={k}>
                <span className={`stop__buoy stop__buoy--${k} legend__buoy`} aria-hidden="true" />
                {kindLabels[k]}
              </li>
            ))}
          </ul>
        </div>
        <SubscribeBar />
      </header>

      <div className="route" ref={route}>
        <svg className="route__svg" ref={svg} aria-hidden="true" preserveAspectRatio="none">
          <path className="route__ahead" ref={ahead} />
          <path className="route__wake" ref={wake} />
        </svg>
        <div className="route__anchor" ref={anchor} aria-hidden="true">
          <Anchor />
        </div>
        <div className="route__boat" ref={boat} aria-hidden="true">
          <div className="route__hull" ref={hull}>
            <div className="route__stern-wake" ref={stern}>
              <SternWake />
            </div>
            <div className="route__water">
              <span ref={water} />
            </div>
            <div className="route__rock" ref={rock}>
              <Sailboat />
            </div>
          </div>
        </div>
        <ol className="route__stops">
          {events2027.map((ev, i) => {
            const { y, m } = parseISODate(ev.start);
            const prev = events2027[i - 1];
            const newMonth = !prev || parseISODate(prev.start).m !== m;
            const showYear = i === 0 || m === 1;
            return (
              <EventCard
                key={ev.id}
                event={ev}
                status={statuses[ev.id]}
                daysAway={daysUntil(ev.start, today)}
                side={i % 2 === 0 ? 'left' : 'right'}
                monthLabel={newMonth ? `${MONTHS_LONG[m - 1]}${showYear ? ` ${y}` : ''}` : undefined}
              />
            );
          })}
        </ol>
      </div>
    </section>
  );
}
