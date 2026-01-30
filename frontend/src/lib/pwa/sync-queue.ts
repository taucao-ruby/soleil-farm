/**
 * Offline Sync Queue
 * ==================
 * Manages mutations that need to be synced when online.
 * Implements a queue-based approach for reliable offline-first experience.
 */

import { nanoid } from 'nanoid';

// ============================================================================
// TYPES
// ============================================================================

export type MutationType = 'create' | 'update' | 'delete';
export type ResourceType = 'land-parcels' | 'crop-cycles' | 'activity-logs' | 'seasons';

export interface QueuedMutation<T = unknown> {
  id: string;
  type: MutationType;
  resource: ResourceType;
  data: T;
  timestamp: number;
  retryCount: number;
  endpoint: string;
}

export interface SyncResult {
  success: boolean;
  mutationId: string;
  error?: string;
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const SYNC_QUEUE_KEY = 'soleil-farm-sync-queue';
const SYNC_STATUS_KEY = 'soleil-farm-sync-status';

// ============================================================================
// SYNC QUEUE CLASS
// ============================================================================

class SyncQueue {
  private queue: QueuedMutation[] = [];
  private isSyncing = false;
  private onQueueChange?: (queue: QueuedMutation[]) => void;

  constructor() {
    this.loadFromStorage();
    this.setupOnlineListener();
  }

  /**
   * Load queue from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[SyncQueue] Failed to load from storage:', error);
      this.queue = [];
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.queue));
      this.onQueueChange?.(this.queue);
    } catch (error) {
      console.error('[SyncQueue] Failed to save to storage:', error);
    }
  }

  /**
   * Setup online/offline event listeners
   */
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      console.log('[SyncQueue] Online - processing queue...');
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      console.log('[SyncQueue] Offline - mutations will be queued');
    });
  }

  /**
   * Add mutation to queue
   */
  add<T>(
    mutation: Omit<QueuedMutation<T>, 'id' | 'timestamp' | 'retryCount'>
  ): string {
    const queuedMutation: QueuedMutation<T> = {
      ...mutation,
      id: nanoid(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(queuedMutation as QueuedMutation);
    this.saveToStorage();

    console.log('[SyncQueue] Added mutation:', queuedMutation.id);

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }

    return queuedMutation.id;
  }

  /**
   * Remove mutation from queue
   */
  remove(id: string): void {
    this.queue = this.queue.filter((m) => m.id !== id);
    this.saveToStorage();
  }

  /**
   * Get all pending mutations
   */
  getAll(): QueuedMutation[] {
    return [...this.queue];
  }

  /**
   * Get pending count
   */
  getPendingCount(): number {
    return this.queue.length;
  }

  /**
   * Clear all mutations
   */
  clear(): void {
    this.queue = [];
    this.saveToStorage();
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(callback: (queue: QueuedMutation[]) => void): () => void {
    this.onQueueChange = callback;
    callback(this.queue); // Initial call
    return () => {
      this.onQueueChange = undefined;
    };
  }

  /**
   * Process the sync queue
   */
  async processQueue(): Promise<SyncResult[]> {
    if (this.isSyncing || !navigator.onLine || this.queue.length === 0) {
      return [];
    }

    this.isSyncing = true;
    this.updateSyncStatus('syncing');
    const results: SyncResult[] = [];

    console.log(`[SyncQueue] Processing ${this.queue.length} mutations...`);

    // Process mutations in order
    for (const mutation of [...this.queue]) {
      try {
        await this.executeMutation(mutation);
        this.remove(mutation.id);
        results.push({ success: true, mutationId: mutation.id });
        console.log('[SyncQueue] Synced mutation:', mutation.id);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[SyncQueue] Failed to sync mutation:', mutation.id, error);
        
        // Increment retry count
        mutation.retryCount++;
        
        // Remove after max retries
        if (mutation.retryCount >= 3) {
          this.remove(mutation.id);
          results.push({ 
            success: false, 
            mutationId: mutation.id, 
            error: `Max retries exceeded: ${errorMessage}` 
          });
        } else {
          this.saveToStorage();
          results.push({ 
            success: false, 
            mutationId: mutation.id, 
            error: errorMessage 
          });
        }
      }
    }

    this.isSyncing = false;
    this.updateSyncStatus(this.queue.length === 0 ? 'synced' : 'pending');
    
    return results;
  }

  /**
   * Execute a single mutation
   */
  private async executeMutation(mutation: QueuedMutation): Promise<void> {
    const { type, endpoint, data } = mutation;
    
    const options: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    let response: Response;

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
      default:
        throw new Error(`Unknown mutation type: ${type}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Update sync status
   */
  private updateSyncStatus(status: 'syncing' | 'synced' | 'pending' | 'error'): void {
    try {
      localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
        status,
        timestamp: Date.now(),
        pendingCount: this.queue.length,
      }));
    } catch (error) {
      console.error('[SyncQueue] Failed to update sync status:', error);
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): { status: string; timestamp: number; pendingCount: number } | null {
    try {
      const stored = localStorage.getItem(SYNC_STATUS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const syncQueue = new SyncQueue();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Queue a create mutation
 */
export function queueCreate<T>(
  resource: ResourceType,
  endpoint: string,
  data: T
): string {
  return syncQueue.add({
    type: 'create',
    resource,
    endpoint,
    data,
  });
}

/**
 * Queue an update mutation
 */
export function queueUpdate<T>(
  resource: ResourceType,
  endpoint: string,
  data: T
): string {
  return syncQueue.add({
    type: 'update',
    resource,
    endpoint,
    data,
  });
}

/**
 * Queue a delete mutation
 */
export function queueDelete(
  resource: ResourceType,
  endpoint: string
): string {
  return syncQueue.add({
    type: 'delete',
    resource,
    endpoint,
    data: null,
  });
}
