import { calendarYear, events2027 } from '../data/calendar';
import { club, crewMembers, founders } from '../data/club';
import { SignalFlag } from '../components/SignalFlag';
import { buildCrew } from '../lib/crew';
import { publicUrl } from '../lib/paths';
import { phonetic, signalLetters } from '../lib/signal';
import './cabin.css';

/** The first name hoisted in code flags, read from the top, as a boat signals. */
function Hoist({ name, halfMast = false }: { name: string; halfMast?: boolean }) {
  const letters = signalLetters(name);
  return (
    <div
      className={halfMast ? 'hoist hoist--half' : 'hoist'}
      title={`${name} in signal flags${halfMast ? ', at half-mast' : ''}: ${phonetic(letters)}`}
    >
      {letters.map((l, i) => (
        <SignalFlag key={i} letter={l} />
      ))}
    </div>
  );
}

function Portrait({ name, photo }: { name: string; photo?: string }) {
  return photo ? (
    <img className="crew__photo" src={publicUrl(photo)} alt="" loading="lazy" />
  ) : (
    <span className="crew__photo crew__initial" aria-hidden="true">
      {name.charAt(0)}
    </span>
  );
}

export function Cabin() {
  const crew = buildCrew(events2027, crewMembers);
  return (
    <section className="cabin" id="about" aria-labelledby="cabin-title">
      <div className="cabin__window">
        <img
          className="cabin__photo"
          src={publicUrl('/photos/chart-table-1280.jpg')}
          srcSet={`${publicUrl('/photos/chart-table-1280.jpg')} 1280w, ${publicUrl('/photos/chart-table-1920.jpg')} 1920w`}
          sizes="100vw"
          alt="A navigator's chart table: a paper chart with dividers, a pencil, a hand-bearing compass, tide tables and a logbook"
          loading="lazy"
        />
        <div className="wrap">
          <header className="cabin__intro">
            <h2 id="cabin-title">Who we are</h2>
            <p>{club.intro}</p>
            <dl className="cabin__facts">
              <div>
                <dt>Home port</dt>
                <dd>
                  {club.city}, {club.country}
                </dd>
              </div>
              <div>
                <dt>Sailing since</dt>
                <dd>{club.founded}</dd>
              </div>
              <div>
                <dt>Where we sail</dt>
                <dd>{club.waters.join(', ')}</dd>
              </div>
            </dl>
          </header>
        </div>
      </div>

      <div className="cabin__inner wrap">
        <div className="crew" id="crew">
          <h3>The crew</h3>
          <p className="crew__note">
            The people running the club and organising our activities in {calendarYear}. Above each photo, their
            first name is spelled in signal flags, read from the top.
          </p>
          <ul className="crew__list">
            {crew.map(({ name, firstName, role, photo }) => (
              <li className="crew__member" key={name}>
                <Hoist name={firstName} />
                <Portrait name={name} photo={photo} />
                <div className="crew__caption">
                  <p className="crew__name">{name}</p>
                  <p className="crew__role">{role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="founders" id="founders" aria-labelledby="founders-title">
          <div className="founders__head">
            <h3 id="founders-title">Legacy &amp; remembrance</h3>
            <p>Founding members of TISE, in loving memory. Their names fly at half-mast.</p>
          </div>
          <ul className="founders__list">
            {founders.map((f) => (
              <li className="founder" key={f.name}>
                <Hoist name={f.name.split(' ')[0]} halfMast />
                <p className="founder__name">{f.name}</p>
                <p className="founder__years">{f.years}</p>
                <p className="founder__role">{f.role}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
