import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import pt from './pt.json';
import es from './es.json';
import en from './en.json';

export type Lang = 'pt' | 'es' | 'en';

export const SUPPORTED_LANGS: readonly Lang[] = ['pt', 'es', 'en'] as const;

const DICTS: Record<Lang, Record<string, unknown>> = { pt, es, en };
export const COOKIE_NAME = 'icebar_lang';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  raw: <T = unknown>(key: string) => T;
}

const LangContext = createContext<LangContextValue | null>(null);

function readKey(dict: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object' && k in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, dict);
}

function isLang(v: string | undefined | null): v is Lang {
  return v === 'pt' || v === 'es' || v === 'en';
}

/**
 * Map a BCP-47 language tag (e.g. "en-US", "es-AR") to one of our supported langs.
 * Anything we don't recognise falls back to undefined so callers can chain.
 */
function langFromTag(tag: string | undefined): Lang | undefined {
  if (!tag) return undefined;
  const code = tag.toLowerCase().split(/[-_]/)[0];
  if (code === 'pt') return 'pt';
  if (code === 'es') return 'es';
  if (code === 'en') return 'en';
  return undefined;
}

/** Country codes that we treat as Spanish-speaking by default. */
const ES_COUNTRIES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GT',
  'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE',
]);
/** Country codes that we treat as English-speaking by default. */
const EN_COUNTRIES = new Set([
  'US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA',
]);

export function LangProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // On mount, sync with browser preference if no cookie was set yet.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const has = document.cookie.split('; ').some(c => c.startsWith(`${COOKIE_NAME}=`));
    if (has) return;
    // Try every browser preference in order. First match wins.
    const langs = (navigator.languages && navigator.languages.length > 0)
      ? navigator.languages
      : [navigator.language || ''];
    let detected: Lang | undefined;
    for (const tag of langs) {
      const m = langFromTag(tag);
      if (m) { detected = m; break; }
    }
    if (!detected) detected = 'pt';
    if (detected !== lang) {
      setLangState(detected);
    }
    document.cookie = `${COOKIE_NAME}=${detected}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    document.documentElement.lang = htmlLangFor(detected);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== 'undefined') {
      document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
      document.documentElement.lang = htmlLangFor(l);
    }
  }, []);

  const value = useMemo<LangContextValue>(() => {
    const dict = DICTS[lang];
    const t = (key: string) => {
      const v = readKey(dict, key);
      if (typeof v === 'string') return v;
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV !== 'production') console.warn(`[i18n] missing key: ${key} (${lang})`);
      return key;
    };
    const raw = <T = unknown,>(key: string) => readKey(dict, key) as T;
    return { lang, setLang, t, raw };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useT() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useT must be used inside <LangProvider>');
  return ctx;
}

/**
 * Resolve the initial language for a request, in priority order:
 *   1. `icebar_lang` cookie (explicit user choice)
 *   2. Vercel geo header (`x-vercel-ip-country`) — helpful when Accept-Language is generic
 *   3. `Accept-Language` header
 *   4. Default to `pt` (Brazil)
 */
export function detectLangFromRequest(headers?: Record<string, string | string[] | undefined>): Lang {
  if (!headers) return 'pt';
  const cookieHeader = pickHeader(headers, 'cookie');
  const cookieLang = readCookieLang(cookieHeader);
  if (cookieLang) return cookieLang;

  const country = pickHeader(headers, 'x-vercel-ip-country')?.toUpperCase();
  if (country === 'BR') return 'pt';
  if (country && EN_COUNTRIES.has(country)) return 'en';
  if (country && ES_COUNTRIES.has(country)) return 'es';

  const accept = pickHeader(headers, 'accept-language');
  const fromAccept = parseAcceptLanguage(accept);
  if (fromAccept) return fromAccept;

  return 'pt';
}

function pickHeader(headers: Record<string, string | string[] | undefined>, name: string): string | undefined {
  const v = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(v)) return v[0];
  return v;
}

function readCookieLang(cookieHeader?: string): Lang | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split(';').find(p => p.trim().startsWith(`${COOKIE_NAME}=`));
  if (!match) return undefined;
  const v = match.split('=')[1]?.trim().toLowerCase();
  return isLang(v) ? v : undefined;
}

function parseAcceptLanguage(header?: string): Lang | undefined {
  if (!header) return undefined;
  // Example: "es-AR,es;q=0.9,en;q=0.7,pt;q=0.6"
  const items = header.split(',').map(p => {
    const [tag, ...rest] = p.trim().split(';');
    const qPart = rest.find(r => r.trim().startsWith('q='));
    const q = qPart ? parseFloat(qPart.trim().slice(2)) : 1;
    return { tag, q: Number.isFinite(q) ? q : 1 };
  });
  items.sort((a, b) => b.q - a.q);
  for (const { tag } of items) {
    const m = langFromTag(tag);
    if (m) return m;
  }
  return undefined;
}

function htmlLangFor(l: Lang): string {
  if (l === 'pt') return 'pt-BR';
  if (l === 'es') return 'es';
  return 'en';
}

/** @deprecated keep for any old call sites; prefer detectLangFromRequest */
export function readLangFromCookieHeader(cookieHeader?: string): Lang {
  return readCookieLang(cookieHeader) ?? 'pt';
}
