import { useT } from '@/i18n/LangProvider';

/**
 * Inmediately below the hero. Restates Duracao / Inclui / Preço / Avaliação
 * for users that scrolled past without reading the chips. Research: showing
 * what/duration/price within first viewport increases conversion materially.
 *
 * Mobile: switches to a horizontal scroll-snap carousel so the four cards
 * remain glanceable without burning vertical real estate.
 */
export function ExperienceHighlight() {
  const { t } = useT();

  const items = [
    { icon: <ClockIcon />, label: t('highlight.duration_label'), value: t('highlight.duration_value') },
    { icon: <PackageIcon />, label: t('highlight.includes_label'), value: t('highlight.includes_value') },
    { icon: <PriceIcon />, label: t('highlight.price_label'), value: t('highlight.price_value') },
    {
      icon: <StarIcon />,
      label: t('highlight.rating_label'),
      value: t('highlight.rating_value'),
      meta: t('highlight.rating_meta'),
      highlight: true,
    },
  ];

  return (
    <section
      aria-label={t('highlight.duration_label')}
      style={{
        position: 'relative',
        marginTop: '-3rem',
        zIndex: 2,
      }}
    >
      <div className='container'>
        <div
          className='highlight-card'
          style={{
            background: 'rgba(11, 18, 33, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 'clamp(1.25rem, 3vw, 2rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'clamp(1rem, 2.5vw, 1.5rem)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className='highlight-item'
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                paddingInline: 4,
                paddingLeft: i > 0 ? 'clamp(1rem, 2vw, 1.25rem)' : 4,
                position: 'relative',
              }}
            >
              {/* Vertical separator (desktop only) */}
              {i > 0 && (
                <span
                  aria-hidden
                  className='highlight-sep'
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 6,
                    bottom: 6,
                    width: 1,
                    background: 'var(--border)',
                  }}
                />
              )}

              <div
                style={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: it.highlight
                    ? 'linear-gradient(135deg, rgba(56,189,248,0.25), rgba(56,189,248,0.08))'
                    : 'rgba(56,189,248,0.14)',
                  color: 'var(--primary-light)',
                  boxShadow: it.highlight ? '0 0 24px rgba(56,189,248,0.25)' : 'none',
                }}
              >
                {it.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                    color: 'var(--text-subtle)',
                    marginBottom: 2,
                  }}
                >
                  {it.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
                  {it.value}
                </div>
                {it.meta && (
                  <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 2 }}>{it.meta}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          :global(.highlight-card) {
            display: flex !important;
            grid-template-columns: none !important;
            overflow-x: auto;
            gap: 12px !important;
            padding: 14px 14px !important;
            scroll-snap-type: x mandatory;
            scroll-padding-inline: 14px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          :global(.highlight-card)::-webkit-scrollbar {
            display: none;
          }
          :global(.highlight-item) {
            flex: 0 0 auto;
            min-width: 200px;
            padding-left: 8px !important;
            scroll-snap-align: start;
          }
          :global(.highlight-sep) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v5l3 2' />
    </svg>
  );
}
function PackageIcon() {
  return (
    <svg width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M21 16V8l-9-5-9 5v8l9 5 9-5z' />
      <path d='M3.3 7l8.7 5 8.7-5' />
      <path d='M12 22V12' />
    </svg>
  );
}
function PriceIcon() {
  return (
    <svg width='26' height='26' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z' />
      <circle cx='7' cy='7' r='1.5' />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width='26' height='26' viewBox='0 0 24 24' fill='currentColor' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round'>
      <polygon points='12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9' />
    </svg>
  );
}
