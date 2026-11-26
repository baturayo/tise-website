import type { LogEntry, Main } from '../data/logbook';
import { hoursBy } from '../lib/passage';

const PLANS: { key: Main | 'none'; label: string; hoist: number }[] = [
  { key: 'full', label: 'Full main', hoist: 1 },
  { key: 'reef1', label: 'Reef 1', hoist: 0.8 },
  { key: 'reef2', label: 'Reef 2', hoist: 0.62 },
  { key: 'reef3', label: 'Reef 3', hoist: 0.46 },
  { key: 'trysail', label: 'Trysail', hoist: 0 },
  { key: 'none', label: 'Bare pole', hoist: 0 },
];

/** A side view of the rig with the main hoisted to a reef, or the small trysail set on its own. */
function Rig({ plan, hoist }: { plan: Main | 'none'; hoist: number }) {
  const top = 8;
  const foot = 92;
  const mast = 40;
  const head = foot - (foot - top) * hoist;
  return (
    <svg className="rig" viewBox="0 0 100 120" aria-hidden="true">
      <path className="rig__sea" d="M4 108 Q 18 102 32 108 T 60 108 T 88 108 T 100 108" />
      <path className="rig__hull" d="M14 98 L86 98 L78 106 L22 106 Z" />
      <line className="rig__mast" x1={mast} y1={top - 2} x2={mast} y2={98} />
      <line className="rig__boom" x1={mast} y1={foot} x2={82} y2={foot} />
      {hoist > 0 && <path className="rig__main" d={`M${mast + 1.5} ${head} L${mast + 1.5} ${foot - 1} L${80 - (1 - hoist) * 8} ${foot - 1} Z`} />}
      {hoist > 0 && hoist < 1 && <path className="rig__reef" d={`M${mast + 1.5} ${foot - 1} L80 ${foot - 1}`} />}
      {plan === 'trysail' && <path className="rig__main rig__main--trysail" d={`M${mast + 1.5} 46 L${mast + 1.5} 86 L68 84 Z`} />}
    </svg>
  );
}

/**
 * Hours under each mainsail plan, and with the engine running, as logged: every interval between
 * two entries counts for the plan written at its start. Time in harbour is left out.
 */
export function SailWardrobe({ log }: { log: LogEntry[] }) {
  // the intervals from the entry before each harbour stay to the departure are spent in harbour
  const inPort = (e: LogEntry) => e.n === 19 || e.n === 48;
  const byMain = hoursBy(log, (e) => e.main ?? 'none', inPort);
  const byEngine = hoursBy(log, (e) => (e.engine ? 'on' : 'off'), inPort);
  const atSea = (byEngine.on ?? 0) + (byEngine.off ?? 0);
  const max = Math.max(...Object.values(byMain));

  return (
    <figure className="wardrobe">
      <ul className="wardrobe__plans">
        {PLANS.map((p) => {
          const h = byMain[p.key] ?? 0;
          return (
            <li key={p.key} className="wardrobe__plan">
              <Rig plan={p.key} hoist={p.hoist} />
              <span className="wardrobe__label">{p.label}</span>
              <span className="wardrobe__bar" style={{ inlineSize: `${(h / max) * 100}%` }} aria-hidden="true" />
              <span className="wardrobe__hours">{Math.round(h)} h</span>
            </li>
          );
        })}
      </ul>
      <div className="wardrobe__engine">
        <p>
          The engine was running for <strong>{Math.round(byEngine.on ?? 0)}</strong> of the {Math.round(atSea)} hours at sea in
          the log; sails alone for {Math.round(byEngine.off ?? 0)}.
        </p>
        <div className="wardrobe__split" aria-hidden="true">
          <span className="wardrobe__split-on" style={{ flexGrow: byEngine.on ?? 0 }} />
          <span className="wardrobe__split-off" style={{ flexGrow: byEngine.off ?? 0 }} />
        </div>
      </div>
    </figure>
  );
}
