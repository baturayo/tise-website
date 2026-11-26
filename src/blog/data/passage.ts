/**
 * The story of the passage, day by day, and the facts around it. Positions, times and numbers come
 * from the boat's logbook (logbook.ts); events, meals and wildlife from Emmanuel's journal, kept in
 * French on board, and from my own memory. Crewmates are named by first name only.
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
    place: 'Morocco, for diesel; the fuel station was closed',
    lat: 33.716,
    lon: -7.392,
    after: 19,
    arrive: Date.UTC(2026, 10, 7, 5, 0), // 06:00 CET, from the journal
    leave: Date.UTC(2026, 10, 7, 10, 30),
  },
  {
    id: 'agadir',
    name: 'Agadir',
    place: 'Morocco: entry, diesel, repairs, a shower',
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
 * The watches on the way to Agadir: three pairs, two hours each. Emmanuel kept 18–20, 00–02, 06–08
 * and 12–14 with Sophia, and Niko and I came on straight before them.
 */
/** `crewList`: how the pair is written in the post's crew list, if not as `label` (Samir is happy for us to use his surname). */
export const rota: (Watch & { label: string; crewList?: string; mine?: boolean })[] = [
  { name: 'mine', label: 'Niko and me', mine: true, hours: [[4, 6], [10, 12], [16, 18], [22, 24]] },
  { name: 'journal', label: 'Emmanuel and Sophia', hours: [[0, 2], [6, 8], [12, 14], [18, 20]] },
  { name: 'third', label: 'Tymon and Samir', crewList: 'Tymon and Samir Chehoud', hours: [[2, 4], [8, 10], [14, 16], [20, 22]] },
];

/**
 * Log lines that fall in Niko's and my hours but that we didn't write: on the Sunday night I was
 * asleep below when the halyard went, whatever the rota says.
 */
