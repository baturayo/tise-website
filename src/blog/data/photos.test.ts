import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { photosOn } from '../lib/photos';
import { days } from './passage';
import { PHOTO_SIZES, photos } from './photos';

const folder = new URL('../../../public/sailing-blogs/gibraltar-to-las-palmas/photos/', import.meta.url);
const published = photos.flatMap((p) => PHOTO_SIZES.map((size) => new URL(`${p.file}-${size}.jpg`, folder)));
/** and the image link previews use, next to the post */
const preview = new URL('../og.jpg', folder);

/** A JPEG's bytes as text, one character per byte, to search it. */
const asText = (jpeg: Uint8Array) => new TextDecoder('latin1').decode(jpeg);

/** The tag numbers in a JPEG's Exif block (main and Exif directories), or none if it has no Exif. */
function exifTags(jpeg: Uint8Array): number[] {
  const at = asText(jpeg).indexOf('Exif\0\0');
  if (at < 0) return [];
  const tiff = new DataView(jpeg.buffer, jpeg.byteOffset + at + 6);
  const le = tiff.getUint16(0) === 0x4949; // 'II': little-endian
  const u16 = (o: number) => tiff.getUint16(o, le);
  const u32 = (o: number) => tiff.getUint32(o, le);
  const dir = (o: number) => Array.from({ length: u16(o) }, (_, k) => ({ tag: u16(o + 2 + 12 * k), value: u32(o + 10 + 12 * k) }));
  const main = dir(u32(4));
  const sub = main.find((e) => e.tag === 0x8769);
  return [...main, ...(sub ? dir(sub.value) : [])].map((e) => e.tag);
}

describe('the passage photos', () => {
  it('each land on a day of the passage', () => {
    for (const p of photos) {
      expect(days.filter((d) => photosOn([p], d.date).length === 1), p.file).toHaveLength(1);
    }
  });

  it('are all published, at every size', () => {
    for (const url of published) expect(existsSync(url), url.pathname).toBe(true);
  });

  it('carry no location, camera or time stamps: the site’s code is public', () => {
    const GPS = 0x8825, MAKE = 0x010f, MODEL = 0x0110, DATETIME = 0x0132, TAKEN = 0x9003, DIGITISED = 0x9004;
    for (const url of [...published, preview]) {
      const jpeg = readFileSync(url);
      for (const tag of [GPS, MAKE, MODEL, DATETIME, TAKEN, DIGITISED]) expect(exifTags(jpeg), url.pathname).not.toContain(tag);
      expect(asText(jpeg), url.pathname).not.toContain('iPhone');
    }
  });

  it('each say what is in them', () => {
    for (const p of photos) {
      expect(p.alt.length, p.file).toBeGreaterThan(10);
      expect(p.caption.length, p.file).toBeGreaterThan(10);
    }
  });
});
