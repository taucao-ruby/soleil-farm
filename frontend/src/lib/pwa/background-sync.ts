/**
 * Background Sync Service
 * =======================
 * Handles background synchronization using the Background Sync API.
 * Falls back to manual sync when Background Sync is not available.
 */

// ============================================================================
// TYPES
// ============================================================================

export type SyncTag =
  | 'sync-activity-logs'
  | 'sync-crop-cycles'
  | 'sync-land-parcels'
  | 'sync-all';

// ============================================================================
// BACKGROUND SYNC CLASS
// ============================================================================

class BackgroundSyncService {
  private isSupported: boolean;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'SyncManager' in window;
  }

  /**
   * Check if Background Sync is supported
   */
  isBackgroundSyncSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Register a sync event
   */
  async registerSync(tag: SyncTag): Promise<boolean> {
    if (!this.isSupported) {
      console.log('[BackgroundSync] Not supported, will sync when online');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      // @ts-expect-error SyncManager is not in TypeScript types yet
      await registration.sync.register(tag);
      console.log(`[BackgroundSync] Registered sync: ${tag}`);
      return true;
    } catch (error) {
      console.error('[BackgroundSync] Failed to register sync:', error);
      return false;
    }
  }

  /**
   * Register sync for activity logs
   */
  async syncActivityLogs(): Promise<boolean> {
    return this.registerSync('sync-activity-logs');
  }

  /**
   * Register sync for crop cycles
   */
  async syncCropCycles(): Promise<boolean> {
    return this.registerSync('sync-crop-cycles');
  }

  /**
   * Register sync for land parcels
   */
  async syncLandParcels(): Promise<boolean> {
    return this.registerSync('sync-land-parcels');
  }

  /**
   * Register sync for all pending data
   */
  async syncAll(): Promise<boolean> {
    return this.registerSync('sync-all');
  }

  /**
   * Check for pending background syncs
   */
  async getPendingSyncs(): Promise<SyncTag[]> {
    if (!this.isSupported) {
      return [];
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      // @ts-expect-error SyncManager is not in TypeScript types yet
      const tags = await registration.sync.getTags();
      return tags as SyncTag[];
    } catch (error) {
      console.error('[BackgroundSync] Failed to get pending syncs:', error);
      return [];
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const backgroundSync = new BackgroundSyncService();

// ============================================================================
// SERVICE WORKER SYNC HANDLER
// ============================================================================

/**
 * Setup sync event handler in service worker
 * This code should be added to the service worker file
 */
export const SERVICE_WORKER_SYNC_CODE = `
// Background Sync Handler
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);

  switch (event.tag) {
    case 'sync-activity-logs':
      event.waitUntil(syncActivityLogs());
      break;
    case 'sync-crop-cycles':
      event.waitUntil(syncCropCycles());
      break;
    case 'sync-land-parcels':
      event.waitUntil(syncLandParcels());
      break;
    case 'sync-all':
      event.waitUntil(syncAll());
      break;
    default:
      console.log('[SW] Unknown sync tag:', event.tag);
  }
});

async function syncActivityLogs() {
  const queue = await getQueuedMutations('activity-logs');
  for (const mutation of queue) {
    await processMutation(mutation);
  }
}

async function syncCropCycles() {
  const queue = await getQueuedMutations('crop-cycles');
  for (const mutation of queue) {
    await processMutation(mutation);
  }
}

async function syncLandParcels() {
  const queue = await getQueuedMutations('land-parcels');
  for (const mutation of queue) {
    await processMutation(mutation);
  }
}

async function syncAll() {
  const queue = await getAllQueuedMutations();
  for (const mutation of queue) {
    await processMutation(mutation);
  }
}

async function getQueuedMutations(resource) {
  // Get from IndexedDB or localStorage via postMessage
  return [];
}

async function getAllQueuedMutations() {
  return [];
}

async function processMutation(mutation) {
  const { type, endpoint, data } = mutation;
  
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  let response;

  switch (type) {
    case 'create':
      response = await fetch(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
      });
      break;
    case 'update':
      response = await fetch(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
      });
      break;
    case 'delete':
      response = await fetch(endpoint, {
        ...options,
        method: 'DELETE',
      });
      break;
  }

  if (!response.ok) {
    throw new Error('Sync failed: ' + response.status);
  }

  return response.json();
}
`;
