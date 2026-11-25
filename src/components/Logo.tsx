import { publicUrl } from '../lib/paths';

/*
 * The club's logo, redrawn as vectors from the original artwork (files in public/brand/): the
 * Turkish flag at the masthead, the blue mainsail with its ring of fifteen gold stars, the hull
 * and the wave. On the site's dark blue the white versions are used.
 */

/** The logo without its bottom line of text, sized for the menu bar (the link around it is labelled). */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      className={`logo ${className ?? ''}`}
      src={publicUrl('/brand/tise-logo-compact-white.svg')}
      alt=""
      width={58}
      height={60}
    />
  );
}

/** The whole logo with its name, Turkish International Sailors Europe, for the footer. */
export function LogoFull({ className }: { className?: string }) {
  return (
    <img
      className={className}
      src={publicUrl('/brand/tise-logo-white.svg')}
      alt="TISE, Turkish International Sailors Europe"
      width={444}
      height={507}
    />
  );
}
