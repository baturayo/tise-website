import { useEffect, useState } from 'react';
import { Nav, sectionIds, type SectionId } from './components/Nav';
import { ScrollTrigger, useReducedMotion } from './hooks/motion';
import { toISODate } from './lib/calendar';
import { pickActive } from './lib/sections';
import { Hero } from './sections/Hero';
import { Cabin } from './sections/Cabin';
import { Voyage } from './sections/Voyage';
import { Harbour } from './sections/Harbour';
import { Footer } from './sections/Footer';
import './styles/chrome.css';

export function App() {
  const reduced = useReducedMotion();
  const [today] = useState(() => toISODate(new Date()));
  const [active, setActive] = useState<SectionId>('deck');

  // which section is being read: the one whose top has passed a line 35% down the window
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = sectionIds.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const id = pickActive(tops, window.innerHeight * 0.35, atBottom) as SectionId | undefined;
      if (id) setActive(id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // positions change once web fonts arrive; then honour a link straight to a section (/#voyage)
  useEffect(() => {
    const settle = async () => {
      await document.fonts?.ready;
      ScrollTrigger.refresh();
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    settle();
  }, []);

  return (
    <>
      <a className="skip-link" href="#voyage">
        Skip to the 2027 plan
      </a>
      <Nav active={active} />
      <main>
        <Hero today={today} motion={!reduced} />
        <Cabin />
        <Voyage today={today} motion={!reduced} />
        <Harbour />
      </main>
      <Footer />
    </>
  );
}
