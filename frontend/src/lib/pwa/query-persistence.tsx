/**
 * React Query Persistence
 * =======================
 * Configures React Query to persist data to localStorage for offline support.
 * Uses @tanstack/react-query-persist-client for seamless persistence.
 */

import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactNode } from 'react';

// ============================================================================
// CONSTANTS
// ============================================================================

const PERSIST_KEY = 'soleil-farm-query-cache';
const MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours

// ============================================================================
// PERSISTER CONFIGURATION
// ============================================================================

/**
 * Create a localStorage persister
 * Data is serialized to JSON and stored in localStorage
 */
export const createQueryPersister = () => {
  return createSyncStoragePersister({
    storage: window.localStorage,
    key: PERSIST_KEY,
    // Throttle writes to avoid performance issues
    throttleTime: 1000,
    // Custom serialization with error handling
    serialize: (data) => {
      try {
        return JSON.stringify(data);
      } catch (error) {
        console.error('[QueryPersist] Serialization error:', error);
        return '';
      }
    },
    deserialize: (data) => {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('[QueryPersist] Deserialization error:', error);
        return {};
      }
    },
  });
};

// ============================================================================
// QUERY CLIENT OPTIONS
// ============================================================================

/**
 * Query client options optimized for offline-first
 */
export const offlineQueryClientOptions = {
  defaultOptions: {
    queries: {
      // Keep data fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Keep data in cache for 24 hours
      gcTime: MAX_AGE,
      // Retry failed requests
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Use cached data while revalidating
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations when back online
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
};

// ============================================================================
// PERSISTENCE PROVIDER
// ============================================================================

interface PersistQueryProviderProps {
  client: QueryClient;
  children: ReactNode;
}

/**
 * Persistence Provider Component
 * Wraps the app with React Query persistence
 */
export function PersistQueryProvider({
  client,
  children,
}: PersistQueryProviderProps) {
  const persister = createQueryPersister();

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister,
        maxAge: MAX_AGE,
        // Don't persist mutation cache (it's handled separately)
        buster: import.meta.env.VITE_APP_VERSION || '1.0.0',
        // Only persist successful queries
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            // Only persist successful queries
            if (query.state.status !== 'success') return false;
            // Don't persist large datasets
            const dataSize = JSON.stringify(query.state.data).length;
            if (dataSize > 1024 * 100) return false; // 100KB limit
            return true;
          },
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Clear persisted query cache
 */
export function clearPersistedCache(): void {
  try {
    localStorage.removeItem(PERSIST_KEY);
    console.log('[QueryPersist] Cache cleared');
  } catch (error) {
    console.error('[QueryPersist] Failed to clear cache:', error);
  }
}

/**
 * Get persisted cache size in bytes
 */
export function getPersistedCacheSize(): number {
  try {
    const cache = localStorage.getItem(PERSIST_KEY);
    return cache ? new Blob([cache]).size : 0;
  } catch {
    return 0;
  }
}

/**
 * Format cache size for display
 */
export function formatCacheSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
