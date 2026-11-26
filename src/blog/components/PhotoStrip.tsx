import { useRef, useState, type CSSProperties } from 'react';
import type { Photo } from '../lib/photos';

/** The post's photos sit next to it, in photos/ (see src/blog/data/photos.ts). */
const url = (p: Photo, size: 800 | 1600) => `photos/${p.file}-${size}.jpg`;

/** Up to three to a row; four go two and two. */
function rows(list: Photo[]): Photo[][] {
  const per = list.length === 4 ? 2 : 3;
  const out: Photo[][] = [];
  for (let i = 0; i < list.length; i += per) out.push(list.slice(i, i + per));
  return out;
}

/** A day's photos as a strip of prints, each one opening full size. */
export function PhotoStrip({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Photo | null>(null);
  if (photos.length === 0) return null;

  const show = (p: Photo) => {
    setOpen(p);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <div className="photos">
        {rows(photos).map((row) => (
          <div key={row[0].file} className={`photos__row photos__row--${row.length}`}>
            {row.map((p) => (
              <figure key={p.file} className="photos__item" style={{ '--ratio': p.w / p.h } as CSSProperties}>
                <button type="button" className="photos__open" onClick={() => show(p)} aria-haspopup="dialog">
                  <img src={url(p, 800)} width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" />
                  <span className="visually-hidden">(open full size)</span>
                </button>
                <figcaption className="photos__caption">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
      {/* a click anywhere, Escape or the button closes it */}
      <dialog ref={dialog} className="lightbox" aria-label={open?.caption} onClick={close} onClose={() => setOpen(null)}>
        {open && (
          <figure className="lightbox__figure">
            <img src={url(open, 1600)} alt={open.alt} />
            <figcaption className="lightbox__caption">{open.caption}</figcaption>
          </figure>
        )}
        <button type="button" className="lightbox__close" onClick={close}>
          Close
        </button>
      </dialog>
    </>
  );
}
