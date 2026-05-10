import { useEffect, useState } from 'react';
import { useT } from '@/i18n/LangProvider';
import type { Experience } from '@/data/experiences';
import { formatPrice, track } from '@/lib/track';
import Link from 'next/link';

const WHATSAPP_NUMBER = '5500000000000';

interface StickyBookingBarProps {
  /** Cheapest experience for the tenant; null if no posts (then the bar hides). */
  cheapest: Experience | null;
  currency: string;
}

/**
 * Mobile-only sticky bottom bar. Appears once the user scrolls past the hero.
 * Mirrors the hero CTA so the booking action is always one tap away.
 * Research: 63% of travel searches happen on mobile, so a sticky CTA is critical.
 *
 * Includes a compact WhatsApp icon button to the left of the primary CTA so
 * the user has a low-friction direct-contact option without a floating FAB
 * that would steal attention from the page content.
 */
export function StickyBookingBar({ cheapest, currency }: StickyBookingBarProps) {
  const { t, lang } = useT();
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Show earlier — at ~40% of the viewport already feels right
      setVisible(y > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Hide while a text input has focus so the keyboard isn't covered
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) {
        setHidden(true);
      }
    };
    const onFocusOut = () => setHidden(false);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  // Without a tenant post we have nowhere to send the user; hide the bar entirely.
  if (!cheapest) return null;

  const offscreen = !visible || hidden;

  return (
    <div
      className='sticky-bar'
      aria-hidden={offscreen}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        transform: offscreen ? 'translateY(120%)' : 'translateY(0)',
        transition: 'transform 360ms cubic-bezier(0.22, 1, 0.36, 1)',
        paddingBottom: 'var(--safe-bottom)',
        background: 'rgba(2, 6, 23, 0.94)',
        backdropFilter: 'blur(18px)',
        borderTop: '1px solid var(--border-strong)',
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Price + rating block */}
        <div style={{ minWidth: 0, flexShrink: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: 'var(--text-subtle)',
              lineHeight: 1,
              marginBottom: 4,
            }}
          >
            {t('sticky.from')}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--text)',
                lineHeight: 1,
              }}
            >
              {cheapest.priceFrom != null ? formatPrice(cheapest.priceFrom, currency, lang) : '—'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 4,
              fontSize: 11,
              color: 'var(--text-muted)',
              lineHeight: 1,
            }}
          >
            <span style={{ color: 'var(--star)' }}>★</span>
            <span style={{ fontWeight: 700, color: 'var(--text)' }}>4.9</span>
            <span>· {t('sticky.rating_count')}</span>
          </div>
        </div>

        {/* WhatsApp ghost icon — compact so the primary CTA stays dominant */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target='_blank'
          rel='noopener noreferrer'
          aria-label='WhatsApp'
          onClick={() => track('sticky_whatsapp_click')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            minWidth: 48,
            flexShrink: 0,
            borderRadius: 14,
            background: 'rgba(34, 197, 94, 0.16)',
            border: '1px solid rgba(34, 197, 94, 0.45)',
            color: '#25D366',
          }}
        >
          <svg width='22' height='22' viewBox='0 0 32 32' fill='currentColor' aria-hidden>
            <path d='M27.2 4.7A15.84 15.84 0 0 0 16 .1C7.2.1.1 7.2.1 16c0 2.8.7 5.5 2.1 7.9L0 32l8.3-2.2c2.3 1.3 4.9 1.9 7.6 1.9h.1C24.7 31.7 32 24.6 32 15.8c0-4.2-1.6-8.2-4.8-11.1zM16 29c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-5 1.3 1.3-4.8-.3-.5C3.5 20.7 2.7 18.4 2.7 16 2.7 8.7 8.7 2.7 16 2.7c3.5 0 6.8 1.4 9.3 3.9 2.5 2.5 3.8 5.8 3.8 9.3-.1 7.3-6 13.1-13.1 13.1zm7.3-9.8c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.3 0 1.9 1.4 3.8 1.6 4.1.2.3 2.8 4.3 6.8 6 .9.4 1.7.6 2.3.8.9.3 1.8.3 2.5.2.8-.1 2.4-1 2.7-1.9.3-1 .3-1.7.2-1.9-.1-.2-.4-.3-.8-.5z' />
          </svg>
        </a>

        <Link
          href={cheapest.href}
          className='btn btn-primary'
          onClick={() => track('sticky_cta_click', { slug: cheapest.id })}
          style={{
            flex: '1 1 auto',
            minHeight: 48,
            padding: '0.85rem 1.25rem',
            justifyContent: 'center',
          }}
        >
          {t('sticky.cta')}
        </Link>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          :global(.sticky-bar) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
