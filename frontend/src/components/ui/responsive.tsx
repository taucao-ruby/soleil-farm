/**
 * Responsive UI Components
 * =========================
 * Mobile-first responsive components for Soleil Farm
 */

import * as React from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { ChevronLeft, X, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { haptic } from '@/hooks/useTouchInteractions';

// ============================================================================
// MOBILE HEADER
// ============================================================================

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * MobileHeader Component
 * =======================
 * Sticky header optimized for mobile with back button and actions
 */
export function MobileHeader({
  title,
  subtitle,
  onBack,
  actions,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'border-b border-border',
        'px-4 py-3 safe-area-top',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              haptic('light');
              onBack();
            }}
            className="shrink-0 -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

// ============================================================================
// RESPONSIVE MODAL
// ============================================================================

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * ResponsiveModal Component
 * ==========================
 * Full-screen on mobile, dialog on desktop
 */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-background"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b safe-area-top">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 pb-safe">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="sticky bottom-0 bg-background border-t p-4 safe-area-bottom">
                {footer}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        {footer && <div className="mt-4">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// SWIPEABLE LIST ITEM
// ============================================================================

interface SwipeAction {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

interface SwipeableListItemProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onPress?: () => void;
  className?: string;
}

/**
 * SwipeableListItem Component
 * ============================
 * List item with swipe-to-reveal actions
 */
export function SwipeableListItem({
  children,
  leftActions = [],
  rightActions = [],
  onPress,
  className,
}: SwipeableListItemProps) {
  const [offset, setOffset] = React.useState(0);
  const [isRevealed, setIsRevealed] = React.useState<'left' | 'right' | null>(null);
  const isMobile = useIsMobile();

  const actionWidth = 72; // Width per action button
  const leftWidth = leftActions.length * actionWidth;
  const rightWidth = rightActions.length * actionWidth;

  const handleDrag = (_: unknown, info: PanInfo) => {
    const newOffset = info.offset.x;

    // Limit drag distance
    const minOffset = -rightWidth;
    const maxOffset = leftWidth;
    setOffset(Math.max(minOffset, Math.min(maxOffset, newOffset)));
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.x;
    const threshold = 0.5;

    if (info.offset.x > leftWidth * threshold || velocity > 500) {
      setOffset(leftWidth);
      setIsRevealed('left');
      haptic('light');
    } else if (info.offset.x < -rightWidth * threshold || velocity < -500) {
      setOffset(-rightWidth);
      setIsRevealed('right');
      haptic('light');
    } else {
      setOffset(0);
      setIsRevealed(null);
    }
  };

  const handleActionClick = (action: SwipeAction) => {
    haptic('medium');
    action.onClick();
    setOffset(0);
    setIsRevealed(null);
  };

  const close = () => {
    setOffset(0);
    setIsRevealed(null);
  };

  if (!isMobile || (leftActions.length === 0 && rightActions.length === 0)) {
    return (
      <div
        className={cn('cursor-pointer', className)}
        onClick={onPress}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Left actions (revealed when swiping right) */}
      <div
        className="absolute inset-y-0 left-0 flex"
        style={{ width: leftWidth }}
      >
        {leftActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action)}
            className="flex flex-col items-center justify-center text-white text-xs font-medium"
            style={{
              width: actionWidth,
              backgroundColor: action.color,
            }}
          >
            {action.icon}
            <span className="mt-1">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Right actions (revealed when swiping left) */}
      <div
        className="absolute inset-y-0 right-0 flex"
        style={{ width: rightWidth }}
      >
        {rightActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action)}
            className="flex flex-col items-center justify-center text-white text-xs font-medium"
            style={{
              width: actionWidth,
              backgroundColor: action.color,
            }}
          >
            {action.icon}
            <span className="mt-1">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -rightWidth, right: leftWidth }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: offset }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        onClick={() => {
          if (isRevealed) {
            close();
          } else {
            onPress?.();
          }
        }}
        className={cn('bg-background relative z-10', className)}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ============================================================================
// RESPONSIVE CARD
// ============================================================================

interface ResponsiveCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveCard Component
 * =========================
 * Adaptive card that adjusts padding and layout for mobile
 */
