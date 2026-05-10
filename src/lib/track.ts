// Safe analytics helper: emits to gtag/plausible if loaded, otherwise no-op.
// Centralizes event names so we can grep them for QA.

type EventName =
  | 'hero_cta_click'
  | 'hero_secondary_click'
  | 'sticky_cta_click'
  | 'sticky_whatsapp_click'
  | 'experience_card_click'
  | 'final_cta_click'
  | 'lang_switch'
  | 'faq_open'
  | 'gallery_view'
  | 'gallery_open'
  | 'header_cta_click'
  | 'whatsapp_fab_click'
  | 'about_cta_click';

interface AnalyticsWindow extends Window {
  gtag?: (cmd: 'event', name: string, props?: Record<string, unknown>) => void;
  plausible?: (name: string, opts?: { props?: Record<string, unknown> }) => void;
}

export function track(event: EventName, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as AnalyticsWindow;
  try {
    w.gtag?.('event', event, props);
    w.plausible?.(event, props ? { props } : undefined);
  } catch {
    // never throw from analytics
  }
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[track]', event, props ?? '');
  }
}

const LOCALE_BY_LANG = { pt: 'pt-BR', es: 'es-AR', en: 'en-US' } as const;

/**
 * Format a price using the user's display locale and the company's currency.
 * Currency comes from LibreTickets (BRL for Brazil tenants, ARS for Argentina, etc).
 */
export function formatPrice(
  value: number,
  currency: string,
  lang: 'pt' | 'es' | 'en' = 'pt',
): string {
  return new Intl.NumberFormat(LOCALE_BY_LANG[lang] ?? 'pt-BR', {
    style: 'currency',
    currency: currency || 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

/** @deprecated Use `formatPrice(value, currency, lang)` so we honour per-tenant currency. */
export function formatBRL(value: number, lang: 'pt' | 'es' | 'en' = 'pt'): string {
  return formatPrice(value, 'BRL', lang);
}
