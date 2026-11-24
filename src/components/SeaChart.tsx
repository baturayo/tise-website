import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { ScrollTrigger } from '../hooks/motion';

/** Lines of swell across the chart; neighbouring rows drift opposite ways as the page scrolls. */
const ROWS = Array.from({ length: 24 }, (_, i) => ({
  top: ((i + 0.5) / 24) * 100 + (((i * 37) % 5) - 2) * 0.6,
  dist: (i % 2 ? -1 : 1) * (320 + ((i * 89) % 260)),
  phase: (i * 53) % 160,
  chop: i % 3 === 2,
}));

const POINTS = [
  { angles: [22.5, 67.5], length: 44, width: 6 },
  { angles: [45], length: 60, width: 8.5 },
  { angles: [0], length: 88, width: 12 },
];

/** A chart compass rose: degree ring, 16 points and the rhumb lines running out across the sea. */
export function CompassRose({ className, x, y, size }: { className: string; x?: number; y?: number; size?: number }) {
  return (
    <svg className={className} viewBox="-120 -120 240 240" x={x} y={y} width={size} height={size} aria-hidden="true">
      <g className="rose__rhumbs">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} y2={-1800} transform={`rotate(${i * 22.5})`} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g className="rose__ring">
        <circle r="97" />
        <circle r="90" />
        {Array.from({ length: 72 }, (_, i) => (
          <line key={i} y1={-90} y2={i % 2 ? -93.5 : -97} transform={`rotate(${i * 5})`} />
        ))}
      </g>
      <g className="rose__degrees">
        {Array.from({ length: 11 }, (_, i) => (i + 1) * 30).map((a) => (
          <text key={a} transform={`rotate(${a}) translate(0 -103)`}>
            {String(a).padStart(3, '0')}
          </text>
        ))}
        <text className="rose__north" transform="translate(0 -103)">
          N
        </text>
      </g>
      <g className="rose__points">
        {POINTS.flatMap(({ angles, length, width }) =>
          angles.flatMap((base) =>
            [0, 90, 180, 270].map((q) => {
              const a = base + q;
              return (
                <g key={`${a}-${length}`} transform={`rotate(${a})`}>
                  <path className="rose__dark" d={`M0 ${-length} L${-width} ${-width} L0 0 Z`} />
                  <path className="rose__light" d={`M0 ${-length} L${width} ${-width} L0 0 Z`} />
                </g>
              );
            }),
          ),
        )}
        <circle r="4.5" />
      </g>
    </svg>
  );
}

/** The sea chart under the 2027 plan: swell, compass roses and the graduated chart border. */
export function SeaChart({ motion }: { motion: boolean }) {
  const sea = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = sea.current;
    if (!motion || !el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => el.style.setProperty('--drift', self.progress.toFixed(4)),
    });
    el.style.setProperty('--drift', trigger.progress.toFixed(4));
    return () => trigger.kill();
  }, [motion]);

  return (
    <div className="chart" aria-hidden="true">
      <div className="sea" ref={sea}>
        {ROWS.map((r, i) => (
          <div
            key={i}
            className={`sea__row${r.chop ? ' sea__row--chop' : ''}`}
            style={{ top: `${r.top}%`, '--dist': `${r.dist}px`, '--phase': `${r.phase}px` } as CSSProperties}
          />
        ))}
      </div>
      <CompassRose className="chart__rose chart__rose--north" />
      <CompassRose className="chart__rose chart__rose--south" />
      <div className="chart__scale chart__scale--left" />
      <div className="chart__scale chart__scale--right" />
    </div>
  );
}
