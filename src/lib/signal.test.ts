import { describe, expect, it } from 'vitest';
import { phonetic, signalLetters } from './signal';

describe('signalLetters', () => {
  it('spells a name in the letters of the signal flags', () => {
    expect(signalLetters('Joel')).toEqual(['J', 'O', 'E', 'L']);
  });

  it('flies Turkish letters as their plain flag', () => {
    expect(signalLetters('Özlem')).toEqual(['O', 'Z', 'L', 'E', 'M']);
    expect(signalLetters('Ilgın Çağrı Şükrü')).toEqual([...'ILGINCAGRISUKRU']);
    expect(signalLetters('İsmail')).toEqual([...'ISMAIL']);
  });

  it('leaves out spaces, hyphens and anything without a flag', () => {
    expect(signalLetters("Jean-Luc O'Neil 2")).toEqual([...'JEANLUCONEIL']);
  });
});

describe('phonetic', () => {
  it('reads a hoist aloud in the phonetic alphabet', () => {
    expect(phonetic(['B', 'A', 'T', 'U', 'R', 'A', 'Y'])).toBe('Bravo Alfa Tango Uniform Romeo Alfa Yankee');
  });
});
