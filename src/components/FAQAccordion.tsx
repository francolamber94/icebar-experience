import { useState } from 'react';
import { useT } from '@/i18n/LangProvider';
import { track } from '@/lib/track';

interface FAQ {
  q: string;
  a: string;
}

export function FAQAccordion() {
  const { t, raw } = useT();
  const questions = raw<FAQ[]>('faq.questions') || [];
  // Multiple open at once — UX research: users compare answers in mobile
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
        track('faq_open', { index: i, q: questions[i]?.q });
      }
      return next;
    });
  };

  return (
    <section id='faq' className='section section-alt'>
      <div className='container' style={{ maxWidth: 820 }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <span className='eyebrow'>{t('faq.eyebrow')}</span>
          <h2>{t('faq.title')}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {questions.map((qa, i) => {
            const isOpen = openSet.has(i);
            return (
              <div
                key={i}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid',
                  borderColor: isOpen ? 'var(--border-strong)' : 'var(--border)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 200ms ease',
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    textAlign: 'left',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: 16,
                    color: 'var(--text)',
                    minHeight: 60,
                  }}
                >
                  <span style={{ lineHeight: 1.4 }}>{qa.q}</span>
                  <span
                    aria-hidden
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      borderRadius: 999,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isOpen ? 'var(--primary)' : 'rgba(56,189,248,0.14)',
                      color: isOpen ? 'var(--text-on-primary)' : 'var(--primary-light)',
                      transition: 'transform 240ms ease, background 240ms ease',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round'>
                      <line x1='12' y1='5' x2='12' y2='19' />
                      <line x1='5' y1='12' x2='19' y2='12' />
                    </svg>
                  </span>
                </button>

                {/* Modern technique: animate grid-template-rows 0fr -> 1fr.
                    No fixed maxHeight, no truncation regardless of answer length. */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <p
                      style={{
                        padding: '0 1.25rem 1.25rem',
                        fontSize: 15,
                        lineHeight: 1.65,
                        color: 'var(--text-muted)',
                        margin: 0,
                      }}
                    >
                      {qa.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
