import { useEffect, useRef, useState } from 'react';
import { useT } from '@/i18n/LangProvider';
import { GALLERY } from '@/data/gallery';
import { track } from '@/lib/track';
import { Lightbox } from './Lightbox';

const MOBILE_INITIAL_COUNT = 6;

export function GallerySection() {
  const { t, lang } = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const fired = useRef(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || fired.current) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            track('gallery_view');
          }
        });
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const open = (i: number) => {
    setLightboxIndex(i);
    track('gallery_open', { index: i });
  };

  const hiddenCount = Math.max(0, GALLERY.length - MOBILE_INITIAL_COUNT);

  return (
    <section ref={sectionRef} id='galeria' className='section'>
      <div className='container'>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <span className='eyebrow'>{t('gallery.eyebrow')}</span>
          <h2 style={{ marginBottom: 12 }}>{t('gallery.title')}</h2>
          <p style={{ maxWidth: 560, margin: '0 auto' }}>{t('gallery.subtitle')}</p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '180px',
            gridAutoFlow: 'dense',
            gap: 12,
          }}
          className='gallery-grid'
        >
          {GALLERY.map((g, i) => {
            const hideOnMobile = !expanded && i >= MOBILE_INITIAL_COUNT;
            return (
              <button
                key={i}
                type='button'
                onClick={() => open(i)}
                aria-label={g.alt[lang]}
                className={`gallery-item ${hideOnMobile ? 'gallery-item-extra' : ''}`}
                style={{
                  gridColumn: g.wide ? 'span 2' : 'span 1',
                  gridRow: g.tall ? 'span 2' : 'span 1',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  transition: 'transform 240ms ease, border-color 240ms ease',
                  cursor: 'zoom-in',
                  padding: 0,
                  appearance: 'none',
                  background: 'linear-gradient(135deg, #0F172A, #020617)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <img
                  src={g.src}
                  alt=''
                  loading='lazy'
                  decoding='async'
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Mobile-only "Show more" — hides on desktop where grid renders all */}
        {hiddenCount > 0 && !expanded && (
          <div className='gallery-more' style={{ display: 'none', justifyContent: 'center', marginTop: 18 }}>
            <button
              type='button'
              onClick={() => setExpanded(true)}
              className='btn btn-ghost'
              style={{ padding: '0.85rem 1.5rem' }}
            >
              {t('gallery.show_more').replace('{n}', String(hiddenCount))}
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <a
            href='https://instagram.com/icebarbr'
            target='_blank'
            rel='noopener noreferrer'
            className='btn btn-ghost'
          >
            #ICEBARBR · {t('gallery.cta')}
          </a>
        </div>
      </div>

      <Lightbox
        items={GALLERY}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.gallery-grid) {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: auto !important;
            gap: 10px !important;
          }
          /* Force every item to a clean square cell on mobile (no wide/tall) */
          :global(.gallery-grid .gallery-item) {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            aspect-ratio: 4 / 5 !important;
          }
          :global(.gallery-grid .gallery-item-extra) {
            display: none !important;
          }
          :global(.gallery-more) {
            display: flex !important;
          }
        }
      `}</style>
    </section>
  );
}
