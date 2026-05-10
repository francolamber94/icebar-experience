# ICE BAR — Landing

Landing page comercial de **ICE BAR Brasil** (bar de gelo natural a −10°C). Estructura research-backed para conversion (best practices 2026 de tourism), copy en PT con switcher a ES, branding completo del kit de marca, y proxy transparente al backend de **LibreTickets** para `/post`, `/checkout`, `/b`, etc.

> Este folder vive dentro del workspace de LibreTickets solo por comodidad de iteracion. Esta gitignored. Cuando este listo para deploy, se mueve a su propio repo + Vercel project.

## Stack

- **Next.js 15** Pages Router
- **React 18**
- **TypeScript** strict
- **CSS** plano (`globals.css` + tokens en `src/styles/tokens.ts`)
- **i18n** simple cookie-based (sin libs externas)

## Quickstart local

```bash
cd landing-icebar
cp .env.example .env.local       # editar LIBRETICKETS_BASE_URL si necesario
npm install
npm run dev                       # corre en http://localhost:3002
```

Para apuntar a un LibreTickets corriendo en local (usual durante desarrollo):

```bash
# en .env.local
LIBRETICKETS_BASE_URL=http://localhost:3000
```

## Estructura

```
landing-icebar/
  public/brand/         logos (svg) y fonts (otf)
  public/photos/        13 fotos del catalogo (las generas con ChatGPT, ver README abajo)
  src/pages/            Next.js pages (_app, _document, index)
  src/components/       11 componentes que arman la landing
  src/i18n/             LangProvider + pt.json + es.json
  src/data/             experiences/testimonials/stats/gallery (mocks bilingues)
  src/styles/           tokens.ts + globals.css con @font-face
  src/lib/              track.ts (analytics safe-no-op) + helpers
  next.config.js        rewrites a LibreTickets
```

## Generar las fotos con ChatGPT

La landing necesita 13 imagenes en `public/photos/`. Estilo unificado: **photorealistic 8k, gente real disfrutando, iluminacion azul-cyan + atmosfera con neblina de gelo**. Foto real (no stock) sube conversion +23% segun research.

| Archivo | Tamaño | Que tiene que mostrar |
|---|---|---|
| `hero.jpg` | 1920×1080 | Grupo de 5 amigos brindando con copos de gelo, capas térmicas plata, paredes azuladas, expresiones genuinas de risa |
| `about.jpg` | 1600×1000 (vertical) | Vista wide del interior mostrando profundidad y tamaño del bar (counter, sofas de gelo, esculturas brasileiras) |
| `step-1.jpg` | 800×600 | Smartphone en mano mostrando interfaz de reserva, reflejo cyan |
| `step-2.jpg` | 800×600 | Mujer riendo mientras staff la ayuda con la capa térmica |
| `step-3.jpg` | 800×600 | Detras de 2 amigos cruzando puerta arqueada de hielo, luz cyan |
| `gallery-1.jpg` ... `gallery-8.jpg` | 1080×1080 | UGC-style: macro caipirinha, parejas, grupos, esculturas, bartender, selfies — ver prompts detallados en `/Users/francolambertucci/.cursor/plans/icebar_landing_*.plan.md` |
| `exp-express.jpg` | 800×500 | 2 amigos entrando por puerta de hielo, energia "primera vez" |
| `exp-caipirinha.jpg` | 800×500 | Bartender sirviendo cachaca premium en copos de hielo |
| `exp-vip.jpg` | 800×500 | Pareja VIP elegante con copas de champagne de hielo, sofas de pele |
| `exp-familia.jpg` | 800×500 | Familia 4 personas con capas (incluye 2 niños con mocktails) |
| `final-cta-bg.jpg` | 1920×800 | Bar vacio con luz cyan, atmosfera "tu lugar te espera" |
| `og-image.jpg` | 1200×630 | Hero recortado para preview de redes |

Los prompts completos estan en el plan que generamos: `/Users/francolambertucci/.cursor/plans/icebar_landing_*.plan.md`.

Mientras no existan, los componentes muestran un fondo dark cyan como fallback.

## i18n

- Default: `pt-BR` (Brasil)
- Detecta `navigator.language` en primer load, persiste con cookie `icebar_lang` (1 año)
- Switcher PT/ES en el header, top-right
- Las traducciones viven en `src/i18n/pt.json` y `es.json` con keys planas anidadas
- Hook `useT()` expone `t(key)`, `raw<T>(key)` y `setLang(l)`
- Datasets bilingues exportan `{ pt, es }` por campo, los componentes leen `data.field[lang]`

