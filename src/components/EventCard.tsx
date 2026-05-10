import Link from 'next/link';
import type { Experience } from '@/data/experiences';
import { useT } from '@/i18n/LangProvider';
import { formatPrice, track } from '@/lib/track';

interface EventCardProps {
  experience: Experience;
}

/**
 * Catalog card for one experience (Post in LibreTickets).
 * Single source of truth for content: API payload from `/api/public/tenant-events`.
 * Layout is intentionally minimal — the post page in LibreTickets owns the rich detail.
 */
export function EventCard({ experience }: EventCardProps) {
  const { lang, t } = useT();
  const { id, title, description, image, priceFrom, currency, durationMin, href } = experience;

  return (
    <Link
      href={href}
      onClick={() => track('experience_card_click', { slug: id, price: priceFrom ?? 0 })}
      className='event-card'
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        overflow: 'hidden',
        color: 'inherit',
        transition: 'transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {image && (
        <div
          className='event-card-image'
          style={{
            position: 'relative',
            aspectRatio: '4 / 3',
            backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(2,6,23,0.6) 100%), url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0b1221',
          }}
        >
          {durationMin != null && (
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                padding: '6px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                background: 'rgba(2, 6, 23, 0.7)',
                backdropFilter: 'blur(8px)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
              }}
            >
              {durationMin} min
            </div>
          )}
        </div>
      )}

      <div
        className='event-card-body'
        style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}
      >
        <h3 style={{ fontSize: 20, marginBottom: 0 }}>{title}</h3>

        {description && (
          <p
            className='event-card-description'
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>
        )}

        <div
          className='event-card-footer'
          style={{
            marginTop: 'auto',
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {priceFrom != null && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: 'var(--text-subtle)',
                }}
              >
                {t('experiences.from')}
              </div>
              <div
                className='event-card-price'
                style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}
              >
                {formatPrice(priceFrom, currency, lang)}
              </div>
            </div>
          )}
          <span className='btn btn-primary btn-sm event-card-cta' style={{ pointerEvents: 'none' }}>
            {t('experiences.book')}
          </span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          :global(.event-card-body) {
            padding: 1.5rem 1.25rem 1.5rem !important;
          }
          /* Stack price on top, full-width CTA below — primary-thumb friendly */
          :global(.event-card-footer) {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
          }
          :global(.event-card-cta) {
            width: 100%;
            justify-content: center;
            padding: 0.95rem 1.25rem !important;
            font-size: 1rem !important;
          }
          :global(.event-card-price) {
            font-size: 28px !important;
          }
        }
      `}</style>
    </Link>
  );
}
