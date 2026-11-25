import { events2027 } from '../data/calendar';
import { club, crewMembers, founders } from '../data/club';
import { ProfileCard } from '../components/ProfileCard';
import { SignalFlag } from '../components/SignalFlag';
import { buildCrew } from '../lib/crew';
import { publicUrl } from '../lib/paths';
import { phonetic, signalLetters } from '../lib/signal';
import './cabin.css';

/**
 * A small signal mast beside each photo: a pole with a brass truck at the top, the halyard running down
 * beside it to a cleat, and the person's first name hoisted close up in code flags, read from the top.
 */
function SignalMast({ name }: { name: string }) {
  const letters = signalLetters(name);
  return (
    <div className="mast" title={`${name} in signal flags: ${phonetic(letters)}`}>
      <span className="mast__halyard" aria-hidden="true" />
      <span className="mast__cleat" aria-hidden="true" />
      <div className="mast__flags" aria-hidden="true">
        {letters.map((l, i) => (
          <SignalFlag key={i} letter={l} />
        ))}
      </div>
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
                <dt>{club.shortName} stands for</dt>
                <dd>{club.fullName}</dd>
              </div>
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
          <h3>Club Management</h3>
          <ul className="crew__list">
            {crew.map(({ name, firstName, role, photo, bio }) => (
              <li className="crew__member" key={name}>
                <p className="crew__name">{name}</p>
                <p className="crew__role">{role}</p>
                <SignalMast name={firstName} />
                <ProfileCard className="crew__card" name={name} callName={firstName} role={role} bio={bio} heading="Crew log">
                  <Portrait name={name} photo={photo} />
                </ProfileCard>
              </li>
            ))}
          </ul>
        </div>

        <aside className="founders" id="founders" aria-labelledby="founders-title">
          <div className="founders__head">
            <h3 id="founders-title">Legacy &amp; remembrance</h3>
            <p>Founding members of TISE, in loving memory.</p>
          </div>
          <ul className="founders__list">
            {founders.map((f) => (
              <li className="founder" key={f.name}>
                {f.photo && (
                  <ProfileCard
                    className="founder__card"
                    name={f.name}
                    callName={f.name.split(' ')[0]}
                    role={f.role}
                    years={f.years}
                    bio={f.bio}
                    heading="In memory"
                  >
                    <img className="founder__photo" src={publicUrl(f.photo)} alt="" loading="lazy" />
                  </ProfileCard>
                )}
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
