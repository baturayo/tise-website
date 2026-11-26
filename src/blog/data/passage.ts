/**
 * The story of the passage, day by day, and the facts around it. Positions, times and numbers come
 * from the boat's logbook (logbook.ts); events, people, meals and wildlife from a crewmate's journal,
 * kept in French on board. Crewmates are named by first name only.
 */
import type { Port, Watch } from '../lib/passage';

/** Harbours: where the logbook names them; their positions are the harbours' own. */
export const ports: (Port & { place: string; labelSide?: 'left' | 'right' })[] = [
  {
    id: 'alcaidesa',
    name: 'Alcaidesa Marina',
    place: 'La Línea, under the Rock of Gibraltar',
    lat: 36.159,
    lon: -5.358,
    after: 0,
    leave: Date.UTC(2026, 10, 5, 14, 5), // 15:05 ship's time (CET)
  },
  {
    id: 'mohammedia',
    name: 'Mohammedia',
    place: 'Morocco, for diesel',
    lat: 33.716,
    lon: -7.392,
    after: 19,
    arrive: Date.UTC(2026, 10, 7, 5, 0), // 06:00 CET, from the journal
    leave: Date.UTC(2026, 10, 7, 10, 30),
  },
  {
    id: 'agadir',
    name: 'Agadir',
    place: 'Morocco: entry, repairs, a shower',
    lat: 30.425,
    lon: -9.634,
    after: 48,
    arrive: Date.UTC(2026, 10, 10, 2, 30), // from the journal
    leave: Date.UTC(2026, 10, 10, 16, 40),
  },
  {
    id: 'laspalmas',
    name: 'Las Palmas',
    place: 'Gran Canaria',
    labelSide: 'right',
    lat: 28.127,
    lon: -15.425,
    after: 70,
  },
];

/** Names on the chart, as on a paper chart: land upright, water in italics. */
export const chartNames: { name: string; lat: number; lon: number; water?: boolean; island?: boolean; anchor?: 'start' | 'middle' | 'end' }[] = [
  { name: 'Gibraltar', lat: 36.3, lon: -5.15, anchor: 'start' },
  { name: 'Tangier', lat: 35.72, lon: -5.6, anchor: 'start' },
  { name: 'Cabo Espartel', lat: 35.7, lon: -6.0, anchor: 'end' },
  { name: 'Casablanca', lat: 33.52, lon: -7.35, anchor: 'start' },
  { name: 'Safi', lat: 32.3, lon: -9.05, anchor: 'start' },
  { name: 'Madeira', lat: 32.95, lon: -16.85, anchor: 'start', island: true },
  { name: 'Lanzarote', lat: 29.4, lon: -13.35, anchor: 'start', island: true },
  { name: 'Fuerteventura', lat: 28.25, lon: -13.75, anchor: 'start', island: true },
  { name: 'Gran Canaria', lat: 27.62, lon: -15.6, anchor: 'middle', island: true },
  { name: 'Tenerife', lat: 28.62, lon: -16.6, anchor: 'start', island: true },
  { name: 'North Atlantic Ocean', lat: 33.6, lon: -13.4, water: true },
  { name: 'Strait of Gibraltar', lat: 36.42, lon: -6.6, water: true, anchor: 'end' },
  { name: 'Mediterranean', lat: 36.55, lon: -3.2, water: true },
  { name: 'Spain', lat: 37.5, lon: -4.8 },
  { name: 'Portugal', lat: 38.6, lon: -8.0 },
  { name: 'Morocco', lat: 32.2, lon: -6.6 },
];

/**
 * The watches on the way to Agadir: three pairs, two hours each. The journal's writer kept
 * 18–20, 00–02, 06–08 and 12–14 with Sophia, and mine came straight before his.
 */
export const rota: (Watch & { label: string; mine?: boolean })[] = [
  { name: 'mine', label: 'My watch', mine: true, hours: [[4, 6], [10, 12], [16, 18], [22, 24]] },
  { name: 'journal', label: 'The journal’s writer and Sophia', hours: [[0, 2], [6, 8], [12, 14], [18, 20]] },
  { name: 'third', label: 'The third pair', hours: [[2, 4], [8, 10], [14, 16], [20, 22]] },
];

/** The skipper's standing orders, from the first page of the log. */
export const callTheSkipper = [
  'Any risk of collision, close-quarters situation or uncertainty',
  'Visibility deteriorating or falling below 2 nautical miles',
  'Wind increasing by more than 10 knots, or by more than you are comfortable with',
  'An unexpected wind shift of more than about 30°',
  'A need to reef or to alter the passage plan',
  'Any suspected equipment failure',
  'Engine or equipment failure',
  'Any person injured, unwell or showing signs of significant fatigue',
  'Any navigation uncertainty',
  'Any man overboard, fire, flooding or other emergency',
  'Any situation where the watchkeeper is uncertain',
  'If the engine is required, or needs to be switched off',
];

