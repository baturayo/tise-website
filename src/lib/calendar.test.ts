import { describe, expect, it } from 'vitest';
import { events2027 } from '../data/calendar';
import {
  daysUntil,
  formatDateRange,
  getEventStatuses,
  toISODate,
} from './calendar';

const byTitle = (t: string) => {
  const e = events2027.find((ev) => ev.title.includes(t));
  if (!e) throw new Error(`no event matching ${t}`);
  return e;
};

describe('toISODate', () => {
  it('uses local date parts, not UTC', () => {
    expect(toISODate(new Date(2027, 0, 1, 0, 30))).toBe('2027-01-01');
    expect(toISODate(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });
});

describe('formatDateRange', () => {
  it('formats a single day with weekday', () => {
    expect(formatDateRange('2026-11-19')).toBe('Thu 19 Nov 2026');
    expect(formatDateRange('2027-01-16')).toBe('Sat 16 Jan 2027');
  });
  it('formats a range within one month', () => {
    expect(formatDateRange('2027-01-30', '2027-01-31')).toBe('30–31 Jan 2027');
  });
  it('formats a range across months', () => {
    expect(formatDateRange('2027-06-28', '2027-07-02')).toBe('28 Jun – 2 Jul 2027');
  });
  it('formats a range across years', () => {
    expect(formatDateRange('2026-12-30', '2027-01-02')).toBe('30 Dec 2026 – 2 Jan 2027');
  });
});

describe('getEventStatuses', () => {
  it('marks past, next and upcoming relative to today', () => {
    const s = getEventStatuses(events2027, '2027-02-01');
    expect(s[byTitle('Boat Show').id]).toBe('past');
    expect(s[byTitle('Classroom').id]).toBe('next');
    expect(s[byTitle('Sailing Talk').id]).toBe('upcoming');
    expect(Object.values(s).filter((v) => v === 'next')).toHaveLength(1);
  });
  it('marks an ongoing multi-day event as now and the following one as next', () => {
    const s = getEventStatuses(events2027, '2027-07-12');
    expect(s[byTitle('Flotilla').id]).toBe('now');
    expect(s[byTitle('Nieuwpoort').id]).toBe('next');
  });
  it('treats the last day of a range as now, not past', () => {
    const s = getEventStatuses(events2027, '2027-07-17');
    expect(s[byTitle('Flotilla').id]).toBe('now');
  });
  it('has no next event once the year is over', () => {
    const s = getEventStatuses(events2027, '2028-01-01');
    expect(Object.values(s).every((v) => v === 'past')).toBe(true);
  });
});

describe('daysUntil', () => {
  it('counts whole days between date-only strings', () => {
    expect(daysUntil('2026-12-10', '2026-11-20')).toBe(20);
    expect(daysUntil('2027-03-29', '2027-03-27')).toBe(2); // across DST change
  });
});

describe('events2027 data', () => {
  it('matches the final 2027 activity plan: titles, dates and countries', () => {
    expect(events2027.map((e) => [e.title, e.start, e.end, e.country])).toEqual([
      ['Sailors Party', '2027-01-16', undefined, 'BE'],
      ['Düsseldorf Boat Show', '2027-01-30', '2027-01-31', 'DE'],
      ['Classroom: Introduction to Sailing', '2027-02-18', undefined, 'BE'],
      ['Sailing Talk: How to Buy a Boat', '2027-03-18', undefined, 'BE'],
      ['“Hello Spring” Party', '2027-04-02', undefined, 'BE'],
      ['Sailing Weekend in Zeeland', '2027-04-09', '2027-04-11', 'NL'],
      ['Sailing in Amsterdam', '2027-05-14', '2027-05-17', 'NL'],
      ['Harbour Manoeuvres in Bruinisse Marina', '2027-06-25', '2027-06-27', 'NL'],
      ['Laser & Surfing Weekend', '2027-07-03', undefined, 'NL'],
      ['TISE Summer Flotilla: Marmaris/Hisarönü', '2027-07-10', '2027-07-17', 'TR'],
      ['Sailing Weekend in Nieuwpoort', '2027-08-14', '2027-08-15', 'BE'],
      ['TISE Open Day', '2027-09-23', undefined, 'BE'],
      ['Sailing Weekend in Zeeland', '2027-10-23', '2027-10-24', 'NL'],
      ['Year-End Party', '2027-12-09', undefined, 'BE'],
    ]);
  });
  it('lists the events in chronological order with unique ids', () => {
    const starts = events2027.map((e) => e.start);
    expect([...starts].sort()).toEqual(starts);
    expect(new Set(events2027.map((e) => e.id)).size).toBe(events2027.length);
  });
  it('keeps countries from the plan', () => {
    expect(byTitle('Flotilla').country).toBe('TR');
    expect(byTitle('Boat Show').country).toBe('DE');
    expect(byTitle('Amsterdam').country).toBe('NL');
  });
});
