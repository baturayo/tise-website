import type { BlogPost } from '../data/posts';

/** The posts with the most recent sailing first, as the blog lists them. */
export function newestFirst(list: BlogPost[]): BlogPost[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

/** The posts either side of one, in the blog's newest-first order. */
export function neighbours(list: BlogPost[], slug: string): { newer?: BlogPost; older?: BlogPost } {
  const sorted = newestFirst(list);
  const i = sorted.findIndex((p) => p.slug === slug);
  if (i < 0) throw new Error(`There is no blog post called "${slug}"`);
  return { newer: sorted[i - 1], older: sorted[i + 1] };
}
