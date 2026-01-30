/**
 * OfflineIndicator Component
 * ==========================
 * Shows a banner when the user is offline.
 * Also displays pending sync count.
 */

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOnlineStatus } from '@/lib/pwa/use-online-status';
import { useSyncQueue } from '@/lib/pwa/use-sync-queue';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { pendingCount, isSyncing, processQueue } = useSyncQueue();
  const [showReconnected, setShowReconnected] = useState(false);

  // Show "reconnected" message briefly when coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isOnline, wasOffline]);

  // If online and no message to show, return null
  if (isOnline && !showReconnected && pendingCount === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        className
      )}
    >
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">
            📡 Không có kết nối internet. Dữ liệu sẽ được đồng bộ khi online.
          </span>
          {pendingCount > 0 && (
            <span className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingCount} chờ đồng bộ
            </span>
          )}
        </div>
      )}

      {/* Reconnected Banner */}
      {isOnline && showReconnected && (
        <div className="bg-green-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">
            ✨ Đã kết nối lại! Đang đồng bộ dữ liệu...
          </span>
        </div>
      )}

      {/* Syncing Banner */}
      {isOnline && !showReconnected && isSyncing && (
        <div className="bg-blue-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="text-sm font-medium">
            Đang đồng bộ {pendingCount} mục...
          </span>
        </div>
      )}

      {/* Pending Sync Banner (when online but has pending items) */}
      {isOnline && !showReconnected && !isSyncing && pendingCount > 0 && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm font-medium">
            {pendingCount} mục chờ đồng bộ
          </span>
          <button
            onClick={() => processQueue()}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1 rounded-full transition-colors"
          >
            Đồng bộ ngay
          </button>
        </div>
      )}
    </div>
  );
}
