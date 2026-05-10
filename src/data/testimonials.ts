import type { Lang } from '@/i18n/LangProvider';

export interface Testimonial {
  name: string;
  city: string;
  date: string;
  rating: 5;
  /** Initials shown in the avatar circle (we don't ship UGC photos to keep it real & legal). */
  initials: string;
  text: Record<Lang, string>;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Carolina S.',
    city: 'São Paulo, SP',
    date: '2026-04',
    rating: 5,
    initials: 'CS',
    text: {
      pt: 'Foi a coisa mais legal que eu já fiz no Brasil. Os copos de gelo, as paredes esculpidas, a iluminação azul, tudo. Vale cada centavo. Já comprei pra levar a minha irmã quando ela vier visitar.',
      es: 'Fue lo más copado que hice en Brasil. Los vasos de hielo, las paredes esculpidas, la iluminación azul, todo. Vale cada centavo. Ya compré para llevar a mi hermana cuando venga a visitarme.',
      en: 'Easily the coolest thing I\'ve done in Brazil. The ice glasses, the carved walls, the blue lighting — all of it. Worth every penny. Already booked tickets to bring my sister when she visits.',
    },
  },
  {
    name: 'Rodrigo M.',
    city: 'Curitiba, PR',
    date: '2026-03',
    rating: 5,
    initials: 'RM',
    text: {
      pt: 'Levei a família inteira, até o meu pai de 70 anos amou. As capas mantêm a gente bem aquecido e o staff é super atencioso. Recomendo demais, principalmente o combo família.',
      es: 'Llevé a toda la familia, hasta mi papá de 70 años lo amó. Las capas te mantienen bien abrigado y el equipo es súper atento. Lo recomiendo un montón, sobre todo el combo familia.',
      en: 'Took the whole family — even my 70-year-old dad loved it. The thermal capes keep you really warm and the staff is super attentive. Strongly recommend, especially the family combo.',
    },
  },
  {
    name: 'Mariana T.',
    city: 'Buenos Aires, AR',
    date: '2026-02',
    rating: 5,
    initials: 'MT',
    text: {
      pt: 'Fui no VIP e valeu cada real. A foto profissional ficou linda, parece de revista. O drink "Aurora" é incrível. Voltarei sempre que estiver em Foz!',
      es: 'Fui al VIP y valió cada peso. La foto profesional quedó hermosa, parece de revista. El trago "Aurora" es increíble. ¡Vuelvo cada vez que esté en Foz!',
      en: 'Went for the VIP and it was worth every cent. The pro photo turned out gorgeous — magazine-quality. The "Aurora" cocktail is incredible. I\'ll be back every time I\'m in Foz.',
    },
  },
  {
    name: 'Lucas P.',
    city: 'Belo Horizonte, MG',
    date: '2026-02',
    rating: 5,
    initials: 'LP',
    text: {
      pt: 'Cheguei achando que ia ser cafona, saí impressionado. As esculturas são reais, o frio é real e a caipirinha no copo de gelo é uma experiência única. Despedida de solteiro perfeita.',
      es: 'Llegué pensando que iba a ser kitsch, salí impresionado. Las esculturas son reales, el frío es real y la caipirinha en vaso de hielo es una experiencia única. Despedida de soltero perfecta.',
      en: 'Walked in expecting cheesy, walked out blown away. The sculptures are real, the cold is real, and a caipirinha in an ice glass is a one-of-a-kind experience. Perfect bachelor party stop.',
    },
  },
  {
    name: 'Beatriz F.',
    city: 'Rio de Janeiro, RJ',
    date: '2026-01',
    rating: 5,
    initials: 'BF',
    text: {
      pt: 'Reservei online em 2 minutos. Chegamos, vestimos as capas e em 5 minutos já estávamos no Ártico. As fotos no Instagram bombaram. Adorei a vibe.',
      es: 'Reservé online en 2 minutos. Llegamos, nos pusimos las capas y en 5 minutos ya estábamos en el Ártico. Las fotos en Instagram explotaron. Me encantó la vibe.',
      en: 'Booked online in 2 minutes. We arrived, suited up and were inside the Arctic 5 minutes later. The photos blew up on Instagram. Loved the vibe.',
    },
  },
  {
    name: 'Diego A.',
    city: 'Santiago, CL',
    date: '2025-12',
    rating: 5,
    initials: 'DA',
    text: {
      pt: 'Estava com baixas expectativas e me surpreendi. O ambiente é maior do que parece nas fotos, os bartenders são divertidos. 45 min passam voando. Top!',
      es: 'Estaba con bajas expectativas y me sorprendí. El ambiente es más grande de lo que parece en las fotos, los bartenders son divertidos. 45 min pasan volando. ¡Top!',
      en: 'Came in with low expectations and was completely surprised. The space is bigger than it looks in photos, the bartenders are fun. The 45 min fly by. Top notch.',
    },
  },
];
