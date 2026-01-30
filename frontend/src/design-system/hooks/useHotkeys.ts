/**
 * Soleil Farm Design System - useHotkeys Hook
 * ==========================================
 * Keyboard shortcut management for accessibility.
 */

import * as React from 'react';

// ===== TYPES =====
type KeyboardModifiers = {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

type HotkeyCallback = (event: KeyboardEvent) => void;

type HotkeyOptions = {
  /** Enable hotkey only when element is focused */
  enableOnFormTags?: boolean;
  /** Enable hotkey only when specific element is focused */
  targetElement?: HTMLElement | null;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Enable in input fields */
  enableOnInput?: boolean;
  /** Enabled state */
  enabled?: boolean;
};

// ===== PARSE HOTKEY STRING =====
function parseHotkey(hotkey: string): {
  key: string;
  modifiers: KeyboardModifiers;
} {
  const parts = hotkey.toLowerCase().split('+');
  const key = parts.pop() || '';

  const modifiers: KeyboardModifiers = {
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt') || parts.includes('option'),
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
  };

  return { key, modifiers };
}

// ===== CHECK IF MODIFIERS MATCH =====
function modifiersMatch(
  event: KeyboardEvent,
  modifiers: KeyboardModifiers
): boolean {
  return (
    !!modifiers.ctrl === event.ctrlKey &&
    !!modifiers.shift === event.shiftKey &&
    !!modifiers.alt === event.altKey &&
    !!modifiers.meta === event.metaKey
  );
}

// ===== CHECK IF TARGET IS FORM ELEMENT =====
function isFormElement(element: EventTarget | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  const tagName = element.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    element.isContentEditable
  );
}

// ===== MAIN HOOK =====
/**
 * Hook to handle keyboard shortcuts
 * 
 * @example
 * // Single hotkey
 * useHotkeys('ctrl+k', () => openSearchModal());
 * 
 * // Multiple hotkeys
 * useHotkeys('esc', () => closeModal());
 * useHotkeys('ctrl+s', () => saveDocument(), { preventDefault: true });
 */
export function useHotkeys(
  hotkey: string | string[],
  callback: HotkeyCallback,
  options: HotkeyOptions = {}
): void {
  const {
    enableOnFormTags = false,
    targetElement = null,
    preventDefault = true,
    enableOnInput = false,
    enabled = true,
  } = options;

  const callbackRef = React.useRef(callback);

  // Update callback ref on change
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    if (!enabled) return;

    const hotkeys = Array.isArray(hotkey) ? hotkey : [hotkey];
    const parsedHotkeys = hotkeys.map(parseHotkey);

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if target is form element and not enabled
      if (!enableOnFormTags && !enableOnInput && isFormElement(event.target)) {
        return;
      }

      // Skip if target element is specified and doesn't match
      if (targetElement && event.target !== targetElement) {
        return;
      }

      // Check if any hotkey matches
      const match = parsedHotkeys.some(({ key, modifiers }) => {
        const keyMatch =
          event.key.toLowerCase() === key ||
          event.code.toLowerCase() === `key${key}`;
        return keyMatch && modifiersMatch(event, modifiers);
      });

      if (match) {
        if (preventDefault) {
          event.preventDefault();
        }
        callbackRef.current(event);
      }
    };

    const target = targetElement || document;
    target.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [hotkey, enableOnFormTags, targetElement, preventDefault, enableOnInput, enabled]);
}

// ===== HOTKEY DISPLAY HELPER =====
/**
 * Get display string for hotkey (handles Mac/Windows differences)
 */
export function getHotkeyDisplay(hotkey: string): string {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return hotkey
    .split('+')
    .map((key) => {
      switch (key.toLowerCase()) {
        case 'ctrl':
        case 'control':
          return isMac ? '⌃' : 'Ctrl';
        case 'shift':
          return isMac ? '⇧' : 'Shift';
        case 'alt':
        case 'option':
          return isMac ? '⌥' : 'Alt';
        case 'meta':
        case 'cmd':
        case 'command':
          return isMac ? '⌘' : 'Win';
        case 'enter':
          return '↵';
        case 'escape':
        case 'esc':
          return 'Esc';
        case 'backspace':
          return '⌫';
        case 'delete':
          return 'Del';
        case 'arrowup':
          return '↑';
        case 'arrowdown':
          return '↓';
        case 'arrowleft':
          return '←';
        case 'arrowright':
          return '→';
        case 'space':
          return 'Space';
        default:
          return key.toUpperCase();
      }
    })
    .join(isMac ? '' : '+');
}

// ===== HOTKEY INDICATOR COMPONENT =====
interface HotkeyIndicatorProps {
  hotkey: string;
  className?: string;
}

export function HotkeyIndicator({ hotkey, className }: HotkeyIndicatorProps) {
  const display = getHotkeyDisplay(hotkey);

  return (
    <kbd
      className={`
        inline-flex items-center gap-0.5 rounded border border-border 
        bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground
        ${className || ''}
      `}
    >
      {display.split('').map((char, i) => (
        <span key={i}>{char}</span>
      ))}
    </kbd>
  );
}

export default useHotkeys;
