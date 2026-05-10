import { useEffect, useState } from 'react';

/**
 * Hairline scroll progress at the very top of the viewport.
 * Mobile only — gives a subtle "you're getting somewhere" feedback
 * that reduces abandonment in long landings.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className='scroll-progress-root'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 60,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--primary), var(--accent))',
          transition: 'width 120ms linear',
          boxShadow: progress > 1 ? '0 0 12px rgba(56,189,248,0.6)' : 'none',
        }}
      />
      <style jsx>{`
        @media (min-width: 900px) {
          :global(.scroll-progress-root) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
