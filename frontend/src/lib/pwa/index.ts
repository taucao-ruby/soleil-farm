/**
 * PWA Module
 * ==========
 * Centralized exports for PWA functionality
 */

// Sync Queue
export {
  syncQueue,
  queueCreate,
  queueUpdate,
  queueDelete,
  type QueuedMutation,
  type MutationType,
  type ResourceType,
  type SyncResult,
} from './sync-queue';

// Background Sync
export {
  backgroundSync,
  type SyncTag,
} from './background-sync';

// Service Worker Registration
export { registerServiceWorker, unregisterServiceWorker } from './service-worker-registration';

// Query Persistence
export {
  PersistQueryProvider,
  createQueryPersister,
  offlineQueryClientOptions,
  clearPersistedCache,
  getPersistedCacheSize,
  formatCacheSize,
} from './query-persistence.js';

// Hooks
export { useOnlineStatus, useIsOnline } from './use-online-status';
export { useSyncQueue } from './use-sync-queue';
export { useInstallPrompt } from './use-install-prompt';
export { useOfflineMutation, createOfflineMutation } from './use-offline-mutation';
