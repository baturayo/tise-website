import { useMemo, type ReactNode } from 'react';
import { BlogFooter, BlogHeader } from '../components/BlogChrome';
import { ChartDefs, PassageChart, fullChart } from '../components/PassageChart';
import { logbook } from '../data/logbook';
import { ports } from '../data/passage';
import { posts } from '../data/posts';
import { buildTrack, timeline } from '../lib/passage';
import { newestFirst } from '../lib/posts';
import { useReducedMotion } from '../../hooks/motion';

const ROOT = '../';

/** The Atlantic passage's chart, small, as its post's picture. */
function AtlanticThumb() {
  const still = useReducedMotion();
  const track = useMemo(() => buildTrack(logbook, ports), []);
  const times = useMemo(() => timeline(track), [track]);
  return <PassageChart className="bi__chart" track={track} times={times} view={fullChart} drawIn={false} still={still} label="" />;
}

/** Each post's picture on the front page, by slug. */
const THUMBS: Record<string, () => ReactNode> = {
  'gibraltar-to-las-palmas': () => <AtlanticThumb />,
};

/** The blog's front page: its posts, newest first. */
export function BlogIndex() {
  return (
    <>
      <ChartDefs />
      <BlogHeader root={ROOT} here="index" />
      <main id="main" className="bi">
        <div className="bi__head">
          <h1 className="bi__title">Sailing blog</h1>
          <p className="bi__sub">Passages, races and weekends afloat, written up by TISE members.</p>
        </div>
        <ol className="bi__posts">
          {newestFirst(posts).map((p) => (
            <li key={p.slug} className="bi__post">
              <a className="bi__link" href={`${p.slug}/`}>
                {THUMBS[p.slug]?.()}
                <span className="bi__text">
                  <span className="bi__date">
                    {p.when} · {p.author}
                  </span>
                  <span className="bi__post-title">{p.title}</span>
                  <span className="bi__summary">{p.summary}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </main>
      <BlogFooter root={ROOT} />
    </>
  );
}
