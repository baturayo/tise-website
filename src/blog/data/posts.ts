/**
 * The blog's posts. Each one lives in its own folder under sailing-blogs/, named by its slug, and
 * needs an entry here so the blog's front page and the other posts can link to it.
 */
export interface BlogPost {
  slug: string;
  title: string;
  /** when the sailing happened (ISO date), to put the newest first */
  date: string;
  /** the date as shown */
  when: string;
  author: string;
  summary: string;
}

export const posts: BlogPost[] = [
  {
    slug: 'gibraltar-to-las-palmas',
    title: 'Gibraltar to Las Palmas',
    date: '2026-11-05',
    when: 'November 2026',
    author: 'Baturay Ofluoğlu',
    summary:
      'Nine days and about 830 miles down the coast of Morocco to the Canaries: a whale in the Strait, a broken halyard, a fuel stop in Mohammedia with no fuel, and a gale under the trysail. Told from the boat’s logbook, with the wet bits left in.',
  },
];
