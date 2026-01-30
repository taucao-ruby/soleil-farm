/**
 * Service Worker Registration
 * ===========================
 * Handles service worker registration and updates.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// REGISTRATION
// ============================================================================

/**
 * Register the service worker
 */
export async function registerServiceWorker(
  config?: ServiceWorkerConfig
): Promise<ServiceWorkerRegistration | undefined> {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported');
    return undefined;
  }

  // Only register in production
  if (import.meta.env.DEV) {
    console.log('[SW] Skipping service worker registration in development');
    return undefined;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service worker registered:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New update available
            console.log('[SW] New content available, refresh to update');
            config?.onUpdate?.(registration);
          } else {
            // First install
            console.log('[SW] Content cached for offline use');
            config?.onSuccess?.(registration);
          }
        }
      });
    });

    // Check if waiting worker exists (update available)
    if (registration.waiting) {
      config?.onUpdate?.(registration);
    }

    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    config?.onError?.(error as Error);
    return undefined;
  }
}

/**
 * Unregister all service workers
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('[SW] All service workers unregistered');
    return true;
  } catch (error) {
    console.error('[SW] Unregistration failed:', error);
    return false;
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting(registration: ServiceWorkerRegistration): void {
  registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
}

/**
 * Listen for controller change (new service worker activated)
 */
export function onControllerChange(callback: () => void): () => void {
  const handler = () => {
    callback();
  };

  navigator.serviceWorker.addEventListener('controllerchange', handler);

  return () => {
    navigator.serviceWorker.removeEventListener('controllerchange', handler);
  };
}
