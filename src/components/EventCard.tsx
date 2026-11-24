import { countryNames, type ClubEvent, type EventKind } from '../data/calendar';
import { placeCoords } from '../data/places';
import { formatDateRange, type EventStatus } from '../lib/calendar';
import { formatCoords } from '../lib/geo';
import { Flag } from './Flag';

export const kindLabels: Record<EventKind, string> = {
  sailing: 'On the water',
  learning: 'Learning',
  social: 'Social',
  show: 'Boat show',
  committee: 'Club meeting',
};

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join('');
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

function statusText(status: EventStatus, daysAway?: number) {
  if (status === 'past') return 'Done';
  if (status === 'now') return 'Happening now';
  if (status === 'next') {
    if (daysAway === 0) return 'Next up, today';
    if (daysAway === 1) return 'Next up, tomorrow';
    return `Next up, in ${daysAway} days`;
  }
  return null;
}

interface EventCardProps {
  event: ClubEvent;
  status: EventStatus;
  daysAway?: number;
  side: 'left' | 'right';
  monthLabel?: string;
}

/** One stop on the voyage: a buoy on the route and its chart label. */
export function EventCard({ event, status, daysAway, side, monthLabel }: EventCardProps) {
  const badge = statusText(status, daysAway);
  const coords = event.place ? placeCoords[event.place] : undefined;
  return (
    <li className={`stop stop--${side} stop--${status}`}>
      {monthLabel && (
        <p className="stop__month" aria-hidden="true">
          {monthLabel}
        </p>
      )}
      <span className={`stop__buoy stop__buoy--${event.kind}`} aria-hidden="true" />
      <article className="stop__body">
        <p className="stop__date">
          <time dateTime={event.start}>{formatDateRange(event.start, event.end)}</time>
          {badge && <span className={`stop__badge stop__badge--${status}`}>{badge}</span>}
        </p>
        <h3 className="stop__title">{event.title}</h3>
        <p className="stop__meta">
          <Flag code={event.country} />
          <span>{event.place ? `${event.place}, ${countryNames[event.country]}` : countryNames[event.country]}</span>
          <span className={`stop__kind stop__kind--${event.kind}`}>{kindLabels[event.kind]}</span>
        </p>
        {coords && <p className="stop__coords">{formatCoords(coords)}</p>}
        {event.organisers.length > 0 && <p className="stop__org">Organised by {joinNames(event.organisers)}</p>}
      </article>
    </li>
  );
}
