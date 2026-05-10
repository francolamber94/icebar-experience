/**
 * Shared header constants. Single source of truth for the landing's Header
 * appearance + nav structure. Both `Header.tsx` (client renderer) and
 * `pages/api/header-config.ts` (cross-origin contract for LibreTickets) import
 * from here, so any change here propagates to LT's post page automatically
 * after the LRU cache (60s) expires.
 *
 * Keep this file dependency-free (no React, no JSON imports) so it can run in
 * both client and serverless contexts without bundling overhead.
 */

import type { Lang } from '@/i18n/LangProvider';

/** Anchor IDs on the landing that we surface in the top nav. */
export const HEADER_NAV_IDS = ['experiencias', 'sobre', 'galeria', 'faq'] as const;
export type HeaderNavId = (typeof HEADER_NAV_IDS)[number];

/** Where the top-bar "Reservar" CTA scrolls to. */
export const HEADER_CTA_ANCHOR = '#experiencias';

/** Visual constants. Mirror the dark navy + cyan palette of the landing. */
export const HEADER_BRAND = {
  /** Public path under the landing's origin. The /api/header-config endpoint
   *  rewrites this to absolute so cross-origin consumers (LT) can render it. */
  logoUrl: '/brand/logo-horizontal-white.svg',
  /** Render height in px. Width is auto. */
  logoHeight: 36,
  /** Fixed header height in px (matches `--header-h` CSS var). */
  headerHeight: 72,
  /** Inner container max width in px (matches `--container` CSS var).
   *  LT uses this to align its header content with the landing pixel-by-pixel. */
  containerMaxWidth: 1200,
  /** Horizontal padding for the inner container. CSS clamp() to match the
   *  landing's `.container` rule (`padding-inline: clamp(1rem, 4vw, 2rem)`). */
  containerPaddingInline: 'clamp(1rem, 4vw, 2rem)',
  /** Page background under the header (used by LT to alpha-blend with blur). */
  bgColor: '#020617',
  /** Subtle bottom border (sky-400 tinted, matches `--primary`). */
  borderColor: 'rgba(56, 189, 248, 0.25)',
  /** Default text colour for nav items + brand name. */
  textColor: '#ffffff',
  /** Muted text for inactive nav items. Mirrors `--text-muted`. */
  textMuted: 'rgba(248, 250, 252, 0.72)',
  /** Brand primary colour. Matches the landing's `--primary` (sky-400) so the
   *  CTA button renders identical in both apps. */
  primaryColor: '#38bdf8',
} as const;

/** Per-language metadata for the LangSwitcher. */
export const LANG_META: Record<Lang, { flag: string; short: string; label: string }> = {
  pt: { flag: '🇧🇷', short: 'PT', label: 'Português' },
  es: { flag: '🇦🇷', short: 'ES', label: 'Español' },
  en: { flag: '🇺🇸', short: 'EN', label: 'English' },
};
