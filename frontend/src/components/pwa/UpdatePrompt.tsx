/**
 * UpdatePrompt Component
 * ======================
 * Shows a prompt when a new version of the app is available.
 */

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface UpdatePromptProps {
  className?: string;
}

export function UpdatePrompt({ className }: UpdatePromptProps) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const checkForUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        setRegistration(reg);

        // Check if there's a waiting worker (update available)
        if (reg.waiting) {
          setUpdateAvailable(true);
        }

        // Listen for new service worker
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      } catch (error) {
        console.error('[UpdatePrompt] Failed to check for updates:', error);
      }
    };

    checkForUpdates();

    // Check for updates periodically (every 30 minutes)
    const interval = setInterval(async () => {
      if (registration) {
        await registration.update();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [registration]);

  const handleUpdate = useCallback(() => {
    if (!registration?.waiting) return;

    // Tell the waiting service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload the page when the new service worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }, [registration]);

  const handleDismiss = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  if (!updateAvailable) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50',
        'bg-blue-600 text-white rounded-lg shadow-lg',
        'p-4 animate-in slide-in-from-bottom-4 duration-300',
        className
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-blue-200 hover:text-white"
        aria-label="Đóng"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <RefreshCw className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm">
            Phiên bản mới đã sẵn sàng!
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            Cập nhật để có trải nghiệm tốt nhất.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleUpdate}
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
}
