import { events2027 } from '../data/calendar';
import { club, crewMembers, founders } from '../data/club';
import { buildCrew } from '../lib/crew';
import { publicUrl } from '../lib/paths';
import './cabin.css';

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
            {crew.map(({ name, role, photo }) => (
              <li className="crew__member" key={name}>
                <p className="crew__name">{name}</p>
                <p className="crew__role">{role}</p>
                <Portrait name={name} photo={photo} />
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
                {f.photo && <img className="founder__photo" src={publicUrl(f.photo)} alt="" loading="lazy" />}
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
