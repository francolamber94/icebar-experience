import { useT } from '@/i18n/LangProvider';

const WHATSAPP_NUMBER = '5500000000000';
const WHATSAPP_DISPLAY = '+55 (45) 0000-0000';

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  return (
    <footer
      className='site-footer'
      style={{
        background: '#01040D',
        borderTop: '1px solid var(--border)',
        paddingTop: '4rem',
        paddingBottom: 'calc(2rem + var(--safe-bottom))',
        position: 'relative',
      }}
    >
      <div
        className='container footer-grid'
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
        }}
      >
        <div>
          <img
            src='/brand/logo-horizontal-white.svg'
            alt='ICE BAR'
            style={{ height: 36, marginBottom: 16 }}
          />
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 280 }}>
            {t('footer.tagline')}
          </p>
        </div>

        <FooterCol title={t('footer.hours_title')}>
          {t('footer.hours_body')
            .split('\n')
            .map((line, i) => (
              <div key={i} style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                {line}
              </div>
            ))}
        </FooterCol>

        <FooterCol title={t('footer.address_title')}>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
            Shopping Catuaí Palladium
            <br />
            2º piso, Av. das Cataratas
            <br />
            Foz do Iguaçu, PR — Brasil
          </div>
        </FooterCol>

        <FooterCol title={t('footer.follow_title')}>
          <div className='footer-social' style={{ display: 'flex', gap: 12 }}>
            <SocialBtn href='https://instagram.com/icebarbr' label='Instagram'>
              <InstagramIcon />
            </SocialBtn>
            <SocialBtn href={`https://wa.me/${WHATSAPP_NUMBER}`} label='WhatsApp'>
              <WhatsAppIcon />
            </SocialBtn>
            <SocialBtn href='https://www.tiktok.com/@icebarbr' label='TikTok'>
              <TikTokIcon />
            </SocialBtn>
          </div>

          {/* WhatsApp prominent CTA — primary mobile contact channel */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target='_blank'
            rel='noopener noreferrer'
            className='footer-wa-cta'
            style={{
              marginTop: 18,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 14,
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: 'var(--text)',
              transition: 'background 200ms ease',
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
              <WhatsAppIcon />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                {t('footer.whatsapp_cta')}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{WHATSAPP_DISPLAY}</span>
            </div>
          </a>
        </FooterCol>
      </div>

      <div
        className='container footer-bottom'
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 12,
          color: 'var(--text-subtle)',
        }}
      >
        <span>
          © {year} ICE BAR EXPERIENCE. {t('footer.rights')}
        </span>
        <span className='footer-powered'>{t('footer.powered')}</span>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          :global(.footer-grid) {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: left;
          }
          :global(.footer-social) {
            justify-content: flex-start;
          }
          :global(.footer-wa-cta) {
            display: flex !important;
            width: 100%;
          }
          :global(.footer-bottom) {
            justify-content: center;
            text-align: center;
            padding-bottom: calc(var(--sticky-bar-h) + 12px);
          }
          /* Hide the powered-by stamp on phones — pure noise on a sales surface */
          :global(.footer-powered) {
            display: none !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: 'var(--primary-light)',
          marginBottom: 16,
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target='_blank'
      rel='noopener noreferrer'
      style={{
        width: 44,
        height: 44,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-muted)',
        transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(56,189,248,0.14)';
        e.currentTarget.style.color = 'var(--primary-light)';
        e.currentTarget.style.borderColor = 'var(--border-strong)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--surface)';
        e.currentTarget.style.color = 'var(--text-muted)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='3' width='18' height='18' rx='5' />
      <circle cx='12' cy='12' r='4' />
      <circle cx='17.5' cy='6.5' r='1' fill='currentColor' />
    </svg>
  );
}
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox='0 0 32 32' fill='currentColor' aria-hidden>
      <path d='M27.2 4.7A15.84 15.84 0 0 0 16 .1C7.2.1.1 7.2.1 16c0 2.8.7 5.5 2.1 7.9L0 32l8.3-2.2c2.3 1.3 4.9 1.9 7.6 1.9h.1C24.7 31.7 32 24.6 32 15.8c0-4.2-1.6-8.2-4.8-11.1zM16 29c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-5 1.3 1.3-4.8-.3-.5C3.5 20.7 2.7 18.4 2.7 16 2.7 8.7 8.7 2.7 16 2.7c3.5 0 6.8 1.4 9.3 3.9 2.5 2.5 3.8 5.8 3.8 9.3-.1 7.3-6 13.1-13.1 13.1zm7.3-9.8c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.6-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.8-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.3 0 1.9 1.4 3.8 1.6 4.1.2.3 2.8 4.3 6.8 6 .9.4 1.7.6 2.3.8.9.3 1.8.3 2.5.2.8-.1 2.4-1 2.7-1.9.3-1 .3-1.7.2-1.9-.1-.2-.4-.3-.8-.5z' />
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
      <path d='M19.6 7.2a5.5 5.5 0 0 1-3.4-1.2v8.5a5.5 5.5 0 1 1-5.5-5.5h.6v3a2.5 2.5 0 1 0 2 2.4V2h2.9a5.5 5.5 0 0 0 3.4 5.2z' />
    </svg>
  );
}
