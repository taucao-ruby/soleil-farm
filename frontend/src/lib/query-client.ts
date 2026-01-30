import { QueryClient } from '@tanstack/react-query';

// ============================================================================
// CACHE TIME CONSTANTS
// ============================================================================

export const CACHE_TIME = {
  /** 5 minutes - for frequently changing data */
  SHORT: 1000 * 60 * 5,
  /** 15 minutes - default cache time */
  MEDIUM: 1000 * 60 * 15,
  /** 1 hour - for rarely changing data */
  LONG: 1000 * 60 * 60,
  /** 24 hours - for static data */
  STATIC: 1000 * 60 * 60 * 24,
} as const;

export const STALE_TIME = {
  /** 30 seconds - for real-time data */
  REALTIME: 1000 * 30,
  /** 2 minutes - for frequently changing data */
  SHORT: 1000 * 60 * 2,
  /** 5 minutes - default stale time */
  MEDIUM: 1000 * 60 * 5,
  /** 30 minutes - for rarely changing data */
  LONG: 1000 * 60 * 30,
  /** Never stale - for static data */
  NEVER: Infinity,
  /** 24 hours - for static data (same as CACHE_TIME.STATIC) */
  STATIC: 1000 * 60 * 60 * 24,
} as const;

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

/**
 * Query Keys Factory
 * ===================
 * Centralized query key management for consistent cache invalidation.
 * Uses array structure for hierarchical cache invalidation.
 *
 * @example
 * // Get all keys for land parcels
 * queryClient.invalidateQueries({ queryKey: queryKeys.landParcels.all });
 *
 * // Get specific land parcel key
 * queryClient.invalidateQueries({ queryKey: queryKeys.landParcels.detail(1) });
 */
export const queryKeys = {
  // Land Parcels
  landParcels: {
    all: ['landParcels'] as const,
    lists: () => [...queryKeys.landParcels.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.landParcels.lists(), params] as const,
    details: () => [...queryKeys.landParcels.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.landParcels.details(), id] as const,
  },

  // Crop Cycles
  cropCycles: {
    all: ['cropCycles'] as const,
    lists: () => [...queryKeys.cropCycles.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.cropCycles.lists(), params] as const,
    details: () => [...queryKeys.cropCycles.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.cropCycles.details(), id] as const,
    stages: (cycleId: number) =>
      [...queryKeys.cropCycles.detail(cycleId), 'stages'] as const,
  },

  // Seasons
  seasons: {
    all: ['seasons'] as const,
    lists: () => [...queryKeys.seasons.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.seasons.lists(), params] as const,
    details: () => [...queryKeys.seasons.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.seasons.details(), id] as const,
    current: () => [...queryKeys.seasons.all, 'current'] as const,
    definitions: () => [...queryKeys.seasons.all, 'definitions'] as const,
  },

  // Activity Logs
  activityLogs: {
    all: ['activityLogs'] as const,
    lists: () => [...queryKeys.activityLogs.all, 'list'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.activityLogs.lists(), params] as const,
    infinite: (params?: Record<string, unknown>) =>
      [...queryKeys.activityLogs.list(params), 'infinite'] as const,
    calendar: (month: string, params?: Record<string, unknown>) =>
      [...queryKeys.activityLogs.list(params), 'calendar', month] as const,
    details: () => [...queryKeys.activityLogs.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.activityLogs.details(), id] as const,
    types: () => [...queryKeys.activityLogs.all, 'types'] as const,
    analytics: (params?: Record<string, unknown>) =>
      [...queryKeys.activityLogs.list(params), 'analytics'] as const,
  },

  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  // Crop Types
  cropTypes: {
    all: ['cropTypes'] as const,
    list: () => [...queryKeys.cropTypes.all, 'list'] as const,
  },

  // Water Sources
  waterSources: {
    all: ['waterSources'] as const,
    list: () => [...queryKeys.waterSources.all, 'list'] as const,
  },

  // Units of Measure
  unitsOfMeasure: {
    all: ['unitsOfMeasure'] as const,
    list: () => [...queryKeys.unitsOfMeasure.all, 'list'] as const,
  },
} as const;

// ============================================================================
// QUERY CLIENT CONFIGURATION
// ============================================================================

/**
 * Create and configure the React Query client with optimized defaults.
 *
 * Features:
 * - Smart retry logic (3 attempts with exponential backoff)
 * - Optimized stale/cache times
 * - Background refetch on window focus
 * - Refetch on reconnect
 * - Error handling with toast notifications
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // How long data is considered fresh (won't refetch)
        staleTime: STALE_TIME.MEDIUM,

        // How long to keep inactive data in cache
        gcTime: CACHE_TIME.MEDIUM,

        // Retry failed requests
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error instanceof Error && 'status' in error) {
            const status = (error as { status: number }).status;
            if (status >= 400 && status < 500) {
              return false;
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },

        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus (user returns to tab)
        refetchOnWindowFocus: true,

        // Refetch when reconnecting to network
        refetchOnReconnect: true,

        // Don't refetch on component mount if data is fresh
        refetchOnMount: true,

        // Keep previous data while fetching new data
        placeholderData: (previousData: unknown) => previousData,

        // Network mode - always try to fetch, use cache as fallback
        networkMode: 'offlineFirst',
      },

      mutations: {
        // Retry mutations on network errors only
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('Network')) {
            return failureCount < 2;
          }
          return false;
        },

        // Network mode for mutations
        networkMode: 'online',
      },
    },
  });
}

// ============================================================================
// DEFAULT QUERY CLIENT INSTANCE
// ============================================================================

/**
 * Default query client instance.
 * Import this in your app root and provide it to QueryClientProvider.
 *
 * @example
 * import { queryClient } from '@/lib/query-client';
 *
 * function App() {
 *   return (
 *     <QueryClientProvider client={queryClient}>
 *       <App />
 *     </QueryClientProvider>
 *   );
 * }
 */
export const queryClient = createQueryClient();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Invalidate all queries for a resource
 *
 * @param resourceKey - The base query key for the resource
 *
 * @example
 * invalidateResource(queryKeys.landParcels.all);
 */
export function invalidateResource(resourceKey: readonly string[]): void {
  queryClient.invalidateQueries({ queryKey: resourceKey });
}

/**
 * Prefetch a query for faster navigation
 *
 * @param queryKey - The query key
 * @param queryFn - The query function
 *
 * @example
 * await prefetchQuery(
 *   queryKeys.landParcels.detail(1),
 *   () => landParcelService.getById(1)
 * );
 */
export async function prefetchQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: STALE_TIME.MEDIUM,
  });
}

/**
 * Set query data directly (useful for optimistic updates)
 *
 * @param queryKey - The query key
 * @param data - The data to set
 *
 * @example
 * setQueryData(queryKeys.landParcels.detail(1), updatedParcel);
 */
export function setQueryData<T>(
  queryKey: readonly unknown[],
  data: T | ((oldData: T | undefined) => T)
): void {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Get cached query data
 *
 * @param queryKey - The query key
 * @returns The cached data or undefined
 *
 * @example
 * const parcel = getQueryData<LandParcel>(queryKeys.landParcels.detail(1));
 */
export function getQueryData(queryKey: readonly unknown[]): unknown {
  return queryClient.getQueryData(queryKey);
}
