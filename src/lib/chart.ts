/** Geometry for the sea chart at the top of the page: Mercator projection and positions along a route. */

export interface Pt {
  x: number;
  y: number;
}

/** R: pixels per radian of longitude; lon0/latTop: the chart's top-left corner. */
export interface Projection {
  R: number;
  lon0: number;
  latTop: number;
}

const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

/** A position on the chart (x to the east, y to the south), as on a Mercator nautical chart. */
export function project(m: Projection, lon: number, lat: number): Pt {
  return { x: (m.R * (lon - m.lon0) * Math.PI) / 180, y: m.R * (merc(m.latTop) - merc(lat)) };
}

/** Distance sailed to reach each point of a route of straight courses. */
export function cumulativeLengths(pts: Pt[]): number[] {
  const out = [0];
  for (let i = 1; i < pts.length; i++) {
    out.push(out[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return out;
}

export interface Along extends Pt {
  /** the course being sailed */
  dx: number;
  dy: number;
  /** index of the point the boat is heading for */
  index: number;
}

/** Where the boat is after sailing a given distance along the route, and which way it is heading. */
export function pointAlong(pts: Pt[], cum: number[], len: number): Along {
  const total = cum[cum.length - 1];
  const d = Math.min(Math.max(len, 0), total);
  let i = 1;
  while (i < pts.length - 1 && cum[i] < d) i++;
  const a = pts[i - 1];
  const b = pts[i];
  const span = cum[i] - cum[i - 1];
  const t = span ? (d - cum[i - 1]) / span : 0;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, dx: b.x - a.x, dy: b.y - a.y, index: i };
}

/** A parallel written the way a chart border labels it: 52°30′N. */
export function formatLatitude(lat: number): string {
  const total = Math.round(Math.abs(lat) * 60);
  return `${Math.floor(total / 60)}°${String(total % 60).padStart(2, '0')}′${lat < 0 ? 'S' : 'N'}`;
}
