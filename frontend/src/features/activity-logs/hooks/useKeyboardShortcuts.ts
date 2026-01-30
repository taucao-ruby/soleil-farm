/**
 * Keyboard Shortcuts Hook
 * ========================
 * Handle keyboard shortcuts for activity logs
 */

import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onNewActivity?: () => void;
  onSearch?: () => void;
  onEscape?: () => void;
  onSave?: () => void;
}

/**
 * Hook for keyboard shortcuts
 *
 * @param shortcuts - Callback functions for each shortcut
 *
 * @example
 * useKeyboardShortcuts({
 *   onNewActivity: () => setIsModalOpen(true),
 *   onSearch: () => searchInputRef.current?.focus(),
 *   onEscape: () => setIsModalOpen(false),
 * });
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Escape always works
      if (event.key === 'Escape') {
        shortcuts.onEscape?.();
        return;
      }

      // Ctrl+S for save
      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        shortcuts.onSave?.();
        return;
      }

      // Skip other shortcuts if in input
      if (isInput) return;

      switch (event.key.toLowerCase()) {
        case 'n':
          // N: New activity
          event.preventDefault();
          shortcuts.onNewActivity?.();
          break;

        case '/':
        case 'k':
          // / or Ctrl+K: Focus search
          if (event.key === 'k' && !(event.ctrlKey || event.metaKey)) return;
          event.preventDefault();
          shortcuts.onSearch?.();
          break;
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
