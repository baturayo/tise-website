import { posts } from '../blog/data/posts';
import { newestFirst } from '../blog/lib/posts';
import { publicUrl } from '../lib/paths';
import './logbook.css';

/** The sailing blog on the landing page: its newest posts, each with the picture its link previews use. */
export function Logbook() {
  const latest = newestFirst(posts).slice(0, 3);
  if (latest.length === 0) return null;
  return (
    <section className="logbook" id="blog" aria-labelledby="logbook-title">
      <div className="logbook__inner wrap">
        <div className="logbook__intro">
          <h2 id="logbook-title">From the sailing blog</h2>
          <p>
            Members write up their passages, races and weekends afloat from the boat’s logbook: where we went, what broke,
            and what we learned on the way.
          </p>
          <a className="btn btn--ghost" href={publicUrl('/sailing-blogs/')}>
            All blog posts
          </a>
        </div>
        <ul className="logbook__posts">
          {latest.map((p) => (
            <li key={p.slug}>
              <a className="logbook__post" href={publicUrl(`/sailing-blogs/${p.slug}/`)}>
                <img
                  className="logbook__photo"
                  src={publicUrl(`/sailing-blogs/${p.slug}/og.jpg`)}
                  width={1200}
                  height={630}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="logbook__meta">
                  {p.when} · {p.author}
                </span>
                <span className="logbook__title">{p.title}</span>
                <span className="logbook__summary">{p.summary}</span>
                <span className="logbook__more">Read the post</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
