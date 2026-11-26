import { useMemo, useState } from 'react';
import { club } from '../data/club';
import { subscribeLinks } from '../lib/ics';
import { publicUrl } from '../lib/paths';

const icon = {
  apple:
    'M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM14.2 5.6c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z',
  calendar: 'M7 2v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2zM5 9h14v10H5z',
  download: 'M11 3h2v9.6l3.3-3.3 1.4 1.4L12 16.4l-5.7-5.7 1.4-1.4 3.3 3.3zM4 18h16v2H4z',
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

/** Subscribe to /calendar.ics from any calendar app; updates to the plan reach subscribers automatically. */
export function SubscribeBar() {
  // the feed's full address: against the page in the browser, against the club's site when rendered at build time
  const links = useMemo(() => {
    const page = typeof window === 'undefined' ? `${club.siteUrl}/` : window.location.href;
    return subscribeLinks(new URL(publicUrl('/calendar.ics'), page).href, club.name);
  }, []);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.download);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      document.querySelector<HTMLInputElement>('.subscribe__url')?.select();
    }
  };
  return (
    <div className="subscribe">
      <h3 className="subscribe__title">Follow the plan in your calendar</h3>
      <p className="subscribe__text">
        Subscribe once and new or changed activities appear on your phone automatically.
      </p>
      <div className="subscribe__buttons">
        <a className="btn btn--primary" href={links.apple}>
          <Icon d={icon.apple} />
          iPhone &amp; Mac
        </a>
        <a className="btn btn--ghost" href={links.google} target="_blank" rel="noopener noreferrer">
          <Icon d={icon.calendar} />
          Google Calendar
        </a>
        <a className="btn btn--ghost" href={links.outlook} target="_blank" rel="noopener noreferrer">
          <Icon d={icon.calendar} />
          Outlook
        </a>
        <a className="btn btn--ghost" href={links.download} download="tise-sailing-club.ics">
          <Icon d={icon.download} />
          Download file
        </a>
      </div>
      <div className="subscribe__copy">
        <input
          className="subscribe__url"
          readOnly
          value={links.download}
          aria-label="Calendar feed link"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button type="button" className="btn btn--ghost" onClick={copy}>
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      <p className="subscribe__hint">
        On Android: copy the link, then in Google Calendar on a computer choose Other calendars, From URL. It syncs to
        your phone from there.
      </p>
      <span className="visually-hidden" role="status">
        {copied ? 'Calendar link copied' : ''}
      </span>
    </div>
  );
}