export const notWrittenByUs = [39];

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
      'There were seven of us aboard Escapado at Alcaidesa Marina, in La Línea, with the Rock of Gibraltar looming over the pontoons: Rob, our skipper, and a crew of six: Sophia, Tymon, Niko, Samir, Emmanuel and me. Day 0 was the part of ocean sailing nobody posts online: scrubbing the boat, and provisioning for the passage south.',
      'The plan was Las Palmas de Gran Canaria by way of Agadir, in Morocco: just under 830 miles, as it turned out. The plan would change. Plans at sea do.',
    ],
    events: [{ text: 'Cleaning and provisioning in Alcaidesa Marina', kind: 'harbour' }],
  },
  {
    date: '2026-11-05',
    weekday: 'Thursday',
    title: 'Two leaks and a whale',
    story: [
      'We were meant to leave at eight. At seven we were at customs, declaring our route via Agadir; at eight we were filling up with diesel (remember the diesel, it comes back); at half past eight an electronic fault showed up, and while looking for it we found two leaks in the engine’s cooling. The departure time became a topic of conversation. With the bilges dry and a new rule to check the water level every hour, we finally slipped the lines at 15:05.',
      'Three hours later, crossing the shipping lanes of the Strait, a whale surfaced beside us. The log’s second line reads “Sails up – full sail – whale sighted”, which is about as good as a second line gets. Then the wind died, exactly as forecast, the engine went back on, and a 1.7-knot tide carried us west. Niko made a mushroom risotto with courgette. It would not be his last shift at the stove.',
      'The watches started that evening: two hours on, four off. Niko and I came on at 22:00, as Cabo Espartel, the north-west corner of Africa, came abeam to port. By midnight the sea was calm, the sky clear and the Mediterranean behind us. This would not last.',
    ],
    events: [
      { time: '07:00', text: 'Customs: route declared via Agadir', kind: 'harbour' },
      { time: '08:30', text: 'Electronic fault; two leaks found in the engine cooling', kind: 'gear' },
      { time: '15:05', text: 'Departure from Alcaidesa Marina, seven hours late', kind: 'harbour', n: 1 },
      { time: '18:06', text: 'Whale sighted in the shipping lanes', kind: 'wildlife', n: 2 },
      { time: '22:00', text: 'Cabo Espartel abeam: Niko’s and my first watch', kind: 'sailing', n: 5 },
      { text: 'Mushroom risotto with courgette (Niko)', kind: 'galley' },
    ],
    extract: [2, 4, 5, 6],
  },
  {
    date: '2026-11-06',
    weekday: 'Friday',
    title: 'A sextant at sunrise',
    story: [
      'A windless first full day down the Moroccan coast, mostly under engine. At sunrise Rob showed us the principle of the sextant: bring the lower image down to the horizon. The GPS kept its job, for now. On our late-morning watch there was finally enough breeze to stop the engine and sail on main and jib.',
      'After lunch came the drills: man overboard and reefing, done by 14:05, and we used the light weather to set up the automatic third reef. We had no idea yet how much we would come to love that third reef. Dinner was pasta with tomato and onion sauce: for seven, Niko reckoned, 600 grams.',
      'At midnight the plan changed: we needed diesel. Yes, already. The watch on deck turned south, to 190° and then 200°, for the port of Mohammedia.',
    ],
    events: [
      { text: 'Sextant demonstration at sunrise', kind: 'sailing' },
      { time: '10:52', text: 'Engine off, main and jib, on our watch', kind: 'sailing', n: 11 },
      { time: '14:05', text: 'Man-overboard and reefing practice done', kind: 'sailing', n: 12 },
      { text: 'Pasta with tomato and onion: 600 g for seven', kind: 'galley' },
      { time: '00:00', text: 'Course changed for Mohammedia, for diesel', kind: 'harbour', n: 16 },
    ],
    extract: [11, 12, 15, 16],
  },
  {
    date: '2026-11-07',
    weekday: 'Saturday',
    title: 'The diesel was on board all along',
    story: [
      'We came in to Mohammedia in the dark, at the end of Niko’s and my 04:00 watch, and called the port on the VHF. Nobody really answered. The most we got out of the harbour office was that we should wait outside. Fine: we would anchor. Except the anchor had been taken off the boat, chain and rope, before we came aboard, so first we had to rig it. Then we spent what was left of the night at anchor, waiting for the fuel station to open. It was closed. We waited. It stayed closed.',
      'While we waited we found that the reserve gas bottle was suspiciously light (Tymon disagreed) and then, in a twist nobody saw coming, three 20-litre jerry cans of diesel on board: 60 litres. We had stopped, basically, for nothing. Still, better to check than to be sorry in the middle of the ocean with no fuel. We topped up the main tank from the jerry cans, and at 10:30 we left with it full and ten litres still spare in a can, carrying on to Agadir to refuel properly. Ship’s time went over to UTC. At 13:00, in a flat calm, we tried the storm sails: the storm jib could not be hoisted at all, being lashed with elastic around the furled genoa. Better to learn that in zero knots than in thirty.',
      'Rob set up a galley rota, since Niko was spending most of his life at the stove: the afternoon watch cooks dinner, and the next day’s lunch. Democracy had come to the galley.',
      'That night brought, for me, the best part of the whole trip. There was no wind that day (the log says Force 0 to 1, and the engine did most of the work), and the sea was so flat that the bioluminescence lit up everything that moved. On our 22:00 watch the dolphins came, torpedoes made of light, and raced the boat. I spent more than half an hour on the foredeck watching them. We were doing about four and a half knots, which to a dolphin is a warm-up; they never tired. Twice I saw a big shoal of fish leap clear of the water, trying to get away from them. They didn’t. The dolphins had their dinner and carried on racing us while they ate it. No wind, no sailing, and still amazing.',
    ],
    events: [
      { text: 'Called the port on the VHF, on our watch: nobody really answered', kind: 'harbour', n: 19 },
      { time: '06:00', text: 'Told to wait outside; anchor rigged, then dropped', kind: 'harbour' },
      { text: 'The fuel station: closed. We waited; it stayed closed', kind: 'harbour' },
      { text: 'Three 20-litre jerry cans of diesel found on board', kind: 'gear' },
      { time: '10:30', text: 'Main tank topped up from the jerry cans; left Mohammedia full + 10 litres spare, for Agadir', kind: 'harbour', n: 21 },
      { text: 'Ship’s time changed to UTC', kind: 'sailing', n: 20 },
      { time: '13:00', text: 'Zero wind: trysail and storm jib tested; the storm jib can’t be hoisted', kind: 'gear', n: 22 },
      { text: 'Tortillas with mushroom, pepper, cucumber and tofu', kind: 'galley' },
      { text: 'Dolphins racing the boat in the bioluminescence for over half an hour, on our watch', kind: 'wildlife', n: 27 },
      { text: 'Two shoals of fish leaping to escape them: the dolphins’ dinner', kind: 'wildlife' },
    ],
    extract: [21, 22, 26, 27],
  },
  {
    date: '2026-11-08',
    weekday: 'Sunday',
    title: 'After the calm, the blow',
    story: [
      'At midnight, when Emmanuel and Sophia came on, the dolphins were still with us. By dawn there was wind at last. The engine went off at 05:45 and we sailed close-hauled at Force 2 to 3. Lovely. Be careful what you wish for.',
      'It kept building. By 12:50 we were down to the third reef with the jib furled, Force 5 to 6, and by late afternoon it was blowing about 30 knots. Three people were seasick that night.',
      'At 22:14 the log has a question mark in it: “Jib swivel broken?” It was. The genoa’s halyard had gone. I was asleep below, and what I remember is the noise: the jib flogging in the wind until the watch on deck furled it by hand. With only a reefed main left, the engine went back on. That question mark did a lot of work.',
      'On deck, in the middle of the night, I froze. I was soaked through, and the waves slapped me one after another. The wind was right on the nose, which didn’t help: it only sped the slaps up. Then came the rain. The Lord had apparently decided the Atlantic wasn’t wet enough and started pouring a second one on us from above, by the bucketful, and the wind threw every drop at my face like gravel. Escapado is a First 40.7, a race boat, so there was no sprayhood and no bimini; my sprayhood was my eyelids, and they didn’t help at all. More than once I asked myself what the hell I was doing in the middle of the ocean. Looking back, it was a very good experience. A very challenging one.',
    ],
    events: [
      { time: '00:00', text: 'The dolphins still with us at the change of watch', kind: 'wildlife', n: 28 },
      { time: '05:45', text: 'Engine off: sailing close-hauled, F2–3', kind: 'sailing', n: 31 },
      { time: '12:50', text: 'Reef 3, jib furled: F5–6', kind: 'sailing', n: 34 },
      { time: '20:06', text: 'Wind 20–25 knots', kind: 'sailing', n: 38 },
      { time: '22:14', text: '“Jib swivel broken?”: the genoa halyard has gone; the jib furled by hand', kind: 'gear', n: 39 },
    ],
    extract: [31, 34, 38, 39],
  },
  {
    date: '2026-11-09',
    weekday: 'Monday',
    title: 'Eight dolphins and a spinning skipper',
    story: [
      'With no headsail we motor-sailed all day on the reefed main, and there was no fixing it at sea: the genoa stayed down until Agadir. The day watches became three hours long, and ours moved to 10:00–13:00.',
      'After the blow, with the waves still two to three metres high, Rob went up the mast. He had a very hard time at the top, and coming down was worse: with nothing proper to hold on to, he spun round and round the forestay like a fan blade. Spinning on a wire above a 2–3 metre sea cannot have been fun. Rob, we salute you.',
      'In the morning a family of dolphins found us, at least eight of them with three young, and in the afternoon the same family came back to play at the bow for twenty minutes, unbothered by our broken halyard. The breeze was light and the beat almost pleasant. Niko made a very good curry rice.',
      'Just after midnight the last fix of the leg put us about eleven miles off Agadir, where, this time, there really was diesel.',
    ],
    events: [
      { text: 'A family of dolphins: at least eight, three of them young', kind: 'wildlife', n: 42 },
      { text: 'Day watches now three hours: ours 10:00–13:00', kind: 'sailing', n: 44 },
      { text: 'Rob up the mast in a 2–3 m sea, spinning round the forestay on the way down', kind: 'gear' },
      { text: 'The same dolphins at the bow for twenty minutes', kind: 'wildlife' },
      { text: 'Curry rice (Niko)', kind: 'galley' },
    ],
    extract: [40, 42, 44, 48],
  },
  {
    date: '2026-11-10',
    weekday: 'Tuesday',
    title: 'Agadir: passports, diesel and washing-up liquid',
    story: [
      'Agadir was the stop we had planned all along. We arrived at 02:30 and were told to anchor in the bay; then the harbour office flashed lights at us and we turned back, until the VHF settled it (an improvement on Mohammedia: this time somebody answered): anchor where there is ten metres of water, because of the tide. Morocco speaks French on the radio, so Emmanuel did the talking, and reckoned the man in the harbour office had changed channel without noticing. We anchored for what was left of the night.',
      'From 09:10 it was passports for everyone, three times over: harbour office, police and customs. Rob has two passports, which caused a stir, and our authorisation to command the boat was an old one with the wrong call sign. Rob downloaded the right one, customs searched the boat, and at 11:30 we were legal. And unlike Mohammedia’s, Agadir’s fuel station was open. It took cash only, but it took it: diesel at last, from an actual pump.',
      'So we made ourselves useful. The genoa was torn at the head: we cut the damaged end off the luff and tried to feed it back into the forestay’s groove, but there was too much friction. Second attempt: washing-up liquid on the luff, and Tymon up the mast. It slid. Rob gave us an hour ashore, enough for a shower and a “vegetarian” kefta sandwich that turned out to have meat in it.',
      'Agadir was also where we lost Samir. He left the boat there, and unfortunately we had to carry on without him, six instead of seven. Rob, the skipper, stepped into his place on the rota and stood Samir’s watches with Tymon for the rest of the way. At 16:40 we motored out of Agadir Marina: legal, repaired, showered, fuelled and one crew member short. Go west!',
    ],
    events: [
      { time: '02:30', text: 'Arrived off Agadir; anchored in 10 m', kind: 'harbour' },
      { time: '09:10', text: 'Harbour office, police and customs, until 11:30', kind: 'harbour' },
      { text: 'Diesel, at last, from an open fuel station: cash only', kind: 'harbour' },
      { text: 'Genoa repaired: washing-up liquid, and Tymon up the mast', kind: 'gear' },
      { text: 'A “vegetarian” kefta sandwich, with meat', kind: 'galley' },
      { text: 'Samir leaves the boat; Rob takes his watches with Tymon', kind: 'harbour' },
      { time: '16:40', text: 'Away from Agadir Marina, fuelled', kind: 'harbour', n: 49 },
    ],
    extract: [49, 50, 51],
  },
  {
    date: '2026-11-11',
    weekday: 'Wednesday',
    title: 'The washing machine',
    story: [
      'The wind came back in the night and the reefs went in one after another: reef 2 at 01:48, reef 3 by 04:00, the headsail reefed at 05:50. Then the log goes quiet: nothing between 08:13 and 15:56, the longest silence on the passage. When it starts again, the main is down and the trysail is up with a scrap of jib, and the barometer reads 1009, the lowest of the trip.',
      'Rob put the waves at three to four metres, the biggest five, and the wind at 25 to 30 knots, gusting 35. Seas came over the boat one after another, and we carried the trysail all night.',
      'Below deck the boat had become a washing machine. The roof leaked, and between the waves coming over and the rain coming down (the Lord was at it again with his buckets) there was water coming in everywhere; I was soaking wet on every watch. My food for the whole storm was half a protein bar and one slice of pizza. What I learned from it comes right after the last day, and it is the most useful part of this post.',
    ],
    events: [
      { time: '01:48', text: 'Reef 2', kind: 'sailing', n: 53 },
      { time: '05:50', text: 'Reef 3 and headsail reefed', kind: 'sailing', n: 55 },
      { time: '15:56', text: 'Trysail and reefed jib; barometer 1009', kind: 'sailing', n: 57 },
      { text: 'Waves 3–4 m, the biggest 5 m; 25–30 knots gusting 35', kind: 'sailing' },
      { text: 'The roof leaking; me soaked on every watch', kind: 'gear' },
      { text: 'Half a protein bar and one slice of pizza: my menu for the storm', kind: 'galley' },
    ],
    extract: [55, 56, 57, 58],
  },
  {
    date: '2026-11-12',
    weekday: 'Thursday',
    title: 'Shake out the reefs',
    story: [
      'The morning after the gale, the Atlantic apologised. At 04:30 the trysail came down and the reefed main went up; at 08:24 all the reefs came out, the engine went off, and the log shows 7.6 knots, the fastest of the passage. By the end of the day we had run 135 miles, our best.',
      'Everyone’s watch clothes were wet, and the morning went on drying them: the boat turned into a floating laundry. Rob talked us through the weather we had had, and recommended the Ocean Cruising Club to anyone thinking of going further.',
    ],
    events: [
      { time: '08:24', text: 'All reefs out, engine off: 7.6 knots', kind: 'sailing', n: 62 },
      { text: '135 miles: the best day of the passage', kind: 'sailing' },
      { text: 'Watch clothes drying all morning', kind: 'gear' },
    ],
    extract: [61, 62, 63, 64],
  },
  {
    date: '2026-11-13',
    weekday: 'Friday',
    title: 'Landfall on Friday the 13th',
    story: [
      'Sailors don’t leave port on a Friday. Arriving, we decided, is allowed. At 01:03 the VHF went on. At 03:45 we took in the first reef, at 04:00 the engine went off, and we sailed the last of the night with Fuerteventura somewhere to port.',
      'The last entry in the log is at 08:00: 28°26′N 15°05′W, main with one reef, and Gran Canaria 25 miles ahead. That is where the logbook ends and Las Palmas, and dry socks, begin.',
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
  { day: 3, what: 'We needed diesel', fix: 'A detour to Mohammedia, where the fuel station stayed closed. Then we found three 20-litre jerry cans on board, topped up the main tank from them and carried on to Agadir to refuel' },
  { day: 3, what: 'The reserve gas bottle felt empty', fix: 'Disputed (by Tymon)' },
  { day: 3, what: 'The storm jib can’t be hoisted: it is lashed around the furled genoa', fix: 'Found in a flat calm, not in a gale' },
  { day: 4, what: 'The genoa halyard broke (“Jib swivel broken?”, 22:14)', fix: 'Jib furled by hand; Rob went up the mast, but it couldn’t be fixed at sea. Reefed main and engine to Agadir' },
  { day: 6, what: 'The genoa torn at the head', fix: 'Damaged end cut off, washing-up liquid on the luff, Tymon up the mast' },
  { day: 7, what: 'The roof leaked, and my foul-weather gear wasn’t up to the job', fix: 'Nothing to be done at sea: I stayed wet. The lessons are further up' },
  { day: 9, what: 'Found in Las Palmas: three of the six screws missing from the gooseneck, which holds the boom to the mast', fix: 'A big maintenance before she sailed on. Luckily, it held through both blows' },
];

export type CareMark = 'shower' | 'cotton' | 'pro' | 'spin' | 'shake';

/** What Wednesday taught me, written as the care label I wish my kit had come with. */
export const careLabel: { mark: CareMark; title: string; text: string }[] = [
  {
    mark: 'shower',
    title: 'Shower-test before you go',
    text: 'Stand under the shower in your full foul-weather kit before you go offshore. Better to find the leaks in your bathroom than on watch.',
  },
  {
    mark: 'cotton',
    title: 'No cotton',
    text: 'In the damp, everything with cotton in it got wet, even below deck. The only things I could still wear were 100% polyester.',
  },
  {
    mark: 'pro',
    title: 'Professional gear only',
    text: 'A race boat like ours has no sprayhood and no bimini, so your kit is the only roof you get. Equipment quality really matters, and mine wasn’t good enough for this. Buy for the worst day, not the average one.',
  },
  {
    mark: 'spin',
    title: 'Expect the spin cycle',
    text: 'I had never been seasick in my life before this trip, so I didn’t even bother to bring seasickness pills, although ChatGPT warned me several times. When it hit, I was too dizzy even to ask the crew for one, and went straight to bed. Plan as if you will be: bring them, and keep them somewhere you can reach easily, not at the bottom of your bag.',
  },
  {
    mark: 'shake',
    title: 'Pack protein you can drink',
    text: 'In a storm it’s very difficult to cook, and on board it’s often hard to get enough protein anyway. Protein shakes are really handy: next time they’re coming with me.',
  },
];
