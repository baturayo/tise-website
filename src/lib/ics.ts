import { countryNames, type ClubEvent } from '../data/calendar';
import { parseISODate } from './calendar';

interface ICSOptions {
  calName: string;
  domain: string;
  /** DTSTAMP value, UTC, e.g. 20261120T120000Z */
  stamp: string;
}

/** Identifies our events in every calendar. Never derive it from the site address: moving domains would duplicate events. */
const UID_SUFFIX = 'tise-sailing-club';

const escapeText = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Fold a content line to at most 75 octets per physical line (RFC 5545 §3.1). */
function fold(line: string): string[] {
  const enc = new TextEncoder();
  const out: string[] = [];
  let current = '';
  for (const ch of line) {
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (enc.encode(current + ch).length > limit) {
      out.push(out.length === 0 ? current : ' ' + current);
      current = ch;
    } else {
      current += ch;
    }
  }
  out.push(out.length === 0 ? current : ' ' + current);
  return out;
}

const compact = (iso: string) => iso.replace(/-/g, '');

function dayAfter(iso: string): string {
  const { y, m, d } = parseISODate(iso);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return `${next.getUTCFullYear()}${String(next.getUTCMonth() + 1).padStart(2, '0')}${String(next.getUTCDate()).padStart(2, '0')}`;
}

export function buildICS(events: ClubEvent[], opts: ICSOptions): string {
  const raw: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${opts.calName}//Activity Calendar//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(opts.calName)}`,
    'X-WR-TIMEZONE:Europe/Brussels',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
  ];
  for (const ev of events) {
    const location = [ev.place, countryNames[ev.country]].filter(Boolean).join(', ');
    const description = ev.organisers.length
      ? `Organised by ${ev.organisers.join(' & ')}. More at https://${opts.domain}`
      : `More at https://${opts.domain}`;
    raw.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@${UID_SUFFIX}`,
      `DTSTAMP:${opts.stamp}`,
      `DTSTART;VALUE=DATE:${compact(ev.start)}`,
      `DTEND;VALUE=DATE:${dayAfter(ev.end ?? ev.start)}`,
      `SUMMARY:${escapeText(ev.title)}`,
      `LOCATION:${escapeText(location)}`,
      `DESCRIPTION:${escapeText(description)}`,
      `CATEGORIES:${ev.kind.toUpperCase()}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    );
  }
  raw.push('END:VCALENDAR');
  return raw.flatMap(fold).join('\r\n') + '\r\n';
}

export function subscribeLinks(feedUrl: string, calName: string) {
  const webcal = feedUrl.replace(/^https?:\/\//, 'webcal://');
  return {
    apple: webcal,
    google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
    outlook: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(feedUrl)}&name=${encodeURIComponent(calName)}`,
    download: feedUrl,
  };
}
