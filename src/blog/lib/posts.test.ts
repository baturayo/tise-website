import { describe, expect, it } from 'vitest';
import type { BlogPost } from '../data/posts';
import { neighbours, newestFirst } from './posts';

const post = (slug: string, date: string): BlogPost => ({
  slug,
  title: slug,
  date,
  when: date,
  published: date,
  author: 'A sailor',
  summary: '',
});

const blog = [post('spring-regatta', '2027-04-10'), post('gibraltar', '2026-11-05'), post('summer-cruise', '2027-07-01')];

describe('newestFirst', () => {
  it('puts the most recent passage first', () => {
    expect(newestFirst(blog).map((p) => p.slug)).toEqual(['summer-cruise', 'spring-regatta', 'gibraltar']);
  });

  it('leaves the list it was given alone', () => {
    newestFirst(blog);
    expect(blog[0].slug).toBe('spring-regatta');
  });
});

describe('neighbours', () => {
  it('finds the newer and the older post either side', () => {
    const { newer, older } = neighbours(blog, 'spring-regatta');
    expect(newer?.slug).toBe('summer-cruise');
    expect(older?.slug).toBe('gibraltar');
  });

  it('has no newer post for the newest, and no older one for the oldest', () => {
    expect(neighbours(blog, 'summer-cruise').newer).toBeUndefined();
    expect(neighbours(blog, 'gibraltar').older).toBeUndefined();
  });

  it('has neither when the post is the only one', () => {
    expect(neighbours([post('gibraltar', '2026-11-05')], 'gibraltar')).toEqual({ newer: undefined, older: undefined });
  });

  it('refuses a post that is not on the blog', () => {
    expect(() => neighbours(blog, 'atlantic-crossing')).toThrow(/atlantic-crossing/);
  });
});
