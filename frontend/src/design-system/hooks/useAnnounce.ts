/**
 * Soleil Farm Design System - useAnnounce Hook
 * ============================================
 * Screen reader announcements for accessibility.
 */

import * as React from 'react';

// ===== TYPES =====
type Politeness = 'polite' | 'assertive' | 'off';

interface AnnounceOptions {
  /** Politeness level for screen readers */
  politeness?: Politeness;
  /** Clear announcement after delay (ms) */
  clearAfter?: number;
}

// ===== LIVE REGION CONTAINER =====
let announceContainer: HTMLDivElement | null = null;

function getAnnounceContainer(): HTMLDivElement {
  if (announceContainer) return announceContainer;

  // Create container for announcements
  announceContainer = document.createElement('div');
  announceContainer.setAttribute('aria-live', 'polite');
  announceContainer.setAttribute('aria-atomic', 'true');
  announceContainer.setAttribute('role', 'status');
  announceContainer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;

  document.body.appendChild(announceContainer);
  return announceContainer;
}

// ===== ANNOUNCE FUNCTION =====
/**
 * Make an announcement to screen readers
 */
export function announce(
  message: string,
  options: AnnounceOptions = {}
): () => void {
  const { politeness = 'polite', clearAfter = 5000 } = options;

  const container = getAnnounceContainer();

  // Update politeness
  container.setAttribute('aria-live', politeness);

  // Create announcement element
  const announcement = document.createElement('div');
  announcement.textContent = message;
  container.appendChild(announcement);

  // Clear after delay
  const timeoutId = setTimeout(() => {
    if (announcement.parentNode === container) {
      container.removeChild(announcement);
    }
  }, clearAfter);

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    if (announcement.parentNode === container) {
      container.removeChild(announcement);
    }
  };
}

// ===== MAIN HOOK =====
/**
 * Hook for making screen reader announcements
 * 
 * @example
 * const announce = useAnnounce();
 * 
 * const handleSave = async () => {
 *   await saveData();
 *   announce('Đã lưu thành công', { politeness: 'polite' });
 * };
 */
export function useAnnounce() {
  const cleanupRef = React.useRef<(() => void) | null>(null);

  const announceMessage = React.useCallback(
    (message: string, options?: AnnounceOptions) => {
      // Cleanup previous announcement
      cleanupRef.current?.();
      cleanupRef.current = announce(message, options);
    },
    []
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      cleanupRef.current?.();
    };
  }, []);

  return announceMessage;
}

// ===== LIVE REGION COMPONENT =====
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: Politeness;
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

/**
 * Component wrapper for live regions
 */
export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = true,
  relevant = 'additions',
  className,
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
    >
      {children}
    </div>
  );
}

// ===== VISUALLY HIDDEN COMPONENT =====
interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Hide content visually but keep it accessible to screen readers
 */
export function VisuallyHidden({
  children,
  as: Component = 'span',
}: VisuallyHiddenProps) {
  return (
    <Component
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}
    >
      {children}
    </Component>
  );
}

// ===== SKIP LINK COMPONENT =====
interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

/**
 * Skip navigation link for keyboard users
 */
export function SkipLink({
  href = '#main-content',
  children = 'Bỏ qua điều hướng',
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:left-4 focus:top-4 focus:z-50
        focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2
        focus:text-primary-foreground focus:shadow-lg focus:outline-none
        focus:ring-2 focus:ring-ring focus:ring-offset-2
      "
    >
      {children}
    </a>
  );
}

export default useAnnounce;
