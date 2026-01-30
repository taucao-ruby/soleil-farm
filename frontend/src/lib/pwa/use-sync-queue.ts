/**
 * useSyncQueue Hook
 * =================
 * React hook for managing the offline sync queue.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  syncQueue,
  type QueuedMutation,
  type MutationType,
  type ResourceType,
  type SyncResult,
} from './sync-queue';
import { useOnlineStatus } from './use-online-status';

export interface UseSyncQueueReturn {
  queue: QueuedMutation[];
  pendingCount: number;
  isSyncing: boolean;
  isOnline: boolean;
  addToQueue: <T>(
    type: MutationType,
    resource: ResourceType,
    endpoint: string,
    data: T
  ) => string;
  removeFromQueue: (id: string) => void;
  processQueue: () => Promise<SyncResult[]>;
  clearQueue: () => void;
}

/**
 * Hook for managing sync queue
 */
export function useSyncQueue(): UseSyncQueueReturn {
  const [queue, setQueue] = useState<QueuedMutation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline, wasOffline } = useOnlineStatus();

  // Subscribe to queue changes
  useEffect(() => {
    const unsubscribe = syncQueue.subscribe((newQueue) => {
      setQueue(newQueue);
    });

    return unsubscribe;
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && wasOffline && queue.length > 0) {
      processQueue();
    }
  }, [isOnline, wasOffline]);

  const addToQueue = useCallback(
    <T,>(
      type: MutationType,
      resource: ResourceType,
      endpoint: string,
      data: T
    ): string => {
      return syncQueue.add({
        type,
        resource,
        endpoint,
        data,
      });
    },
    []
  );

  const removeFromQueue = useCallback((id: string) => {
    syncQueue.remove(id);
  }, []);

  const processQueue = useCallback(async (): Promise<SyncResult[]> => {
    if (isSyncing) return [];

    setIsSyncing(true);
    try {
      const results = await syncQueue.processQueue();
      return results;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  const clearQueue = useCallback(() => {
    syncQueue.clear();
  }, []);

  return {
    queue,
    pendingCount: queue.length,
    isSyncing,
    isOnline,
    addToQueue,
    removeFromQueue,
    processQueue,
    clearQueue,
  };
}
