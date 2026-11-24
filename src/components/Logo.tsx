import { useId } from 'react';
import { ring, starPath } from './svg';

interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
}

/**
 * The TISE mark, redrawn from the original: a blue mainsail carrying the ring of twelve stars,
 * a lighter jib, the red pennant at the masthead and two waves underneath.
 */
export function LogoMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="TISE Sailing Club">
      <defs>
        <linearGradient id={`${id}main`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4D86FF" />
          <stop offset=".55" stopColor="#1846C9" />
          <stop offset="1" stopColor="#0A1F6B" />
        </linearGradient>
        <linearGradient id={`${id}jib`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#A9C4FF" />
        </linearGradient>
        <linearGradient id={`${id}wave`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22C3D0" />
          <stop offset="1" stopColor="#6FA8FF" />
        </linearGradient>
      </defs>
      {/* pennant */}
      <path d="M33.2 3.2 L43.5 5.4 L33.2 8.4 Z" fill="#E30A17" />
      <circle cx="36.3" cy="5.8" r="1.25" fill="#fff" />
      <circle cx="36.8" cy="5.8" r="1" fill="#E30A17" />
      {/* mast */}
      <rect x="32.4" y="3" width="1.5" height="44" rx=".75" fill="#0A1F6B" />
      {/* jib */}
      <path d="M31.2 10 L31.2 45 L11 45 C17.5 33 24.5 20 31.2 10 Z" fill={`url(#${id}jib)`} />
      {/* mainsail */}
      <path d="M35 7 C46 15.5 54.8 29 57 45 L35 45 Z" fill={`url(#${id}main)`} />
      {ring(45, 32, 6.2).map(([x, y], i) => (
        <path key={i} d={starPath(x, y, 1.25)} fill="#FFCC00" />
      ))}
      {/* hull */}
      <path d="M8.5 47.5 H59.5 C57.5 51.5 54 53.6 49.5 53.6 H18 C13.6 53.6 10.4 51.2 8.5 47.5 Z" fill="#0A1F6B" />
      {/* waves */}
      <path
        d="M4 58.5 C10 55, 16 62, 23 58.5 S36 55, 43 58.5 S54 62, 60 58.5"
        fill="none"
        stroke={`url(#${id}wave)`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M14 62.4 C19 60, 24 64.5, 30 62.4 S41 60, 47 62.4"
        fill="none"
        stroke={`url(#${id}wave)`}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
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
