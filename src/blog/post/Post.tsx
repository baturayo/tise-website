import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollTrigger, useReducedMotion } from '../../hooks/motion';
import { formatCoords } from '../../lib/geo';
import { Barograph } from '../components/Barograph';
import { BlogFooter, BlogHeader, PostNav } from '../components/BlogChrome';
import { CareLabel } from '../components/CareLabel';
import { ChartDefs, PassageChart, boxAround, fullChart, projectLatLon, type ChartControls, type ChartNote } from '../components/PassageChart';
import { PhotoStrip } from '../components/PhotoStrip';
import { SailWardrobe } from '../components/SailWardrobe';
import { WatchDial } from '../components/WatchDial';
import { logbook, type LogEntry } from '../data/logbook';
import { bosunsList, callTheSkipper, days, ports, rota, type Day, type Kind } from '../data/passage';
import { photos } from '../data/photos';
import { buildTrack, dayNumber, nauticalMiles, positionAt, shipsDay, timeline, trackLength, utcMs } from '../lib/passage';
import { photosOn } from '../lib/photos';

const ROOT = '../../';
const SLUG = 'gibraltar-to-las-palmas';

const byN = new Map(logbook.map((e) => [e.n, e]));

/** Who was aboard besides the skipper, in their watch pairs. */
const crew = rota.map((w) => w.crewList ?? w.label);

/** Navigator's notes pencilled on the chart, at the logged positions. */
const pencilled: { n: number; text: string; side?: ChartNote['side'] }[] = [
  { n: 2, text: 'Whale, 18:06' },
  { n: 27, text: 'Dolphins in the phosphorescence', side: 'right' },
  { n: 39, text: 'Jib halyard gone, 22:14' },
  { n: 42, text: 'Eight dolphins, three young' },
  { n: 57, text: 'Trysail, 1009 hPa' },
  { n: 62, text: 'All reefs out, 7.6 kn' },
];
const NOTES: ChartNote[] = pencilled.map(({ n, text, side }) => ({ lat: byN.get(n)!.lat!, lon: byN.get(n)!.lon!, text, side }));

const KIND_LABEL: Record<Kind, string> = {
  wildlife: 'Wildlife',
  gear: 'Gear',
  galley: 'Galley',
  harbour: 'Harbour',
  sailing: 'Sailing',
};

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
      <PhotoStrip photos={photosOn(photos, day.date)} />
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
        const [a, b] = shipsDay(day.date);
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
      <BlogHeader root={ROOT} here="post" />
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
            <p className="cartouche__sub">Nine days down the Atlantic coast of Morocco to the Canaries, told from the boat’s logbook, with the wet bits left in.</p>
            <p className="cartouche__by">Baturay Ofluoğlu · 5–13 November 2026</p>
            <dl className="cartouche__notes">
              <div>
                <dt>Boat</dt>
                <dd>Escapado</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>First 40.7</dd>
              </div>
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
            In November I was one of seven aboard Escapado, a Beneteau First 40.7, on a Sail Racing Academy passage from
            Gibraltar to Las Palmas de Gran Canaria: out through the Strait, down the Atlantic coast of Morocco, and across to the Canaries. We had
            a whale, dolphins twice, two blows, a broken halyard, two stops for diesel (one of them for nothing) and my first
            seasickness ever.
          </p>
          <dl className="aboard">
            <div>
              <dt>Boat</dt>
              <dd>Escapado, a Beneteau First 40.7: a 40-foot race boat</dd>
            </div>
            <div>
              <dt>Organised by</dt>
              <dd>Sail Racing Academy</dd>
            </div>
            <div>
              <dt>Skipper</dt>
              <dd>Rob</dd>
            </div>
            <div>
              <dt>Crew</dt>
              <dd>
                <ul className="aboard__crew">
                  {crew.map((pair) => (
                    <li key={pair}>{pair}</li>
                  ))}
                </ul>
                <span className="aboard__note">
                  in watch pairs. Samir left us in Agadir; from there Rob stood his watches with Tymon.
                </span>
              </dd>
            </div>
          </dl>
          <p>
            This is that passage as the boat’s logbook tells it. Every position on this page is one we wrote down on watch, every
            hour or two, with the barometer, the course, the speed and whatever sails were still working. The stories come from
            Emmanuel’s journal, kept in French on board, and from my own memory, which is mostly of being wet.
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
              I kept mine with Niko. Emmanuel and Sophia took over from us, and Tymon and Samir from them. Rob, as skippers do,
              was on call for all of it, and from Agadir on he was on the rota too: Samir left us there, and Rob took over his
              watches with Tymon.
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

        <section className="kit" aria-labelledby="kit-title">
          <div className="wrap-text">
            <h2 id="kit-title" className="section-title">
              Pack for the washing machine
            </h2>
            <p>
              If you take one thing from this post, take this. I had never been seasick before this trip, and I had never been
              that wet for that long. Wednesday found every weak spot in my kit, and the time to find the weak spots in yours is
              at home, not halfway to the Canaries.
            </p>
            <p>Here is what I ate, and the care label I wish my kit had come with.</p>
          </div>
          <CareLabel />
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
              A light-wind start and a broken jib halyard meant a lot of motoring, which explains all the stops for diesel. Once
              the wind came, we went through the whole wardrobe: every reef in the main, and a day and a night under the trysail.
            </p>
          </div>
          <SailWardrobe log={logbook} />
        </section>

        <section className="bosun" aria-labelledby="bosun-title">
          <div className="wrap-text">
            <h2 id="bosun-title" className="section-title">
              The bosun’s list
            </h2>
            <p>Things that broke, weren’t there or were closed, and what we did about them.</p>
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
            First, though, Escapado went in for a big maintenance, and she needed it. The gooseneck, the fitting that holds the
            boom to the mast, should have had six screws; three of them were missing. Luckily, nothing happened in either blow. As
            I write this, she is racing in the ARC, crossing the Atlantic from Las Palmas to the Caribbean. We wish them all the
            best. Fair winds, Escapado!
          </p>
          <p>
            TISE sails the Belgian and Dutch coast through the season, and further afield in summer. If this made you want to go,
            come sailing with us.
          </p>
          <a className="landfall__cta" href={`${ROOT}#join`}>
            Sail with TISE
          </a>
        </section>
        <PostNav slug={SLUG} />
      </main>
      <BlogFooter root={ROOT} />
    </>
  );
}
