import { describe, expect, it } from 'vitest';
import { pickActive } from './sections';

describe('pickActive', () => {
  const page = [
    { id: 'about', top: -2000 },
    { id: 'crew', top: -100 },
    { id: 'voyage', top: 500 },
  ];

  it('picks the last section whose top has scrolled past the reading line', () => {
    expect(pickActive(page, 300, false)).toBe('crew');
  });

  it('picks the first section before any has reached the line', () => {
    expect(
      pickActive(
        [
          { id: 'deck', top: 100 },
          { id: 'about', top: 900 },
        ],
        50,
        false,
      ),
    ).toBe('deck');
  });

  it('picks the last section once the page is scrolled to the bottom', () => {
    expect(pickActive(page, 300, true)).toBe('voyage');
  });

  it('returns nothing when there are no sections', () => {
    expect(pickActive([], 300, false)).toBeUndefined();
  });
});
