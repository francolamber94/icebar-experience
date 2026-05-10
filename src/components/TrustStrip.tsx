import { useT } from '@/i18n/LangProvider';

interface TrustItem {
  icon: React.ReactNode;
  label: string;
}

/**
 * Compact trust band placed between the highlight card and the experiences.
 * Reinforces social proof + safety signals before the user decides to buy.
 */
export function TrustStrip() {
  const { t } = useT();

  const items: TrustItem[] = [
    { icon: <StarIcon />, label: t('trust.rating') },
    { icon: <UsersIcon />, label: t('trust.visitors') },
    { icon: <ShieldIcon />, label: t('trust.cancel') },
    { icon: <LockIcon />, label: t('trust.payment') },
  ];

  return (
    <section
      aria-label='Trust signals'
      style={{
        paddingBlock: 'clamp(1rem, 3vw, 1.5rem)',
      }}
    >
      <div className='container'>
        <div
          className='trust-strip'
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px 28px',
            padding: '14px 18px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid var(--border)',
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className='trust-item'
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 22,
                  height: 22,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-light)',
                }}
              >
                {it.icon}
              </span>
              <span>{it.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          /* Horizontal scroll-snap so all 4 items remain visible without wrapping ugly */
          :global(.trust-strip) {
            justify-content: flex-start !important;
            flex-wrap: nowrap !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 22px !important;
            padding: 12px 14px !important;
            scrollbar-width: none;
          }
          :global(.trust-strip)::-webkit-scrollbar {
            display: none;
          }
          :global(.trust-item) {
            scroll-snap-align: start;
          }
        }
      `}</style>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
      <polygon points='12 2 15 9 22 9.3 17 14 18.5 21 12 17.3 5.5 21 7 14 2 9.3 9 9' />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M22 21v-2a4 4 0 0 0-3-3.87' />
      <path d='M16 3.13A4 4 0 0 1 16 11' />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
      <polyline points='9 12 11 14 15 10' />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='4' y='11' width='16' height='10' rx='2' />
      <path d='M8 11V8a4 4 0 0 1 8 0v3' />
    </svg>
  );
}
