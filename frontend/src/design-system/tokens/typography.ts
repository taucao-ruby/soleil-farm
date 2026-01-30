/**
 * Soleil Farm Design System - Typography Tokens
 * =============================================
 * Hệ thống typography tối ưu cho tiếng Việt
 * với các dấu và ký tự đặc biệt
 */

// ===== FONT FAMILIES =====
export const fontFamily = {
  // Primary font - Sans serif for UI
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
  ] as const,

  // Monospace - Code and technical data
  mono: [
    'JetBrains Mono',
    'Fira Code',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace',
  ] as const,

  // Display - Headings (optional)
  display: [
    'Inter',
    'system-ui',
    'sans-serif',
  ] as const,
} as const;

// ===== FONT SIZES =====
export const fontSize = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
} as const;

// ===== LINE HEIGHTS =====
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// ===== FONT WEIGHTS =====
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// ===== LETTER SPACING =====
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// ===== TEXT STYLES (Composite) =====
export const textStyles = {
  // Display - Hero sections
  'display-2xl': {
    fontSize: fontSize['7xl'],
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  'display-xl': {
    fontSize: fontSize['6xl'],
    lineHeight: lineHeight.none,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  'display-lg': {
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tight,
  },
  'display-md': {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },
  'display-sm': {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
  },

  // Headings
  'heading-xl': {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
  },
  'heading-lg': {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.snug,
    fontWeight: fontWeight.semibold,
  },
  'heading-md': {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
  },
  'heading-sm': {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
  },
  'heading-xs': {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.semibold,
  },

  // Body text
  'body-xl': {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
  },
  'body-lg': {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
  },
  'body-md': {
    fontSize: fontSize.base,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
  },
  'body-sm': {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
  },
  'body-xs': {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
  },

  // Labels and captions
  'label-lg': {
    fontSize: fontSize.base,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.medium,
  },
  'label-md': {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.medium,
  },
  'label-sm': {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.tight,
    fontWeight: fontWeight.medium,
  },

  // Caption and helper text
  'caption': {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.normal,
    fontWeight: fontWeight.normal,
  },

  // Code
  'code-lg': {
    fontSize: fontSize.base,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.mono,
  },
  'code-md': {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.mono,
  },
  'code-sm': {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.relaxed,
    fontWeight: fontWeight.normal,
    fontFamily: fontFamily.mono,
  },
} as const;

// ===== VIETNAMESE TYPOGRAPHY HELPERS =====
export const vietnameseTypography = {
  // Recommended settings for Vietnamese text
  fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"', // OpenType features
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
} as const;

export const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  textStyles,
  vietnameseTypography,
} as const;

export default typography;
