/**
 * Soleil Farm Design System - Token Index
 * =======================================
 * Central export point for all design tokens
 */

// ===== COLOR TOKENS =====
export {
  colors,
  primary,
  earth,
  soil,
  water,
  sun,
  neutral,
  status,
  semantic,
  chart,
  getStatusColor,
  getStatusColorWithOpacity,
} from './colors';

// ===== SPACING TOKENS =====
export {
  default as spacing,
  semanticSpacing,
  gap,
  inset,
  stack,
  inline,
} from './spacing';

// ===== TYPOGRAPHY TOKENS =====
export {
  typography,
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  textStyles,
  vietnameseTypography,
} from './typography';

// ===== ANIMATION TOKENS =====
export {
  default as animationTokens,
  duration,
  easing,
  transitions,
  animations,
  fadeVariants,
  fadeInAnimation,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  scaleVariants,
  scaleInAnimation,
  staggerContainerVariants,
  staggerItemVariants,
  modalOverlayVariants,
  modalContentVariants,
  dropdownVariants,
  toastVariants,
  sidebarVariants,
  cardHoverVariants,
  buttonTapVariants,
  listItemVariants,
  pageVariants,
  skeletonVariants,
  pulseVariants,
  cssKeyframes,
} from './animations';

// ===== SHADOW TOKENS =====
export {
  shadows,
  boxShadow,
  semanticShadow,
  coloredShadow,
  darkModeShadow,
  createRingShadow,
  combineShadows,
} from './shadows';

// ===== BORDER TOKENS =====
export {
  borders,
  borderRadius,
  semanticRadius,
  borderWidth,
  borderStyle,
  borderColor,
  divider,
  outline,
  createBorder,
  roundedSide,
} from './borders';

// ===== BREAKPOINT TOKENS =====
export {
  default as breakpointTokens,
  breakpoints,
  containerMaxWidth,
  mediaQuery,
  zIndex,
  layout,
  aspectRatio,
  isBreakpoint,
  getCurrentBreakpoint,
} from './breakpoints';

// ===== COMBINED TOKENS OBJECT =====
import { colors } from './colors';
import spacing from './spacing';
import { typography } from './typography';
import animationTokens from './animations';
import { shadows } from './shadows';
import { borders } from './borders';
import breakpointTokens from './breakpoints';

export const tokens = {
  colors,
  spacing,
  typography,
  animations: animationTokens,
  shadows,
  borders,
  breakpoints: breakpointTokens,
} as const;

export default tokens;
