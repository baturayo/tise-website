/** Names spelled in the flags of the International Code of Signals, one flag per letter A–Z. */

const WORDS: Record<string, string> = {
  A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel',
  I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa',
  Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey',
  X: 'X-ray', Y: 'Yankee', Z: 'Zulu',
};

/**
 * The flags that spell a name. There are no flags for Ö, Ç, Ğ, Ş, Ü or the dotted and dotless i,
 * so they fly as O, C, G, S, U and I; spaces, hyphens and the like are left out.
 */
export function signalLetters(name: string): string[] {
  return [...name.toLocaleUpperCase('tr-TR').normalize('NFD').replace(/\p{M}/gu, '')].filter((c) => c in WORDS);
}

/** A hoist read aloud in the phonetic alphabet: "Oscar Zulu Lima Echo Mike". */
export function phonetic(letters: string[]): string {
  return letters.map((l) => WORDS[l]).join(' ');
}
