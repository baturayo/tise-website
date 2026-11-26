import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { LogEntry, Main } from '../data/logbook';
import { ports } from '../data/passage';
import { utcMs } from '../lib/passage';
import { formatCoords } from '../../lib/geo';

const MAIN_LABEL: Record<Main | 'none', string> = {
  full: 'Full main',
  reef1: 'Reef 1',
  reef2: 'Reef 2',
  reef3: 'Reef 3',
  trysail: 'Trysail',
  none: 'No main',
};
const JIB_LABEL = { full: 'Full jib', reefed: 'Reefed jib', furled: 'Jib furled', none: 'No jib' } as const;

/** The barometer reading written over another digit, between 1022 and 1020: drawn, but not joined. */
const doubtful = (e: LogEntry) => e.baro === 1030;

interface Props {
  log: LogEntry[];
}

/**
 * The whole passage on one sheet, like the paper on a barograph drum: pressure across the top, and
 * under it what was set, the jib and the engine, entry by entry. Pointing at it, or the arrow keys,
 * reads the log.
 */
export function Barograph({ log }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(960);
  const timed = useMemo(() => log.filter((e) => e.time).map((e) => ({ e, t: utcMs(e)! })), [log]);
  const [active, setActive] = useState(timed.length - 1);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(320, entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const t0 = Date.UTC(2026, 10, 5, 14, 0);
  const t1 = Date.UTC(2026, 10, 13, 9, 0);
  const pad = { l: 44, r: 12, t: 18 };
  const H = { baro: 170, gap: 26, band: 16, bands: 3 };
  const height = pad.t + H.baro + H.gap + H.bands * (H.band + 6) + 26;
  const x = (t: number) => pad.l + ((t - t0) / (t1 - t0)) * (width - pad.l - pad.r);
  const pMin = 1006;
  const pMax = 1027;
  const y = (p: number) => pad.t + ((pMax - p) / (pMax - pMin)) * H.baro;

  const baroPts = timed.filter(({ e }) => e.baro && !doubtful(e));
  const line = baroPts.map(({ e, t }, i) => `${i ? 'L' : 'M'}${x(t).toFixed(1)},${y(e.baro!).toFixed(1)}`).join('');
  const odd = timed.filter(({ e }) => doubtful(e));

  // bands: each interval takes the state written at its start; harbour stays are left blank
  const harbours = ports.filter((p) => p.arrive && p.leave).map((p) => ({ name: p.name, a: p.arrive!, b: p.leave! }));
  const inPort = (t: number) => harbours.some((h) => t >= h.a && t < h.b);
  const intervals = timed.slice(0, -1).map((cur, i) => ({ ...cur, next: timed[i + 1].t })).filter((s) => !inPort(s.t));
  const bandTop = (k: number) => pad.t + H.baro + H.gap + k * (H.band + 6);

  // ship's days, midnight to midnight in ship's time
  const days: { t: number; label: string }[] = [];
  for (let d = 5; d <= 13; d++) {
    const t = Date.UTC(2026, 10, d, d <= 7 ? -1 : 0);
    days.push({ t, label: new Date(Date.UTC(2026, 10, d)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', timeZone: 'UTC' }) });
  }

  const cur = timed[active];
  const choose = (clientX: number) => {
    const box = wrap.current!.getBoundingClientRect();
    const px = clientX - box.left;
    let best = 0;
    let bestD = Infinity;
    timed.forEach(({ t }, i) => {
      const d = Math.abs(x(t) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setActive(best);
  };
  const onKey = (ev: KeyboardEvent) => {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') setActive((a) => Math.min(timed.length - 1, a + 1));
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') setActive((a) => Math.max(0, a - 1));
    else if (ev.key === 'Home') setActive(0);
    else if (ev.key === 'End') setActive(timed.length - 1);
    else return;
    ev.preventDefault();
  };

  const e = cur.e;
  const when = `${new Date(Date.UTC(2026, 10, Number(e.date.slice(8)))).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}, ${e.time}${e.utcOffset ? ' CET' : ' UTC'}${e.approx ? ', about' : ''}`;

  return (
    <figure className="baro">
      <div
        className="baro__plot"
        ref={wrap}
        tabIndex={0}
        role="group"
        aria-label="Barograph and sail plan, entry by entry. Use the arrow keys to read the log."
        onPointerMove={(ev) => choose(ev.clientX)}
        onPointerDown={(ev) => choose(ev.clientX)}
        onKeyDown={onKey}
      >
        <svg width={width} height={height} aria-hidden="true">
          {days.map((d, i) => (
            <g key={d.label}>
              {i % 2 === 0 && i < days.length - 1 && (
                <rect
                  className="baro__day"
                  x={Math.max(pad.l, x(d.t))}
                  y={pad.t}
                  width={x(days[i + 1].t) - Math.max(pad.l, x(d.t))}
                  height={height - pad.t - 22}
                />
              )}
              <text className="baro__daylabel" x={Math.max(pad.l + 2, x(d.t) + 4)} y={height - 8}>
                {d.label}
              </text>
            </g>
          ))}
          {harbours.map((h) => (
            <g key={h.name}>
              <rect className="baro__port" x={x(h.a)} y={pad.t} width={x(h.b) - x(h.a)} height={height - pad.t - 22} />
              <text className="baro__portlabel" x={(x(h.a) + x(h.b)) / 2} y={pad.t + H.baro + 14} textAnchor="middle">
                {h.name}
              </text>
            </g>
          ))}
          {[1008, 1012, 1016, 1020, 1024].map((p) => (
            <g key={p}>
              <line className="baro__rule" x1={pad.l} x2={width - pad.r} y1={y(p)} y2={y(p)} />
              <text className="baro__tick" x={pad.l - 6} y={y(p) + 4} textAnchor="end">
                {p}
              </text>
            </g>
          ))}
          <text className="baro__unit" x={pad.l - 6} y={pad.t - 6} textAnchor="end">
            hPa
          </text>
          <path className="baro__trace" d={line} />
          {baroPts.map(({ e, t }) => (
            <circle key={e.n} className="baro__reading" cx={x(t)} cy={y(e.baro!)} r={2.2} />
          ))}
          {odd.map(({ e, t }) => (
            <g key={e.n}>
              <circle className="baro__odd" cx={x(t)} cy={y(1026.4)} r={3} />
              <text className="baro__oddlabel" x={x(t) + 6} y={y(1026.4) + 4}>
                1030 as written
              </text>
            </g>
          ))}

          {(['main', 'jib', 'engine'] as const).map((kind, k) => (
            <g key={kind}>
              <text className="baro__bandlabel" x={pad.l - 6} y={bandTop(k) + 12} textAnchor="end">
                {kind === 'main' ? 'Main' : kind === 'jib' ? 'Jib' : 'Engine'}
              </text>
              {intervals.map((s) => {
                const cls =
                  kind === 'main'
                    ? `baro__band baro__main--${s.e.main ?? 'none'}`
                    : kind === 'jib'
                      ? `baro__band baro__jib--${s.e.jib ?? 'none'}`
                      : `baro__band baro__engine--${s.e.engine ? 'on' : 'off'}`;
                return <rect key={s.e.n} className={cls} x={x(s.t)} y={bandTop(k)} width={Math.max(0.5, x(s.next) - x(s.t))} height={H.band} />;
              })}
            </g>
          ))}

          <line className="baro__cursor" x1={x(cur.t)} x2={x(cur.t)} y1={pad.t - 4} y2={height - 22} />
        </svg>
      </div>
      <figcaption className="baro__read" aria-live="polite">
        <span className="baro__when">{when}</span>
        <span className="baro__facts">
          {e.lat !== undefined && <span>{formatCoords({ lat: e.lat, lon: e.lon! })}</span>}
          {e.cog !== undefined && <span>Course {String(e.cog).padStart(3, '0')}°</span>}
          {e.sog !== undefined && <span>{e.sog.toFixed(1)} kn</span>}
          {e.baro !== undefined && <span>{e.baro} hPa</span>}
          {e.wind && <span>Wind {e.wind}</span>}
          <span>
            {MAIN_LABEL[e.main ?? 'none']}, {JIB_LABEL[e.jib ?? 'none'].toLowerCase()}, engine {e.engine ? 'on' : 'off'}
          </span>
        </span>
        {e.remark && <span className="baro__remark">“{e.remark}”</span>}
      </figcaption>
    </figure>
  );
}
