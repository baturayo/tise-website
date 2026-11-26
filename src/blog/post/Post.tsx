import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger, useReducedMotion } from '../../hooks/motion';
import { formatCoords } from '../../lib/geo';
import { Barograph } from '../components/Barograph';
import { BlogFooter, BlogHeader } from '../components/BlogChrome';
import { ChartDefs, PassageChart, boxAround, fullChart, projectLatLon, type ChartControls, type ChartNote } from '../components/PassageChart';
import { SailWardrobe } from '../components/SailWardrobe';
import { WatchDial } from '../components/WatchDial';
import { logbook, type LogEntry } from '../data/logbook';
import { bosunsList, callTheSkipper, days, ports, type Day, type Kind } from '../data/passage';
import { buildTrack, dayNumber, nauticalMiles, positionAt, timeline, trackLength, utcMs } from '../lib/passage';

const ROOT = '../../';

const byN = new Map(logbook.map((e) => [e.n, e]));

/** Navigator's notes pencilled on the chart, at the logged positions. */
const NOTES: ChartNote[] = [
  { n: 2, text: 'Whale, 18:06' },
  { n: 28, text: 'Dolphins in the phosphorescence' },
  { n: 39, text: 'Jib halyard gone, 22:14' },
  { n: 42, text: 'Eight dolphins, three young' },
  { n: 57, text: 'Trysail, 1009 hPa' },
  { n: 62, text: 'All reefs out, 7.6 kn' },
].map(({ n, text }) => ({ lat: byN.get(n)!.lat!, lon: byN.get(n)!.lon!, text }));

const KIND_LABEL: Record<Kind, string> = {
  wildlife: 'Wildlife',
  gear: 'Gear',
  galley: 'Galley',
  harbour: 'Harbour',
  sailing: 'Sailing',
};

/** The ship's day as a window of UTC time: ship's time was CET until 7 November, UTC after. */
function dayWindow(date: string): [number, number] {
  const d = Number(date.slice(8));
  const start = Date.UTC(2026, 10, d, d <= 7 ? -1 : 0);
  const end = Date.UTC(2026, 10, d + 1, d + 1 <= 7 ? -1 : 0);
  return [start, end];
}

const long = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' });

