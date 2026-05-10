/**
 * The shape used by the landing for each experience card.
 * Source of truth lives in LibreTickets (`/api/public/tenant-events`); this
 * file only declares the type used by the page and downstream components.
 */
export interface Experience {
  /** Post id from LibreTickets, also the slug for analytics. */
  id: string;
  title: string;
  /** Plain-text short description shown on the card (clamped to a few lines). */
  description: string | null;
  /** Cover image URL — usually an absolute URL hosted by LibreTickets. */
  image: string | null;
  /** Cheapest ticket price in the company's currency. `null` if no tickets. */
  priceFrom: number | null;
  /** ISO 4217 currency code (BRL, ARS, USD, ...). */
  currency: string;
  /** Optional duration shown on the image overlay. */
  durationMin: number | null;
  /** Path to the post page (always `/post/<id>`, rewritten to LT). */
  href: string;
}

export interface PublicTenantResponse {
  company: {
    id: string;
    name: string;
    logo: string | null;
    primaryColor: string;
    companyTag: string | null;
    currency: string;
  };
  events: Experience[];
}
