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
  waters: ['Belgian coast', 'Zeeland', 'Amsterdam', 'Türkiye', 'Greece', 'Croatia', 'Mediterranean'],
} as const;

export interface Founder {
  name: string;
  years: string;
  role: string;
  /** path under /public; the photos come from the club's old website */
  photo?: string;
  /** shown when their card is turned over; from the club's old website */
  bio?: string;
}

/** "Legacy & remembrance": the founding members the club remembers (wording agreed with Serdar Bilgiç). */
export const founders: Founder[] = [
  {
    name: 'Aydın Erol',
    years: '1957–2017',
    role: 'Founding member',
    photo: '/founders/aydin-erol.jpg',
    bio: 'We miss our founder and great friend Aydın Erol, who founded TISE Sailing Club with the support of a management board of Serdar Bilgiç, Ahmet Karaman, Yılmaz Özcan and Gürol Aydemir.',
  },
  {
    name: 'Ahmet Karaman',
    years: '1969–2022',
    role: 'Founding member',
    photo: '/founders/ahmet-karaman.jpg',
    bio: 'Ahmet fell in love with sailing in 2008 in Göcek. He then gained his experience on frequent trips along the North Sea coast and in the Mediterranean with his TISE friends. He held an RYA Day Skipper licence, skippered TISE sailing activities and was well known for his advanced navigation skills. He also loved basketball and football, and worked for a global automotive company.',
  },
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
  /** a few sentences about them, shown when their card is turned over */
  bio?: string;
}

/**
 * The crew list. Everyone organising an activity in the calendar is added automatically as
 * Executive; list people here to show their full name, give them a role (President) or a photo, or
 * to show members who organise nothing this year. `name` must match the calendar's first name.
 * People with a role come first, in this order; everyone else is in alphabetical order.
 */
export const crewMembers: CrewMember[] = [
  {
    name: 'Serdar',
    fullName: 'Serdar Bilgiç',
    role: 'President',
    founder: true,
    photo: '/crew/serdar.jpg',
    bio: "President and founding member of TISE Sailing Club. Serdar started his sailing adventure on Lac Léman in Geneva in 2001, and has since sailed with his TISE friends and family, mostly in the North Sea and the Mediterranean. He holds an RYA skipper licence and skippers most of TISE's sailing activities. He lives and works in Brussels.",
  },
  { name: 'Özlem', fullName: 'Özlem Tatar', role: 'Executive Lead', photo: '/crew/ozlem.jpg' },
  {
    name: 'Baturay',
    fullName: 'Baturay Ofluoğlu',
    photo: '/crew/baturay.jpg',
    bio: 'Baturay started sailing in 2007 at Gökova Yelken Kulübü, in a Laser. He then joined İstanbul Yelken Kulübü, where he sailed Pirats and Lasers. From 2012 to 2016 he raced a First 40 and a J/80 in Istanbul. He has also sailed the Atlantic, on a passage from Gibraltar to Las Palmas in the Canary Islands. Since 2024 he has been an active member of TISE. Ashore, he is an entrepreneur and AI consultant, and lives in Belgium.',
  },
  { name: 'Beyza', fullName: 'Beyza Alabay', photo: '/crew/beyza.jpg' },
  { name: 'Joel', fullName: 'Joel Newburn', photo: '/crew/joel.jpg' },
  { name: 'John', fullName: 'John Hird' },
  { name: 'Sezen', fullName: 'Sezen Gürlek', photo: '/crew/sezen.jpg' },
  { name: 'Yeter', fullName: 'Yeter Gökburun Bilgiç', photo: '/crew/yeter.jpg' },
  { name: 'Özge', fullName: 'Özge Bozal', photo: '/crew/ozge.jpg' },
];
