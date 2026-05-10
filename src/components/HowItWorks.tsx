import { useT } from '@/i18n/LangProvider';

export function HowItWorks() {
  const { t } = useT();

  const steps = [
    { n: '01', title: t('how.step1_title'), body: t('how.step1_body'), img: '/photos/step-1.jpg' },
    { n: '02', title: t('how.step2_title'), body: t('how.step2_body'), img: '/photos/step-2.jpg' },
    { n: '03', title: t('how.step3_title'), body: t('how.step3_body'), img: '/photos/step-3.jpg' },
  ];

  return (
    <section className='section'>
      <div className='container'>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <span className='eyebrow'>{t('how.eyebrow')}</span>
          <h2>{t('how.title')}</h2>
        </div>

        <div
          className='how-grid'
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(1rem, 3vw, 2rem)',
            position: 'relative',
          }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className='how-card'
              style={{
                position: 'relative',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                overflow: 'hidden',
                transition: 'transform 240ms ease, border-color 240ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div
                className='how-image'
                style={{
                  aspectRatio: '4 / 3',
                  backgroundImage: `linear-gradient(180deg, transparent 50%, rgba(2,6,23,0.6) 100%), url(${s.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundColor: '#0b1221',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: 'var(--primary)',
                    color: 'var(--text-on-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 16,
                    boxShadow: 'var(--shadow-glow)',
                  }}
                >
                  {s.n}
                </span>
              </div>
              <div className='how-body' style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s.body}</p>
              </div>

              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className='step-connector'
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: -12,
                    transform: 'translateY(-50%)',
                    width: 24,
                    height: 2,
                    background: 'linear-gradient(90deg, var(--primary), transparent)',
                    display: 'none',
                  }}
                />
              )}

              {/* Mobile vertical connector — sits on the gap between cards */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className='step-connector-vertical'
                  style={{
                    display: 'none',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          :global(.step-connector) {
            display: block !important;
          }
        }
        @media (max-width: 640px) {
          :global(.how-image) {
            aspect-ratio: 16 / 9 !important;
          }
          :global(.how-body) {
            padding: 1.25rem 1.25rem 1.5rem !important;
          }
          /* Show the vertical connector line between cards */
          :global(.step-connector-vertical) {
            display: block !important;
            position: absolute !important;
            left: 38px;
            bottom: -28px;
            width: 2px;
            height: 28px;
            background: linear-gradient(180deg, var(--primary) 0%, transparent 100%);
            z-index: 1;
          }
        }
      `}</style>
    </section>
  );
}
