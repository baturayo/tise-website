/**
 * The header and footer of the sailing blog's pages. The blog lives in folders under the club's
 * site, so links back to the site and its files are relative to `root` (e.g. '../../').
 */
export function BlogHeader({ root, here }: { root: string; here?: 'index' }) {
  return (
    <header className="bh">
      <a className="bh__skip" href="#main">
        Skip to the post
      </a>
      <div className="bh__bar">
        <a className="bh__home" href={root}>
          <img className="bh__logo" src={`${root}brand/tise-logo-compact.svg`} alt="" width={59} height={60} />
          <span className="bh__club">TISE Sailing Club</span>
        </a>
        <a className="bh__blog" href={here === 'index' ? './' : '../'} aria-current={here === 'index' ? 'page' : undefined}>
          Sailing blog
        </a>
      </div>
    </header>
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
