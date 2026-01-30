import * as React from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// TOOLTIP COMPONENT (Simple implementation for Recharts)
// ============================================================================

interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  /** Tooltip content */
  content?: React.ReactNode;
  /** Side to show tooltip */
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, content, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
      <div
        ref={ref}
        className="relative inline-flex"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        {...props}
      >
        {children}
        {isVisible && content && (
          <div
            className={cn(
              'absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform',
              'rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md',
              'animate-in fade-in-0 zoom-in-95',
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);
Tooltip.displayName = 'Tooltip';

// ============================================================================
// TOOLTIP PROVIDER (for compatibility)
// ============================================================================

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>;
}

// ============================================================================
// TOOLTIP TRIGGER
// ============================================================================

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(
  ({ className, children, asChild, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { ref, ...props } as React.Attributes);
    }
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }
);
TooltipTrigger.displayName = 'TooltipTrigger';

// ============================================================================
// TOOLTIP CONTENT
// ============================================================================

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
          'animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };
