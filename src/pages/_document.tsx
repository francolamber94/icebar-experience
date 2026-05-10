import { Html, Head, Main, NextScript } from 'next/document';

const SITE_NAME = 'ICE BAR EXPERIENCE';
const SITE_URL = 'https://icebar.com.br';
const DESCRIPTION_PT =
  'O Ártico no Brasil. Bar 100% feito de gelo natural a −10°C. Capa térmica, luvas e drink incluso. 45 min de uma experiência única. Reserve online.';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'TouristAttraction'],
  name: SITE_NAME,
  description: DESCRIPTION_PT,
  url: SITE_URL,
  image: `${SITE_URL}/photos/hero.jpg`,
  priceRange: 'R$ 89 - R$ 299',
  servesCuisine: ['Cocktails', 'Caipirinha'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shopping Catuaí Palladium, 2º piso, Av. das Cataratas',
    addressLocality: 'Foz do Iguaçu',
    addressRegion: 'PR',
    addressCountry: 'BR',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '14:00', closes: '23:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '14:00', closes: '00:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '14:00', closes: '22:00' },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1247',
    bestRating: '5',
    worstRating: '1',
  },
};

export default function Document() {
  return (
    <Html lang='pt-BR'>
      <Head>
        {/* Favicons */}
        <link rel='icon' href='/brand/logo-icon-blue.svg' type='image/svg+xml' />
        <link rel='alternate icon' href='/brand/favicon-source-blue.png' />
        <link rel='apple-touch-icon' href='/brand/favicon-source-blue.png' />

        {/* Theme color (matches our --bg) */}
        <meta name='theme-color' content='#020617' />

        {/* Preconnect for any optional remote assets */}
        <link rel='preconnect' href='https://app.libretickets.com' />

        {/* Preload hero photo — improves LCP on slow mobile networks. */}
        {/* `fetchpriority` cast: supported by React 18 / browsers but the @types lag; keep until upstream catches up. */}
        <link rel='preload' as='image' href='/photos/hero.jpg' {...({ fetchPriority: 'high' } as Record<string, string>)} />

        {/* Preload critical font weights to avoid flash of unstyled text */}
        <link
          rel='preload'
          href='/brand/fonts/Fact-VF.otf'
          as='font'
          type='font/otf'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/brand/fonts/Noka-Medium.otf'
          as='font'
          type='font/otf'
          crossOrigin='anonymous'
        />

        {/* JSON-LD structured data for local SEO */}
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
