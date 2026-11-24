import { describe, expect, it } from 'vitest';
import { events2027 } from '../data/calendar';
import { monthsAtPlace } from './calendar';
import { cumulativeLengths, formatLatitude, pointAlong, project } from './chart';

describe('project (Mercator, y down)', () => {
  const m = { R: 180 / Math.PI, lon0: 2, latTop: 53 };
  it('puts the top-left corner of the chart at 0,0', () => {
    const p = project(m, 2, 53);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(0);
  });
  it('moves right going east and down going south', () => {
    expect(project(m, 3, 53).x).toBeCloseTo(1);
    expect(project(m, 2, 52).y).toBeGreaterThan(0);
  });
  it('stretches latitude the Mercator way', () => {
    const p = project({ R: 1, lon0: 0, latTop: 45 }, 0, 0);
    expect(p.y).toBeCloseTo(Math.log(Math.tan(Math.PI / 4 + Math.PI / 8)));
  });
});

describe('route geometry', () => {
  const pts = [
    { x: 0, y: 0 },
    { x: 3, y: 4 },
    { x: 3, y: 14 },
  ];
  const cum = cumulativeLengths(pts);
  it('measures the distance sailed to each point', () => {
    expect(cum).toEqual([0, 5, 15]);
  });
  it('finds the position and heading a given distance along the route', () => {
    expect(pointAlong(pts, cum, 0)).toMatchObject({ x: 0, y: 0, index: 1 });
    const p = pointAlong(pts, cum, 10);
    expect(p.x).toBeCloseTo(3);
    expect(p.y).toBeCloseTo(9);
    expect(p).toMatchObject({ dx: 0, dy: 10, index: 2 });
  });
  it('stays at the ends when asked to go before the start or past the finish', () => {
    expect(pointAlong(pts, cum, -5)).toMatchObject({ x: 0, y: 0 });
    expect(pointAlong(pts, cum, 99)).toMatchObject({ x: 3, y: 14 });
  });
});

describe('formatLatitude', () => {
  it('writes a parallel the way a chart border does', () => {
    expect(formatLatitude(51)).toBe('51°00′N');
    expect(formatLatitude(52.5)).toBe('52°30′N');
    expect(formatLatitude(-33.5)).toBe('33°30′S');
  });
});

describe('monthsAtPlace', () => {
  it('lists the months the club is at a place, in calendar order, once each', () => {
    expect(monthsAtPlace(events2027, 'Bruinisse')).toBe('Apr, Jun, Oct');
    expect(monthsAtPlace(events2027, 'Amsterdam')).toBe('May');
    expect(monthsAtPlace(events2027, 'Nowhere')).toBe('');
  });
});
