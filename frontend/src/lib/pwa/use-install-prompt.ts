/**
 * useInstallPrompt Hook
 * =====================
 * Manages the PWA install prompt for Add to Home Screen functionality.
 */

import { useState, useEffect, useCallback } from 'react';

// Extend Window interface to include beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

export interface UseInstallPromptReturn {
  /**
   * Whether the install prompt can be shown
   */
  canInstall: boolean;
  /**
   * Whether the app is already installed
   */
  isInstalled: boolean;
  /**
   * Show the install prompt
   */
  promptInstall: () => Promise<boolean>;
  /**
   * Dismiss the install prompt UI
   */
  dismissPrompt: () => void;
  /**
   * Whether the user has dismissed the prompt
   */
  isDismissed: boolean;
}

const INSTALL_DISMISSED_KEY = 'soleil-farm-install-dismissed';

/**
 * Hook for managing PWA install prompt
 */
export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem(INSTALL_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Check if app is already installed
  useEffect(() => {
    // Check display-mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check iOS standalone mode
    if ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone) {
      setIsInstalled(true);
      return;
    }
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    if (isInstalled) return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent default browser prompt
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
      console.log('[PWA] Install prompt available');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('[PWA] App installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for user's choice
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Install prompt outcome:', outcome);

      // Clear the deferred prompt
      setDeferredPrompt(null);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('[PWA] Install prompt failed:', error);
      return false;
    }
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setIsDismissed(true);
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }
  }, []);

  return {
    canInstall: !isInstalled && !isDismissed && deferredPrompt !== null,
    isInstalled,
    promptInstall,
    dismissPrompt,
    isDismissed,
  };
}
