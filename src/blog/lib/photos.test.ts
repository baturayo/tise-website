import { describe, expect, it } from 'vitest';
import { photosOn, type Photo } from './photos';

const photo = (file: string, taken: string): Photo => ({ file, taken, w: 600, h: 800, alt: file, caption: file });
const files = (list: Photo[]) => list.map((p) => p.file);

describe('photosOn', () => {
  it('puts a photo on the ship’s day it was taken: ship’s time was CET until 7 November', () => {
    // 23:30 UTC on the 5th was already 00:30 on the 6th aboard
    const list = [photo('after-midnight', '2026-11-05T23:30:00Z')];
    expect(photosOn(list, '2026-11-05')).toEqual([]);
    expect(files(photosOn(list, '2026-11-06'))).toEqual(['after-midnight']);
  });

  it('and UTC after', () => {
    const list = [photo('dolphins', '2026-11-07T22:39:55Z'), photo('kite', '2026-11-12T15:54:20Z')];
    expect(files(photosOn(list, '2026-11-07'))).toEqual(['dolphins']);
    expect(photosOn(list, '2026-11-08')).toEqual([]);
    expect(files(photosOn(list, '2026-11-12'))).toEqual(['kite']);
  });

  it('lists a day’s photos in the order they were taken', () => {
    const list = [photo('whale', '2026-11-05T16:59:46Z'), photo('marina', '2026-11-05T08:26:25Z'), photo('crew', '2026-11-05T16:47:56Z')];
    expect(files(photosOn(list, '2026-11-05'))).toEqual(['marina', 'crew', 'whale']);
  });

  it('does not reorder the list it is given', () => {
    const list = [photo('b', '2026-11-05T12:00:00Z'), photo('a', '2026-11-05T09:00:00Z')];
    photosOn(list, '2026-11-05');
    expect(files(list)).toEqual(['b', 'a']);
  });
});
