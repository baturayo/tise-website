/** Working with the logbook: times, distances, the track and the watch rota. */
import type { LogEntry } from '../data/logbook';

export interface LatLon {
  lat: number;
  lon: number;
}

const EARTH_NM = 3440.065; // mean radius of the earth in nautical miles
const rad = (d: number) => (d * Math.PI) / 180;

/** Distance along a rhumb line (a constant compass course), the way a navigator measures a leg. */
export function nauticalMiles(a: LatLon, b: LatLon): number {
  const p1 = rad(a.lat);
  const p2 = rad(b.lat);
  const dPhi = p2 - p1;
  const dPsi = Math.log(Math.tan(Math.PI / 4 + p2 / 2) / Math.tan(Math.PI / 4 + p1 / 2));
  const q = Math.abs(dPsi) > 1e-12 ? dPhi / dPsi : Math.cos(p1);
  return Math.hypot(dPhi, q * rad(b.lon - a.lon)) * EARTH_NM;
}

/** The moment of an entry, in UTC milliseconds; null when no time was written. */
export function utcMs(e: Pick<LogEntry, 'date' | 'time' | 'utcOffset'>): number | null {
  if (!e.time) return null;
  const [y, m, d] = e.date.split('-').map(Number);
  const [h, min] = e.time.split(':').map(Number);
  return Date.UTC(y, m - 1, d, h - e.utcOffset, min);
}

/** A UTC moment written as ship's time. */
export function shipTime(ms: number, utcOffset: number): string {
  const d = new Date(ms + utcOffset * 3_600_000);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

export interface Port extends LatLon {
  id: string;
  name: string;
  /** the logbook row after which the boat reaches this port (0: the start) */
  after: number;
  /** UTC, when known */
  arrive?: number;
  leave?: number;
}

export interface TrackPoint extends LatLon {
  kind: 'fix' | 'port';
  /** the leg arriving at this point runs between two logged fixes */
  logged: boolean;
  entry?: LogEntry;
  port?: Port;
}

/** The passage as sailed: from port to port through every logged fix, in order. */
export function buildTrack(log: LogEntry[], ports: Port[]): TrackPoint[] {
  const out: TrackPoint[] = [];
  const add = (p: Omit<TrackPoint, 'logged'>) =>
    out.push({ ...p, logged: p.kind === 'fix' && out.length > 0 && out[out.length - 1].kind === 'fix' });
  const portsAfter = (n: number) => ports.filter((p) => p.after === n).forEach((port) => add({ kind: 'port', lat: port.lat, lon: port.lon, port }));
  portsAfter(0);
  for (const e of log) {
    if (e.lat !== undefined && e.lon !== undefined) add({ kind: 'fix', lat: e.lat, lon: e.lon, entry: e });
    portsAfter(e.n);
  }
  return out;
}

/** Total length of a track, and the part of it between logged fixes. */
export function trackLength(pts: (LatLon & { logged: boolean })[]): { total: number; logged: number } {
  let total = 0;
  let logged = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = nauticalMiles(pts[i - 1], pts[i]);
    total += d;
    if (pts[i].logged) logged += d;
  }
  return { total, logged };
}

export interface Timed extends LatLon {
  t: number;
}

/** The boat's moments in time: each fix, and each port at arrival and departure where known. */
export function timeline(track: TrackPoint[]): Timed[] {
  const out: Timed[] = [];
  for (const p of track) {
    if (p.kind === 'fix') {
      const t = p.entry ? utcMs(p.entry) : null;
      if (t !== null) out.push({ lat: p.lat, lon: p.lon, t });
    } else if (p.port) {
      if (p.port.arrive !== undefined) out.push({ lat: p.lat, lon: p.lon, t: p.port.arrive });
      if (p.port.leave !== undefined) out.push({ lat: p.lat, lon: p.lon, t: p.port.leave });
    }
  }
  return out;
}

/** Where the boat was at a moment, between the timed points either side; held at the ends. */
export function positionAt(pts: Timed[], t: number): Timed {
  if (t <= pts[0].t) return pts[0];
  const last = pts[pts.length - 1];
  if (t >= last.t) return last;
  let i = 1;
  while (pts[i].t < t) i++;
  const a = pts[i - 1];
  const b = pts[i];
  const k = (t - a.t) / (b.t - a.t);
  return { lat: a.lat + (b.lat - a.lat) * k, lon: a.lon + (b.lon - a.lon) * k, t };
}

/**
 * Hours spent in each state, giving every interval between two timed entries to the state written
 * at its start. Intervals starting in port are left out.
 */
export function hoursBy(
  log: LogEntry[],
  key: (e: LogEntry) => string,
  inPort: (e: LogEntry) => boolean = () => false,
): Record<string, number> {
  const out: Record<string, number> = {};
  const timed = log.filter((e) => e.time);
  for (let i = 0; i < timed.length - 1; i++) {
    if (inPort(timed[i])) continue;
    const h = (utcMs(timed[i + 1])! - utcMs(timed[i])!) / 3_600_000;
    const k = key(timed[i]);
    out[k] = (out[k] ?? 0) + h;
  }
  return out;
}

export interface Watch {
  name: string;
  /** [from, to) in hours of ship's time */
  hours: [number, number][];
}

/** Who has the deck at an hour of the day (0–24), from a rota; null if nobody is listed. */
export function onWatch(rota: Watch[], hour: number): string | null {
  for (const w of rota) if (w.hours.some(([a, b]) => hour >= a && hour < b)) return w.name;
  return null;
}

/**
 * The log lines with a remark written in one pair's hours while the two-hour rota ran (from the
 * first evening until the day watches changed on 9 November), less any the pair didn't write.
 */
export function writtenOnWatch(log: LogEntry[], rota: Watch[], name: string, except: number[] = []): LogEntry[] {
  return log.filter((e) => {
    if (!e.time || !e.remark || e.leg !== 1 || e.date < '2026-11-05' || e.date > '2026-11-08') return false;
    if (except.includes(e.n)) return false;
    const [h, m] = e.time.split(':').map(Number);
    return onWatch(rota, h + m / 60) === name;
  });
}

/** Days are counted as in the journal: day 0 is the day before departure, 4 November. */
export function dayNumber(date: string): number {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.UTC(2026, 10, 4)) / 86_400_000);
}

/** The ship's day as a window of UTC time, [start, end): ship's time was CET until 7 November, UTC after. */
export function shipsDay(date: string): [number, number] {
  const d = Number(date.slice(8));
  const start = Date.UTC(2026, 10, d, d <= 7 ? -1 : 0);
  const end = Date.UTC(2026, 10, d + 1, d + 1 <= 7 ? -1 : 0);
  return [start, end];
}
