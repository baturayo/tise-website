import { shipsDay } from './passage';

/** A photo from the passage, published in public/sailing-blogs/<post>/photos/ as <file>-<size>.jpg. */
export interface Photo {
  file: string;
  /** when it was taken (UTC, from the photo's own metadata, which is stripped from the published copy) */
  taken: string;
  /** pixel size of the small copy, for the aspect ratio */
  w: number;
  h: number;
  alt: string;
  caption: string;
}

/** The photos taken on one ship's day, in the order they were taken. */
export function photosOn(list: Photo[], date: string): Photo[] {
  const [start, end] = shipsDay(date);
  return list
    .filter((p) => {
      const t = Date.parse(p.taken);
      return t >= start && t < end;
    })
    .sort((a, b) => Date.parse(a.taken) - Date.parse(b.taken));
}
