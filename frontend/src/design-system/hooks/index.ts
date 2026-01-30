/**
 * Soleil Farm Design System - Hooks Index
 * =======================================
 * Export all accessibility and utility hooks
 */

// ===== HOTKEYS =====
export {
  useHotkeys,
  getHotkeyDisplay,
  HotkeyIndicator,
} from './useHotkeys';

// ===== FOCUS TRAP =====
export {
  useFocusTrap,
  FocusLock,
} from './useFocusTrap';

// ===== MEDIA QUERY =====
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsLargeDesktop,
  usePrefersReducedMotion,
  usePrefersDarkMode,
  usePrefersLightMode,
  useBreakpoint,
  useBreakpointValue,
} from './useMediaQuery';

// ===== ANNOUNCEMENTS =====
export {
  useAnnounce,
  announce,
  LiveRegion,
  VisuallyHidden,
  SkipLink,
} from './useAnnounce';
