import { posts } from '../data/posts';
import { neighbours } from '../lib/posts';

/**
 * The header, footer and post-to-post navigation of the sailing blog's pages. The blog lives in
 * folders under the club's site, so links back to the site and its files are relative to `root`
 * (e.g. '../../'). A post's folder sits next to the others, so '../' is the blog's front page.
 */
export function BlogHeader({ root, here }: { root: string; here: 'index' | 'post' }) {
  return (
    <header className="bh">
      <a className="bh__skip" href="#main">
        {here === 'index' ? 'Skip to the posts' : 'Skip to the post'}
      </a>
      <div className="bh__bar">
        <a className="bh__home" href={root}>
          <img className="bh__logo" src={`${root}brand/tise-logo-compact.svg`} alt="" width={59} height={60} />
          <span className="bh__club">TISE Sailing Club</span>
        </a>
        {here === 'index' ? (
          <a className="bh__blog" href="./" aria-current="page">
            Sailing blog
          </a>
        ) : (
          <a className="bh__blog bh__blog--back" href="../">
            <svg className="bh__chevron" viewBox="0 0 10 16" aria-hidden="true">
              <path d="M8 2 2 8l6 6" />
            </svg>
            All posts
          </a>
        )}
      </div>
    </header>
  );
}

/** The end of a post: the posts either side of it, and the way back to all of them. */
export function PostNav({ slug }: { slug: string }) {
  const { newer, older } = neighbours(posts, slug);
  return (
    <nav className="pn" aria-labelledby="pn-title">
      <div className="pn__inner">
        <h2 id="pn-title" className="pn__title">
          More from the sailing blog
        </h2>
        {newer || older ? (
          <ul className="pn__pair">
            {[
              { post: older, dir: 'Older post', rel: 'prev' },
              { post: newer, dir: 'Newer post', rel: 'next' },
            ].map(
              ({ post, dir, rel }) =>
                post && (
                  <li key={rel}>
                    <a className={`pn__link pn__link--${rel}`} href={`../${post.slug}/`} rel={rel}>
                      <span className="pn__dir">{dir}</span>
                      <span className="pn__post">{post.title}</span>
                      <span className="pn__meta">
                        {post.when}, {post.author}
                      </span>
                    </a>
                  </li>
                ),
            )}
          </ul>
        ) : (
          <p className="pn__empty">This is the first post on the blog. The next one is still at sea.</p>
        )}
        <a className="pn__all" href="../">
          All posts
        </a>
      </div>
    </nav>
  );
}

export function BlogFooter({ root }: { root: string }) {
  return (
    <footer className="bf">
      <p>
        <a href={root}>TISE Sailing Club</a>, Brussels. Chart drawn from Natural Earth coastlines and bathymetry, in the public
        domain. Not for navigation.
      </p>
    </footer>
  );
}
