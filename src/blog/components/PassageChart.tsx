import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from 'react';
import { CompassRose } from '../../components/SeaChart';
import { project, type Pt } from '../../lib/chart';
import { formatCoords } from '../../lib/geo';
import { passageChart as M } from '../data/passageChart';
import { chartNames, ports } from '../data/passage';
import { shipTime, type Timed, type TrackPoint } from '../lib/passage';
import type { LogEntry } from '../data/logbook';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChartControls {
  /** frame part of the chart; it is widened to the shape of the window */
  setView(box: Box, immediate?: boolean): void;
  /** put the boat where the log has it at a moment (UTC ms) */
  setTime(t: number): void;
}

export interface ChartNote {
  lat: number;
  lon: number;
  text: string;
}

const P = (lat: number, lon: number): Pt => project(M, lon, lat);

/** Ship's time went from CET to UTC during the stop at Mohammedia. */
const SHIP_TIME_TO_UTC = Date.UTC(2026, 10, 7, 9, 0);

/** Depths drawn on the chart, shallow to deep. */
const DEPTHS = [200, 1000, 2000, 3000, 4000] as const;

/** A box around points, with a margin, at least `min` wide. */
export function boxAround(pts: Pt[], pad = 0.18, min = 90): Box {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  let x0 = Math.min(...xs);
  let x1 = Math.max(...xs);
  let y0 = Math.min(...ys);
  let y1 = Math.max(...ys);
  const grow = (a: number, b: number) => Math.max(min, (b - a) * (1 + 2 * pad));
  const w = grow(x0, x1);
  const h = grow(y0, y1);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  x0 = cx - w / 2;
  x1 = cx + w / 2;
  y0 = cy - h / 2;
  y1 = cy + h / 2;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export const fullChart: Box = { x: 0, y: 0, w: M.width, h: M.height };
export const projectLatLon = P;

/** Shared chart geometry, drawn once and used by every chart on the page. */
export function ChartDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {/* vector-effect isn't inherited through <use>, so it goes on the shapes themselves */}
        {DEPTHS.map((d) => (
          <path key={d} id={`pc-d${d}`} d={M.depth[d]} vectorEffect="non-scaling-stroke" />
        ))}
        <path id="pc-land" d={M.land} vectorEffect="non-scaling-stroke" />
      </defs>
    </svg>
  );
}

interface Props {
  track: TrackPoint[];
  times: Timed[];
  /** initial frame */
  view?: Box;
  /** draw the whole track in on load (the overview) */
  drawIn?: boolean;
  /** show where the boat is, and how far it has come */
  boat?: boolean;
  notes?: ChartNote[];
  /** called with the entry under the pointer, for a readout */
  onFix?: (e: LogEntry | null) => void;
  controls?: Ref<ChartControls>;
  className?: string;
  label: string;
  /** reduced motion: no animation of the frame or the drawing */
  still?: boolean;
}

/**
 * A Mercator chart of the passage in the style of a paper chart: buff land, blue shallows, depth
 * contours, the logged track in pencil with a fix at every position, and the harbours. Labels and
 * marks keep the same size on screen whatever the zoom.
 */
