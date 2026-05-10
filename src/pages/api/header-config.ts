import type { NextApiRequest, NextApiResponse } from 'next';

import { HEADER_BRAND, HEADER_CTA_ANCHOR, HEADER_NAV_IDS, LANG_META } from '@/components/headerConfig';
import { SUPPORTED_LANGS, type Lang } from '@/i18n/LangProvider';
import pt from '@/i18n/pt.json';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

const DICTS: Record<Lang, Record<string, unknown>> = { pt, es, en };

/**
 * Cross-origin contract: describes the landing's Header so other apps (e.g. the
 * LibreTickets post page rendered under the same custom domain) can render a
 * matching top bar without duplicating any branding/nav constants.
 *
 * Source of truth lives in `@/components/headerConfig` and the i18n dicts; this
 * endpoint just serialises them to absolute URLs and the requested language.
 *
 * Cache: 60s s-maxage so consumers can hit us aggressively without taxing the
 * lambda. Cleanly invalidated by re-deploying the landing.
 */
export interface HeaderConfigResponse {
  brand: {
    logoUrl: string;
    logoHeight: number;
    headerHeight: number;
    containerMaxWidth: number;
    containerPaddingInline: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    textMuted: string;
    primaryColor: string;
  };
  nav: { id: string; label: string; href: string }[];
  cta: { label: string; href: string };
  languages: { code: Lang; flag: string; short: string; label: string }[];
  currentLang: Lang;
  backLabel: string;
  backHref: string;
}

function pickLang(input: unknown): Lang {
  const v = typeof input === 'string' ? input.toLowerCase() : '';
  return (SUPPORTED_LANGS as readonly string[]).includes(v) ? (v as Lang) : 'pt';
}

function readKey(dict: Record<string, unknown>, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, k) => {
    if (acc && typeof acc === 'object' && k in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[k];
    }
    return undefined;
  }, dict);
  return typeof value === 'string' ? value : undefined;
}

function resolveOrigin(req: NextApiRequest): string {
  const proto = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'https';
  const fwdHost = req.headers['x-forwarded-host'] as string | undefined;
  const host = fwdHost || req.headers.host || 'localhost:3003';
  return `${proto}://${host}`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<HeaderConfigResponse>) {
  const lang = pickLang(req.query.lang);
  const dict = DICTS[lang];
  const origin = resolveOrigin(req);

  const config: HeaderConfigResponse = {
    brand: {
      logoUrl: `${origin}${HEADER_BRAND.logoUrl}`,
      logoHeight: HEADER_BRAND.logoHeight,
      headerHeight: HEADER_BRAND.headerHeight,
      containerMaxWidth: HEADER_BRAND.containerMaxWidth,
      containerPaddingInline: HEADER_BRAND.containerPaddingInline,
      bgColor: HEADER_BRAND.bgColor,
      borderColor: HEADER_BRAND.borderColor,
      textColor: HEADER_BRAND.textColor,
      textMuted: HEADER_BRAND.textMuted,
      primaryColor: HEADER_BRAND.primaryColor,
    },
    nav: HEADER_NAV_IDS.map(id => ({
      id,
      label: readKey(dict, `nav.${id}`) ?? id,
      href: `${origin}/#${id}`,
    })),
    cta: {
      label: readKey(dict, 'nav.reservar') ?? 'Reservar',
      href: `${origin}${HEADER_CTA_ANCHOR}`,
    },
    languages: SUPPORTED_LANGS.map(code => ({
      code,
      flag: LANG_META[code].flag,
      short: LANG_META[code].short,
      label: LANG_META[code].label,
    })),
    currentLang: lang,
    backLabel: readKey(dict, 'nav.voltar') ?? 'Voltar ao site',
    backHref: `${origin}/`,
  };

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.status(200).json(config);
}
