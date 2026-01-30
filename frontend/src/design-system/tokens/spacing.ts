/**
 * Soleil Farm Design System - Spacing Tokens
 * ==========================================
 * Hệ thống khoảng cách dựa trên base unit 4px
 * Đảm bảo consistency và rhythm trong layout
 */

// ===== BASE SPACING SCALE =====
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// ===== SEMANTIC SPACING =====
export const semanticSpacing = {
  // Component internal spacing
  'component-xs': spacing[1],    // 4px - Tight spacing
  'component-sm': spacing[2],    // 8px - Small elements
  'component-md': spacing[3],    // 12px - Default
  'component-lg': spacing[4],    // 16px - Larger elements
  'component-xl': spacing[6],    // 24px - Spacious

  // Section spacing
  'section-sm': spacing[6],      // 24px
  'section-md': spacing[8],      // 32px
  'section-lg': spacing[12],     // 48px
  'section-xl': spacing[16],     // 64px

  // Page spacing
  'page-padding-mobile': spacing[4],   // 16px
  'page-padding-tablet': spacing[6],   // 24px
  'page-padding-desktop': spacing[8],  // 32px

  // Card padding
  'card-padding-sm': spacing[3],  // 12px
  'card-padding-md': spacing[4],  // 16px
  'card-padding-lg': spacing[6],  // 24px

  // Form spacing
  'form-gap': spacing[4],         // 16px - Between form fields
  'form-group-gap': spacing[6],   // 24px - Between form groups
  'input-padding-x': spacing[3],  // 12px
  'input-padding-y': spacing[2],  // 8px

  // Button spacing
  'button-padding-x-sm': spacing[3],  // 12px
  'button-padding-y-sm': spacing[1.5], // 6px
  'button-padding-x-md': spacing[4],  // 16px
  'button-padding-y-md': spacing[2],  // 8px
  'button-padding-x-lg': spacing[6],  // 24px
  'button-padding-y-lg': spacing[3],  // 12px

  // Table spacing
  'table-cell-padding-x': spacing[4], // 16px
  'table-cell-padding-y': spacing[3], // 12px

  // List spacing
  'list-item-gap': spacing[2],    // 8px
  'list-group-gap': spacing[4],   // 16px
} as const;

// ===== GAP UTILITIES =====
export const gap = {
  none: spacing[0],
  xs: spacing[1],     // 4px
  sm: spacing[2],     // 8px
  md: spacing[4],     // 16px
  lg: spacing[6],     // 24px
  xl: spacing[8],     // 32px
  '2xl': spacing[12], // 48px
} as const;

// ===== INSET (Padding) UTILITIES =====
export const inset = {
  none: spacing[0],
  xs: spacing[1],     // 4px
  sm: spacing[2],     // 8px
  md: spacing[4],     // 16px
  lg: spacing[6],     // 24px
  xl: spacing[8],     // 32px
} as const;

// ===== STACK (Vertical) UTILITIES =====
export const stack = {
  none: spacing[0],
  xs: spacing[1],     // 4px
  sm: spacing[2],     // 8px
  md: spacing[4],     // 16px
  lg: spacing[6],     // 24px
  xl: spacing[8],     // 32px
} as const;

// ===== INLINE (Horizontal) UTILITIES =====
export const inline = {
  none: spacing[0],
  xs: spacing[1],     // 4px
  sm: spacing[2],     // 8px
  md: spacing[3],     // 12px
  lg: spacing[4],     // 16px
  xl: spacing[6],     // 24px
} as const;

export default spacing;
