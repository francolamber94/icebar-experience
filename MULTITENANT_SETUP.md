# Multi-tenant Landing Setup — White-label LibreTickets

Guía para armar la landing de un cliente nuevo. Usá `landing-icebar` (este repo)
como template — clonalo, renombralo y adaptá los assets/copy/idiomas. Tiene
todo lo necesario: i18n (PT/ES/EN), header-config API que LT consume para
match visual del checkout, lang switcher, video hero, integración con la API
publica de tenant-events, etc.

La landing vive en su **propio repo + propio Vercel project**, bajo el dominio del cliente (`cliente.com.ar`). Los paths compartidos del sistema de tickets (`/post`, `/checkout`, `/b`, `/api/trpc`, etc.) se proxean transparentemente al deploy de LibreTickets vía `next.config.js` `rewrites`. La URL del navegador queda siempre en `cliente.com.ar`.

```
cliente.com.ar/                  → landing custom (ESTE proyecto)
cliente.com.ar/tours/algo        → landing custom
cliente.com.ar/post/<id>         → SSR de LibreTickets (rewrite)
cliente.com.ar/checkout/<id>     → SSR de LibreTickets (rewrite)
cliente.com.ar/b/<ticketId>      → SSR de LibreTickets (rewrite)
cliente.com.ar/api/trpc/*        → API de LibreTickets (rewrite)
```

---

## Setup nuevo cliente — paso a paso

### 1. Crear el repo

```bash
# desde la raíz del workspace master:
cp -R landing-icebar /tmp/landing-cliente
cd /tmp/landing-cliente
rm -rf node_modules .next .git
git init && git add . && git commit -m "init landing"

# crear repo en GitHub (org tuya o del cliente) y pushear
gh repo create landing-cliente --private --source=. --push
```

### 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

```
LIBRETICKETS_BASE_URL=https://app.libretickets.com
NEXT_PUBLIC_COMPANY_TAG=<companyTag de la empresa en LibreTickets>
NEXT_PUBLIC_FEATURED_POST_ID=     # opcional: postId de un evento estrella
NEXT_PUBLIC_BRAND_NAME=Cliente XYZ
NEXT_PUBLIC_BRAND_PRIMARY=#0ea5a5
```

El `NEXT_PUBLIC_COMPANY_TAG` lo ves en LibreTickets editando la empresa: aparece como "Enlace personalizado".

### 3. Conectar a Vercel

1. Vercel Dashboard → Add new → Project → importar repo.
2. En Settings → Environment Variables, agregá las mismas variables de `.env.local` (`LIBRETICKETS_BASE_URL`, `NEXT_PUBLIC_DEMO_POST_ID`, `NEXT_PUBLIC_BRAND_NAME`, `NEXT_PUBLIC_BRAND_PRIMARY`) para Production y Preview.
3. Deploy.

### 4. Conectar el dominio del cliente

1. En el proyecto Vercel del landing → Settings → Domains → Add → escribir `cliente.com.ar`.
2. Vercel te muestra el DNS que el cliente tiene que cargar:
   - Para subdominio (`tickets.cliente.com.ar`): **CNAME → `cname.vercel-dns.com`**.
   - Para apex (`cliente.com.ar`): **A record → `76.76.21.21`** (IP de Vercel).
3. El cliente carga ese DNS en su registrador (NIC.ar, GoDaddy, Cloudflare, etc.).
4. Esperar 1-30 min a que propague + Vercel emita SSL automáticamente.

### 5. Registrar el dominio en LibreTickets

Esto es para que el SSR de LibreTickets reconozca el host y pueda inyectar el branding correcto al checkout/post/etc.

1. En LibreTickets, abrir la empresa del cliente (admin) → sección "Custom domain".
2. Pegar `cliente.com.ar` en el input y guardar.
3. Una vez que el SSL ya esté emitido en Vercel y todo verifique, hacer click en "Marcar como verified".

### 6. Configurar branding (paleta + assets)

En la misma pantalla de la empresa, seccion "Branding":

- Color primary / secondary (los del checkout, botones, etc.).
- Background / paper / texto opcionales.
- Favicon URL (sirve a `/favicon.ico` en el dominio del cliente).
- OG Image URL.

Esto se aplica **inmediatamente** al checkout, página de evento, ticket, etc., bajo el dominio del cliente. La landing visual se controla acá en el repo del template (texto, hero, fotos).

---

## Validación end-to-end (round trip de prueba)

Una vez que está todo conectado, validá que el flujo cierra:

1. Visitar `https://cliente.com.ar` → debe ver la landing custom (este proyecto).
2. Click "Comprar entradas" → URL queda en `cliente.com.ar/post/<id>`. El theme MUI debe verse con los colores del branding configurado.
3. Avanzar el flujo de compra → llegar a Mercado Pago.
4. Pagar (con cuenta test o real) → MP redirige al usuario a `cliente.com.ar/b/<ticketId>` (no a `app.libretickets.com`). Esto prueba que las `back_urls` dinámicas funcionan.
5. Verificar en LibreTickets que el ticket se generó OK (esto valida que el `notification_url` del webhook MP sigue llegando bien a `app.libretickets.com/api/mercado-pago/webhook`).

Si los puntos 1-5 pasan, el cliente está listo. Si la landing necesita más páginas/copy, las agregás en `src/pages/...` y deploy.

---

## Estructura del template (landing-icebar como base)

```
landing-icebar/
├── package.json
├── next.config.js                  # rewrites a LIBRETICKETS_BASE_URL
├── tsconfig.json
├── .env.example
├── README.md                       # doc especifica de icebar
├── MULTITENANT_SETUP.md            # este archivo (guia generica)
└── src/
    ├── pages/
    │   ├── _app.tsx
    │   ├── index.tsx               # home con hero, experiencias, sobre, FAQ
    │   └── api/
    │       └── header-config.ts    # endpoint que LT consume para pixel-match del header
    ├── components/
    │   ├── Header.tsx              # logo + nav + lang switcher + CTA
    │   ├── headerConfig.ts         # SSOT de logo/colores/nav/etc.
    │   ├── LangSwitcher.tsx        # PT/ES/EN con bandera
    │   ├── Hero.tsx
    │   ├── ExperiencesSection.tsx
    │   ├── AboutSection.tsx
    │   ├── GallerySection.tsx
    │   ├── FAQSection.tsx
    │   └── ...
    ├── i18n/                        # diccionarios pt.json / es.json / en.json
    ├── data/
    │   └── experiences.ts           # mock o fetcher de tenant-events
    └── styles/globals.css
```

Para un cliente nuevo borrá lo especifico de icebar (PROMPTS.md, fotos del bar,
copys), reemplazá el branding en `headerConfig.ts` + `i18n/*.json` + assets en
`public/`, y dejá lo estructural (Header, LangSwitcher, header-config endpoint).

---

## Cosas que NO hacer

- **No** copies este template adentro del repo de LibreTickets. Si lo hacés, perdés el deploy independiente y rompés el sentido de la arquitectura.
- **No** uses NextAuth ni cookies de sesión en la landing — el comprador no se loguea acá; el flujo es "checkout as guest". Si necesitás cuenta, hace que se loguee directamente en LibreTickets (en la página `/post/<id>` que ya está en LibreTickets).
- **No** intentes proxiear `/api/auth/*` ni `/_next/static/*` al rewriter — los assets de la landing son propios; los de LibreTickets se sirven desde `LIBRETICKETS_BASE_URL` cuando el SSR de allá los necesita.
