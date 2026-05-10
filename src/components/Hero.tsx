import { useEffect, useRef, useState } from 'react';
import { useT } from '@/i18n/LangProvider';
import { track } from '@/lib/track';

const HERO_PHOTO = '/photos/hero.jpg';
const HERO_VIDEO = '/photos/hero.mp4';

export function Hero() {
  const { t } = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Pause video when tab is hidden / save battery + bandwidth
  useEffect(() => {
    const onVis = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else if (!reduceMotion) v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [reduceMotion]);

  return (
    <section
      className='hero-section'
      style={{
        position: 'relative',
        // Use svh to dodge the iOS URL bar resizing bug
        minHeight: 'min(100svh, 820px)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'calc(var(--header-h) + var(--safe-top))',
        paddingBottom: 'clamp(2rem, 8vw, 6rem)',
        overflow: 'hidden',
      }}
    >
      {/* Background: video (autoplay muted loop) with image fallback */}
      {!reduceMotion && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
          poster={HERO_PHOTO}
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -3,
            backgroundColor: '#020617',
            filter: 'brightness(0.72) saturate(1.08)',
          }}
        >
          <source src={HERO_VIDEO} type='video/mp4' />
        </video>
      )}
      {/* Static image fallback (also visible until video starts decoding) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${HERO_PHOTO})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#020617',
          zIndex: -3,
          opacity: reduceMotion ? 1 : 0,
        }}
      />
      {/* Gradient overlay sits above the video for legibility */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(2,6,23,0.7) 0%, rgba(2,6,23,0.55) 40%, rgba(2,6,23,1) 100%)',
          zIndex: -2,
        }}
      />
      {/* Left vignette: darkens the copy column without killing the right side imagery */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.2) 55%, rgba(2,6,23,0) 100%)',
          zIndex: -2,
          pointerEvents: 'none',
        }}
      />
      {/* Subtle frost vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(900px 500px at 20% 30%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(700px 500px at 80% 70%, rgba(165,243,252,0.14), transparent 60%)',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

      <div className='container' style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 820 }}>
          {/* Trust pill above title — repeats trust signal even before chips */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 999,
              background: 'rgba(2,6,23,0.55)',
              border: '1px solid var(--border-strong)',
              backdropFilter: 'blur(8px)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text)',
              marginBottom: 18,
            }}
          >
            <span style={{ color: 'var(--star)', letterSpacing: 1 }}>★ 4.9</span>
            <span style={{ color: 'var(--text-subtle)' }}>·</span>
            <span style={{ color: 'var(--text-muted)' }}>{t('hero.trust_badge')}</span>
          </div>

          <span
            className='eyebrow'
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <span style={{ width: 28, height: 1, background: 'var(--primary)' }} />
            {t('hero.tagline')}
          </span>

          <h1 style={{ marginBottom: '1.25rem' }}>{t('hero.title')}</h1>

          <p
            className='hero-subtitle'
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
              maxWidth: 640,
              color: 'var(--text-muted)',
              marginBottom: '1.75rem',
              lineHeight: 1.6,
            }}
          >
            {t('hero.subtitle')}
          </p>

          {/* Above-the-fold chips: research-backed (must show what/duration/price) */}
          <div
            className='hero-chips'
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: '1.75rem',
            }}
          >
            <Chip>{t('hero.chip_duration')}</Chip>
            <Chip className='hide-mobile'>{t('hero.chip_temp')}</Chip>
            <Chip className='hide-mobile'>{t('hero.chip_drink')}</Chip>
            <Chip highlight>{t('hero.chip_rating')}</Chip>
          </div>

          <div className='hero-cta-row' style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a
              href='#experiencias'
              className='btn btn-primary btn-block-mobile'
              onClick={() => track('hero_cta_click', { variant: 'primary' })}
              style={{ flexDirection: 'column', gap: 2, padding: '0.95rem 1.75rem' }}
            >
              <span>{t('hero.cta_primary')}</span>
              <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.78, letterSpacing: 0.4 }}>
                {t('hero.cta_primary_from')}
              </span>
            </a>
            <a
              href='#galeria'
              className='btn btn-ghost btn-block-mobile'
              onClick={() => track('hero_secondary_click')}
            >
              {t('hero.cta_secondary')}
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint — desktop only (mobile uses the space for CTA) */}
      <div
        aria-hidden
        className='hero-scroll-hint'
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          opacity: 0.6,
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {t('hero.scroll_hint')}
        <span
          style={{
            width: 1,
            height: 32,
            background: 'linear-gradient(180deg, var(--primary), transparent)',
            animation: 'iceBarScroll 1.6s ease-in-out infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes iceBarScroll {
          0%,
          100% {
            transform: scaleY(1);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.4);
            opacity: 1;
          }
        }
        @media (max-width: 640px) {
          :global(.hero-chips .hide-mobile) {
            display: none !important;
          }
          :global(.hero-cta-row) {
            flex-direction: column;
            gap: 10px !important;
          }
          :global(.hero-cta-row .btn) {
            width: 100%;
          }
          :global(.hero-scroll-hint) {
            display: none !important;
          }
          :global(.hero-section) {
            padding-bottom: clamp(1.5rem, 6vw, 3rem) !important;
          }
        }
      `}</style>
    </section>
  );
}

function Chip({
  children,
  highlight,
  className,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 14px',
        borderRadius: 999,
        background: highlight ? 'rgba(56,189,248,0.16)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${highlight ? 'var(--border-strong)' : 'var(--border)'}`,
        fontSize: 13,
        fontWeight: 600,
        color: highlight ? 'var(--primary-light)' : 'var(--text)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {children}
    </span>
  );
}
