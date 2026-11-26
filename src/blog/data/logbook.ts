/**
 * The boat's logbook, Alcaidesa Marina (La Línea) → Mohammedia → Agadir → Las Palmas, 5–13 November
 * 2026, transcribed from photos of its five pages. It is the only source for positions and data on
 * this page: nothing here is interpolated or invented.
 *
 * - `time` is ship's time as written (24 h). Ship's time was CET (UTC+1) until the stop at
 *   Mohammedia, then UTC (`utcOffset`). The first digits of most times are hidden in the binding and
 *   were reconstructed from the order of entries, the engine hours and the distance run; `approx`
 *   marks the least certain ones.
 * - `date` is the ship's date of the entry (the page headers only give the day a page was started).
 * - `main`/`jib` say what was set, read from the remarks and the SAIL column; `engine` is whether the
 *   engine was running at the entry.
 * - `wind` is the true wind as written: Beaufort force (F) or knots (kn).
 * - `remark` is the remarks column, with abbreviations written out.
 * - The barometer reading of 1030 at 00:00 on 11 November is as written (overwritten digit, between
 *   1022 and 1020).
 */
export type Main = 'full' | 'reef1' | 'reef2' | 'reef3' | 'trysail';
export type Jib = 'full' | 'reefed' | 'furled';

export interface LogEntry {
  /** row number, in the order written */
  n: number;
  leg: 1 | 2;
  date: string;
  time: string | null;
  utcOffset: 0 | 1;
  approx?: boolean;
  lat?: number;
  lon?: number;
  /** course over the ground, degrees true */
  cog?: number;
  /** speed over the ground, knots */
  sog?: number;
  /** barometer, hPa */
  baro?: number;
  wind?: string;
  main?: Main;
  jib?: Jib;
  engine: boolean;
  remark?: string;
}

