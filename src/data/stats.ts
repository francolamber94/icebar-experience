import type { Lang } from '@/i18n/LangProvider';

export interface Stat {
  value: string;
  label: Record<Lang, string>;
}

export const STATS: Stat[] = [
  {
    value: '−10°C',
    label: {
      pt: 'Temperatura constante',
      es: 'Temperatura constante',
      en: 'Constant temperature',
    },
  },
  {
    value: '200m²',
    label: {
      pt: 'De gelo natural',
      es: 'De hielo natural',
      en: 'Of natural ice',
    },
  },
  {
    value: '40 ton',
    label: {
      pt: 'Esculpidas à mão',
      es: 'Esculpidas a mano',
      en: 'Hand-sculpted',
    },
  },
  {
    value: '+10.000',
    label: {
      pt: 'Visitantes felizes',
      es: 'Visitantes felices',
      en: 'Happy guests',
    },
  },
];
