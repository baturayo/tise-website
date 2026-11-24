import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';

/** Everything on the page, top to bottom; used to work out which part is being read. */
export const sectionIds = ['deck', 'about', 'crew', 'founders', 'voyage', 'join', 'contact'] as const;
export type SectionId = (typeof sectionIds)[number];

/** The sections listed in the header and the footer. */
export const navItems: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'Who we are' },
  { id: 'crew', label: 'Crew' },
  { id: 'founders', label: 'Founders' },
  { id: 'voyage', label: '2027 plan' },
  { id: 'contact', label: 'Contact' },
];

export function Nav({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and puts focus back on its button; growing to desktop width closes it too.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const wide = window.matchMedia('(min-width: 981px)');
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [open]);

  return (
    <header className={`nav${open ? ' nav--open' : ''}`}>
      <div className="nav__bar">
        <a
          className="nav__home"
          href="#deck"
          aria-label="TISE Sailing Club, back to top"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </a>
        <nav className="nav__menu" id="site-menu" aria-label="Sections">
          <ul className="nav__links">
            {navItems.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined} onClick={() => setOpen(false)}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--primary nav__menu-cta" href="#join" onClick={() => setOpen(false)}>
            Sail with us
          </a>
        </nav>
        <a className="btn btn--primary nav__cta" href="#join">
          Sail with us
        </a>
        <button
          ref={toggle}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__toggle-icon" aria-hidden="true" />
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
