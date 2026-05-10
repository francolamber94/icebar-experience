import { useT } from '@/i18n/LangProvider';
import type { Experience } from '@/data/experiences';
import { EventCard } from './EventCard';

interface ExperiencesSectionProps {
  experiences: Experience[];
  /** Currency is unused at the section level today; kept here so future filters/badges can use it. */
  currency?: string;
}

/**
 * Renders the catalog of experiences (Posts) for the tenant. Always shows the
 * eyebrow + title block; if the tenant has no posts yet, shows a friendly
 * "coming soon" fallback so the section never appears broken.
 */
export function ExperiencesSection({ experiences }: ExperiencesSectionProps) {
  const { t } = useT();
  const hasExperiences = experiences.length > 0;

  return (
    <section id='experiencias' className='section section-alt'>
      <div className='container'>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <span className='eyebrow'>{t('experiences.eyebrow')}</span>
          <h2 style={{ marginBottom: 12 }}>{t('experiences.title')}</h2>
          <p style={{ maxWidth: 600, margin: '0 auto' }}>{t('experiences.subtitle')}</p>
        </div>

        {hasExperiences ? (
          <div
            className='experiences-grid'
            style={{
              display: 'grid',
              // Cap each card at 300px and use auto-fill so the layout looks the
              // same with 1, 2, 4 or N posts: a single post stays in a 300px
              // column instead of stretching to the full container width.
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 300px))',
              justifyContent: 'center',
              gap: 'clamp(1rem, 2.5vw, 1.75rem)',
            }}
          >
            {experiences.map(exp => (
              <EventCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <div
            style={{
              maxWidth: 520,
              margin: '0 auto',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              border: '1px dashed var(--border-strong)',
              borderRadius: 20,
              background: 'rgba(2, 6, 23, 0.4)',
              color: 'var(--text-muted)',
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            {t('experiences.empty')}
          </div>
        )}
      </div>

      <style jsx>{`
        /* On phones force one-column full-width — readability + commitment beats density */
        @media (max-width: 640px) {
          :global(.experiences-grid) {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
    </section>
  );
}