export type Kind = 'wildlife' | 'gear' | 'galley' | 'harbour' | 'sailing';

export interface DayEvent {
  /** ship's time, as in the log or the journal */
  time?: string;
  text: string;
  kind: Kind;
  /** the logbook row it belongs to, when it is in the log */
  n?: number;
}

export interface Day {
  date: string;
  weekday: string;
  title: string;
  story: string[];
  events: DayEvent[];
  /** logbook rows to show as an extract of the log */
  extract?: number[];
}

export const days: Day[] = [
  {
    date: '2026-11-04',
    weekday: 'Wednesday',
    title: 'Scrubbing and stowing',
    story: [
      'There were seven of us aboard at Alcaidesa Marina, in La Línea, with the Rock of Gibraltar behind the pontoons: Rob, our skipper, and a crew of six. Day 0 was for work, not sailing: cleaning the boat, and provisioning for the passage south.',
      'The plan was to sail to Las Palmas de Gran Canaria by way of Agadir, in Morocco: just under 830 miles, as it turned out.',
    ],
    events: [{ text: 'Cleaning and provisioning in Alcaidesa Marina', kind: 'harbour' }],
  },
  {
    date: '2026-11-05',
    weekday: 'Thursday',
    title: 'Two leaks and a whale',
    story: [
      'We were meant to leave at eight. At seven we were at customs, declaring our route via Agadir; at eight we were filling up with diesel; at half past eight an electronic fault showed up, and looking for it, we found two leaks in the engine’s cooling. The morning went on pumping and tracing pipes. With the bilges dry and a rule to check the water level every hour, we finally slipped the lines at 15:05.',
      'Three hours later, crossing the shipping lanes of the Strait, a whale surfaced beside us: the log’s second line reads “Sails up – full sail – whale sighted”. Then the wind died, exactly as forecast, the engine went back on, and a 1.7-knot tide carried us west. Nikolas made a mushroom risotto with courgette.',
      'The watches started that evening, two hours each. Mine began at 22:00, as Cabo Espartel, the north-west corner of Africa, came abeam to port. By midnight the sea was calm, the sky clear and the Mediterranean behind us.',
    ],
    events: [
      { time: '07:00', text: 'Customs: route declared via Agadir', kind: 'harbour' },
      { time: '08:30', text: 'Electronic fault; two leaks found in the engine cooling', kind: 'gear' },
      { time: '15:05', text: 'Departure from Alcaidesa Marina', kind: 'harbour', n: 1 },
      { time: '18:06', text: 'Whale sighted in the shipping lanes', kind: 'wildlife', n: 2 },
      { time: '22:00', text: 'Cabo Espartel abeam, on my watch', kind: 'sailing', n: 5 },
      { text: 'Mushroom risotto with courgette (Nikolas)', kind: 'galley' },
    ],
    extract: [2, 4, 5, 6],
  },
  {
    date: '2026-11-06',
    weekday: 'Friday',
    title: 'A sextant at sunrise',
    story: [
      'A windless first full day down the Moroccan coast, mostly under engine. At sunrise Rob showed us the principle of the sextant: bring the lower image down to the horizon. On my late-morning watch there was finally enough breeze to stop the engine and sail on main and jib.',
      'After lunch came the drills: man overboard and reefing, done by 14:05, and we used the light weather to set up the automatic third reef. Dinner was pasta with tomato and onion sauce. For seven, Nikolas reckoned, 600 grams.',
      'At midnight the plan changed: we needed diesel. The watch on deck turned south, to 190° and then 200°, for the port of Mohammedia.',
    ],
    events: [
      { text: 'Sextant demonstration at sunrise', kind: 'sailing' },
      { time: '10:52', text: 'Engine off, main and jib, on my watch', kind: 'sailing', n: 11 },
      { time: '14:05', text: 'Man-overboard and reefing practice done', kind: 'sailing', n: 12 },
      { text: 'Pasta with tomato and onion: 600 g for seven', kind: 'galley' },
      { time: '00:00', text: 'Course changed for Mohammedia, for diesel', kind: 'harbour', n: 16 },
    ],
    extract: [11, 12, 15, 16],
  },
  {
    date: '2026-11-07',
    weekday: 'Saturday',
    title: 'Diesel in Mohammedia',
    story: [
      'We reached Mohammedia at six in the morning and the harbour office asked us to wait outside. Fine: we would anchor. Except the anchor had been taken off the boat, chain and rope, before we came aboard, so first we had to rig it. Meanwhile we found that the reserve gas bottle was suspiciously light (Tymon disagreed), and then jerry cans on board holding enough diesel for the passage.',
      'We left at 10:30 with the main tank full and ten litres spare. Ship’s time went over to UTC. At 13:00, in a flat calm, we tried the storm sails: the storm jib could not be hoisted at all, being lashed with elastic around the furled genoa. Better to learn that in zero wind.',
      'Rob set up a galley rota, since Nikolas was spending most of his life at the stove: the afternoon watch cooks dinner, and the next day’s lunch.',
    ],
    events: [
      { time: '06:00', text: 'Arrived off Mohammedia; anchor rigged, then dropped', kind: 'harbour' },
      { text: 'Jerry cans of diesel found on board', kind: 'gear' },
      { time: '10:30', text: 'Left Mohammedia: tank full + 10 litres spare', kind: 'harbour', n: 21 },
      { text: 'Ship’s time changed to UTC', kind: 'sailing', n: 20 },
      { time: '13:00', text: 'Zero wind: trysail and storm jib tested; the storm jib can’t be hoisted', kind: 'gear', n: 22 },
      { text: 'Tortillas with mushroom, pepper, cucumber and tofu', kind: 'galley' },
    ],
    extract: [21, 22, 25, 26],
  },
  {
    date: '2026-11-08',
    weekday: 'Sunday',
    title: 'After the calm, the blow',
    story: [
      'At midnight dolphins came round the boat, visible only by the phosphorescence they stirred up in the water. By dawn there was wind at last: the engine went off at 05:45 and we sailed close-hauled at Force 2 to 3.',
      'It kept building. By 12:50 we were down to the third reef with the jib furled, Force 5 to 6, and by late afternoon it was blowing about 30 knots: warm, but wet. Three people were seasick that night.',
      'At 22:14, on my watch, the log has a question mark in it: “Jib swivel broken?” It was. The genoa’s halyard had gone, and with only a reefed main left, the engine went back on.',
    ],
    events: [
      { time: '00:00', text: 'Dolphins in the bioluminescence', kind: 'wildlife', n: 28 },
      { time: '05:45', text: 'Engine off: sailing close-hauled, F2–3', kind: 'sailing', n: 31 },
      { time: '12:50', text: 'Reef 3, jib furled: F5–6', kind: 'sailing', n: 34 },
      { time: '20:06', text: 'Wind 20–25 knots', kind: 'sailing', n: 38 },
      { time: '22:14', text: '“Jib swivel broken?”: the genoa halyard has gone', kind: 'gear', n: 39 },
    ],
    extract: [31, 34, 38, 39],
  },
  {
    date: '2026-11-09',
    weekday: 'Monday',
    title: 'Eight dolphins and a curry',
    story: [
      'With no headsail we motor-sailed all day on the reefed main. The day watches became three hours long, and mine moved to 10:00–13:00.',
      'In the morning a family of dolphins found us, at least eight of them with three young; in the afternoon the same family came back and played at the bow for twenty minutes. The breeze was light and the beat almost pleasant. Nikolas made a very good curry rice.',
      'Just after midnight the last fix of the leg put us about eleven miles off Agadir.',
    ],
    events: [
      { text: 'A family of dolphins: at least eight, three of them young', kind: 'wildlife', n: 42 },
      { text: 'Day watches now three hours: mine 10:00–13:00', kind: 'sailing', n: 44 },
      { text: 'The same dolphins at the bow for twenty minutes', kind: 'wildlife' },
      { text: 'Curry rice (Nikolas)', kind: 'galley' },
    ],
    extract: [40, 42, 44, 48],
  },
  {
    date: '2026-11-10',
    weekday: 'Tuesday',
    title: 'Agadir: paperwork and washing-up liquid',
    story: [
      'We arrived at 02:30 and were told to anchor in the bay. Then the harbour office flashed lights at us and we turned back, until the VHF settled it, in French: anchor where there is ten metres of water, because of the tide. Morocco speaks French on the radio, so our French speaker did the talking.',
      'From 09:10 it was passports for everyone, three times over: harbour office, police and customs. Rob has two passports, which caused a stir, and our authorisation to command the boat was an old one with the wrong call sign. Rob downloaded the right one, customs searched the boat, and at 11:30 we were legal.',
      'Then the genoa, torn at the head. We cut the damaged end off the luff and tried to feed it back into the forestay’s groove: too much friction. Second attempt: washing-up liquid on the luff, and Tymon up the mast. It slid. Rob gave us an hour ashore, enough for a shower and a “vegetarian” kefta sandwich that turned out to have meat in it, and at 16:40 we motored out of Agadir Marina. Go west!',
    ],
    events: [
      { time: '02:30', text: 'Arrived off Agadir; anchored in 10 m', kind: 'harbour' },
      { time: '09:10', text: 'Harbour office, police and customs, until 11:30', kind: 'harbour' },
      { text: 'Genoa repaired: washing-up liquid, and Tymon up the mast', kind: 'gear' },
      { text: 'A “vegetarian” kefta sandwich, with meat', kind: 'galley' },
      { time: '16:40', text: 'Away from Agadir Marina', kind: 'harbour', n: 49 },
    ],
    extract: [49, 50, 51],
  },
  {
    date: '2026-11-11',
    weekday: 'Wednesday',
    title: 'Trysail weather',
    story: [
      'The wind came back in the night and the reefs went in one after another: reef 2 at 01:48, reef 3 by 04:00, the headsail reefed at 05:50. Then the log goes quiet: nothing between 08:13 and 15:56, the longest silence on the passage. When it starts again, the main is down and the trysail is up, with a scrap of jib. The barometer reads 1009, the lowest of the trip.',
      'Rob put the waves at three to four metres, the biggest five, and the wind at 25 to 30 knots gusting 35. Seas came over the boat; our helmsman took four of them and his brand-new foul-weather suit was soaked through. We carried the trysail all night.',
    ],
    events: [
      { time: '01:48', text: 'Reef 2', kind: 'sailing', n: 53 },
      { time: '05:50', text: 'Reef 3 and headsail reefed', kind: 'sailing', n: 55 },
      { time: '15:56', text: 'Trysail and reefed jib; barometer 1009', kind: 'sailing', n: 57 },
      { text: 'Waves 3–4 m, the biggest 5 m; 25–30 knots gusting 35', kind: 'sailing' },
    ],
    extract: [55, 56, 57, 58],
  },
  {
    date: '2026-11-12',
    weekday: 'Thursday',
    title: 'Shake out the reefs',
    story: [
      'The morning after a gale. At 04:30 the trysail came down and the reefed main went up; at 08:24 all the reefs came out, the engine went off, and the log shows 7.6 knots, the fastest of the passage. By the end of the day we had run 135 miles, our best.',
      'Everyone’s watch clothes were wet, and the morning went on drying them. Rob talked us through the weather we had had, and recommended the Ocean Cruising Club to anyone thinking of going further.',
    ],
    events: [
      { time: '08:24', text: 'All reefs out, engine off: 7.6 knots', kind: 'sailing', n: 62 },
      { text: '135 miles: the best day of the passage', kind: 'sailing' },
    ],
    extract: [61, 62, 63, 64],
  },
  {
    date: '2026-11-13',
    weekday: 'Friday',
    title: 'Landfall on Friday the 13th',
    story: [
      'Sailors don’t leave port on a Friday; arriving is allowed. At 01:03 the VHF went on. At 03:45 we took in the first reef, at 04:00 the engine went off, and we sailed the last of the night with Fuerteventura somewhere to port.',
      'The last entry in the log is at 08:00: 28°26′N 15°05′W, main with one reef, and Gran Canaria 25 miles ahead. That is where the logbook ends and Las Palmas begins.',
    ],
    events: [
      { time: '01:03', text: 'VHF on', kind: 'sailing', n: 66 },
      { time: '03:45', text: 'Reef 1; engine off at 04:00', kind: 'sailing', n: 68 },
      { time: '08:00', text: 'Last entry: 25 miles to Las Palmas', kind: 'harbour', n: 70 },
    ],
    extract: [67, 68, 69, 70],
  },
];

/** What broke, and what we did about it. */
export const bosunsList: { day: number; what: string; fix: string }[] = [
  { day: 1, what: 'An electronic fault, then two leaks in the engine cooling', fix: 'Pumped out, traced, and the water level checked every hour after that' },
  { day: 3, what: 'No anchor: chain and rope had been taken off the boat', fix: 'Rigged it outside Mohammedia before we could anchor' },
  { day: 3, what: 'We needed diesel', fix: 'A detour to Mohammedia, and jerry cans found on board: tank full + 10 litres spare' },
  { day: 3, what: 'The reserve gas bottle felt empty', fix: 'Disputed (by Tymon)' },
  { day: 3, what: 'The storm jib can’t be hoisted: it is lashed around the furled genoa', fix: 'Found in a flat calm, not in a gale' },
  { day: 4, what: 'The genoa halyard broke (“Jib swivel broken?”, 22:14)', fix: 'Reefed main and engine to Agadir' },
  { day: 6, what: 'The genoa torn at the head', fix: 'Damaged end cut off, washing-up liquid on the luff, Tymon up the mast' },
];
