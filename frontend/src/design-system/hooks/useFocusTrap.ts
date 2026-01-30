/**
 * Soleil Farm Design System - useFocusTrap Hook
 * =============================================
 * Trap focus within a container for accessibility.
 */

import * as React from 'react';

// ===== FOCUSABLE ELEMENTS SELECTOR =====
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

// ===== TYPES =====
interface UseFocusTrapOptions {
  /** Whether the focus trap is active */
  enabled?: boolean;
  /** Element to focus on mount */
  initialFocus?: React.RefObject<HTMLElement>;
  /** Element to focus on unmount */
  returnFocus?: boolean;
  /** Callback when escape is pressed */
  onEscape?: () => void;
}

// ===== MAIN HOOK =====
/**
 * Hook to trap focus within a container
 * 
 * @example
 * const containerRef = useFocusTrap<HTMLDivElement>({
 *   enabled: isOpen,
 *   onEscape: handleClose,
 * });
 * 
 * return <div ref={containerRef}>...</div>
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  options: UseFocusTrapOptions = {}
): React.RefObject<T> {
  const { enabled = true, initialFocus, returnFocus = true, onEscape } = options;

  const containerRef = React.useRef<T>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  // Get all focusable elements
  const getFocusableElements = React.useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
    ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
  }, []);

  // Handle tab key
  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !containerRef.current) return;

      // Handle Escape
      if (event.key === 'Escape' && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      // Handle Tab
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [enabled, getFocusableElements, onEscape]
  );

  // Setup focus trap
  React.useEffect(() => {
    if (!enabled) return;

    // Store previous active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable
    const focusInitial = () => {
      if (initialFocus?.current) {
        initialFocus.current.focus();
      } else {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else {
          // Focus container if no focusable elements
          containerRef.current?.focus();
        }
      }
    };

    // Delay focus to ensure DOM is ready
    const timeoutId = setTimeout(focusInitial, 0);

    // Add keydown listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to previous element
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, initialFocus, returnFocus, handleKeyDown, getFocusableElements]);

  return containerRef;
}

// ===== FOCUS LOCK COMPONENT =====
interface FocusLockProps {
  children: React.ReactNode;
  enabled?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  returnFocus?: boolean;
  onEscape?: () => void;
  className?: string;
}

export function FocusLock({
  children,
  enabled = true,
  initialFocus,
  returnFocus = true,
  onEscape,
  className,
}: FocusLockProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({
    enabled,
    initialFocus,
    returnFocus,
    onEscape,
  });

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className={className}
      style={{ outline: 'none' }}
    >
      {children}
    </div>
  );
}

export default useFocusTrap;
