import { describe, expect, it } from 'vitest';
import type { ClubEvent } from '../data/calendar';
import { buildCrew } from './crew';

const ev = (id: string, organisers: string[]): ClubEvent => ({
  id,
  title: id,
  start: '2027-01-01',
  country: 'BE',
  organisers,
  kind: 'social',
});
const events = [ev('a', ['Yeter', 'Baturay']), ev('b', ['Yeter']), ev('c', ['Yeter', 'Joel'])];

describe('buildCrew', () => {
  it('calls everyone without a listed role Executive, in alphabetical order', () => {
    expect(buildCrew(events, []).map((c) => [c.name, c.role])).toEqual([
      ['Baturay', 'Executive'],
      ['Joel', 'Executive'],
      ['Yeter', 'Executive'],
    ]);
  });

  it('includes listed members who organise no activity, in alphabetical place', () => {
    const crew = buildCrew(events, [{ name: 'Özge' }]);
    expect(crew.map((c) => c.name)).toEqual(['Baturay', 'Joel', 'Özge', 'Yeter']);
    expect(crew.find((c) => c.name === 'Özge')?.role).toBe('Executive');
  });

  it('puts members with a role first, in the order they are listed', () => {
    const crew = buildCrew(events, [
      { name: 'Özlem', role: 'President' },
      { name: 'Yeter', role: 'Treasurer' },
    ]);
    expect(crew.map((c) => c.name)).toEqual(['Özlem', 'Yeter', 'Baturay', 'Joel']);
  });

  it('shows a member by their full name, joined to the first name the calendar uses', () => {
    const crew = buildCrew(events, [
      { name: 'Yeter', fullName: 'Yeter Gökburun Bilgiç' },
      { name: 'Özge', fullName: 'Özge Bozal' },
    ]);
    expect(crew.map((c) => c.name)).toEqual(['Baturay', 'Joel', 'Özge Bozal', 'Yeter Gökburun Bilgiç']);
  });

  it('shows an organiser who is also listed once, with the listed role and photo', () => {
    const yeter = buildCrew(events, [{ name: 'Yeter', role: 'President', photo: '/crew/yeter.jpg' }]).filter(
      (c) => c.name === 'Yeter',
    );
    expect(yeter).toEqual([{ name: 'Yeter', firstName: 'Yeter', role: 'President', photo: '/crew/yeter.jpg' }]);
  });

  it('adds founder to the title of a founding member, who keeps their alphabetical place', () => {
    const crew = buildCrew(events, [
      { name: 'Özlem', role: 'Executive Lead' },
      { name: 'Joel', founder: true },
    ]);
    expect(crew.map((c) => [c.name, c.role])).toEqual([
      ['Özlem', 'Executive Lead'],
      ['Baturay', 'Executive'],
      ['Joel', 'Executive & founder'],
      ['Yeter', 'Executive'],
    ]);
  });

  it('adds founder to an office too, and the office still puts them first', () => {
    const crew = buildCrew(events, [
      { name: 'Serdar', role: 'President', founder: true },
      { name: 'Özlem', role: 'Executive Lead' },
    ]);
    expect(crew.map((c) => [c.name, c.role])).toEqual([
      ['Serdar', 'President & founder'],
      ['Özlem', 'Executive Lead'],
      ['Baturay', 'Executive'],
      ['Joel', 'Executive'],
      ['Yeter', 'Executive'],
    ]);
  });

  it('keeps the first name the calendar uses next to the full name', () => {
    const crew = buildCrew(events, [{ name: 'Yeter', fullName: 'Yeter Gökburun Bilgiç' }]);
    expect(crew.find((c) => c.firstName === 'Yeter')?.name).toBe('Yeter Gökburun Bilgiç');
  });
});
