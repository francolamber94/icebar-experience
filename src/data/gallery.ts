import type { Lang } from '@/i18n/LangProvider';

export interface GalleryItem {
  src: string;
  /** alt text per language, important for SEO + a11y */
  alt: Record<Lang, string>;
  /** When true, this item spans 2 cols on desktop (used in the masonry grid) */
  wide?: boolean;
  /** When true, this item spans 2 rows on desktop */
  tall?: boolean;
}

export const GALLERY: GalleryItem[] = [
  {
    src: '/photos/gallery-1.jpg',
    alt: {
      pt: 'Caipirinha em copo de gelo',
      es: 'Caipirinha en vaso de hielo',
      en: 'Caipirinha served in a hand-carved ice glass',
    },
    tall: true,
  },
  {
    src: '/photos/gallery-2.jpg',
    alt: {
      pt: 'Casal beijando em frente ao painel ICE BAR',
      es: 'Pareja besándose frente al cartel ICE BAR',
      en: 'Couple kissing in front of the ICE BAR sign',
    },
  },
  {
    src: '/photos/gallery-3.jpg',
    alt: {
      pt: 'Trio de amigos no trono de gelo',
      es: 'Trío de amigos en el trono de hielo',
      en: 'Three friends posing on the ice throne',
    },
    wide: true,
  },
  {
    src: '/photos/gallery-4.jpg',
    alt: {
      pt: 'Bartender preparando drink',
      es: 'Bartender preparando un trago',
      en: 'Bartender mixing a cocktail',
    },
  },
  {
    src: '/photos/gallery-5.jpg',
    alt: {
      pt: 'Banco de gelo coberto de pele branca com duas caipirinhas',
      es: 'Banco de hielo cubierto de piel blanca con dos caipirinhas',
      en: 'Ice bench draped in white fur with two caipirinhas',
    },
  },
  {
    src: '/photos/gallery-6.jpg',
    alt: {
      pt: 'Grupo brindando com copos de gelo',
      es: 'Grupo brindando con vasos de hielo',
      en: 'Group toasting with ice glasses',
    },
    wide: true,
  },
  {
    src: '/photos/gallery-7.jpg',
    alt: {
      pt: 'Selfie com fundo iluminado em azul',
      es: 'Selfie con fondo iluminado en azul',
      en: 'Selfie against a blue-lit ice wall',
    },
  },
  {
    src: '/photos/gallery-8.jpg',
    alt: {
      pt: 'Família com criança encantada',
      es: 'Familia con un niño asombrado',
      en: 'Family with a wide-eyed child',
    },
  },
  {
    src: '/photos/gallery-9.jpg',
    alt: {
      pt: 'Parede de gelo esculpida com motivos brasileiros iluminada em ciano',
      es: 'Pared de hielo esculpida con motivos brasileños iluminada en cian',
      en: 'Carved ice wall with Brazilian motifs lit in cyan',
    },
  },
];
