import { describe, expect, it } from 'vitest';
import { events2027 } from '../data/calendar';
import { placeCoords } from '../data/places';
import { formatCoords } from './geo';

describe('formatCoords', () => {
  it('writes degrees and minutes with the hemisphere, as on a chart', () => {
    expect(formatCoords({ lat: 51.66027778, lon: 4.09333333 })).toBe('51°40′N 4°06′E');
  });
  it('uses S and W south of the equator and west of Greenwich', () => {
    expect(formatCoords({ lat: -33.8568, lon: -151.2153 })).toBe('33°51′S 151°13′W');
  });
  it('carries 60 rounded minutes into the next degree', () => {
    expect(formatCoords({ lat: 50.9999, lon: 4 })).toBe('51°00′N 4°00′E');
  });
});

describe('placeCoords', () => {
  it('has a position for every place in the calendar', () => {
    const places = [...new Set(events2027.flatMap((e) => (e.place ? [e.place] : [])))];
    expect(places.filter((p) => !placeCoords[p])).toEqual([]);
  });
});