export function PassageChart({ track, times, view = fullChart, drawIn, boat, notes = [], onFix, controls, className, label, still }: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const sailed = useRef<SVGPathElement>(null);
  const boatEl = useRef<SVGGElement>(null);
  const readout = useRef<HTMLParagraphElement>(null);
  const current = useRef<Box>({ ...view });
  const target = useRef<Box>({ ...view });
  const raf = useRef(0);

  const pts = useMemo(() => track.map((p) => ({ ...p, ...P(p.lat, p.lon) })), [track]);
  // the boat's way through time, projected, with the distance run along it on the chart
  const path = useMemo(() => {
    const xy = times.map((p) => P(p.lat, p.lon));
    const cum = [0];
    for (let i = 1; i < xy.length; i++) cum.push(cum[i - 1] + Math.hypot(xy[i].x - xy[i - 1].x, xy[i].y - xy[i - 1].y));
    return { xy, cum, d: 'M' + xy.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L') };
  }, [times]);
  const total = path.cum[path.cum.length - 1];

  // apply a frame: the viewBox, widened to the element's shape, and the size of a screen pixel in chart units
  const apply = (b: Box) => {
    const el = svg.current;
    if (!el) return;
    const W = el.clientWidth || 1;
    const H = el.clientHeight || 1;
    let { x, y, w, h } = b;
    if (w / h < W / H) {
      const nw = (h * W) / H;
      x -= (nw - w) / 2;
      w = nw;
    } else {
      const nh = (w * H) / W;
      y -= (nh - h) / 2;
      h = nh;
    }
    el.setAttribute('viewBox', `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`);
    el.style.setProperty('--upp', (w / W).toFixed(4));
    // the fixes answer the pointer within 10 screen pixels, at any zoom
    const r = ((10 * w) / W).toFixed(3);
    el.querySelectorAll('.pc__fix-hit').forEach((c) => c.setAttribute('r', r));
  };

  const tick = () => {
    const c = current.current;
    const t = target.current;
    const k = 0.12;
    let moving = false;
    for (const key of ['x', 'y', 'w', 'h'] as const) {
      const d = t[key] - c[key];
      if (Math.abs(d) > 0.05) moving = true;
      c[key] += d * k;
    }
    apply(c);
    raf.current = moving ? requestAnimationFrame(tick) : 0;
  };

  useImperativeHandle(controls, () => ({
    setView(box, immediate) {
      target.current = { ...box };
      if (immediate || still) {
        current.current = { ...box };
        apply(box);
        return;
      }
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    },
    setTime(t) {
      const ts = times;
      let i = 1;
      while (i < ts.length - 1 && ts[i].t < t) i++;
      const a = ts[i - 1];
      const b = ts[i];
      const k = b.t === a.t ? 1 : Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t)));
      const pa = path.xy[i - 1];
      const pb = path.xy[i];
      const x = pa.x + (pb.x - pa.x) * k;
      const y = pa.y + (pb.y - pa.y) * k;
      const run = path.cum[i - 1] + (path.cum[i] - path.cum[i - 1]) * k;
      sailed.current?.style.setProperty('stroke-dashoffset', String(total - run));
      // heading: the leg being sailed, or the last one when stopped in port
      let j = i;
      while (j > 1 && path.xy[j].x === path.xy[j - 1].x && path.xy[j].y === path.xy[j - 1].y) j--;
      const hd = (Math.atan2(path.xy[j].y - path.xy[j - 1].y, path.xy[j].x - path.xy[j - 1].x) * 180) / Math.PI + 90;
      boatEl.current?.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      boatEl.current?.style.setProperty('--hd', `${hd.toFixed(1)}deg`);
      if (readout.current) {
        const lat = a.lat + (b.lat - a.lat) * k;
        const lon = a.lon + (b.lon - a.lon) * k;
        // ship's time, as in the log: CET until the clocks went to UTC at Mohammedia
        const cet = t < SHIP_TIME_TO_UTC;
        const day = new Date(t + (cet ? 3_600_000 : 0)).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
        readout.current.textContent = `${day}, ${shipTime(t, cet ? 1 : 0)} ${cet ? 'CET' : 'UTC'} · ${formatCoords({ lat, lon })}`;
      }
    },
  }));

  useEffect(() => {
    apply(current.current);
    const el = svg.current;
    if (!el) return;
    const ro = new ResizeObserver(() => apply(current.current));
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the overview draws its track in once, on load
  useEffect(() => {
    const el = sailed.current;
    if (!el || !drawIn) return;
    if (still) {
      el.style.strokeDashoffset = '0';
      return;
    }
    el.style.strokeDashoffset = String(total);
    const anim = el.animate([{ strokeDashoffset: total }, { strokeDashoffset: 0 }], {
      duration: 3200,
      delay: 400,
      easing: 'cubic-bezier(0.45, 0, 0.2, 1)',
      fill: 'forwards',
    });
    return () => anim.cancel();
  }, [drawIn, still, total]);

  // graticule: every degree
  const grid = useMemo(() => {
    const lines: string[] = [];
    for (let lon = -31; lon <= 6; lon++) {
      const a = P(43.5, lon);
      const b = P(21, lon);
      lines.push(`M${a.x.toFixed(1)},${a.y.toFixed(1)}V${b.y.toFixed(1)}`);
    }
    for (let lat = 21; lat <= 43; lat++) {
      const a = P(lat, -31);
      const b = P(lat, 6);
      lines.push(`M${a.x.toFixed(1)},${a.y.toFixed(1)}H${b.x.toFixed(1)}`);
    }
    return lines.join('');
  }, []);

  const segments = useMemo(() => {
    const logged: string[] = [];
    const unlogged: string[] = [];
    for (let i = 1; i < pts.length; i++) {
      const s = `M${pts[i - 1].x.toFixed(1)},${pts[i - 1].y.toFixed(1)}L${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
      (pts[i].logged ? logged : unlogged).push(s);
    }
    return { logged: logged.join(''), unlogged: unlogged.join('') };
  }, [pts]);

  const rose = P(34.6, -13.2);

  return (
    <div className={`pc${className ? ` ${className}` : ''}`}>
      <svg
        ref={svg}
        className="pc__svg"
        role={label ? 'img' : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect className="pc__shoal" x={-2000} y={-2000} width={5000} height={5000} />
        <use href="#pc-d200" className="pc__deep" />
        {DEPTHS.map((d, i) => (
          <use key={d} href={`#pc-d${d}`} className={`pc__contour pc__contour--${i}`} />
        ))}
        <path className="pc__grid" d={grid} />
        <use href="#pc-land" className="pc__land" />
        <CompassRose className="pc__rose" x={rose.x - 60} y={rose.y - 60} size={120} />

        {chartNames.map((n) => {
          const p = P(n.lat, n.lon);
          return (
            <text
              key={n.name}
              className={`pc__name${n.water ? ' pc__name--water' : ''}${n.island ? ' pc__name--island' : ''}`}
              x={p.x}
              y={p.y}
              textAnchor={n.anchor ?? 'middle'}
            >
              {n.name}
            </text>
          );
        })}

        <path className="pc__track pc__track--unlogged" d={segments.unlogged} />
        <path className="pc__track" d={segments.logged} />
        <path
          ref={sailed}
          className="pc__sailed"
          d={path.d}
          style={{ strokeDasharray: total, strokeDashoffset: boat ? total : drawIn ? total : 0 }}
        />

        {pts
          .filter((p) => p.kind === 'fix')
          .map((p) => (
            <g key={`${p.entry!.n}`} className="pc__fix" onPointerEnter={() => onFix?.(p.entry!)} onPointerLeave={() => onFix?.(null)}>
              <circle className="pc__fix-hit" cx={p.x} cy={p.y} r={10} />
              <path className="pc__fix-halo" d={`M${p.x},${p.y}h0.001`} />
              <path className="pc__fix-dot" d={`M${p.x},${p.y}h0.001`} />
            </g>
          ))}

        {ports.map((port) => {
          const p = P(port.lat, port.lon);
          return (
            <g key={port.id} className="pc__port">
              <path className="pc__port-mark" d={`M${p.x},${p.y}h0.001`} />
              <text className={`pc__port-name${port.labelSide === 'right' ? ' pc__port-name--right' : ''}`} x={p.x} y={p.y}>
                <tspan className="pc__port-label">{port.name}</tspan>
              </text>
            </g>
          );
        })}

        {notes.map((n) => {
          const p = P(n.lat, n.lon);
          return (
            <g key={n.text} className="pc__note">
              <path className="pc__note-mark" d={`M${p.x},${p.y}h0.001`} />
              <text x={p.x} y={p.y} className="pc__note-text">
                {n.text}
              </text>
            </g>
          );
        })}

        {boat && (
          <g ref={boatEl} className="pc__boat">
            <g className="pc__boat-hull">
              <path d="M0,-11 C5,-4 5,6 3.2,10 L-3.2,10 C-5,6 -5,-4 0,-11 Z" />
              <path className="pc__boat-mast" d="M0,-4 L0,6" />
            </g>
          </g>
        )}
      </svg>
      {boat && <p className="pc__readout" ref={readout} aria-hidden="true" />}
    </div>
  );
}
