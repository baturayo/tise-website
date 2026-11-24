import { Logo } from '../components/Logo';
import { navItems } from '../components/Nav';
import { calendarYear } from '../data/calendar';
import { club } from '../data/club';
import { photoCredits } from '../data/credits';
import { publicUrl } from '../lib/paths';
import './footer.css';

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__grid wrap">
        <div className="footer__brand">
          <Logo />
          <p>
            A sailing club for people of every experience level, based in {club.city} since {club.founded}.
          </p>
        </div>

        <nav className="footer__col" aria-labelledby="footer-explore">
          <h2 id="footer-explore">Explore</h2>
          <ul>
            {navItems
              .filter((s) => s.id !== 'contact')
              .map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.label}</a>
                </li>
              ))}
            <li>
              <a href="#join">Join the club</a>
            </li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2>Contact</h2>
          <ul>
            <li>
              <a href={club.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              {club.city}, {club.country}
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h2>Calendar</h2>
          <ul>
            <li>
              <a href="#voyage">The {calendarYear} plan</a>
            </li>
            <li>
              <a href={publicUrl('/calendar.ics')} download="tise-sailing-club.ics">
                Download the calendar (.ics)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__legal wrap">
        <p>
          © {new Date().getFullYear()} {club.name}
        </p>
        <p className="footer__credits">
          Images and map data, resized, cropped or tinted for this site:{' '}
          {photoCredits.map((c, i) => (
            <span key={c.source}>
              {i > 0 && '; '}
              <a href={c.source}>{c.title}</a> by {c.author} (<a href={c.licenceUrl}>{c.licence}</a>)
            </span>
          ))}
          .
        </p>
      </div>
    </footer>
  );
}
