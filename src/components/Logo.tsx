import { publicUrl } from '../lib/paths';

/*
 * The club's logo, redrawn as vectors from the club's artwork (files in public/brand/): the
 * Turkish flag at the masthead, the blue mainsail with its ring of fifteen gold stars, the hull
 * and the wave. Always in its own colours, on white: the site's dark blue would hide the lettering.
 */

/** The logo without its bottom line of text (too small to read at this size), for the menu bar. */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      className={`logo ${className ?? ''}`}
      src={publicUrl('/brand/tise-logo-compact.svg')}
      alt=""
      width={59}
      height={60}
    />
  );
}

/** The whole logo with its name, Turkish International Sailors Europe, for the footer. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <img
      className={className}
      src={publicUrl('/brand/tise-logo.svg')}
      alt="TISE, Turkish International Sailors Europe"
      width={424}
      height={480}
    />
  );
}
