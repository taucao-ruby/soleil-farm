/**
 * Soleil Farm Design System - Shadow Tokens
 * =========================================
 * Hệ thống bóng đổ để tạo chiều sâu và hierarchy
 */

// ===== BOX SHADOWS =====
export const boxShadow = {
  // No shadow
  none: 'none',

  // Subtle shadows - for hover states, subtle elevation
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Small shadows - for buttons, small cards
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',

  // Default shadows - for cards, dropdowns
  DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',

  // Medium-large shadows - for modals, popovers
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',

  // Large shadows - for important overlays
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',

  // Extra large shadows - for prominent elements
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Inner shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  'inner-lg': 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
} as const;

// ===== SEMANTIC SHADOWS =====
export const semanticShadow = {
  // Card shadows
  card: {
    rest: boxShadow.sm,
    hover: boxShadow.md,
    active: boxShadow.lg,
  },

  // Button shadows
  button: {
    rest: boxShadow.sm,
    hover: boxShadow.md,
    active: boxShadow.xs,
  },

  // Dropdown/Popover shadows
  dropdown: boxShadow.lg,
  popover: boxShadow.lg,

  // Modal shadows
  modal: boxShadow.xl,
  dialog: boxShadow.xl,

  // Toast/Notification shadows
  toast: boxShadow.lg,
  notification: boxShadow.lg,

  // Input focus shadow
  inputFocus: '0 0 0 3px rgba(16, 185, 129, 0.2)', // Primary color with opacity
  inputError: '0 0 0 3px rgba(239, 68, 68, 0.2)', // Error color with opacity

  // Navigation shadows
  navbar: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  sidebar: '2px 0 8px -2px rgba(0, 0, 0, 0.1)',
} as const;

// ===== COLORED SHADOWS (Glow effect) =====
export const coloredShadow = {
  primary: {
    sm: '0 2px 8px -2px rgba(16, 185, 129, 0.3)',
    md: '0 4px 14px -3px rgba(16, 185, 129, 0.4)',
    lg: '0 8px 20px -4px rgba(16, 185, 129, 0.5)',
  },
  warning: {
    sm: '0 2px 8px -2px rgba(245, 158, 11, 0.3)',
    md: '0 4px 14px -3px rgba(245, 158, 11, 0.4)',
    lg: '0 8px 20px -4px rgba(245, 158, 11, 0.5)',
  },
  error: {
    sm: '0 2px 8px -2px rgba(239, 68, 68, 0.3)',
    md: '0 4px 14px -3px rgba(239, 68, 68, 0.4)',
    lg: '0 8px 20px -4px rgba(239, 68, 68, 0.5)',
  },
  info: {
    sm: '0 2px 8px -2px rgba(59, 130, 246, 0.3)',
    md: '0 4px 14px -3px rgba(59, 130, 246, 0.4)',
    lg: '0 8px 20px -4px rgba(59, 130, 246, 0.5)',
  },
} as const;

// ===== DARK MODE SHADOWS =====
export const darkModeShadow = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
} as const;

// ===== SHADOW UTILITIES =====

/**
 * Generate ring shadow (focus state)
 */
export function createRingShadow(
  color: string,
  width: number = 3,
  opacity: number = 0.2
): string {
  // Parse hex color
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `0 0 0 ${width}px rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Combine multiple shadows
 */
export function combineShadows(...shadows: string[]): string {
  return shadows.filter(Boolean).join(', ');
}

export const shadows = {
  boxShadow,
  semantic: semanticShadow,
  colored: coloredShadow,
  darkMode: darkModeShadow,
  createRingShadow,
  combineShadows,
} as const;

export default shadows;
