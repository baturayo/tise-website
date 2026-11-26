import { useMemo } from 'react';
import { BlogFooter, BlogHeader } from '../components/BlogChrome';
import { ChartDefs, PassageChart, fullChart } from '../components/PassageChart';
import { logbook } from '../data/logbook';
import { ports } from '../data/passage';
import { buildTrack, timeline } from '../lib/passage';
import { useReducedMotion } from '../../hooks/motion';

const ROOT = '../';

/** The blog's front page: its posts, newest first. One for now. */
export function BlogIndex() {
  const still = useReducedMotion();
  const track = useMemo(() => buildTrack(logbook, ports), []);
  const times = useMemo(() => timeline(track), [track]);
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
          <li className="bi__post">
            <a className="bi__link" href="gibraltar-to-las-palmas/">
              <PassageChart className="bi__chart" track={track} times={times} view={fullChart} drawIn={false} still={still} label="" />
              <span className="bi__text">
                <span className="bi__date">November 2026 · Baturay Ofluoğlu</span>
                <span className="bi__post-title">Gibraltar to Las Palmas</span>
                <span className="bi__summary">
                  Nine days and about 830 miles down the Atlantic coast of Morocco to the Canaries: a whale in the Strait, a broken
                  halyard, paperwork in Agadir and a day under the trysail, told from the boat’s logbook.
                </span>
              </span>
            </a>
          </li>
        </ol>
      </main>
      <BlogFooter root={ROOT} />
    </>
  );
}
