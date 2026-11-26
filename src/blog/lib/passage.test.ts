import { describe, expect, it } from 'vitest';
import type { LogEntry } from '../data/logbook';
import {
  buildTrack,
  dayNumber,
  hoursBy,
  nauticalMiles,
  onWatch,
  positionAt,
  shipTime,
  trackLength,
  utcMs,
} from './passage';

const entry = (over: Partial<LogEntry>): LogEntry => ({
  n: 1,
  leg: 1,
  date: '2026-11-05',
  time: '12:00',
  utcOffset: 0,
  engine: false,
  ...over,
});

describe('nauticalMiles', () => {
  it('counts a degree of latitude as 60 miles', () => {
    expect(nauticalMiles({ lat: 30, lon: -10 }, { lat: 31, lon: -10 })).toBeCloseTo(60.04, 1);
  });
  it('shortens a degree of longitude by the cosine of the latitude', () => {
    expect(nauticalMiles({ lat: 60, lon: 0 }, { lat: 60, lon: 1 })).toBeCloseTo(30.02, 1);
  });
});

describe('utcMs and shipTime', () => {
  it('turns ship time at UTC+1 into UTC', () => {
    expect(new Date(utcMs(entry({ time: '15:45', utcOffset: 1 }))!).toISOString()).toBe('2026-11-05T14:45:00.000Z');
  });
  it('has no time for an entry written without one', () => {
    expect(utcMs(entry({ time: null }))).toBeNull();
  });
  it('writes UTC back as ship time with the offset of the day', () => {
    expect(shipTime(Date.UTC(2026, 10, 5, 14, 45), 1)).toBe('15:45');
  });
});

describe('buildTrack', () => {
  const log = [
    entry({ n: 1, time: '10:00', lat: 36, lon: -5 }),
    entry({ n: 2, time: '12:00', lat: 35, lon: -6, remark: 'Stop at port' }),
    entry({ n: 3, time: '14:00' }),
    entry({ n: 4, time: '16:00', lat: 34, lon: -7 }),
  ];
  const ports = [
    { id: 'a', name: 'A', lat: 36.1, lon: -4.9, after: 0 },
    { id: 'b', name: 'B', lat: 34.5, lon: -6.5, after: 3 },
  ];
  it('runs from the first port through the fixes, with the ports in their place', () => {
    const t = buildTrack(log, ports);
    expect(t.map((p) => p.kind)).toEqual(['port', 'fix', 'fix', 'port', 'fix']);
  });
  it('marks only fix-to-fix legs as logged', () => {
    const t = buildTrack(log, ports);
    expect(t.map((p) => p.logged)).toEqual([false, false, true, false, false]);
  });
});

describe('trackLength', () => {
  it('adds up the legs, and the logged ones on their own', () => {
    const pts = [
      { lat: 30, lon: -10, logged: false },
      { lat: 31, lon: -10, logged: true },
      { lat: 32, lon: -10, logged: false },
    ];
    const { total, logged } = trackLength(pts);
    expect(total).toBeCloseTo(120.08, 1);
    expect(logged).toBeCloseTo(60.04, 1);
  });
});

describe('positionAt', () => {
  const pts = [
    { lat: 30, lon: -10, t: 0 },
    { lat: 31, lon: -12, t: 100 },
  ];
  it('interpolates between the fixes either side', () => {
    expect(positionAt(pts, 50)).toMatchObject({ lat: 30.5, lon: -11 });
  });
  it('stays at the ends outside the logged time', () => {
    expect(positionAt(pts, -5)).toMatchObject({ lat: 30, lon: -10 });
    expect(positionAt(pts, 500)).toMatchObject({ lat: 31, lon: -12 });
  });
});

describe('hoursBy', () => {
  it('gives each interval to the state written at its start', () => {
    const log = [
      entry({ time: '00:00', engine: true }),
      entry({ time: '02:00', engine: false }),
      entry({ time: '05:00', engine: true }),
    ];
    expect(hoursBy(log, (e) => (e.engine ? 'engine' : 'sail'))).toEqual({ engine: 2, sail: 3 });
  });
  it('skips intervals that start in port', () => {
    const log = [
      entry({ time: '00:00', engine: true, remark: 'Stop at port' }),
      entry({ time: '06:00', engine: true }),
      entry({ time: '07:00', engine: false }),
    ];
    expect(hoursBy(log, () => 'x', (e) => e.remark === 'Stop at port')).toEqual({ x: 1 });
  });
});

describe('onWatch', () => {
  const rota = [
    { name: 'me', hours: [[16, 18], [22, 24], [4, 6], [10, 12]] as [number, number][] },
    { name: 'them', hours: [[18, 20], [0, 2], [6, 8], [12, 14]] as [number, number][] },
  ];
  it('finds who has the deck at an hour', () => {
    expect(onWatch(rota, 23.5)).toBe('me');
    expect(onWatch(rota, 0.25)).toBe('them');
  });
  it('is nobody listed outside the rota', () => {
    expect(onWatch(rota, 9)).toBeNull();
  });
});

describe('dayNumber', () => {
  it('counts days from the day before departure (day 0)', () => {
    expect(dayNumber('2026-11-04')).toBe(0);
    expect(dayNumber('2026-11-13')).toBe(9);
  });
});
