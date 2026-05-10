import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useT } from '@/i18n/LangProvider';
import { LangSwitcher } from './LangSwitcher';
import { track } from '@/lib/track';
import { HEADER_BRAND, HEADER_CTA_ANCHOR, HEADER_NAV_IDS } from './headerConfig';

const WHATSAPP_NUMBER = '5500000000000';
const WHATSAPP_DISPLAY = '+55 (45) 0000-0000';

export function Header() {
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const lastScrollY = useRef(0);
  // Suppress auto-hide for a short window after a programmatic scroll
  // (anchor click). Otherwise the smooth-scroll triggers a hide and the
  // header vanishes while the user is jumping to a section.
  const suppressHideUntil = useRef(0);

  // Scroll behaviour: solid bg + auto-hide on scroll down (mobile feel)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 32);
      const delta = y - lastScrollY.current;
      if (Date.now() < suppressHideUntil.current) {
        setHidden(false);
      } else if (y > 200 && delta > 6) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastScrollY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onNavClick = () => {
    suppressHideUntil.current = Date.now() + 1200;
    setHidden(false);
  };

  // Active nav indicator — observe sections with id matching nav anchors
  useEffect(() => {
    const targets = HEADER_NAV_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;
    const obs = new IntersectionObserver(
      entries => {
        // Pick the topmost intersecting entry
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    targets.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const navItems = HEADER_NAV_IDS.map(id => ({
    href: `#${id}`,
    id,
    label: t(`nav.${id}`),
  }));

  return (
    <header
      style={{
        position: 'fixed',
        inset: '0 0 auto 0',
        zIndex: 50,
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        background: scrolled ? 'rgba(2, 6, 23, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transform: hidden && !mobileOpen ? 'translateY(-100%)' : 'translateY(0)',
        transition:
          'background 240ms ease, border-color 240ms ease, backdrop-filter 240ms ease, transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div
        className='container'
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, width: '100%' }}
      >
        <Link href='/' aria-label='ICE BAR' style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={HEADER_BRAND.logoUrl}
            alt='ICE BAR'
            style={{ height: scrolled ? 30 : HEADER_BRAND.logoHeight, width: 'auto', transition: 'height 240ms ease' }}
          />
        </Link>

        <nav className='desktop-nav' style={{ display: 'none' }}>
          <ul style={{ display: 'flex', gap: 28, listStyle: 'none', margin: 0, padding: 0 }}>
            {navItems.map(it => {
              const isActive = activeId === it.id;
              return (
                <li key={it.href}>
                  <a
                    href={it.href}
                    onClick={onNavClick}
                    style={{
                      position: 'relative',
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--primary-light)' : 'var(--text-muted)',
                      transition: 'color 160ms ease',
                      paddingBlock: 6,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary-light)')}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {it.label}
                    {isActive && (
                      <span
                        aria-hidden
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: -4,
                          height: 2,
                          borderRadius: 2,
                          background: 'var(--primary)',
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LangSwitcher />
          <a
            href={HEADER_CTA_ANCHOR}
            className='btn btn-primary btn-sm header-cta'
            style={{ display: 'none' }}
            onClick={() => {
              onNavClick();
              track('header_cta_click');
            }}
          >
            {t('nav.reservar')}
          </a>
          <button
            aria-label={t('nav.menu')}
            aria-expanded={mobileOpen}
            className='mobile-menu-btn'
            onClick={() => setMobileOpen(v => !v)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border)',
            }}
          >
            <span aria-hidden style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span
                style={{
                  width: 18,
                  height: 2,
                  background: 'var(--text)',
                  borderRadius: 2,
                  transition: 'transform 240ms ease, opacity 200ms ease',
                  transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none',
                }}
              />
              <span
                style={{
                  width: 18,
                  height: 2,
                  background: 'var(--text)',
                  borderRadius: 2,
                  transition: 'opacity 200ms ease',
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: 18,
                  height: 2,
                  background: 'var(--text)',
                  borderRadius: 2,
                  transition: 'transform 240ms ease',
                  transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed',
          inset: 'var(--header-h) 0 0 0',
          background: 'rgba(2, 6, 23, 0.97)',
          backdropFilter: 'blur(20px)',
          padding: '1.5rem 1.5rem calc(1.5rem + var(--safe-bottom))',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? 'translateX(0)' : 'translateX(8%)',
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 280ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          overflowY: 'auto',
        }}
      >
        <nav style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
          {navItems.map(it => {
            const isActive = activeId === it.id;
            return (
              <a
                key={it.href}
                href={it.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.1rem 0.5rem',
                  fontSize: 20,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? 'var(--primary-light)' : 'var(--text)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span>{it.label}</span>
                {isActive && (
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: 'var(--primary)',
                      boxShadow: '0 0 12px var(--primary)',
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom-pinned actions */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => {
              setMobileOpen(false);
              track('whatsapp_fab_click', { source: 'mobile_menu' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 14,
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: 'var(--text)',
            }}
          >
            <span
              aria-hidden
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: '#25D366',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width='18' height='18' viewBox='0 0 32 32' fill='currentColor' aria-hidden>
                <path d='M27.2 4.7A15.84 15.84 0 0 0 16 .1C7.2.1.1 7.2.1 16c0 2.8.7 5.5 2.1 7.9L0 32l8.3-2.2c2.3 1.3 4.9 1.9 7.6 1.9h.1C24.7 31.7 32 24.6 32 15.8c0-4.2-1.6-8.2-4.8-11.1zM16 29c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-5 1.3 1.3-4.8-.3-.5C3.5 20.7 2.7 18.4 2.7 16 2.7 8.7 8.7 2.7 16 2.7c3.5 0 6.8 1.4 9.3 3.9 2.5 2.5 3.8 5.8 3.8 9.3-.1 7.3-6 13.1-13.1 13.1zm7.3-9.8c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.3 0 1.9 1.4 3.8 1.6 4.1.2.3 2.8 4.3 6.8 6 .9.4 1.7.6 2.3.8.9.3 1.8.3 2.5.2.8-.1 2.4-1 2.7-1.9.3-1 .3-1.7.2-1.9-.1-.2-.4-.3-.8-.5z' />
              </svg>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                {t('nav.whatsapp_title')}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{WHATSAPP_DISPLAY}</span>
            </div>
          </a>
          <a
            href={HEADER_CTA_ANCHOR}
            className='btn btn-primary'
            style={{ width: '100%' }}
            onClick={() => {
              setMobileOpen(false);
              track('header_cta_click', { source: 'mobile_menu' });
            }}
          >
            {t('nav.reservar')}
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          :global(.desktop-nav),
          :global(.header-cta) {
            display: inline-flex !important;
          }
          :global(.mobile-menu-btn) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
