export interface SectionTop {
  id: string;
  /** distance from the top of the window, as from getBoundingClientRect() */
  top: number;
}

/** The section being read: the last one whose top has passed the reading line, or the last one at the bottom of the page. */
export function pickActive(sections: SectionTop[], line: number, atBottom: boolean): string | undefined {
  if (!sections.length) return undefined;
  if (atBottom) return sections[sections.length - 1].id;
  let active = sections[0].id;
  for (const s of sections) if (s.top <= line) active = s.id;
  return active;
}
