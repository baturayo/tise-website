/** Club facts shown on the site. Only facts confirmed by the club belong here. */
export const club = {
  name: 'TISE Sailing Club',
  shortName: 'TISE',
  /** what TISE stands for */
  fullName: 'Turkish International Sailors Europe',
  city: 'Brussels',
  country: 'Belgium',
  founded: 2013,
  siteUrl: 'https://tisesailing.com',
  instagram: 'https://www.instagram.com/tise_sailing/',
  intro:
    'A Brussels sailing club for people of every experience level. We help newcomers get started and sailors build their skills through relaxed cruises and informal training, in a fun, safe and friendly crew.',
  waters: ['Belgian coast', 'Zeeland', 'Amsterdam', 'Türkiye'],
} as const;

export interface Founder {
  name: string;
  years: string;
  role: string;
}

/** "Legacy & remembrance": the founding members the club remembers (wording agreed with Serdar Bilgiç). */
export const founders: Founder[] = [
  { name: 'Aydın Erol', years: '1957–2017', role: 'Founding member' },
  { name: 'Ahmet Karaman', years: '1969–2022', role: 'Founding member' },
];

export interface CrewMember {
  /** first name, as the organisers are written in the calendar */
  name: string;
  /** name and surname, shown on the crew list */
  fullName?: string;
  /** an office that puts them at the top of the crew list, e.g. President; everyone else is Executive */
  role?: string;
  /** a founding member of the club: "& founder" is added to their title */
  founder?: boolean;
  /** path under /public, e.g. '/crew/ozlem.jpg' */
  photo?: string;
}

/**
 * The crew list. Everyone organising an activity in the calendar is added automatically as
 * Executive; list people here to show their full name, give them a role (President) or a photo, or
 * to show members who organise nothing this year. `name` must match the calendar's first name.
 * People with a role come first, in this order; everyone else is in alphabetical order.
 */
export const crewMembers: CrewMember[] = [
  { name: 'Serdar', fullName: 'Serdar Bilgiç', role: 'President', founder: true, photo: '/crew/serdar.jpg' },
  { name: 'Özlem', fullName: 'Özlem Tatar', role: 'Executive Lead', photo: '/crew/ozlem.jpg' },
  { name: 'Baturay', fullName: 'Baturay Ofluoğlu', photo: '/crew/baturay.jpg' },
  { name: 'Beyza', fullName: 'Beyza Alabay', photo: '/crew/beyza.jpg' },
  { name: 'Joel', fullName: 'Joel Newburn', photo: '/crew/joel.jpg' },
  { name: 'John', fullName: 'John Hird' },
  { name: 'Sezen', fullName: 'Sezen Gürlek', photo: '/crew/sezen.jpg' },
  { name: 'Yeter', fullName: 'Yeter Gökburun Bilgiç', photo: '/crew/yeter.jpg' },
  { name: 'Özge', fullName: 'Özge Bozal', photo: '/crew/ozge.jpg' },
];