export const logbook: LogEntry[] = [
  { n: 1, leg: 1, date: '2026-11-05', time: '15:45', utcOffset: 1, lat: 36.1167, lon: -5.3833, cog: 201, sog: 4.9, baro: 1020, wind: 'F0-1', engine: true, remark: 'Depart. Engine on' },
  { n: 2, leg: 1, date: '2026-11-05', time: '18:06', utcOffset: 1, lat: 35.9667, lon: -5.5167, cog: 211, sog: 4.2, baro: 1020, wind: 'F1-2', main: 'full', jib: 'full', engine: false, remark: 'Sails up, full sail. Whale sighted' },
  { n: 3, leg: 1, date: '2026-11-05', time: '18:50', utcOffset: 1, approx: true, engine: true, remark: 'Engine' },
  { n: 4, leg: 1, date: '2026-11-05', time: '20:08', utcOffset: 1, lat: 35.8667, lon: -5.6667, cog: 256, sog: 6.54, baro: 1020, wind: 'F0-1', main: 'full', jib: 'full', engine: true, remark: 'Full sail + engine. 1.7 kn tide in favour' },
  { n: 5, leg: 1, date: '2026-11-05', time: '22:00', utcOffset: 1, lat: 35.8, lon: -5.9333, cog: 220, sog: 5.9, baro: 1020, wind: 'F0-1', main: 'full', engine: true, remark: 'Main + engine. Cabo Espartel abeam to port' },
  { n: 6, leg: 1, date: '2026-11-05', time: '23:47', utcOffset: 1, lat: 35.65, lon: -6.1, cog: 221, sog: 4.6, baro: 1021, wind: 'F0-1', main: 'full', jib: 'full', engine: false, remark: 'Main + headsail. Port tack, close reach' },
  { n: 7, leg: 1, date: '2026-11-06', time: '01:54', utcOffset: 1, lat: 35.6, lon: -6.2, cog: 253, sog: 2.9, baro: 1020, main: 'full', jib: 'full', engine: false, remark: 'Main + headsail. 02:30 engine on' },
  { n: 8, leg: 1, date: '2026-11-06', time: '04:02', utcOffset: 1, lat: 35.5333, lon: -6.3333, cog: 220, sog: 4.6, baro: 1020, main: 'full', engine: true, remark: 'Main + engine' },
  { n: 9, leg: 1, date: '2026-11-06', time: '06:01', utcOffset: 1, lat: 35.4, lon: -6.45, cog: 212, sog: 5.1, baro: 1021, wind: 'F0-1', main: 'full', engine: true, remark: 'Main + engine' },
  { n: 10, leg: 1, date: '2026-11-06', time: '10:38', utcOffset: 1, approx: true, lat: 35.15, lon: -6.7833, cog: 230, sog: 5.2, baro: 1024, wind: 'F0', main: 'full', engine: true },
  { n: 11, leg: 1, date: '2026-11-06', time: '10:52', utcOffset: 1, lat: 35.15, lon: -6.8167, cog: 221, sog: 4.6, baro: 1023, main: 'full', jib: 'full', engine: false, remark: 'Main + jib. Engine off' },
  { n: 12, leg: 1, date: '2026-11-06', time: '14:05', utcOffset: 1, lat: 35.0167, lon: -6.8167, cog: 220, sog: 5.5, baro: 1021, wind: 'F0-1', engine: true, remark: 'Engine on. MOB + reef practice done' },
  { n: 13, leg: 1, date: '2026-11-06', time: '16:02', utcOffset: 1, lat: 34.9167, lon: -6.9667, cog: 225, sog: 5.6, baro: 1022, main: 'full', engine: true, remark: 'Main + engine' },
  { n: 14, leg: 1, date: '2026-11-06', time: '20:07', utcOffset: 1, lat: 34.5167, lon: -7.0833, cog: 191, sog: 6.0, baro: 1022, main: 'full', engine: true, remark: 'Engine + main, later only sails' },
  { n: 15, leg: 1, date: '2026-11-06', time: '22:24', utcOffset: 1, lat: 34.3333, lon: -7.1667, cog: 200, sog: 5.2, baro: 1022, main: 'full', jib: 'full', engine: false, remark: 'Main + jib' },
  { n: 16, leg: 1, date: '2026-11-07', time: '00:01', utcOffset: 1, lat: 34.1833, lon: -7.2, cog: 181, sog: 4.8, baro: 1023, main: 'full', jib: 'full', engine: false, remark: 'Main + jib. 01:40 engine on' },
  { n: 17, leg: 1, date: '2026-11-07', time: '02:00', utcOffset: 1, lat: 34.0667, lon: -7.2, cog: 201, sog: 5.3, baro: 1025, main: 'full', engine: true, remark: 'Engine + main' },
  { n: 18, leg: 1, date: '2026-11-07', time: '04:08', utcOffset: 1, lat: 33.9, lon: -7.2833, cog: 204, sog: 5.5, baro: 1023, main: 'full', engine: true, remark: 'Main + engine' },
  { n: 19, leg: 1, date: '2026-11-07', time: '05:00', utcOffset: 1, approx: true, engine: true, remark: 'Stop at Mohammedia for fuel' },
  { n: 20, leg: 1, date: '2026-11-07', time: null, utcOffset: 0, engine: false, remark: "Change ship's time to UTC" },
  { n: 21, leg: 1, date: '2026-11-07', time: '10:30', utcOffset: 0, engine: true, remark: 'Leave Mohammedia. Main tank full + 3 × 20 litres spare in jerry cans' },
  { n: 22, leg: 1, date: '2026-11-07', time: '13:00', utcOffset: 0, lat: 33.68, lon: -7.64, cog: 260, sog: 5.3, baro: 1021, wind: 'F0-1', engine: true, remark: 'Zero wind! Tested trysail + storm jib' },
  { n: 23, leg: 1, date: '2026-11-07', time: '15:59', utcOffset: 0, lat: 33.5833, lon: -7.9667, cog: 249, sog: 6.1, baro: 1019, engine: true, remark: 'Engine' },
  { n: 24, leg: 1, date: '2026-11-07', time: '18:25', utcOffset: 0, lat: 33.5, lon: -8.2333, cog: 251, sog: 6.0, baro: 1020, wind: 'F0-1', main: 'full', engine: true, remark: 'Engine + sail' },
  { n: 25, leg: 1, date: '2026-11-07', time: '19:55', utcOffset: 0, lat: 33.45, lon: -8.3833, cog: 234, sog: 5.8, baro: 1020, wind: 'F0-1', main: 'full', engine: true, remark: 'Engine + sail. Sail only at 20:00' },
  { n: 26, leg: 1, date: '2026-11-07', time: '21:49', utcOffset: 0, lat: 33.3333, lon: -8.5333, cog: 226, sog: 4.3, baro: 1019, wind: 'F0-2', main: 'full', jib: 'full', engine: false, remark: 'Main + jib. Engine on 22:50' },
  { n: 27, leg: 1, date: '2026-11-07', time: '23:00', utcOffset: 0, lat: 33.2667, lon: -8.6167, cog: 220, sog: 5.3, wind: 'F0-1', main: 'full', jib: 'full', engine: true, remark: 'Main + jib + engine' },
  { n: 28, leg: 1, date: '2026-11-08', time: '00:00', utcOffset: 0, lat: 33.2167, lon: -8.6667, cog: 250, sog: 5.07, main: 'full', engine: true, remark: 'Main + engine' },
  { n: 29, leg: 1, date: '2026-11-08', time: '01:45', utcOffset: 0, lat: 33.1167, lon: -8.8, cog: 223, sog: 5.08, baro: 1019, main: 'full', engine: true, remark: 'Main + engine' },
  { n: 30, leg: 1, date: '2026-11-08', time: '03:48', utcOffset: 0, lat: 33.0167, lon: -8.9333, cog: 227, sog: 4.8, baro: 1019, main: 'full', engine: true, remark: 'Main + engine' },
  { n: 31, leg: 1, date: '2026-11-08', time: '06:05', utcOffset: 0, lat: 32.8667, lon: -9.0833, cog: 225, sog: 5.75, baro: 1019, wind: 'F2-3', main: 'full', jib: 'full', engine: false, remark: 'Main + jib. 05:45 engine off' },
  { n: 32, leg: 1, date: '2026-11-08', time: '09:05', utcOffset: 0, lat: 32.75, lon: -9.2333, cog: 214, sog: 4.44, baro: 1017, wind: 'F2-3', main: 'full', jib: 'full', engine: false, remark: 'Main + jib. 09:30 engine on, battery charging' },
  { n: 33, leg: 1, date: '2026-11-08', time: '10:51', utcOffset: 0, lat: 32.6667, lon: -9.3833, cog: 240, sog: 6.9, baro: 1017, main: 'full', jib: 'full', engine: false, remark: 'Main + jib + engine. 10:30 engine off' },
  { n: 34, leg: 1, date: '2026-11-08', time: '12:50', utcOffset: 0, lat: 32.5167, lon: -9.4167, cog: 144, sog: 5.7, baro: 1016, wind: 'F5-6', main: 'reef3', jib: 'furled', engine: false, remark: 'Reef 3 + furled jib' },
  { n: 35, leg: 1, date: '2026-11-08', time: '14:40', utcOffset: 0, lat: 32.4167, lon: -9.2167, cog: 151, sog: 5.19, baro: 1015, wind: '15-20 kn', main: 'reef2', jib: 'full', engine: false, remark: 'Mainsail reef 2 + full jib' },
  { n: 36, leg: 1, date: '2026-11-08', time: '16:03', utcOffset: 0, lat: 32.3667, lon: -9.3833, cog: 257, sog: 4.6, baro: 1015, main: 'reef2', jib: 'full', engine: false, remark: 'Main reef 2 + full jib. 16:45 engine on' },
  { n: 37, leg: 1, date: '2026-11-08', time: '18:10', utcOffset: 0, lat: 32.2667, lon: -9.5667, cog: 262, sog: 6.2, baro: 1014, main: 'reef2', jib: 'full', engine: false, remark: 'Main reef 2 + full jib. 18:05 engine off' },
  { n: 38, leg: 1, date: '2026-11-08', time: '20:06', utcOffset: 0, lat: 32.2, lon: -9.7, cog: 158, sog: 5.44, baro: 1017, wind: '20-25 kn', main: 'reef2', jib: 'full', engine: false, remark: 'Main reef 2 + full jib' },
  { n: 39, leg: 1, date: '2026-11-08', time: '22:14', utcOffset: 0, lat: 32.05, lon: -9.6333, cog: 162, sog: 5.6, baro: 1014, main: 'reef2', engine: true, remark: 'Main reef 2. Jib swivel broken? Engine on' },
  { n: 40, leg: 1, date: '2026-11-09', time: '00:03', utcOffset: 0, lat: 31.95, lon: -9.6333, cog: 183, sog: 4.3, wind: 'F6-7?', main: 'reef2', engine: true, remark: 'Main reef 2. Engine on' },
  { n: 41, leg: 1, date: '2026-11-09', time: '04:06', utcOffset: 0, lat: 31.8167, lon: -9.7167, cog: 166, sog: 4.7, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 42, leg: 1, date: '2026-11-09', time: '06:07', utcOffset: 0, lat: 31.75, lon: -9.7667, cog: 168, sog: 4.0, baro: 1016, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 43, leg: 1, date: '2026-11-09', time: '08:07', utcOffset: 0, lat: 31.7167, lon: -9.8, cog: 183, sog: 4.3, baro: 1022, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 44, leg: 1, date: '2026-11-09', time: '10:03', utcOffset: 0, lat: 31.5333, lon: -9.8333, cog: 278, sog: 4.8, baro: 1021, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 45, leg: 1, date: '2026-11-09', time: '16:00', utcOffset: 0, lat: 31.1667, lon: -9.9333, cog: 218, sog: 5.93, baro: 1022, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 46, leg: 1, date: '2026-11-09', time: '18:10', utcOffset: 0, lat: 31.0167, lon: -9.8667, cog: 135, sog: 5.9, baro: 1022, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 47, leg: 1, date: '2026-11-09', time: '21:50', utcOffset: 0, approx: true, lat: 30.6833, lon: -9.8833, cog: 174, sog: 5.93, baro: 1022, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 48, leg: 1, date: '2026-11-10', time: '00:10', utcOffset: 0, approx: true, lat: 30.5167, lon: -9.8167, cog: 121, sog: 5.9, baro: 1022, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 49, leg: 2, date: '2026-11-10', time: '16:40', utcOffset: 0, engine: true, remark: 'Engine. Away from Agadir Marina' },
  { n: 50, leg: 2, date: '2026-11-10', time: '20:02', utcOffset: 0, lat: 30.3, lon: -9.9167, cog: 273, sog: 6.5, baro: 1021, main: 'full', engine: true, remark: 'Main + engine' },
  { n: 51, leg: 2, date: '2026-11-10', time: '22:02', utcOffset: 0, lat: 30.3167, lon: -10.1167, cog: 275, sog: 5.5, baro: 1022, main: 'full', jib: 'full', engine: false, remark: 'Main + full jib' },
  { n: 52, leg: 2, date: '2026-11-11', time: '00:00', utcOffset: 0, lat: 30.3, lon: -10.3167, cog: 276, sog: 5.97, baro: 1030, main: 'full', jib: 'full', engine: false, remark: 'Sails up' },
  { n: 53, leg: 2, date: '2026-11-11', time: '01:48', utcOffset: 0, lat: 30.3167, lon: -10.5667, cog: 276, sog: 6.9, baro: 1020, main: 'reef2', engine: true, remark: 'Main reef 2 + engine for batteries' },
  { n: 54, leg: 2, date: '2026-11-11', time: '04:02', utcOffset: 0, lat: 30.3, lon: -10.8, cog: 270, sog: 5.62, baro: 1017, main: 'reef3', engine: false, remark: 'Main reef 3. Engine off at 02:25' },
  { n: 55, leg: 2, date: '2026-11-11', time: '06:00', utcOffset: 0, lat: 30.3167, lon: -11.0, cog: 270, sog: 4.11, baro: 1017, main: 'reef3', jib: 'reefed', engine: false, remark: 'Main reef 3 + headsail reefed at about 05:50' },
  { n: 56, leg: 2, date: '2026-11-11', time: '08:13', utcOffset: 0, lat: 30.3167, lon: -11.2167, cog: 261, sog: 4.9, baro: 1016, main: 'reef3', jib: 'reefed', engine: true, remark: 'Main reef 3 + reefed headsail + engine on' },
  { n: 57, leg: 2, date: '2026-11-11', time: '15:56', utcOffset: 0, lat: 30.3833, lon: -11.9, cog: 312, sog: 3.5, baro: 1009, main: 'trysail', jib: 'reefed', engine: true, remark: 'Trysail + reefed jib. Engine on' },
  { n: 58, leg: 2, date: '2026-11-11', time: '20:00', utcOffset: 0, lat: 30.3667, lon: -12.1, cog: 239, sog: 3.4, baro: 1010, main: 'trysail', engine: true, remark: 'Trysail + engine' },
  { n: 59, leg: 2, date: '2026-11-11', time: '22:00', utcOffset: 0, lat: 30.2833, lon: -12.2, cog: 211, sog: 4.2, baro: 1012, main: 'trysail', engine: true, remark: 'Trysail + engine' },
  { n: 60, leg: 2, date: '2026-11-12', time: '02:00', utcOffset: 0, approx: true, lat: 30.1333, lon: -12.4833, cog: 223, sog: 5.45, baro: 1014, main: 'trysail', engine: true, remark: 'Trysail + engine' },
  { n: 61, leg: 2, date: '2026-11-12', time: '04:30', utcOffset: 0, approx: true, lat: 30.0167, lon: -12.7, cog: 237, sog: 4.9, baro: 1014, main: 'reef2', engine: true, remark: 'Main reef 2 + engine' },
  { n: 62, leg: 2, date: '2026-11-12', time: '08:24', utcOffset: 0, lat: 29.8833, lon: -13.0, cog: 244, sog: 7.62, baro: 1018, main: 'full', engine: false, remark: 'Main reef 2 + engine, then all reefs out and 08:24 engine off' },
  { n: 63, leg: 2, date: '2026-11-12', time: '18:18', utcOffset: 0, approx: true, lat: 29.3833, lon: -13.95, cog: 241, sog: 7.2, baro: 1018, main: 'full', jib: 'full', engine: true, remark: 'Main + jib + engine' },
  { n: 64, leg: 2, date: '2026-11-12', time: '22:06', utcOffset: 0, approx: true, lat: 29.1333, lon: -14.3167, cog: 234, sog: 7.2, baro: 1019, main: 'full', jib: 'full', engine: true, remark: 'Main + jib + engine' },
  { n: 65, leg: 2, date: '2026-11-13', time: '00:03', utcOffset: 0, approx: true, lat: 28.9833, lon: -14.5, cog: 219, sog: 6.2, baro: 1019, main: 'full', jib: 'full', engine: true, remark: 'Main + jib + engine' },
  { n: 66, leg: 2, date: '2026-11-13', time: '01:03', utcOffset: 0, approx: true, main: 'full', jib: 'full', engine: true, remark: 'VHF on' },
  { n: 67, leg: 2, date: '2026-11-13', time: '02:05', utcOffset: 0, lat: 28.8333, lon: -14.65, cog: 224, sog: 6.1, baro: 1019, main: 'full', jib: 'full', engine: true, remark: 'Main + jib + engine' },
  { n: 68, leg: 2, date: '2026-11-13', time: '04:05', utcOffset: 0, lat: 28.6833, lon: -14.8, cog: 223, sog: 6.2, baro: 1019, main: 'reef1', jib: 'full', engine: false, remark: 'Main + jib + engine. About 03:45 reef 1, engine off 04:00' },
  { n: 69, leg: 2, date: '2026-11-13', time: '05:55', utcOffset: 0, lat: 28.5833, lon: -14.9333, cog: 226, sog: 4.1, baro: 1019, main: 'reef1', jib: 'full', engine: false, remark: 'Main reef 1 + full jib' },
  { n: 70, leg: 2, date: '2026-11-13', time: '08:00', utcOffset: 0, approx: true, lat: 28.4333, lon: -15.0833, cog: 225, sog: 5.71, main: 'reef1', engine: true, remark: 'Main reef 1 + engine' },
];
