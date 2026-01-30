/**
 * Soleil Farm Design System - Modal Component
 * ==========================================
 * Accessible modal/dialog component built on Radix UI.
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

// ===== MODAL SIZE VARIANTS =====
const modalVariants = cva(
  [
    'fixed z-50 w-full gap-4 rounded-t-xl bg-background p-6 shadow-lg',
    'sm:rounded-xl',
    'max-h-[90vh] overflow-y-auto',
    'focus:outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
        full: 'sm:max-w-[calc(100vw-2rem)]',
      },
      position: {
        center: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
        top: 'left-1/2 top-16 -translate-x-1/2',
        bottom: 'bottom-0 left-1/2 -translate-x-1/2 sm:bottom-8',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'center',
    },
  }
);

// ===== COMPONENT TYPES =====
export interface ModalProps
  extends DialogPrimitive.DialogProps,
    VariantProps<typeof modalVariants> {
  /** Modal trigger element */
  trigger?: React.ReactNode;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Hide close button */
  hideCloseButton?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Content container className */
  contentClassName?: string;
}

// ===== ANIMATION VARIANTS =====
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

// ===== MODAL COMPONENT =====
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      trigger,
      title,
      description,
      size,
      position,
      hideCloseButton = false,
      closeOnOverlayClick = true,
      footer,
      contentClassName,
      open,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} {...props}>
        {/* Trigger */}
        {trigger && (
          <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
        )}

        {/* Portal */}
        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              {/* Overlay */}
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  onClick={closeOnOverlayClick ? () => onOpenChange?.(false) : undefined}
                />
              </DialogPrimitive.Overlay>

              {/* Content */}
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  ref={ref}
                  className={cn(modalVariants({ size, position }), contentClassName)}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  {(title || description) && (
                    <div className="mb-4">
                      {title && (
                        <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                          {title}
                        </DialogPrimitive.Title>
                      )}
                      {description && (
                        <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                          {description}
                        </DialogPrimitive.Description>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">{children}</div>

                  {/* Footer */}
                  {footer && (
                    <div className="mt-6 flex items-center justify-end gap-3">
                      {footer}
                    </div>
                  )}

                  {/* Close Button */}
                  {!hideCloseButton && (
                    <DialogPrimitive.Close
                      className={cn(
                        'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background',
                        'transition-opacity hover:opacity-100',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        'disabled:pointer-events-none',
                        'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
                      )}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  )}
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    );
  }
);

Modal.displayName = 'Modal';

// ===== CONFIRM MODAL =====
interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring'
            )}
          >
            {loading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {confirmText}
          </button>
        </>
      }
    />
  );
};

// ===== EXPORTS =====
export { Modal, ConfirmModal, modalVariants };
export default Modal;
