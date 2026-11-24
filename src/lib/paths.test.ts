import { describe, expect, it } from 'vitest';
import { publicUrl } from './paths';

describe('publicUrl', () => {
  it('points at a file in public/ when the site sits at the root of its domain', () => {
    expect(publicUrl('/crew/ozlem.jpg', '/')).toBe('/crew/ozlem.jpg');
  });

  it('points at a file in public/ when the site sits in a folder, as on GitHub Pages', () => {
    expect(publicUrl('/crew/ozlem.jpg', '/tise-website/')).toBe('/tise-website/crew/ozlem.jpg');
  });

  it('stays relative to the page when the build is relative', () => {
    expect(publicUrl('/calendar.ics', './')).toBe('./calendar.ics');
  });

  it('accepts paths written without the leading slash', () => {
    expect(publicUrl('photos/harbour-1280.jpg', '/')).toBe('/photos/harbour-1280.jpg');
  });
});
