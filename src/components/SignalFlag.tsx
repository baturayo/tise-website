import type { ReactNode } from 'react';

/**
 * The 26 letter flags of the International Code of Signals, drawn with the hoist (the edge on the
 * halyard) on the left, in a 48 × 40 box (1 : 1.2, the proportion of code flags). Designs checked
 * against the Wikipedia blazons and the Wikimedia Commons drawings (ICS_*.svg).
 */
const R = '#d4252a';
const Y = '#f6c500';
const B = '#1f4ea3';
const W = '#f4f3ee';
const K = '#121418';

const W_ = 48;
const H_ = 40;
const rect = (fill: string, x = 0, y = 0, w = W_, h = H_) => <rect x={x} y={y} width={w} height={h} fill={fill} />;
const poly = (fill: string, points: string) => <polygon points={points} fill={fill} />;
/** quarters: top-hoist, top-fly, bottom-hoist, bottom-fly */
const quarters = (a: string, b: string, c: string, d: string) => (
  <>
    {rect(a, 0, 0, 24, 20)}
    {rect(b, 24, 0, 24, 20)}
    {rect(c, 0, 20, 24, 20)}
    {rect(d, 24, 20, 24, 20)}
  </>
);
const saltire = (field: string, cross: string) => (
  <>
    {rect(field)}
    <path d="M0 0L48 40M48 0L0 40" stroke={cross} strokeWidth="8" />
  </>
);
const cross = (field: string, bars: string) => (
  <>
    {rect(field)}
    {rect(bars, 19.2, 0, 9.6, H_)}
    {rect(bars, 0, 16, W_, 8)}
  </>
);
const centreSquare = (field: string, square: string) => (
  <>
    {rect(field)}
    {rect(square, 16, 13.33, 16, 13.34)}
  </>
);
/** Yankee: ten diagonal stripes from the top fly to the bottom hoist, yellow at the top hoist corner */
const yankee = (
  <>
    {rect(Y)}
    {[1, 3, 5, 7, 9].map((k) => {
      const c = (k + 0.5) * 8.8;
      return <path key={k} d={`M${c + 20} -20L${c - 60} 60`} stroke={R} strokeWidth={8.8 / Math.SQRT2} />;
    })}
  </>
);

const SWALLOWTAIL = '0,0 48,0 36,20 48,40 0,40';

const FLAGS: Record<string, ReactNode> = {
  A: (
    <>
      {rect(W, 0, 0, 24, H_)}
      {poly(B, '24,0 48,0 36,20 48,40 24,40')}
    </>
  ),
  B: poly(R, SWALLOWTAIL),
  C: (
    <>
      {rect(B)}
      {rect(W, 0, 8, W_, 24)}
      {rect(R, 0, 16, W_, 8)}
    </>
  ),
  D: (
    <>
      {rect(Y)}
      {rect(B, 0, 10, W_, 20)}
    </>
  ),
  E: (
    <>
      {rect(B, 0, 0, W_, 20)}
      {rect(R, 0, 20, W_, 20)}
    </>
  ),
  F: (
    <>
      {rect(W)}
      {poly(R, '24,0 48,20 24,40 0,20')}
    </>
  ),
  G: (
    <>
      {rect(B)}
      {[0, 16, 32].map((x) => (
        <rect key={x} x={x} y={0} width={8} height={H_} fill={Y} />
      ))}
    </>
  ),
  H: (
    <>
      {rect(W, 0, 0, 24, H_)}
      {rect(R, 24, 0, 24, H_)}
    </>
  ),
  I: (
    <>
      {rect(Y)}
      <circle cx={24} cy={20} r={10} fill={K} />
    </>
  ),
  J: (
    <>
      {rect(B)}
      {rect(W, 0, 13.33, W_, 13.34)}
    </>
  ),
  K: (
    <>
      {rect(Y, 0, 0, 24, H_)}
      {rect(B, 24, 0, 24, H_)}
    </>
  ),
  L: quarters(Y, K, K, Y),
  M: saltire(B, W),
  N: (
    <>
      {rect(W)}
      {[0, 1, 2, 3].flatMap((row) =>
        [0, 1, 2, 3]
          .filter((col) => (row + col) % 2 === 0)
          .map((col) => <rect key={`${row}${col}`} x={col * 12} y={row * 10} width={12} height={10} fill={B} />),
      )}
    </>
  ),
  O: (
    <>
      {poly(Y, '0,0 0,40 48,40')}
      {poly(R, '0,0 48,0 48,40')}
    </>
  ),
  P: centreSquare(B, W),
  Q: rect(Y),
  R: cross(R, Y),
  S: centreSquare(W, B),
  T: (
    <>
      {rect(R, 0, 0, 16, H_)}
      {rect(W, 16, 0, 16, H_)}
      {rect(B, 32, 0, 16, H_)}
    </>
  ),
  U: quarters(R, W, W, R),
  V: saltire(W, R),
  W: (
    <>
      {rect(B)}
      {rect(W, 8, 6.67, 32, 26.66)}
      {rect(R, 16, 13.33, 16, 13.34)}
    </>
  ),
  X: cross(W, B),
  Y: yankee,
  Z: (
    <>
      {poly(Y, '0,0 48,0 24,20')}
      {poly(K, '0,0 24,20 0,40')}
      {poly(R, '0,40 24,20 48,40')}
      {poly(B, '48,0 48,40 24,20')}
    </>
  ),
};

export function SignalFlag({ letter }: { letter: string }) {
  const swallowtail = letter === 'A' || letter === 'B';
  return (
    <svg className="signal-flag" viewBox="0 0 48 40" aria-hidden="true">
      {FLAGS[letter]}
      {/* a hairline edge, so white and black cloth still shows against the night-blue page */}
      {swallowtail ? (
        <polygon className="signal-flag__edge" points={SWALLOWTAIL} />
      ) : (
        <rect className="signal-flag__edge" x={0} y={0} width={W_} height={H_} />
      )}
    </svg>
  );
}
