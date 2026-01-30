/**
 * Soleil Farm Design System - Breakpoint Tokens
 * =============================================
 * Responsive breakpoints for mobile-first design
 */

// ===== BREAKPOINTS (Mobile-first) =====
export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones, small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops, small desktops
  xl: '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
} as const;

// ===== CONTAINER MAX WIDTHS =====
export const containerMaxWidth = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px', // Slightly smaller for readability
} as const;

// ===== MEDIA QUERY HELPERS =====
export const mediaQuery = {
  // Min-width (mobile-first)
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,

  // Max-width (desktop-first, use sparingly)
  maxSm: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  maxMd: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  maxLg: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  maxXl: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,

  // Range queries
  smToMd: `@media (min-width: ${breakpoints.sm}) and (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  mdToLg: `@media (min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  lgToXl: `@media (min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl) - 1}px)`,

  // Feature queries
  hover: '@media (hover: hover) and (pointer: fine)',
  touch: '@media (hover: none) and (pointer: coarse)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)',
  print: '@media print',
} as const;

// ===== Z-INDEX SCALE =====
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ===== LAYOUT UTILITIES =====
export const layout = {
  // Sidebar widths
  sidebar: {
    collapsed: '4rem',    // 64px - Icon only
    compact: '12rem',     // 192px
    normal: '16rem',      // 256px
    wide: '20rem',        // 320px
  },

  // Header heights
  header: {
    mobile: '3.5rem',     // 56px
    desktop: '4rem',      // 64px
  },

  // Content widths
  content: {
    narrow: '42rem',      // 672px - For reading
    normal: '56rem',      // 896px
    wide: '72rem',        // 1152px
    full: '100%',
  },

  // Modal widths
  modal: {
    sm: '24rem',          // 384px
    md: '28rem',          // 448px
    lg: '32rem',          // 512px
    xl: '36rem',          // 576px
    '2xl': '42rem',       // 672px
    full: '100%',
  },

  // Drawer widths
  drawer: {
    sm: '20rem',          // 320px
    md: '24rem',          // 384px
    lg: '28rem',          // 448px
    full: '100%',
  },
} as const;

// ===== ASPECT RATIOS =====
export const aspectRatio = {
  auto: 'auto',
  square: '1 / 1',
  video: '16 / 9',
  photo: '4 / 3',
  portrait: '3 / 4',
  wide: '21 / 9',
} as const;

// ===== BREAKPOINT UTILITIES =====

/**
 * Check if a breakpoint is active (client-side only)
 */
export function isBreakpoint(bp: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(min-width: ${breakpoints[bp]})`).matches;
}

/**
 * Get current breakpoint name
 */
export function getCurrentBreakpoint(): keyof typeof breakpoints {
  if (typeof window === 'undefined') return 'xs';

  const width = window.innerWidth;
  if (width >= parseInt(breakpoints['2xl'])) return '2xl';
  if (width >= parseInt(breakpoints.xl)) return 'xl';
  if (width >= parseInt(breakpoints.lg)) return 'lg';
  if (width >= parseInt(breakpoints.md)) return 'md';
  if (width >= parseInt(breakpoints.sm)) return 'sm';
  return 'xs';
}

export default {
  breakpoints,
  containerMaxWidth,
  mediaQuery,
  zIndex,
  layout,
  aspectRatio,
  isBreakpoint,
  getCurrentBreakpoint,
};
