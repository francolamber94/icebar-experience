import { useT } from '@/i18n/LangProvider';
import { track } from '@/lib/track';

export function FinalCTASection() {
  const { t } = useT();

  return (
    <section
      style={{
        position: 'relative',
        paddingTop: 'clamp(4rem, 10vw, 7rem)',
        paddingBottom: 'clamp(4rem, 10vw, 7rem)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(180deg, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.7) 50%, rgba(2,6,23,0.95) 100%), url(/photos/final-cta-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#020617',
          zIndex: -1,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(700px 400px at 50% 50%, rgba(56,189,248,0.22), transparent 60%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <div className='container' style={{ textAlign: 'center', maxWidth: 720 }}>
        <h2 style={{ marginBottom: '1rem' }}>{t('final_cta.title')}</h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
            marginBottom: '2rem',
            maxWidth: 560,
            marginInline: 'auto',
          }}
        >
          {t('final_cta.subtitle')}
        </p>
        <a
          href='#experiencias'
          className='btn btn-primary btn-block-mobile'
          onClick={() => track('final_cta_click')}
          style={{ padding: '1.15rem 2.25rem', fontSize: '1.05rem' }}
        >
          {t('final_cta.cta')}
        </a>

        {/* Trust strip below the CTA — last reinforcement before the footer */}
        <div
          style={{
            marginTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px 22px',
            color: 'var(--text-muted)',
            fontSize: 13,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--star)' }}>★</span>
            <strong style={{ color: 'var(--text)' }}>{t('final_cta.trust_rating')}</strong>
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{t('final_cta.trust_visitors')}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{t('final_cta.trust_cancel')}</span>
        </div>
      </div>
    </section>
  );
}
