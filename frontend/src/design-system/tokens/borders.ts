/**
 * Soleil Farm Design System - Border Tokens
 * =========================================
 * Hệ thống border và radius
 */

// ===== BORDER RADIUS =====
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Pills, circles
} as const;

// ===== SEMANTIC BORDER RADIUS =====
export const semanticRadius = {
  // Components
  button: borderRadius.lg,
  'button-sm': borderRadius.md,
  'button-lg': borderRadius.xl,

  input: borderRadius.lg,
  select: borderRadius.lg,
  textarea: borderRadius.lg,

  card: borderRadius.xl,
  'card-sm': borderRadius.lg,
  'card-lg': borderRadius['2xl'],

  modal: borderRadius['2xl'],
  dialog: borderRadius['2xl'],

  dropdown: borderRadius.lg,
  popover: borderRadius.lg,
  tooltip: borderRadius.md,

  badge: borderRadius.full,
  tag: borderRadius.md,
  chip: borderRadius.full,

  avatar: borderRadius.full,
  'avatar-square': borderRadius.lg,

  toast: borderRadius.lg,
  alert: borderRadius.lg,

  // Specific elements
  'status-dot': borderRadius.full,
  progress: borderRadius.full,
  toggle: borderRadius.full,
  checkbox: borderRadius.md,
  radio: borderRadius.full,
} as const;

// ===== BORDER WIDTH =====
export const borderWidth = {
  0: '0px',
  DEFAULT: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

// ===== BORDER STYLES =====
export const borderStyle = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  hidden: 'hidden',
  none: 'none',
} as const;

// ===== BORDER COLORS (Using CSS variables for theme support) =====
export const borderColor = {
  // Default borders
  DEFAULT: 'hsl(var(--border))',
  muted: 'hsl(var(--border))',

  // Input borders
  input: 'hsl(var(--input))',
  'input-focus': 'hsl(var(--ring))',

  // Status borders
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Transparent
  transparent: 'transparent',
} as const;

// ===== DIVIDER STYLES =====
export const divider = {
  horizontal: {
    width: '100%',
    height: '1px',
    backgroundColor: 'hsl(var(--border))',
  },
  vertical: {
    width: '1px',
    height: '100%',
    backgroundColor: 'hsl(var(--border))',
  },
} as const;

// ===== OUTLINE STYLES (Focus states) =====
export const outline = {
  // Default focus outline
  focus: {
    outline: 'none',
    boxShadow: '0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--ring))',
  },

  // Primary focus
  'focus-primary': {
    outline: 'none',
    boxShadow: '0 0 0 2px hsl(var(--background)), 0 0 0 4px #10b981',
  },

  // Error focus
  'focus-error': {
    outline: 'none',
    boxShadow: '0 0 0 2px hsl(var(--background)), 0 0 0 4px #ef4444',
  },

  // Visible focus (for high contrast)
  'focus-visible': {
    outline: '2px solid #10b981',
    outlineOffset: '2px',
  },
} as const;

// ===== BORDER UTILITIES =====

/**
 * Create a border string
 */
export function createBorder(
  width: keyof typeof borderWidth = 'DEFAULT',
  style: keyof typeof borderStyle = 'solid',
  color: string = borderColor.DEFAULT
): string {
  return `${borderWidth[width]} ${borderStyle[style]} ${color}`;
}

/**
 * Create rounded corners for specific sides
 */
export const roundedSide = {
  top: (radius: keyof typeof borderRadius) => ({
    borderTopLeftRadius: borderRadius[radius],
    borderTopRightRadius: borderRadius[radius],
  }),
  right: (radius: keyof typeof borderRadius) => ({
    borderTopRightRadius: borderRadius[radius],
    borderBottomRightRadius: borderRadius[radius],
  }),
  bottom: (radius: keyof typeof borderRadius) => ({
    borderBottomLeftRadius: borderRadius[radius],
    borderBottomRightRadius: borderRadius[radius],
  }),
  left: (radius: keyof typeof borderRadius) => ({
    borderTopLeftRadius: borderRadius[radius],
    borderBottomLeftRadius: borderRadius[radius],
  }),
} as const;

export const borders = {
  borderRadius,
  semanticRadius,
  borderWidth,
  borderStyle,
  borderColor,
  divider,
  outline,
  createBorder,
  roundedSide,
} as const;

export default borders;
