import { useCallback, useEffect, useRef } from 'react';
import { useT } from '@/i18n/LangProvider';
import type { GalleryItem } from '@/data/gallery';

interface LightboxProps {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onChange: (next: number) => void;
}

const SWIPE_THRESHOLD = 60;

export function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const { lang } = useT();
  const isOpen = index !== null;
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  // Keyboard nav + body scroll lock + initial focus.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    closeBtnRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen || index === null) return null;
  const current = items[index];

  // Touch handlers — horizontal swipe between photos
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    // Only trigger if gesture is clearly horizontal
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-label={current.alt[lang]}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(2, 6, 23, 0.94)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'calc(clamp(0.75rem, 3vw, 2rem) + var(--safe-top))',
        paddingBottom: 'calc(clamp(0.75rem, 3vw, 2rem) + var(--safe-bottom))',
        paddingLeft: 'calc(clamp(0.5rem, 2vw, 1.5rem) + var(--safe-left))',
        paddingRight: 'calc(clamp(0.5rem, 2vw, 1.5rem) + var(--safe-right))',
        animation: 'lb-fade 200ms ease-out',
      }}
    >
      {/* Image container: flex column with caption inside the safe area */}
      <div
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'relative',
          maxWidth: 'min(1280px, 96vw)',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          animation: 'lb-pop 280ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <img
          src={current.src}
          alt={current.alt[lang]}
          draggable={false}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 160px)',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: 12,
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
            touchAction: 'pan-x pinch-zoom',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        />

        {/* Caption + counter — inside the viewport, below the image */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: 'rgba(255,255,255,0.78)',
            fontSize: 13,
            letterSpacing: 0.2,
            textAlign: 'center',
            maxWidth: '100%',
            padding: '0 12px',
          }}
        >
          <span style={{ flex: 1, lineHeight: 1.4 }}>{current.alt[lang]}</span>
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              padding: '4px 10px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {index + 1} / {items.length}
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        ref={closeBtnRef}
        onClick={onClose}
        aria-label='Close'
        style={{
          position: 'absolute',
          top: 'calc(clamp(0.75rem, 2vw, 1.5rem) + var(--safe-top))',
          right: 'calc(clamp(0.75rem, 2vw, 1.5rem) + var(--safe-right))',
          width: 48,
          height: 48,
          minWidth: 48,
          minHeight: 48,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(15, 23, 42, 0.7)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: 22,
          lineHeight: 1,
          display: 'grid',
          placeItems: 'center',
          transition: 'background 200ms ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
        }}
      >
        ✕
      </button>

      {/* Prev / Next — desktop only, mobile uses swipe */}
      <button
        onClick={e => {
          e.stopPropagation();
          goPrev();
        }}
        aria-label='Previous'
        className='lb-nav lb-nav-left'
        style={{ ...navBtnStyle('left') }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
        }}
      >
        ‹
      </button>

      <button
        onClick={e => {
          e.stopPropagation();
          goNext();
        }}
        aria-label='Next'
        className='lb-nav lb-nav-right'
        style={{ ...navBtnStyle('right') }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.95)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
        }}
      >
        ›
      </button>

      <style jsx>{`
        @keyframes lb-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes lb-pop {
          from {
            opacity: 0;
            transform: scale(0.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @media (max-width: 640px) {
          /* Mobile relies on swipe — hide nav arrows */
          :global(.lb-nav) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function navBtnStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [side]: 'clamp(0.5rem, 2vw, 1.5rem)',
    width: 52,
    height: 52,
    minWidth: 52,
    minHeight: 52,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(15, 23, 42, 0.7)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 32,
    lineHeight: 1,
    display: 'grid',
    placeItems: 'center',
    transition: 'background 200ms ease',
  } as React.CSSProperties;
}