function LogExtract({ rows }: { rows: LogEntry[] }) {
  return (
    <table className="extract">
      <caption className="visually-hidden">From the log</caption>
      <thead>
        <tr>
          <th scope="col">Time</th>
          <th scope="col">Position</th>
          <th scope="col">Course</th>
          <th scope="col">Speed</th>
          <th scope="col">Bar.</th>
          <th scope="col">Remarks</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((e) => (
          <tr key={e.n}>
            <td>{e.time ?? '–'}</td>
            <td>{e.lat !== undefined ? formatCoords({ lat: e.lat, lon: e.lon! }) : '–'}</td>
            <td>{e.cog !== undefined ? `${String(e.cog).padStart(3, '0')}°` : '–'}</td>
            <td>{e.sog !== undefined ? `${e.sog.toFixed(1)} kn` : '–'}</td>
            <td>{e.baro ?? '–'}</td>
            <td>{e.remark ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface DayFacts {
  miles: number;
  /** first, last and lowest reading of the day */
  baro: [number, number, number] | null;
  wind: string[];
}

function DayArticle({ day, facts }: { day: Day; facts: DayFacts }) {
  const n = dayNumber(day.date);
  return (
    <article className="day" data-date={day.date} aria-labelledby={`day-${n}`}>
      <header className="day__head">
        <p className="day__when">
          <span className="day__n">Day {n}</span> {day.weekday} {long(day.date)}
        </p>
        <h3 id={`day-${n}`} className="day__title">
          {day.title}
        </h3>
        {facts.miles > 0 && (
          <p className="day__facts">
            <span>{Math.round(facts.miles)} miles</span>
            {facts.baro && (
              <span>
                Barometer {facts.baro[0]}
                {facts.baro[1] !== facts.baro[0] ? ` → ${facts.baro[1]}` : ''} hPa
                {facts.baro[2] < Math.min(facts.baro[0], facts.baro[1]) ? `, low ${facts.baro[2]}` : ''}
              </span>
            )}
            {facts.wind.length > 0 && <span>Wind {facts.wind.join(', ')}</span>}
          </p>
        )}
      </header>
      {day.story.map((p, i) => (
        <p key={i} className="day__p">
          {p}
        </p>
      ))}
      <ul className="day__events">
        {day.events.map((ev, i) => (
          <li key={i} className={`day__event day__event--${ev.kind}`}>
            <span className="day__kind">{KIND_LABEL[ev.kind]}</span>
            {ev.time && <time className="day__time">{ev.time}</time>}
            <span>{ev.text}</span>
          </li>
        ))}
      </ul>
      {day.extract && <LogExtract rows={day.extract.map((k) => byN.get(k)!)} />}
    </article>
  );
}

export function Post() {
  const still = useReducedMotion();
  const track = useMemo(() => buildTrack(logbook, ports), []);
  const times = useMemo(() => timeline(track), [track]);
  const length = useMemo(() => trackLength(track), [track]);
  const follow = useRef<ChartControls>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const [fix, setFix] = useState<LogEntry | null>(null);

  const departure = ports[0].leave!;
  const last = times[times.length - 1].t;
  const fixes = track.filter((p) => p.kind === 'fix').length;

  // per day: its window of time, the frame on the chart, and the numbers from the log
  const plan = useMemo(
    () =>
      days.map((day) => {
        const [a, b] = dayWindow(day.date);
        const t0 = Math.min(Math.max(a, departure), last);
        const t1 = Math.max(Math.min(b, last), t0);
        const inside = times.filter((p) => p.t >= t0 && p.t <= t1);
        const ends = [positionAt(times, t0), positionAt(times, t1)];
        const extra = day.date === '2026-11-04' ? [{ lat: 35.78, lon: -6.0 }] : day.date === '2026-11-13' ? [ports[3]] : [];
        const box = boxAround([...inside, ...ends, ...extra].map((p) => projectLatLon(p.lat, p.lon)), 0.3, 150);
        const pts = [ends[0], ...inside, ends[1]];
        let miles = 0;
        for (let i = 1; i < pts.length; i++) miles += nauticalMiles(pts[i - 1], pts[i]);
        const entries = logbook.filter((e) => {
          const t = utcMs(e);
          return t !== null && t >= a && t < b;
        });
        const baros = entries.filter((e) => e.baro && e.baro !== 1030).map((e) => e.baro!);
        const wind = [...new Set(entries.map((e) => e.wind).filter(Boolean) as string[])];
        return { day, t0, t1, box, facts: { miles, baro: baros.length ? ([baros[0], baros[baros.length - 1], Math.min(...baros)] as [number, number, number]) : null, wind } };
      }),
    [departure, last, times],
  );

  useLayoutEffect(() => {
    const root = daysRef.current;
    const chart = follow.current;
    if (!root || !chart) return;
    chart.setView(plan[0].box, true);
    chart.setTime(departure);
    const articles = [...root.querySelectorAll<HTMLElement>('.day')];
    // the day being read frames the chart; scrolling through it sails the boat through that day
    let active = 0;
    const frame = (i: number) => {
      if (i === active) return;
      active = i;
      chart.setView(plan[i].box);
    };
    const triggers = articles.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => self.isActive && frame(i),
        onUpdate: (self) => {
          frame(i);
          chart.setTime(plan[i].t0 + self.progress * (plan[i].t1 - plan[i].t0));
        },
      }),
    );
    // measure again once the fonts are in, and whenever the page changes height
    let pending = 0;
    const refresh = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    document.fonts?.ready.then(refresh);
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(pending);
      triggers.forEach((t) => t.kill());
    };
  }, [plan, departure]);

  const miles = Math.round(length.total / 10) * 10;

  return (
    <>
      <ChartDefs />
      <BlogHeader root={ROOT} />
      <main id="main" className="post">
        <section className="hero" aria-labelledby="post-title">
          <PassageChart
            className="hero__chart"
            track={track}
            times={times}
            view={fullChart}
            drawIn
            still={still}
            label="Chart of the passage from Gibraltar along the coast of Morocco to Gran Canaria, with every position from the log."
          />
          <div className="cartouche">
            <p className="cartouche__kicker">TISE sailing blog</p>
            <h1 id="post-title" className="cartouche__title">
              Gibraltar to Las&nbsp;Palmas
            </h1>
            <p className="cartouche__sub">Nine days down the Atlantic coast of Morocco to the Canaries, told from the boat’s logbook.</p>
            <p className="cartouche__by">Baturay Ofluoğlu · 5–13 November 2026</p>
            <dl className="cartouche__notes">
              <div>
                <dt>Run</dt>
                <dd>about {miles} miles</dd>
              </div>
              <div>
                <dt>Fixes</dt>
                <dd>{fixes} from the log</dd>
              </div>
              <div>
                <dt>Calls</dt>
                <dd>Mohammedia, Agadir</dd>
              </div>
              <div>
                <dt>Depths</dt>
                <dd>in metres</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="intro wrap-text">
          <p className="intro__lede">
            In November I was one of seven aboard a boat sailing from Gibraltar to Las Palmas de Gran Canaria: out through the
            Strait, down the Atlantic coast of Morocco, and across to the Canaries.
          </p>
          <p>
            This is that passage as the boat’s logbook tells it. Every position on this page is one we wrote down on watch, every
            hour or two, with the barometer, the course, the speed and what sails were up. The stories come from a crewmate’s
            journal, kept in French on board.
          </p>
          <p className="intro__chart-note">
            On the chart, the blue water is shallower than 200 metres; each line beyond it is another kilometre down, to 4,000
            metres. Pencil is the track we logged, dashes the bits into harbour that we didn’t, and every dot is a fix.
          </p>
        </section>

        <section className="watches" aria-labelledby="watches-title">
          <div className="wrap-text">
            <h2 id="watches-title" className="section-title">
              On watch
            </h2>
            <p>
              Seven aboard: Rob, the skipper, and three pairs of watchkeepers, two hours on deck and four below, around the clock.
              The French journal’s writer kept 18:00 to 20:00 with Sophia; my watch came straight before his.
            </p>
          </div>
          <WatchDial log={logbook} />
        </section>

        <section className="days" aria-labelledby="days-title">
          <h2 id="days-title" className="section-title wrap-text">
            Day by day
          </h2>
          <div className="days__layout" ref={daysRef}>
            <div className="days__chart">
              <PassageChart
                className="follow"
                track={track}
                times={times}
                boat
                notes={NOTES}
                still={still}
                controls={follow}
                onFix={setFix}
                label="The chart follows the boat as you read, day by day."
              />
              {fix && (
                <div className="fixcard" role="status">
                  <p className="fixcard__when">
                    {new Date(`${fix.date}T12:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })}{' '}
                    {fix.time} {fix.utcOffset ? 'CET' : 'UTC'}
                  </p>
                  <p className="fixcard__pos">{formatCoords({ lat: fix.lat!, lon: fix.lon! })}</p>
                  <p className="fixcard__data">
                    {fix.cog !== undefined && <span>{String(fix.cog).padStart(3, '0')}°</span>}
                    {fix.sog !== undefined && <span>{fix.sog.toFixed(1)} kn</span>}
                    {fix.baro !== undefined && <span>{fix.baro} hPa</span>}
                    {fix.wind && <span>{fix.wind}</span>}
                  </p>
                  {fix.remark && <p className="fixcard__remark">{fix.remark}</p>}
                </div>
              )}
            </div>
            <div className="days__text">
              {plan.map(({ day, facts }) => (
                <DayArticle key={day.date} day={day} facts={facts} />
              ))}
            </div>
          </div>
        </section>

        <section className="sheet" aria-labelledby="sheet-title">
          <div className="wrap-text">
            <h2 id="sheet-title" className="section-title">
              The passage on one sheet
            </h2>
            <p>
              Every barometer reading in the log, and under it what we had up, entry by entry. Watch the pressure sag on the Sunday
              as the first blow came in, and fall to 1009 under the trysail on the Wednesday. Point at the sheet, or use the arrow
              keys, to read the log line by line.
            </p>
          </div>
          <Barograph log={logbook} />
        </section>

        <section className="sails" aria-labelledby="sails-title">
          <div className="wrap-text">
            <h2 id="sails-title" className="section-title">
              What was up
            </h2>
            <p>
              A light-wind start and a broken jib halyard meant a lot of motoring. Once the wind came, we went through the whole
              wardrobe: every reef in the main, and a day and a night under the trysail.
            </p>
          </div>
          <SailWardrobe log={logbook} />
        </section>

        <section className="bosun" aria-labelledby="bosun-title">
          <div className="wrap-text">
            <h2 id="bosun-title" className="section-title">
              The bosun’s list
            </h2>
            <p>Things that broke, or weren’t there, and what we did about them.</p>
            <ol className="bosun__list">
              {bosunsList.map((b, i) => (
                <li key={i} className="bosun__item">
                  <span className="bosun__day">Day {b.day}</span>
                  <span className="bosun__what">{b.what}</span>
                  <span className="bosun__fix">{b.fix}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="orders" aria-labelledby="orders-title">
          <div className="orders__page">
            <h2 id="orders-title" className="orders__title">
              When to call the skipper
            </h2>
            <p className="orders__source">Rob’s standing orders, on the first page of the log</p>
            <ol>
              {callTheSkipper.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="landfall wrap-text" aria-labelledby="landfall-title">
          <h2 id="landfall-title" className="section-title">
            Landfall
          </h2>
          <p>
            Nine days and about {miles} miles after we left Alcaidesa, we tied up in Las Palmas on Friday the 13th. For some of the
            crew it was only a stop: the boat sailed on, and they stayed aboard to show the next crew the ropes.
          </p>
          <p>
            TISE sails the Belgian and Dutch coast through the season, and further afield in summer. If this made you want to go,
            come sailing with us.
          </p>
          <a className="landfall__cta" href={`${ROOT}#join`}>
            Sail with TISE
          </a>
        </section>
      </main>
      <BlogFooter root={ROOT} />
    </>
  );
}
