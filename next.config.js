/** @type {import('next').NextConfig} */
const LT = process.env.LIBRETICKETS_BASE_URL || 'https://app.libretickets.com';
// Tag de la empresa duenia de este landing. Se inyecta como query param en
// cada rewrite a LibreTickets para que el SSR de LT pueda aplicar branding
// white-label sin depender de headers (Vercel cross-project rewrite NO
// preserva host/x-forwarded-host: ambos llegan como libretickets.com).
const TENANT_TAG = process.env.NEXT_PUBLIC_TENANT_TAG || 'icebarexperience';
const t = (path) => `${LT}${path}${path.includes('?') ? '&' : '?'}__tenant=${TENANT_TAG}`;

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Vercel intercepta /_next/image antes de evaluar rewrites y valida que el
    // host del query `url` este en remotePatterns del proyecto actual. Como las
    // imagenes de posts son rewriteadas a LT, necesitamos permitir aca los
    // mismos hosts que LT. Sin esto, todas las fotos dan 400 INVALID_IMAGE_OPTIMIZE_REQUEST.
    remotePatterns: [
      { protocol: 'https', hostname: 'app.libretickets.com' },
      { protocol: 'https', hostname: 'libretickets.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'quickchart.io' },
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
        { source: '/post/:path*', destination: t('/post/:path*') },
        { source: '/appointment/:path*', destination: t('/appointment/:path*') },
        { source: '/checkout', destination: t('/checkout') },
        { source: '/checkout/:path*', destination: t('/checkout/:path*') },
        { source: '/checkout-complete/:path*', destination: t('/checkout-complete/:path*') },
        { source: '/b/:ticketId', destination: t('/b/:ticketId') },
        { source: '/i/:ticketId', destination: t('/i/:ticketId') },
        { source: '/c/:companyId', destination: t('/c/:companyId') },
        { source: '/tickets/:path*', destination: t('/tickets/:path*') },
        { source: '/saved-tickets', destination: t('/saved-tickets') },
        { source: '/api/trpc/:path*', destination: t('/api/trpc/:path*') },
        { source: '/api/mercado-pago/:path*', destination: t('/api/mercado-pago/:path*') },
        { source: '/api/iframe-verify', destination: t('/api/iframe-verify') },
        { source: '/api/public/:path*', destination: t('/api/public/:path*') },
        // Next.js internals que SI o SI tienen que ir a LT (data SSG/ISR e image proxy).
        // OJO: `/_next/image` valida estrictamente sus query params (url, w, q) y
        // devuelve 400 si llega cualquier extra. Por eso NO le inyectamos __tenant.
        { source: '/_next/data/:path*', destination: t('/_next/data/:path*') },
        { source: '/_next/image', destination: `${LT}/_next/image` },
        // Auth flows que LibreTickets necesita para login en checkout
        { source: '/api/auth/:path*', destination: t('/api/auth/:path*') },
        { source: '/login', destination: t('/login') },
        { source: '/login/:path*', destination: t('/login/:path*') },
      ],
      // /_next/static/* NO se rewritea aca: el CDN de Vercel los resuelve antes
      // de los rewrites y devolveria 404. Para que funcione, LT setea
      // `assetPrefix=https://libretickets.com` en su next.config.js, asi su HTML
      // referencia los chunks con URL absoluta y el browser los pide directo
      // al origen sin pasar por icebarexperience.com.
      // Fallback: cualquier path que el landing no haya manejado cae aca.
      // Esto cubre el companyTag en raiz (/<empresa>), que es la pagina publica
      // de la empresa con la lista de eventos en LibreTickets.
      fallback: [{ source: '/:path*', destination: t('/:path*') }],
    };
  },
};

module.exports = nextConfig;
