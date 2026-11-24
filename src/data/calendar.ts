/**
 * TISE activity calendar. Edit this list to update the website AND the subscribable
 * calendar feed (/calendar.ics). Dates are YYYY-MM-DD; `end` is the last day (inclusive).
 */
export type CountryCode = 'BE' | 'NL' | 'DE' | 'TR';
export type EventKind = 'sailing' | 'social' | 'learning' | 'committee' | 'show';

export interface ClubEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  country: CountryCode;
  place?: string;
  organisers: string[];
  kind: EventKind;
}

export const calendarYear = 2027;

export const events2027: ClubEvent[] = [
  {
    id: '2027-01-16-sailor-party',
    title: 'Sailors Party',
    start: '2027-01-16',
    country: 'BE',
    organisers: ['Yeter'],
    kind: 'social',
  },
  {
    id: '2027-01-30-boat-show',
    title: 'Düsseldorf Boat Show',
    start: '2027-01-30',
    end: '2027-01-31',
    country: 'DE',
    place: 'Düsseldorf',
    organisers: ['Baturay'],
    kind: 'show',
  },
  {
    id: '2027-02-18-classroom',
    title: 'Classroom: Introduction to Sailing',
    start: '2027-02-18',
    country: 'BE',
    organisers: ['John', 'Serdar'],
    kind: 'learning',
  },
  {
    id: '2027-03-18-sailing-talk',
    title: 'Sailing Talk: How to Buy a Boat',
    start: '2027-03-18',
    country: 'BE',
    organisers: ['Joel'],
    kind: 'learning',
  },
  {
    id: '2027-04-02-hello-spring',
    title: '“Hello Spring” Party',
    start: '2027-04-02',
    country: 'BE',
    organisers: ['Sezen'],
    kind: 'social',
  },
  {
    id: '2027-04-09-zeeland',
    title: 'Sailing Weekend in Zeeland',
    start: '2027-04-09',
    end: '2027-04-11',
    country: 'NL',
    place: 'Bruinisse',
    organisers: ['Baturay'],
    kind: 'sailing',
  },
  {
    id: '2027-05-14-amsterdam',
    title: 'Sailing in Amsterdam',
    start: '2027-05-14',
    end: '2027-05-17',
    country: 'NL',
    place: 'Amsterdam',
    organisers: ['Baturay'],
    kind: 'sailing',
  },
  {
    id: '2027-06-25-harbour-manoeuvres',
    title: 'Harbour Manoeuvres in Bruinisse Marina',
    start: '2027-06-25',
    end: '2027-06-27',
    country: 'NL',
    place: 'Bruinisse',
    organisers: ['Joel', 'Serdar'],
    kind: 'sailing',
  },
  {
    id: '2027-07-03-laser-surfing',
    title: 'Laser & Surfing Weekend',
    start: '2027-07-03',
    country: 'NL',
    organisers: ['Baturay'],
    kind: 'sailing',
  },
  {
    id: '2027-07-10-flotilla',
    title: 'TISE Summer Flotilla: Marmaris/Hisarönü',
    start: '2027-07-10',
    end: '2027-07-17',
    country: 'TR',
    place: 'Marmaris / Hisarönü',
    organisers: ['Serdar', 'John'],
    kind: 'sailing',
  },
  {
    id: '2027-08-14-nieuwpoort',
    title: 'Sailing Weekend in Nieuwpoort',
    start: '2027-08-14',
    end: '2027-08-15',
    country: 'BE',
    place: 'Nieuwpoort',
    organisers: ['Baturay', 'John', 'Serdar', 'Joel'],
    kind: 'sailing',
  },
  {
    id: '2027-09-23-open-day',
    title: 'TISE Open Day',
    start: '2027-09-23',
    country: 'BE',
    organisers: ['Sezen'],
    kind: 'social',
  },
  {
    id: '2027-10-23-zeeland',
    title: 'Sailing Weekend in Zeeland',
    start: '2027-10-23',
    end: '2027-10-24',
    country: 'NL',
    place: 'Bruinisse',
    organisers: ['Baturay', 'John', 'Serdar', 'Joel'],
    kind: 'sailing',
  },
  {
    id: '2027-12-09-year-end-party',
    title: 'Year-End Party',
    start: '2027-12-09',
    country: 'BE',
    organisers: ['Yeter'],
    kind: 'social',
  },
];

export const countryNames: Record<CountryCode, string> = {
  BE: 'Belgium',
  NL: 'Netherlands',
  DE: 'Germany',
  TR: 'Türkiye',
};
