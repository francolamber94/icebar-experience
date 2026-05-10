import { useEffect, useRef, useState } from 'react';
import { SUPPORTED_LANGS, useT, type Lang } from '@/i18n/LangProvider';
import { track } from '@/lib/track';
import { LANG_META } from './headerConfig';

interface LangOption {
  code: Lang;
  flag: string;
  label: string;
  short: string;
}

/**
 * AR is used for ES because the copy is written in voseo and targets the
 * Mercosur audience (Foz do Iguaçu border). US is used for EN because it's
 * the most universally recognised "English" flag in tourism contexts.
 */
const OPTIONS: Record<Lang, LangOption> = {
  pt: { code: 'pt', ...LANG_META.pt },
  es: { code: 'es', ...LANG_META.es },
  en: { code: 'en', ...LANG_META.en },
};

export function LangSwitcher() {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (l: Lang) => {
    setOpen(false);
    if (l === lang) return;
    setLang(l);
    track('lang_switch', { from: lang, to: l });
  };

  const current = OPTIONS[lang];

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type='button'
        aria-label={`Language: ${current.label}`}
        aria-haspopup='listbox'
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 36,
          padding: '6px 10px 6px 8px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
          color: 'var(--text)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
          cursor: 'pointer',
        }}
      >
        <Flag emoji={current.flag} />
        <span>{current.short}</span>
        <svg
          width='10'
          height='10'
          viewBox='0 0 10 10'
          aria-hidden
          style={{
            transition: 'transform 200ms ease',
            transform: open ? 'rotate(180deg)' : 'none',
            opacity: 0.7,
          }}
        >
          <path d='M2 4l3 3 3-3' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </button>

      <ul
        role='listbox'
        aria-label='Language'
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: 168,
          margin: 0,
          padding: 6,
          listStyle: 'none',
          background: 'rgba(2, 6, 23, 0.96)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 180ms ease, transform 180ms ease',
          zIndex: 60,
        }}
      >
        {SUPPORTED_LANGS.map(l => {
          const opt = OPTIONS[l];
          const active = l === lang;
          return (
            <li key={l}>
              <button
                type='button'
                role='option'
                aria-selected={active}
                onClick={() => choose(l)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: active ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                  color: active ? 'var(--primary-light)' : 'var(--text)',
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 140ms ease',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <Flag emoji={opt.flag} />
                <span style={{ flex: 1 }}>{opt.label}</span>
                {active && (
                  <span aria-hidden style={{ color: 'var(--primary)', fontSize: 16, lineHeight: 1 }}>
                    ✓
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Native emoji flags. They render crisply across macOS, iOS, Android and
 * Windows 10+. We use the system emoji font stack so they look like real
 * flags everywhere instead of stretched SVG shapes.
 */
function Flag({ emoji }: { emoji: string }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        lineHeight: 1,
        fontFamily:
          '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif',
        flexShrink: 0,
      }}
    >
      {emoji}
    </span>
  );
}
