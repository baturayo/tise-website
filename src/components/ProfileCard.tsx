import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { phonetic, signalLetters } from '../lib/signal';
import { SignalFlag } from './SignalFlag';
import './profile-card.css';

interface ProfileCardProps {
  /** full name, written on the log page */
  name: string;
  /** first name: the name hoisted in signal flags */
  callName: string;
  role: string;
  /** dates, for the founders */
  years?: string;
  bio?: string;
  /** the heading of the log page */
  heading: string;
  /** fly the name at half-mast, in remembrance */
  halfMast?: boolean;
  className?: string;
  /** the photo, on the front of the card */
  children: ReactNode;
}

/**
 * A photo that turns over, like a card, to a page from the ship's log about that person. Pointing at it
 * turns it on screens with a mouse; the button turns it everywhere else, and from the keyboard.
 */
export function ProfileCard({ name, callName, role, years, bio, heading, halfMast = false, className, children }: ProfileCardProps) {
  const [turned, setTurned] = useState(false);
  const id = useId();
  const letters = signalLetters(callName);
  return (
    <div className={`card${className ? ` ${className}` : ''}`} data-turned={turned ? '' : undefined}>
      <div className="card__inner">
        <div className="card__front">{children}</div>
        <div className="card__back" id={`${id}-log`}>
          {/* the first name hoisted in code flags down the margin of the page, read from the top */}
          <div
            className={halfMast ? 'card__hoist card__hoist--half' : 'card__hoist'}
            title={`${callName} in signal flags${halfMast ? ', at half-mast' : ''}: ${phonetic(letters)}`}
            aria-hidden="true"
          >
            <span className="card__hoist-flags">
              {letters.map((l, i) => (
                <span key={i} className="card__flag" style={{ '--i': i } as CSSProperties}>
                  <SignalFlag letter={l} />
                </span>
              ))}
            </span>
          </div>
          <div aria-hidden="true">
            <p className="card__heading">{heading}</p>
            <p className="card__name">{name}</p>
            {years && <p className="card__rank">{years}</p>}
          </div>
          {bio ? (
            <p className="card__bio">{bio}</p>
          ) : (
            <p className="card__bio card__phonetic">
              {callName}, {role.toLowerCase()}. The flags in the margin spell {callName}: {phonetic(letters)}.
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        className="card__turn"
        aria-expanded={turned}
        aria-controls={`${id}-log`}
        onClick={() => setTurned((t) => !t)}
      >
        {turned ? 'Show photo' : 'Read log'}
        <span className="visually-hidden">: {name}</span>
      </button>
    </div>
  );
}
