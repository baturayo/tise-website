import { publicUrl } from '../lib/paths';

interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
}

/**
 * The club's logo, redrawn as vectors from the original artwork (files in public/brand/): the
 * Turkish flag at the masthead, the blue mainsail with its ring of fifteen gold stars, the hull
 * and the wave. On the site's dark blue the white version is used.
 */
export function LogoMark({ className }: { className?: string }) {
  return <img className={className} src={publicUrl('/brand/tise-mark-white.svg')} alt="" width={44} height={45} />;
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

export function Logo({ variant = 'full', className }: LogoProps) {
  if (variant === 'mark') return <LogoMark className={className} />;
  return (
    <span className={`logo ${className ?? ''}`}>
      <LogoMark className="logo__mark" />
      <span className="logo__type" aria-hidden="true">
        <span className="logo__name">TISE</span>
        <span className="logo__sub">Sailing Club</span>
      </span>
    </span>
  );
}
