import { useState } from 'react';
import type { LogEntry } from '../data/logbook';
import { rota } from '../data/passage';
import { onWatch } from '../lib/passage';

const R = 118; // radius of the watch ring
const W = 26; // its width

/** A point on the 24-hour dial: midnight at the top, noon at the bottom. */
const at = (hour: number, r: number) => {
  const a = (hour / 24) * 2 * Math.PI - Math.PI / 2;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
};

function arc(from: number, to: number, r0: number, r1: number) {
  const a = at(from, r1);
  const b = at(to, r1);
  const c = at(to, r0);
  const d = at(from, r0);
  const large = to - from > 12 ? 1 : 0;
  return `M${a.x},${a.y}A${r1},${r1} 0 ${large} 1 ${b.x},${b.y}L${c.x},${c.y}A${r0},${r0} 0 ${large} 0 ${d.x},${d.y}Z`;
}

const hourOf = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h + m / 60;
};

/**
 * The watch system on the way to Agadir as a 24-hour clock: three pairs, two hours on and four off.
 * Mine is in red; the log entries written in my hours sit on the outside of the ring.
 */
export function WatchDial({ log }: { log: LogEntry[] }) {
  const [focus, setFocus] = useState<string | null>(null);
  // the two-hour rota ran from the first evening until the day watches changed on 9 November
  const rotaEntries = log.filter((e) => e.time && e.leg === 1 && e.date >= '2026-11-05' && e.date <= '2026-11-08');
  const mine = rotaEntries.filter((e) => onWatch(rota, hourOf(e.time!)) === 'mine' && e.remark);

  return (
    <figure className="watch">
      <svg className="watch__dial" viewBox="-170 -170 340 340" role="img" aria-labelledby="watch-title watch-desc">
        <title id="watch-title">The watch rota, 24 hours</title>
        <desc id="watch-desc">
          Three pairs kept two-hour watches. Mine was 04:00 to 06:00, 10:00 to 12:00, 16:00 to 18:00 and 22:00 to midnight;
          the journal’s writer and Sophia came straight after me.
        </desc>
        <circle className="watch__face" r={R + 34} />
        {rota.map((w) =>
          w.hours.map(([a, b]) => (
            <path
              key={`${w.name}${a}`}
              className={`watch__arc watch__arc--${w.name}${focus && focus !== w.name ? ' watch__arc--dim' : ''}`}
              d={arc(a + 0.04, b - 0.04, R - W, R)}
            >
              <title>
                {String(a).padStart(2, '0')}:00–{String(b % 24).padStart(2, '0')}:00, {w.label.toLowerCase()}
              </title>
            </path>
          )),
        )}
        {Array.from({ length: 24 }, (_, h) => {
          const p0 = at(h, R - W - 4);
          const p1 = at(h, R - W - (h % 6 === 0 ? 14 : 9));
          return <line key={h} className="watch__tick" x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} />;
        })}
        {[0, 6, 12, 18].map((h) => {
          const p = at(h, R - W - 28);
          return (
            <text key={h} className="watch__hour" x={p.x} y={p.y + 5} textAnchor="middle">
              {String(h).padStart(2, '0')}
            </text>
          );
        })}
        {/* the entries written during my watches, on the rim */}
        {mine.map((e) => {
          const h = hourOf(e.time!);
          const p0 = at(h, R + 4);
          const p1 = at(h, R + 16);
          return <line key={e.n} className="watch__entry" x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} />;
        })}
        <text className="watch__centre" y={-4} textAnchor="middle">
          2 on, 4 off
        </text>
        <text className="watch__centre watch__centre--small" y={16} textAnchor="middle">
          ship’s time
        </text>
      </svg>
      <figcaption className="watch__key">
        <ul>
          {rota.map((w) => (
            <li key={w.name}>
              <button
                type="button"
                className={`watch__keybtn watch__keybtn--${w.name}`}
                aria-pressed={focus === w.name}
                onClick={() => setFocus((f) => (f === w.name ? null : w.name))}
              >
                <span className="watch__swatch" aria-hidden="true" />
                {w.label}
                <span className="watch__hours">
                  {w.hours
                    .slice()
                    .sort((p, q) => p[0] - q[0])
                    .map(([a, b]) => `${String(a).padStart(2, '0')}–${String(b % 24).padStart(2, '0')}`)
                    .join(' · ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="watch__note">From Monday 9 November the day watches ran three hours, and mine became 10:00–13:00.</p>
      </figcaption>
      <div className="watch__mine">
        <h3>Written in the log on my watch</h3>
        <ol>
          {mine.map((e) => (
            <li key={e.n}>
              <time>
                {new Date(`${e.date}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })} {e.time}
              </time>
              <span>{e.remark}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
