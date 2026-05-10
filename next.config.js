/** @type {import('next').NextConfig} */
const LT = process.env.LIBRETICKETS_BASE_URL || 'https://app.libretickets.com';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'app.libretickets.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // Multi-tenant proxy: bajo el dominio del cliente (icebar.com.br) servimos
  // landing 100% custom, pero los paths compartidos (/post, /checkout, /b,
  // /api/trpc, etc.) se rewritean transparentemente al deploy de LibreTickets.
  // La URL del navegador queda siempre en icebar.com.br.
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/post/:path*', destination: `${LT}/post/:path*` },
        { source: '/appointment/:path*', destination: `${LT}/appointment/:path*` },
        { source: '/checkout', destination: `${LT}/checkout` },
        { source: '/checkout/:path*', destination: `${LT}/checkout/:path*` },
        { source: '/checkout-complete/:path*', destination: `${LT}/checkout-complete/:path*` },
        { source: '/b/:ticketId', destination: `${LT}/b/:ticketId` },
        { source: '/i/:ticketId', destination: `${LT}/i/:ticketId` },
        { source: '/c/:companyId', destination: `${LT}/c/:companyId` },
        { source: '/tickets/:path*', destination: `${LT}/tickets/:path*` },
        { source: '/saved-tickets', destination: `${LT}/saved-tickets` },
        { source: '/api/trpc/:path*', destination: `${LT}/api/trpc/:path*` },
        { source: '/api/mercado-pago/:path*', destination: `${LT}/api/mercado-pago/:path*` },
        { source: '/api/iframe-verify', destination: `${LT}/api/iframe-verify` },
        { source: '/api/public/:path*', destination: `${LT}/api/public/:path*` },
        // Next.js internals que SI o SI tienen que ir a LT (data SSG/ISR e image proxy)
        { source: '/_next/data/:path*', destination: `${LT}/_next/data/:path*` },
        { source: '/_next/image', destination: `${LT}/_next/image` },
        // Auth flows que LibreTickets necesita para login en checkout
        { source: '/api/auth/:path*', destination: `${LT}/api/auth/:path*` },
        { source: '/login', destination: `${LT}/login` },
        { source: '/login/:path*', destination: `${LT}/login/:path*` },
      ],
      // Despues del filesystem del landing: si /_next/static/* no existe en este
      // proyecto, lo pedimos a LT (chunks que pertenecen a paginas rewriteadas).
      afterFiles: [
        { source: '/_next/static/:path*', destination: `${LT}/_next/static/:path*` },
      ],
      // Fallback: cualquier path que el landing no haya manejado cae aca.
      // Esto cubre el companyTag en raiz (/<empresa>), que es la pagina publica
      // de la empresa con la lista de eventos en LibreTickets.
      fallback: [{ source: '/:path*', destination: `${LT}/:path*` }],
    };
  },
};

module.exports = nextConfig;
