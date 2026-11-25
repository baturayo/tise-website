import type { ClubEvent } from '../data/calendar';
import type { CrewMember } from '../data/club';

export interface CrewEntry {
  /** the name shown: the full name when it is known */
  name: string;
  /** the first name, as the calendar writes it: spelled in signal flags above the photo */
  firstName: string;
  role: string;
  photo?: string;
  /** a few sentences about them, shown when their card is turned over */
  bio?: string;
}

/**
 * Everyone on the crew list: the members listed in club.ts plus everyone organising an activity.
 * Members with an office (President, Executive Lead) come first in the order listed, then everyone
 * else alphabetically, as Executive. A founding member gets "& founder" after their title.
 */
export function buildCrew(events: ClubEvent[], members: CrewMember[]): CrewEntry[] {
  const listed = new Map(members.map((m) => [m.name, m]));
  const names = [...new Set([...members.map((m) => m.name), ...events.flatMap((e) => e.organisers)])];

  const crew = names.map((name): CrewEntry => {
    const member = listed.get(name);
    const title = member?.role ?? 'Executive';
    const role = member?.founder ? `${title} & founder` : title;
    const entry: CrewEntry = { name: member?.fullName ?? name, firstName: name, role };
    if (member?.photo) entry.photo = member.photo;
    if (member?.bio) entry.bio = member.bio;
    return entry;
  });

  const officers = members.filter((m) => m.role).map((m) => m.fullName ?? m.name);
  const rank = (c: CrewEntry) => {
    const i = officers.indexOf(c.name);
    return i === -1 ? officers.length : i;
  };
  return crew.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}
