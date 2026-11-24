import type { CountryCode } from '../data/calendar';
import { countryNames } from '../data/calendar';
import { starPath } from './svg';

/** Small 3:2 country flag, drawn inline so it renders the same on every platform. */
export function Flag({ code, className }: { code: CountryCode; className?: string }) {
  return (
    <svg className={`flag ${className ?? ''}`} viewBox="0 0 30 20" role="img" aria-label={countryNames[code]}>
      {code === 'BE' && (
        <>
          <rect width="10" height="20" fill="#1a1a1a" />
          <rect x="10" width="10" height="20" fill="#FDDA24" />
          <rect x="20" width="10" height="20" fill="#EF3340" />
        </>
      )}
      {code === 'NL' && (
        <>
          <rect width="30" height="6.67" fill="#AE1C28" />
          <rect y="6.67" width="30" height="6.67" fill="#fff" />
          <rect y="13.33" width="30" height="6.67" fill="#21468B" />
        </>
      )}
      {code === 'DE' && (
        <>
          <rect width="30" height="6.67" fill="#1a1a1a" />
          <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
          <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
        </>
      )}
      {code === 'TR' && (
        <>
          <rect width="30" height="20" fill="#E30A17" />
          <circle cx="11" cy="10" r="5" fill="#fff" />
          <circle cx="12.25" cy="10" r="4" fill="#E30A17" />
          <path d={starPath(17.4, 10, 2.5)} fill="#fff" transform="rotate(-18 17.4 10)" />
        </>
      )}
    </svg>
  );
}
