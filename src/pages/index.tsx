import Head from 'next/head';
import type { GetServerSideProps } from 'next';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ExperienceHighlight } from '@/components/ExperienceHighlight';
import { TrustStrip } from '@/components/TrustStrip';
import { AboutSection } from '@/components/AboutSection';
import { HowItWorks } from '@/components/HowItWorks';
import { GallerySection } from '@/components/GallerySection';
import { ExperiencesSection } from '@/components/ExperiencesSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FAQAccordion } from '@/components/FAQAccordion';
import { FinalCTASection } from '@/components/FinalCTASection';
import { Footer } from '@/components/Footer';
import { StickyBookingBar } from '@/components/StickyBookingBar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { useT } from '@/i18n/LangProvider';
import type { Experience } from '@/data/experiences';
import { fetchTenantExperiences, pickCheapest } from '@/lib/fetchExperiences';

const SITE_URL = 'https://icebar.com.br';

const META = {
  pt: {
    title: 'ICE BAR EXPERIENCE — O Ártico no coração do Brasil',
    description:
      'Bar 100% feito de gelo natural a −10°C. Capa térmica, luvas e drink incluso. 45 min de experiência única. Reserve online em 2 minutos.',
  },
  es: {
    title: 'ICE BAR EXPERIENCE — El Ártico en el corazón de Brasil',
    description:
      'Bar 100% hecho de hielo natural a −10°C. Capa térmica, guantes y trago incluido. 45 min de experiencia única. Reservá online en 2 minutos.',
  },
  en: {
    title: 'ICE BAR EXPERIENCE — The Arctic in the heart of Brazil',
    description:
      'A bar built entirely of natural ice, kept at −10°C. Thermal cape, gloves and a cocktail in an ice glass — all included. 45 minutes of pure wow. Book online in 2 minutes.',
  },
};

const OG_LOCALE: Record<'pt' | 'es' | 'en', string> = {
  pt: 'pt_BR',
  es: 'es_AR',
  en: 'en_US',
};

interface HomeProps {
  experiences: Experience[];
  cheapest: Experience | null;
  currency: string;
}

export default function Home({ experiences, cheapest, currency }: HomeProps) {
  const { lang } = useT();
  const meta = META[lang];

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name='description' content={meta.description} />
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
        <link rel='canonical' href={SITE_URL} />

        {/* Open Graph */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='ICE BAR EXPERIENCE' />
        <meta property='og:title' content={meta.title} />
        <meta property='og:description' content={meta.description} />
        <meta property='og:image' content={`${SITE_URL}/photos/og-image.jpg`} />
        <meta property='og:url' content={SITE_URL} />
        <meta property='og:locale' content={OG_LOCALE[lang]} />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={meta.title} />
        <meta name='twitter:description' content={meta.description} />
        <meta name='twitter:image' content={`${SITE_URL}/photos/og-image.jpg`} />
      </Head>

      <ScrollProgress />
      <Header />
      <main className='page-main'>
        <Hero />
        <ExperienceHighlight />
        <TrustStrip />
        {/*
          Mobile-first reorder: cards de venta van arriba (3rd scroll), no
          escondidas detrás de About + How + Gallery. Reduce drop-off.
        */}
        <ExperiencesSection experiences={experiences} currency={currency} />
        <AboutSection />
        <HowItWorks />
        <GallerySection />
        <TestimonialsSection />
        <FAQAccordion />
        <FinalCTASection />
      </main>
      <Footer />
      <StickyBookingBar cheapest={cheapest} currency={currency} />

      <style jsx global>{`
        @media (max-width: 900px) {
          .page-main {
            /* Reserve room so the sticky booking bar never covers content */
            padding-bottom: calc(var(--sticky-bar-h) + var(--safe-bottom));
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ctx => {
  // Re-validate CDN: SSR every request but allow Vercel to cache for 60s.
  ctx.res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  const forwardedHost = (ctx.req.headers['x-forwarded-host'] as string | undefined) ?? undefined;
  const host = (ctx.req.headers.host as string | undefined) ?? undefined;
  const { experiences, currency } = await fetchTenantExperiences({ host, forwardedHost });
  const cheapest = pickCheapest(experiences);

  return {
    props: {
      experiences,
      cheapest,
      currency,
    },
  };
};
