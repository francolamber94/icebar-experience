import type { Experience, PublicTenantResponse } from '@/data/experiences';

/**
 * Fetch the live list of experiences (Posts in LibreTickets) for the current tenant.
 *
 * Host resolution priority:
 *   1. `x-forwarded-host` header (Vercel sets this; needed because `host` becomes
 *      the Vercel preview URL otherwise).
 *   2. `host` header.
 *   3. `NEXT_PUBLIC_TENANT_HOST` env var (handy for local dev where the request
 *      arrives at `localhost:3002` but we want to resolve the real tenant).
 *
 * On any failure (network error, non-200, malformed JSON) we return an empty
 * payload so the page falls back to the "novas experiências em breve" state
 * instead of crashing the whole landing.
 */
export async function fetchTenantExperiences(headers: {
  host?: string;
  forwardedHost?: string;
}): Promise<{ experiences: Experience[]; currency: string }> {
  const ltBase = process.env.LIBRETICKETS_BASE_URL || 'https://app.libretickets.com';

  const hostHeader = headers.forwardedHost || headers.host || '';
  const overrideHost = process.env.NEXT_PUBLIC_TENANT_HOST || '';
  const host = (overrideHost || hostHeader).split(',')[0]?.trim().toLowerCase() ?? '';

  if (!host) {
    return { experiences: [], currency: 'BRL' };
  }

  const url = `${ltBase}/api/public/tenant-events?host=${encodeURIComponent(host)}`;

  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(`[landing] tenant-events fetch failed: ${res.status} ${res.statusText} (${url})`);
      }
      return { experiences: [], currency: 'BRL' };
    }
    const json = (await res.json()) as PublicTenantResponse;
    const events = Array.isArray(json.events) ? json.events : [];
    return {
      experiences: events,
      currency: json.company?.currency ?? 'BRL',
    };
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[landing] tenant-events fetch error', err);
    }
    return { experiences: [], currency: 'BRL' };
  }
}

/** Pick the cheapest experience (lowest `priceFrom`). Returns null if none priced. */
export function pickCheapest(experiences: Experience[]): Experience | null {
  let cheapest: Experience | null = null;
  for (const e of experiences) {
    if (e.priceFrom == null) continue;
    if (!cheapest || cheapest.priceFrom == null || e.priceFrom < cheapest.priceFrom) {
      cheapest = e;
    }
  }
  return cheapest;
}
