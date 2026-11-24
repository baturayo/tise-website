import type { ClubEvent } from '../data/calendar';

export type EventStatus = 'past' | 'now' | 'next' | 'upcoming';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DateParts {
  y: number;
  m: number; // 1-12
  d: number;
}

export function parseISODate(iso: string): DateParts {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m, d };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar date of `d` as YYYY-MM-DD (never shifted through UTC). */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const dayNumber = ({ y, m, d }: DateParts) => Date.UTC(y, m - 1, d) / 86_400_000;

export function weekday(iso: string): string {
  const p = parseISODate(iso);
  return WEEKDAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()];
}

export function monthName(iso: string): string {
  return MONTHS[parseISODate(iso).m - 1];
}

export function formatDateRange(start: string, end?: string): string {
  const s = parseISODate(start);
  if (!end || end === start) {
    return `${weekday(start)} ${s.d} ${MONTHS[s.m - 1]} ${s.y}`;
  }
  const e = parseISODate(end);
  if (s.y !== e.y) {
    return `${s.d} ${MONTHS[s.m - 1]} ${s.y} – ${e.d} ${MONTHS[e.m - 1]} ${e.y}`;
  }
  if (s.m !== e.m) {
    return `${s.d} ${MONTHS[s.m - 1]} – ${e.d} ${MONTHS[e.m - 1]} ${e.y}`;
  }
  return `${s.d}–${e.d} ${MONTHS[s.m - 1]} ${s.y}`;
}

export function daysUntil(date: string, today: string): number {
  return dayNumber(parseISODate(date)) - dayNumber(parseISODate(today));
}

/** Status of each event (by id). Exactly one event — the first starting after today — is `next`. */
export function getEventStatuses(events: ClubEvent[], today: string): Record<string, EventStatus> {
  const result: Record<string, EventStatus> = {};
  let nextAssigned = false;
  for (const ev of [...events].sort((a, b) => a.start.localeCompare(b.start))) {
    const last = ev.end ?? ev.start;
    if (last < today) {
      result[ev.id] = 'past';
    } else if (ev.start <= today) {
      result[ev.id] = 'now';
    } else if (!nextAssigned) {
      result[ev.id] = 'next';
      nextAssigned = true;
    } else {
      result[ev.id] = 'upcoming';
    }
  }
  return result;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The months the club is at a place ("Apr, Jun, Oct"), in calendar order. */
export function monthsAtPlace(events: ClubEvent[], place: string): string {
  const months = events.filter((e) => e.place === place).map((e) => MONTHS_SHORT[parseISODate(e.start).m - 1]);
  return [...new Set(months)].join(', ');
}
