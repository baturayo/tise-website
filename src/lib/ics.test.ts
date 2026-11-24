import { describe, expect, it } from 'vitest';
import { events2027 } from '../data/calendar';
import { buildICS, subscribeLinks } from './ics';

const ics = buildICS(events2027, {
  calName: 'TISE Sailing Club',
  domain: 'tise-sailing.club',
  stamp: '20261120T120000Z',
});
const lines = ics.split('\r\n');
const unfolded = ics.replace(/\r\n /g, '');

describe('buildICS', () => {
  it('wraps one VEVENT per club event in a VCALENDAR', () => {
    expect(lines[0]).toBe('BEGIN:VCALENDAR');
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
    expect(lines.filter((l) => l === 'BEGIN:VEVENT')).toHaveLength(14);
  });
  it('uses CRLF line endings only', () => {
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  });
  it('writes multi-day events as all-day with an exclusive end date', () => {
    expect(unfolded).toContain('UID:2027-01-30-boat-show@tise-sailing-club\r\n');
    const block = unfolded.split('BEGIN:VEVENT').find((b) => b.includes('2027-01-30-boat-show'))!;
    expect(block).toContain('DTSTART;VALUE=DATE:20270130');
    expect(block).toContain('DTEND;VALUE=DATE:20270201');
  });
  it('ends single-day events on the following day, across month ends', () => {
    const block = unfolded.split('BEGIN:VEVENT').find((b) => b.includes('2027-01-16-sailor-party'))!;
    expect(block).toContain('DTSTART;VALUE=DATE:20270116');
    expect(block).toContain('DTEND;VALUE=DATE:20270117');
    const yearEnd = unfolded.split('BEGIN:VEVENT').find((b) => b.includes('year-end-party'))!;
    expect(yearEnd).toContain('DTEND;VALUE=DATE:20271210');
    const flotilla = unfolded.split('BEGIN:VEVENT').find((b) => b.includes('flotilla'))!;
    expect(flotilla).toContain('DTEND;VALUE=DATE:20270718');
  });
  it('escapes commas, semicolons and backslashes in text', () => {
    const out = buildICS(
      [{ id: 'x', title: 'A, B; C\\D', start: '2027-01-01', country: 'BE', organisers: [], kind: 'social' }],
      { calName: 'T', domain: 'd', stamp: '20261120T120000Z' },
    );
    expect(out).toContain('SUMMARY:A\\, B\\; C\\\\D');
  });
  it('folds lines longer than 75 octets', () => {
    expect(lines.every((l) => new TextEncoder().encode(l).length <= 75)).toBe(true);
  });
  it('names the calendar and asks clients to refresh', () => {
    expect(unfolded).toContain('X-WR-CALNAME:TISE Sailing Club');
    expect(unfolded).toContain('REFRESH-INTERVAL;VALUE=DURATION:PT12H');
    expect(unfolded).toContain('DTSTAMP:20261120T120000Z');
  });
});

describe('event identity', () => {
  it('keeps event UIDs stable when the site moves to another domain', () => {
    const a = buildICS(events2027, { calName: 'T', domain: 'tise-sailing.club', stamp: '20261120T120000Z' });
    const b = buildICS(events2027, { calName: 'T', domain: 'tisesailing.eu', stamp: '20261120T120000Z' });
    const uids = (s: string) => s.split('\r\n').filter((l) => l.startsWith('UID:'));
    expect(uids(a)).toEqual(uids(b));
    expect(uids(a)[0]).toBe('UID:2027-01-16-sailor-party@tise-sailing-club');
  });
});

describe('subscribeLinks', () => {
  it('builds webcal, Google and Outlook links from the feed URL', () => {
    const links = subscribeLinks('https://x.org/calendar.ics', 'TISE Sailing Club');
    expect(links.apple).toBe('webcal://x.org/calendar.ics');
    expect(links.google).toBe(
      'https://calendar.google.com/calendar/render?cid=' + encodeURIComponent('webcal://x.org/calendar.ics'),
    );
    expect(links.outlook).toContain('https://outlook.live.com/calendar/0/addfromweb?url=');
    expect(links.outlook).toContain(encodeURIComponent('https://x.org/calendar.ics'));
    expect(links.download).toBe('https://x.org/calendar.ics');
  });
});