export function ResponsiveCard({
  title,
  subtitle,
  icon,
  children,
  onClick,
  actions,
  className,
}: ResponsiveCardProps) {
  const isMobile = useIsMobile();

  return (
    <Card
      className={cn(
        'transition-all',
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.98]',
        isMobile ? 'rounded-none border-x-0' : 'rounded-lg',
        className
      )}
      onClick={onClick}
    >
      {(title || icon || actions) && (
        <CardHeader className={cn('flex-row items-center gap-3', isMobile ? 'p-3' : 'p-4')}>
          {icon && <div className="shrink-0">{icon}</div>}
          <div className="flex-1 min-w-0">
            {title && (
              <CardTitle className={cn('truncate', isMobile ? 'text-base' : 'text-lg')}>
                {title}
              </CardTitle>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </CardHeader>
      )}
      <CardContent className={cn(isMobile ? 'p-3 pt-0' : 'p-4 pt-0')}>
        {children}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MOBILE ACTION SHEET
// ============================================================================

interface ActionSheetAction {
  label: string;
  icon?: React.ReactNode;
  destructive?: boolean;
  onClick: () => void;
}

interface MobileActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  actions: ActionSheetAction[];
}

/**
 * MobileActionSheet Component
 * ============================
 * iOS-style action sheet for mobile
 */
export function MobileActionSheet({
  open,
  onOpenChange,
  title,
  actions,
}: MobileActionSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-2 safe-area-bottom"
          >
            {/* Actions card */}
            <div className="bg-background rounded-xl overflow-hidden mb-2">
              {title && (
                <div className="text-center text-sm text-muted-foreground py-3 border-b">
                  {title}
                </div>
              )}
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    haptic('light');
                    action.onClick();
                    onOpenChange(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-center gap-3 py-4 text-base font-medium',
                    'hover:bg-muted active:bg-muted transition-colors',
                    action.destructive && 'text-destructive',
                    index < actions.length - 1 && 'border-b'
                  )}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            {/* Cancel button */}
            <button
              onClick={() => onOpenChange(false)}
              className="w-full bg-background rounded-xl py-4 text-base font-semibold text-primary hover:bg-muted"
            >
              Hủy
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// PULL TO REFRESH INDICATOR
// ============================================================================

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold?: number;
}

/**
 * PullToRefreshIndicator Component
 * ==================================
 * Visual indicator for pull-to-refresh
 */
export function PullToRefreshIndicator({
  pullDistance,
  isRefreshing,
  threshold = 80,
}: PullToRefreshIndicatorProps) {
  const progress = Math.min(pullDistance / threshold, 1);
  const shouldRefresh = pullDistance >= threshold;

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-all"
      style={{ height: isRefreshing ? 60 : pullDistance }}
    >
      {isRefreshing ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
        />
      ) : (
        <motion.div
          animate={{ rotate: progress * 360, scale: shouldRefresh ? 1.1 : 1 }}
          className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center',
            shouldRefresh
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted-foreground'
          )}
        >
          <motion.svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            animate={{ rotate: shouldRefresh ? 180 : 0 }}
          >
            <path
              fill="currentColor"
              d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
            />
          </motion.svg>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================================
// FLOATING ACTION BUTTON GROUP
// ============================================================================

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingActionGroupProps {
  mainIcon: React.ReactNode;
  actions: FABAction[];
  className?: string;
}

/**
 * FloatingActionGroup Component
 * ==============================
 * Expandable FAB with multiple actions
 */
export function FloatingActionGroup({
  mainIcon,
  actions,
  className,
}: FloatingActionGroupProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn('fixed bottom-24 right-4 z-40', className)}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20"
            />

            {/* Actions */}
            <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3">
              {actions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="bg-background shadow-lg rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                  <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg"
                    onClick={() => {
                      haptic('light');
                      action.onClick();
                      setIsOpen(false);
                    }}
                  >
                    {action.icon}
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-xl"
        onClick={() => {
          haptic('medium');
          setIsOpen(!isOpen);
        }}
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }}>
          {mainIcon}
        </motion.div>
      </Button>
    </div>
  );
}

export {
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  MoreHorizontal as MoreIcon,
};
