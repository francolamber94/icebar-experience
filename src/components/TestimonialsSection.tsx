import { useEffect, useRef, useState } from 'react';
import { useT } from '@/i18n/LangProvider';
import { TESTIMONIALS } from '@/data/testimonials';

const AUTO_ROTATE_MS = 6000;

export function TestimonialsSection() {
  const { t, lang } = useT();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const userInteractedRef = useRef(false);

  // Update active dot based on scroll position (snap-aware)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.clientWidth * 0.9;
      const idx = Math.round(el.scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(idx, 0), TESTIMONIALS.length - 1));
    };
    const onUser = () => {
      userInteractedRef.current = true;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('touchstart', onUser, { passive: true });
    el.addEventListener('mousedown', onUser);
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('touchstart', onUser);
      el.removeEventListener('mousedown', onUser);
    };
  }, []);

  // Auto-rotate (paused once the user touches the carousel)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      if (userInteractedRef.current) return;
      const el = scrollerRef.current;
      if (!el) return;
      const next = (activeIndex + 1) % TESTIMONIALS.length;
      const cardWidth = el.clientWidth * 0.9;
      el.scrollTo({ left: cardWidth * next, behavior: 'smooth' });
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [activeIndex]);

  const goTo = (i: number) => {
    userInteractedRef.current = true;
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.9;
    el.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
  };

  return (
    <section className='section'>
      <div className='container'>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <span className='eyebrow'>{t('testimonials.eyebrow')}</span>
          <h2 style={{ marginBottom: 16 }}>{t('testimonials.title')}</h2>
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <div
              style={{
                color: 'var(--star)',
                letterSpacing: 4,
                fontSize: 22,
                lineHeight: 1,
              }}
            >
              ★★★★★
            </div>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              {t('testimonials.subtitle')}
            </span>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className='no-scrollbar'
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: 8,
            scrollPadding: '0 16px',
          }}
        >
          {TESTIMONIALS.map((tm, i) => (
            <article
              key={i}
              style={{
                scrollSnapAlign: 'start',
                flex: '0 0 calc(90% - 8px)',
                maxWidth: 460,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{ color: 'var(--star)', letterSpacing: 3, fontSize: 14 }}>★★★★★</div>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: 'var(--text)',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                “{tm.text[lang]}”
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                <span
                  aria-hidden
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    background: 'linear-gradient(135deg, var(--primary), var(--brand-deep))',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    color: 'var(--text-on-primary)',
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {tm.initials}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{tm.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-subtle)' }}>
                    {tm.city} · {formatMonth(tm.date, lang)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Dots — outer button is 44x44 (touch friendly), inner pill is the visual */}
        <div
          role='tablist'
          aria-label='Testimonials'
          style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}
        >
          {TESTIMONIALS.map((_, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={i}
                role='tab'
                aria-selected={active}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => goTo(i)}
                style={{
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  minHeight: 44,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    width: active ? 28 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: active ? 'var(--primary)' : 'var(--border-strong)',
                    transition: 'width 240ms ease, background 240ms ease',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIAL_LOCALE = { pt: 'pt-BR', es: 'es-AR', en: 'en-US' } as const;

function formatMonth(yyyymm: string, lang: 'pt' | 'es' | 'en') {
  const [y, m] = yyyymm.split('-').map(Number);
  if (!y || !m) return yyyymm;
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString(TESTIMONIAL_LOCALE[lang] ?? 'pt-BR', { month: 'short', year: 'numeric' });
}
