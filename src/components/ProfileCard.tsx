import { useId, useState, type ReactNode } from 'react';
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
  className?: string;
  /** the photo, on the front of the card */
  children: ReactNode;
}

/**
 * A photo that turns over, like a card, to a page from the ship's log about that person. Pointing at it
 * turns it on screens with a mouse; the button turns it everywhere else, and from the keyboard.
 */
export function ProfileCard({ name, callName, role, years, bio, heading, className, children }: ProfileCardProps) {
  const [turned, setTurned] = useState(false);
  const id = useId();
  const letters = signalLetters(callName);
  return (
    <div className={`card${className ? ` ${className}` : ''}`} data-turned={turned ? '' : undefined}>
      <div className="card__inner">
        <div className="card__front">{children}</div>
        <div className="card__back" id={`${id}-log`}>
          <div aria-hidden="true">
            <p className="card__heading">{heading}</p>
            <p className="card__name">{name}</p>
            <p className="card__rank">{years ? `${role}, ${years}` : role}</p>
          </div>
          {bio ? (
            <p className="card__bio">{bio}</p>
          ) : (
            <div className="card__signal" aria-hidden="true">
              <span className="card__flags">
                {letters.map((l, i) => (
                  <SignalFlag key={i} letter={l} />
                ))}
              </span>
              <span className="card__phonetic">
                {callName} in signal flags: {phonetic(letters)}
              </span>
            </div>
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
