import { club } from '../data/club';
import { publicUrl } from '../lib/paths';
import './harbour.css';

export function Harbour() {
  return (
    <section className="harbour" id="join" aria-labelledby="harbour-title">
      <img
        className="harbour__photo"
        src={publicUrl('/photos/harbour-1280.jpg')}
        srcSet={`${publicUrl('/photos/harbour-1280.jpg')} 1280w, ${publicUrl('/photos/harbour-1920.jpg')} 1920w`}
        sizes="100vw"
        alt="A crew in sailing jackets on a Beneteau Oceanis 43 in choppy water"
        loading="lazy"
      />
      <div className="harbour__inner wrap">
        <h2 id="harbour-title">Come and sail with us</h2>
        <p>
          Never been on a boat, or already holding a skipper licence? There is a place for you on board. Join one of our
          activities, meet the crew and try sailing.
        </p>
        <div className="harbour__actions">
          <a className="btn btn--primary" href={club.instagram} target="_blank" rel="noopener noreferrer">
            Message us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
