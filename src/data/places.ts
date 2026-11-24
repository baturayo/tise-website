import type { Coords } from '../lib/geo';

/**
 * Positions of the places in the calendar (from Wikipedia), shown as waypoints on the 2027 chart.
 * Add one here whenever an activity gets a new `place`.
 */
export const placeCoords: Record<string, Coords> = {
  Düsseldorf: { lat: 51.2256, lon: 6.7767 },
  Bruinisse: { lat: 51.66027778, lon: 4.09333333 },
  Amsterdam: { lat: 52.37277778, lon: 4.89361111 },
  'Marmaris / Hisarönü': { lat: 36.85333333, lon: 28.27083333 },
  Nieuwpoort: { lat: 51.11666667, lon: 2.75 },
};

/** The club's home port, where the boat starts on the chart. */
export const homePort = { name: 'Brussels', lon: 4.3517, lat: 50.8503 };

/**
 * The season's course drawn on the chart: out of Brussels by canal through Antwerp to Zeeland, out to
 * sea and up the coast to Amsterdam, then back down to Nieuwpoort. Points with a name are places
 * from the calendar; the others keep the course on the water.
 */
export const seasonCourse: Array<{ lon: number; lat: number; place?: string }> = [
  { lon: homePort.lon, lat: homePort.lat, place: homePort.name },
  { lon: 4.4, lat: 51.22 },
  { lon: 4.27, lat: 51.44 },
  { lon: 4.0933, lat: 51.6603, place: 'Bruinisse' },
  { lon: 3.88, lat: 51.765 },
  { lon: 3.62, lat: 51.86 },
  { lon: 3.95, lat: 52.15 },
  { lon: 4.42, lat: 52.47 },
  { lon: 4.8936, lat: 52.3728, place: 'Amsterdam' },
  { lon: 4.45, lat: 52.505 },
  { lon: 3.55, lat: 52.2 },
  { lon: 3.1, lat: 51.62 },
  { lon: 2.7, lat: 51.16, place: 'Nieuwpoort' },
];

/** The part of the course (between these two points) sailed while the club is in Türkiye in July. */
export const turkiyeLeg: [number, number] = [9, 11];
