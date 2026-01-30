/**
 * Hooks Index
 * ============
 * Central export point for all custom hooks.
 */

// Utility Hooks
export { useDisclosure } from './useDisclosure';
export { useMediaQuery, useBreakpoint, useIsMobile } from './useMediaQuery';

// Auth Hooks (useLogout is exported from api/use-auth.ts via export * from './api')
export { useAuth, useHasRole, useRequireAuth } from './useAuth';

// API/React Query Hooks
export * from './api';

// Re-export query client utilities
export {
  queryClient,
  queryKeys,
  STALE_TIME,
  CACHE_TIME,
  invalidateResource,
  prefetchQuery,
  setQueryData,
  getQueryData,
} from '@/lib/query-client';