## Branding ICE BAR en LibreTickets (checkout)

La landing custom y el checkout de LibreTickets tienen que ser visualmente coherentes. Para que el checkout (servido bajo el mismo dominio via rewrites) use la paleta ICE BAR:

1. Crear en la DB de LibreTickets una `Company` con `tag: "icebar"` (admin de LibreTickets)
2. En `/company/[companyId]` configurar:
   - **Primary color**: `#38BDF8`
   - **Logo**: subir `public/brand/logo-horizontal-white.svg`
   - **Font**: opcional, `Noka` o cualquier de Google Fonts disponible
   - **Country**: `BR` (define la moneda en la card; BR -> BRL, AR -> ARS)
3. Configurar `customDomain: "icebar.com.br"` (o el que sea) en la company.
4. Crear los Posts (experiencias) con titulo, descripcion (PT), `imgUrl` y al menos 1 ticket activo. La landing los lista automaticamente via `/api/public/tenant-events?host=...`.

## Catalogo dinamico (fuente: LibreTickets)

`pages/index.tsx` ya hace `getServerSideProps` y resuelve los posts del tenant en cada request:

- En produccion el host sale de `x-forwarded-host` (lo manda Vercel con el dominio real).
- En desarrollo local seteamos `NEXT_PUBLIC_TENANT_HOST=icebar.com.br` para que el fetch resuelva al tenant correcto aunque corramos en `localhost:3002`.
- Si el fetch falla o el tenant no tiene posts publicados, la seccion muestra el fallback `experiences.empty` (en los 3 idiomas).
- El boton "Reservar" siempre va a `/post/<id>` (el rewrite de `next.config.js` lo manda al deploy de LibreTickets).

Los testimonials, stats y FAQs siguen siendo mocks (contenido de marca, no necesita vivir en DB).

## Convertir fonts a woff2 (opcional, recomendado para prod)

Las fonts vienen en `.otf` (Fact, Noka 5 weights, CSAsthonDrawn). Para reducir ~40% el tamaño:

```bash
cd public/brand/fonts/
for f in *.otf; do npx -y otf2woff2 "$f"; done
```

Despues actualizar `src/styles/globals.css` cambiando `format('opentype')` -> `format('woff2')` y la extension del archivo.

## Deploy a Vercel

1. Crear un nuevo repo (separado del de LibreTickets) y pushear el contenido de este folder
2. Conectar el repo a un nuevo Vercel project (NO el de LibreTickets)
3. En Project Settings → Environment Variables agregar:
   - `LIBRETICKETS_BASE_URL=https://app.libretickets.com`
   - (no setear `NEXT_PUBLIC_TENANT_HOST` en prod: el host viene del request via `x-forwarded-host`)
4. En Project Settings → Domains agregar `icebar.com.br` (y `www`)
5. Configurar el DNS en el registrar del dominio apuntando a Vercel (CNAME a `cname.vercel-dns.com`)
6. Tambien setear el `customDomain` de la Company en la DB de LibreTickets para que el middleware multi-tenant resuelva el branding correcto

## Performance & SEO checklist

- [x] WebP fallback en `next/image` (config en `next.config.js`)
- [x] Fonts preloaded en `_document.tsx`
- [x] JSON-LD `LocalBusiness` + `TouristAttraction` para SEO local
- [x] Open Graph + Twitter cards en `index.tsx`
- [x] `theme-color` = #020617 para PWA
- [x] Mobile sticky booking bar (research: 63% trafico mobile)
- [x] Reduced motion respect
- [ ] (TODO post-deploy) submit sitemap a Google Search Console
- [ ] (TODO post-deploy) verificar Google Business Profile

## Analytics

Los componentes ya emiten eventos via `src/lib/track.ts`:
- `hero_cta_click` / `hero_secondary_click`
- `header_cta_click` / `sticky_cta_click` / `final_cta_click`
- `experience_card_click` (con slug + price)
- `lang_switch` (from / to)
- `faq_open` (index + question)
- `gallery_view`

El helper detecta `window.gtag` y `window.plausible` automaticamente. Para activar: agregar el snippet de tu provider en `_document.tsx`.

## Roadmap

- [ ] Video hero MP4 (research: +86% conversion vs imagen)
- [ ] i18n del checkout/post de LibreTickets en PT (planificado fuera de este repo)
- [x] Integracion real con `/api/public/tenant-events`
- [ ] Schema markup `Product` para cada experiencia
- [ ] Email capture en pre-launch (con descuento primeros visitantes)
