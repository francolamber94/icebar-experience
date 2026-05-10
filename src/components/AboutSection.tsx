import { useT } from '@/i18n/LangProvider';
import { STATS } from '@/data/stats';
import { track } from '@/lib/track';

export function AboutSection() {
  const { t, lang } = useT();

  return (
    <section id='sobre' className='section section-alt'>
      <div className='container'>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.05fr)',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
          className='about-grid'
        >
          <div
            className='about-image'
            style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              aspectRatio: '4 / 5',
              boxShadow: 'var(--shadow-card)',
              background:
                'linear-gradient(180deg, transparent 50%, rgba(2,6,23,0.4) 100%), url(/photos/about.jpg) center/cover',
              backgroundColor: '#0b1221',
              border: '1px solid var(--border)',
            }}
          >
            {/* Floating temperature badge */}
            <div
              className='about-temp-badge'
              style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                padding: '14px 18px',
                background: 'rgba(2, 6, 23, 0.78)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-strong)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div style={{ fontSize: 26, color: 'var(--primary-light)', lineHeight: 1 }}>❄</div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1.2,
                    color: 'var(--text-subtle)',
                    textTransform: 'uppercase',
                  }}
                >
                  {lang === 'en' ? 'Temperature' : 'Temperatura'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                  −10°C
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className='eyebrow'>{t('about.eyebrow')}</span>
            <h2 style={{ marginBottom: '1.25rem' }}>{t('about.title')}</h2>
            <p style={{ marginBottom: '1.25rem', fontSize: '1.05rem', lineHeight: 1.7 }}>{t('about.p1')}</p>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>{t('about.p2')}</p>

            {/* Inline mini-CTA — never let the user finish reading without an action */}
            <a
              href='#experiencias'
              onClick={() => track('about_cta_click')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 18px',
                marginBottom: '2rem',
                borderRadius: 999,
                background: 'rgba(56,189,248,0.12)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 700,
                transition: 'background 200ms ease, transform 200ms ease',
              }}
            >
              <span>{t('about.cta')}</span>
              <span aria-hidden style={{ color: 'var(--primary-light)', fontSize: 16 }}>
                →
              </span>
            </a>

            <div
              className='about-stats'
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 16,
              }}
            >
              {STATS.map(s => (
                <div
                  key={s.value}
                  style={{
                    padding: '16px 18px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: 'var(--primary-light)',
                      lineHeight: 1.1,
                    }}
                  >
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {s.label[lang]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          :global(.about-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.about-image) {
            aspect-ratio: 4 / 3 !important;
          }
          :global(.about-temp-badge) {
            bottom: 16px !important;
            left: 16px !important;
            padding: 10px 14px !important;
          }
          :global(.about-stats) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
