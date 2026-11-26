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
    bio: "President and founding member of TISE Sailing Club, Serdar started his sailing adventure on Lake Geneva in 2001. He has been the club's skipper since the beginning of the club with sailing adventures mostly in the North Sea and the Mediterranean with family and TISE friends. An RYA-certified skipper, he loves sharing his passion for the sea, welcoming new sailors and bringing people together through sailing. An international CFO and now an entrepreneur, he lives and works in Brussels.",
  },
  {
    name: 'Özlem',
    fullName: 'Özlem Tatar',
    role: 'Executive Lead',
    photo: '/crew/ozlem.jpg',
    bio: "Özlem's sailing journey began in Dubai in 2015, where she earned her RYA Skipper certificate. She then spent nearly a decade racing and sailing with various crews, including the all-female Team Ladies First, and taking on multiple roles on board. In 2025 she moved to Brussels and rediscovered her passion for sailing through TISE. Now she's ready for her next adventure: helping steer our TISE community towards new horizons.",
  },
  {
    name: 'Baturay',
    fullName: 'Baturay Ofluoğlu',
    photo: '/crew/baturay.jpg',
    bio: 'Baturay started sailing in 2007 at Gökova Yelken Kulübü, in a Laser. He then joined İstanbul Yelken Kulübü, where he sailed Pirats and Lasers. From 2012 to 2016 he raced a First 40 and a J/80 in Istanbul. He has also sailed the Atlantic, on a passage from Gibraltar to Las Palmas in the Canary Islands. Since 2024 he has been an active member of TISE. Ashore, he is an entrepreneur and AI consultant, and lives in Belgium.',
  },
  { name: 'Beyza', fullName: 'Beyza Alabay', photo: '/crew/beyza.jpg' },
  {
    name: 'Joel',
    fullName: 'Joel Newburn',
    photo: '/crew/joel.jpg',
    bio: 'Joel started sailing in 2021, learning the sheets on an RYA Competent Crew course on the Baltic Sea, and has since progressed through Day Skipper to Coastal Skipper. He and his family usually charter in the Mediterranean, and are building up experience and shopping for a boat to live aboard in the coming years. He lives in the suburbs of Brussels.',
  },
  { name: 'John', fullName: 'John Hird' },
  {
    name: 'Sezen',
    fullName: 'Sezen Gürlek',
    photo: '/crew/sezen.jpg',
    bio: "Sezen started sailing in 2022 as a beginner at Fenerbahçe Doğuş Sailing Club in Istanbul. She later joined Tüpraş's corporate sailing team, competing in regattas across Turkish waters for a year aboard a MAT 10.10 yacht in the IRC 2 class. Based in Brussels, she enjoys sailing and exploring destinations with beautiful nature and turquoise waters. She is keen to build on her experience, develop her sailing skills, and make sailing a regular part of her future adventures.",
  },
  {
    name: 'Yeter',
    fullName: 'Yeter Gökburun Bilgiç',
    photo: '/crew/yeter.jpg',
    bio: 'Yeter started her sailing adventure with TISE Sailing Club and quickly developed a passion for sailing life. With her high energy, enthusiasm and positive spirit, she actively supports every task on board, with anchoring in all conditions being her expertise. She adores the Mediterranean and sharing sailing adventures with family and friends. A medical doctor by profession, she lives and works in Brussels.',
  },
  {
    name: 'Özge',
    fullName: 'Özge Bozal',
    photo: '/crew/ozge.jpg',
    bio: 'Özge started sailing in 2012 at the Boğaziçi University Sailing Club in Istanbul. With the club, she competed on Platu 25 and J/80 boats in sailing cups and trophy races, both with her own team and as support crew for other teams. She has completed more than ten week-long sailing trips, several of them as skipper, along with leisure excursions. She also trained on Laser sailboats in Foça, İzmir, and has recently taken up windsurfing. Since 2026 she has been a member of TISE. Ashore, she is an AI/ML Engineer and lives in Belgium.',
  },
];
