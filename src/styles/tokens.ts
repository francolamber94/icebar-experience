// Brand tokens derived from the ICE BAR identity kit.
// Single source of truth — components import from here, never hardcoded.

export const colors = {
  // Backgrounds
  bg: '#020617', // slate-950 — primary
  bgAlt: '#0B1221', // slightly lighter slate — alternating sections
  bgElev: '#0F172A', // slate-900 — elevated surfaces
  surface: 'rgba(255, 255, 255, 0.04)', // glass-like cards
  surfaceHover: 'rgba(125, 211, 252, 0.08)',
  border: 'rgba(125, 211, 252, 0.18)',
  borderStrong: 'rgba(125, 211, 252, 0.35)',

  // Brand — ice cyan
  primary: '#38BDF8', // sky-400
  primaryDark: '#0EA5E9', // sky-500 hover
  primaryLight: '#7DD3FC', // sky-300 accent
  accent: '#A5F3FC', // cyan-200 frost glow
  brandDeep: '#008CBC', // exact blue from the ICE BAR logo

  // Text
  text: '#F8FAFC',
  textMuted: 'rgba(248, 250, 252, 0.72)',
  textSubtle: 'rgba(248, 250, 252, 0.55)',
  textOnPrimary: '#020617',

  // Status
  success: '#10B981',
  warn: '#F59E0B',
  star: '#FACC15',
  red: '#ED1D2F', // matches the red in the ICE BAR logo
};

export const fonts = {
  display: '"Fact", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  body: '"Noka", system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
  decorative: '"CSAsthonDrawn", "Caveat", cursive',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  full: 999,
};

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
  xxxl: 96,
};

export const breakpoints = {
  mobile: 640,
  tablet: 900,
  desktop: 1200,
};

export const shadows = {
  card: '0 8px 32px rgba(0, 0, 0, 0.35)',
  glow: '0 0 40px rgba(56, 189, 248, 0.35)',
  glowSoft: '0 0 24px rgba(56, 189, 248, 0.18)',
};

export const transitions = {
  fast: '160ms ease',
  base: '240ms ease',
  slow: '420ms cubic-bezier(0.22, 1, 0.36, 1)',
};
