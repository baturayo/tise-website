import { careLabel, type CareMark } from '../data/passage';

/** Laundry-label symbols, bent to fit an offshore passage. */
function Mark({ mark }: { mark: CareMark }) {
  const tub = 'M5 20 9 34h22l4-14';
  const wave = 'M5 20q3.75-4 7.5 0t7.5 0 7.5 0 7.5 0';
  return (
    <svg className="care__mark" viewBox="0 0 40 40" aria-hidden="true">
      {mark === 'shower' && (
        <>
          <path d={tub} />
          <path d={wave} />
          <path d="M11 6h18M15 10v3M20 10v4M25 10v3" />
        </>
      )}
      {mark === 'cotton' && (
        <>
          <rect x="6" y="6" width="28" height="28" />
          <circle cx="20" cy="20" r="9" />
          <path d="M5 5l30 30M35 5 5 35" />
        </>
      )}
      {mark === 'pro' && (
        <>
          <circle cx="20" cy="20" r="14" />
          <text x="20" y="25.5" textAnchor="middle">
            P
          </text>
        </>
      )}
      {mark === 'spin' && (
        <>
          <path d={tub} />
          <path d={wave} />
          <text x="20" y="31" textAnchor="middle" className="care__temp">
            35
          </text>
        </>
      )}
    </svg>
  );
}

function ProteinBar() {
  return (
    <svg className="menu__pic" viewBox="0 0 120 40" aria-hidden="true">
      {/* the half that was eaten, solid; the half that wasn't, in outline */}
      <path className="menu__ink" d="M8 10h52v20H8zM4 12l4-2v20l-4-2zM24 10v20M40 10v20" />
      <path className="menu__ghost" d="M60 10h52v20H60zM112 10l4 2v16l-4 2" />
      <path className="menu__bite" d="M60 10q-4 5 0 10t0 10" />
    </svg>
  );
}

function PizzaSlice() {
  return (
    <svg className="menu__pic" viewBox="0 0 120 40" aria-hidden="true">
      <path className="menu__ink" d="M38 8q22-6 44 0L60 38z" />
      <path className="menu__ink" d="M40 12q20-5 40 0" />
      <circle className="menu__dot" cx="56" cy="19" r="2.4" />
      <circle className="menu__dot" cx="66" cy="22" r="2" />
      <circle className="menu__dot" cx="60" cy="28" r="1.8" />
    </svg>
  );
}

/** Wednesday's menu and the care label: what the storm cost me, and what to pack instead. */
export function CareLabel() {
  return (
    <div className="kit__layout">
      <figure className="menu">
        <p className="menu__title">Wednesday’s menu</p>
        <p className="menu__sub">served throughout the storm</p>
        <ul className="menu__items">
          <li>
            <ProteinBar />
            <span className="menu__dish">Protein bar</span>
            <span className="menu__qty">half</span>
          </li>
          <li>
            <PizzaSlice />
            <span className="menu__dish">Pizza</span>
            <span className="menu__qty">one slice</span>
          </li>
        </ul>
        <figcaption className="menu__foot">No dessert.</figcaption>
      </figure>

      <div className="care">
        <p className="care__head">Offshore care instructions</p>
        <ol className="care__list">
          {careLabel.map((c) => (
            <li key={c.mark} className="care__row">
              <Mark mark={c.mark} />
              <span>
                <strong className="care__title">{c.title}</strong>
                <span className="care__text">{c.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="care__fabric">
          <span>100% polyester</span>
          <s>cotton</s>
        </p>
      </div>
    </div>
  );
}
