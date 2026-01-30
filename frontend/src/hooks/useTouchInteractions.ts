/**
 * Touch Interactions Hooks
 * =========================
 * Hooks for mobile touch gestures: swipe, long press, pull to refresh
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type RefObject,
  type TouchEvent as ReactTouchEvent,
} from 'react';

// ============================================================================
// SWIPE HOOK
// ============================================================================

type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeConfig {
  threshold?: number; // Minimum distance to trigger swipe (default: 50)
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  isSwiping: boolean;
  direction: SwipeDirection | null;
}

/**
 * useSwipe Hook
 * ==============
 * Detects swipe gestures on an element
 *
 * @example
 * const { ref, deltaX, isSwiping } = useSwipe({
 *   onSwipeLeft: () => handleDelete(),
 *   onSwipeRight: () => handleEdit(),
 * });
 *
 * return <div ref={ref}>Swipeable content</div>;
 */
export function useSwipe<T extends HTMLElement = HTMLDivElement>(
  config: SwipeConfig = {}
): SwipeState & { ref: RefObject<T> } {
  const { threshold = 50, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown } = config;

  const ref = useRef<T>(null);
  const [state, setState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    isSwiping: false,
    direction: null,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setState({
        startX: touch.clientX,
        startY: touch.clientY,
        deltaX: 0,
        deltaY: 0,
        isSwiping: true,
        direction: null,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!state.isSwiping) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - state.startX;
      const deltaY = touch.clientY - state.startY;

      // Determine direction
      let direction: SwipeDirection | null = null;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      setState((prev) => ({
        ...prev,
        deltaX,
        deltaY,
        direction,
      }));
    };

    const handleTouchEnd = () => {
      const { deltaX, deltaY, direction } = state;

      // Trigger callbacks if threshold met
      if (Math.abs(deltaX) >= threshold || Math.abs(deltaY) >= threshold) {
        switch (direction) {
          case 'left':
            onSwipeLeft?.();
            break;
          case 'right':
            onSwipeRight?.();
            break;
          case 'up':
            onSwipeUp?.();
            break;
          case 'down':
            onSwipeDown?.();
            break;
        }
      }

      setState({
        startX: 0,
        startY: 0,
        deltaX: 0,
        deltaY: 0,
        isSwiping: false,
        direction: null,
      });
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [state.isSwiping, state.startX, state.startY, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return { ...state, ref };
}

// ============================================================================
// LONG PRESS HOOK
// ============================================================================

interface LongPressConfig {
  delay?: number; // Time in ms before triggering (default: 500)
  onLongPress: () => void;
  onPress?: () => void;
}

interface LongPressHandlers {
  onTouchStart: (e: ReactTouchEvent) => void;
  onTouchEnd: (e: ReactTouchEvent) => void;
  onTouchMove: (e: ReactTouchEvent) => void;
}

/**
 * useLongPress Hook
 * ==================
 * Detects long press gesture
 *
 * @example
 * const longPressHandlers = useLongPress({
 *   onLongPress: () => openContextMenu(),
 *   delay: 500,
 * });
 *
 * return <div {...longPressHandlers}>Long press me</div>;
 */
export function useLongPress(config: LongPressConfig): LongPressHandlers {
  const { delay = 500, onLongPress, onPress } = config;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback(
    (e: ReactTouchEvent) => {
      const touch = e.touches[0];
      startPosRef.current = { x: touch.clientX, y: touch.clientY };
      isLongPressRef.current = false;

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        onLongPress();
        // Haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, delay);
    },
    [delay, onLongPress]
  );

  const onTouchEnd = useCallback(
    (_e: ReactTouchEvent) => {
      if (!isLongPressRef.current && onPress) {
        onPress();
      }
      clear();
    },
    [clear, onPress]
  );

  const onTouchMove = useCallback(
    (e: ReactTouchEvent) => {
      const touch = e.touches[0];
      const start = startPosRef.current;

      // Cancel long press if moved too much
      if (start) {
        const distance = Math.sqrt(
          Math.pow(touch.clientX - start.x, 2) + Math.pow(touch.clientY - start.y, 2)
        );
        if (distance > 10) {
          clear();
        }
      }
    },
    [clear]
  );

  useEffect(() => {
    return clear;
  }, [clear]);

  return {
    onTouchStart,
    onTouchEnd,
    onTouchMove,
  };
}

// ============================================================================
// PULL TO REFRESH HOOK
// ============================================================================

interface PullToRefreshConfig {
  onRefresh: () => Promise<void>;
  threshold?: number; // Distance to trigger refresh (default: 80)
  maxPull?: number; // Maximum pull distance (default: 120)
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
  shouldRefresh: boolean;
}

/**
 * usePullToRefresh Hook
 * ======================
 * Pull-down-to-refresh functionality
 *
 * @example
 * const { pullDistance, isRefreshing, handlers } = usePullToRefresh({
 *   onRefresh: async () => await refetch(),
 * });
 *
 * return (
 *   <div {...handlers}>
 *     <RefreshIndicator distance={pullDistance} isRefreshing={isRefreshing} />
 *     <Content />
 *   </div>
 * );
 */
export function usePullToRefresh(
  config: PullToRefreshConfig
): PullToRefreshState & {
  handlers: {
    onTouchStart: (e: ReactTouchEvent) => void;
    onTouchMove: (e: ReactTouchEvent) => void;
    onTouchEnd: (e: ReactTouchEvent) => void;
  };
} {
  const { onRefresh, threshold = 80, maxPull = 120 } = config;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    shouldRefresh: false,
  });

  const startYRef = useRef(0);
  const scrollTopRef = useRef(0);

  const onTouchStart = useCallback((e: ReactTouchEvent) => {
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    scrollTopRef.current = window.scrollY;
  }, []);

  const onTouchMove = useCallback(
    (e: ReactTouchEvent) => {
      if (state.isRefreshing) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - startYRef.current;

      // Only pull if at top of page and pulling down
      if (scrollTopRef.current <= 0 && deltaY > 0) {
        const pullDistance = Math.min(deltaY * 0.5, maxPull); // Resistance
        const shouldRefresh = pullDistance >= threshold;

        setState((prev) => ({
          ...prev,
          isPulling: true,
          pullDistance,
          shouldRefresh,
        }));
      }
    },
    [state.isRefreshing, threshold, maxPull]
  );

  const onTouchEnd = useCallback(async () => {
    if (state.shouldRefresh && !state.isRefreshing) {
      setState((prev) => ({
        ...prev,
        isRefreshing: true,
        isPulling: false,
      }));

      try {
        await onRefresh();
      } finally {
        setState({
          isPulling: false,
          pullDistance: 0,
          isRefreshing: false,
          shouldRefresh: false,
        });
      }
    } else {
      setState({
        isPulling: false,
        pullDistance: 0,
        isRefreshing: false,
        shouldRefresh: false,
      });
    }
  }, [state.shouldRefresh, state.isRefreshing, onRefresh]);

  return {
    ...state,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

// ============================================================================
// HAPTIC FEEDBACK
// ============================================================================

/**
 * Trigger haptic feedback
 *
 * @example
 * haptic('light');
 * haptic('medium');
 * haptic('heavy');
 */
export function haptic(intensity: 'light' | 'medium' | 'heavy' = 'medium') {
  if (!navigator.vibrate) return;

  const patterns = {
    light: 10,
    medium: 25,
    heavy: 50,
  };

  navigator.vibrate(patterns[intensity]);
}

export default useSwipe;
