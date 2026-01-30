import { useState, useCallback } from 'react';

/**
 * useDisclosure Hook
 * ==================
 * Manages open/close state for modals, dialogs, drawers
 * 
 * @example
 * const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
 */
export function useDisclosure(defaultIsOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => { setIsOpen(true); }, []);
  const onClose = useCallback(() => { setIsOpen(false); }, []);
  const onToggle = useCallback(() => { setIsOpen((prev) => !prev); }, []);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  };
}
