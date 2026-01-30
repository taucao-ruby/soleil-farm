/**
 * Soleil Farm Design System - StatusBadge Component
 * =================================================
 * Badge component for displaying status with semantic colors.
 * Used for land parcel status, crop cycle status, activity status, etc.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

// ===== STATUS CONFIGURATION =====
const statusConfig = {
  // Land Parcel Status
  available: {
    label: 'Sẵn sàng',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  in_use: {
    label: 'Đang sử dụng',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  resting: {
    label: 'Đang nghỉ',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  maintenance: {
    label: 'Bảo trì',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },

  // Crop Cycle Status
  planned: {
    label: 'Đã lên kế hoạch',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  active: {
    label: 'Đang hoạt động',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  harvested: {
    label: 'Đã thu hoạch',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
  failed: {
    label: 'Thất bại',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-500',
  },

  // Activity Status
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  in_progress: {
    label: 'Đang thực hiện',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  done: {
    label: 'Hoàn thành',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  skipped: {
    label: 'Bỏ qua',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-500',
  },

  // Generic Status
  success: {
    label: 'Thành công',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  warning: {
    label: 'Cảnh báo',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  error: {
    label: 'Lỗi',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  info: {
    label: 'Thông tin',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  default: {
    label: 'Mặc định',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-500',
  },
} as const;

export type StatusType = keyof typeof statusConfig;

// ===== BADGE VARIANTS =====
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'font-medium rounded-full border',
    'transition-colors duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
      variant: {
        filled: '',
        outline: 'bg-transparent',
        subtle: 'border-transparent',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'filled',
    },
  }
);

// ===== COMPONENT TYPES =====
export interface StatusBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof badgeVariants> {
  /** Status type */
  status: StatusType;
  /** Custom label (overrides default) */
  children?: React.ReactNode;
  /** Show status dot */
  showDot?: boolean;
  /** Animate dot (pulse effect) */
  animateDot?: boolean;
  /** Icon to show before text */
  icon?: React.ReactNode;
}

// ===== STATUS BADGE COMPONENT =====
const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      className,
      status,
      size,
      variant,
      children,
      showDot = true,
      animateDot = false,
      icon,
      ...props
    },
    ref
  ) => {
    const config = statusConfig[status] || statusConfig.default;

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ size, variant }), config.color, className)}
        {...props}
      >
        {/* Status Dot */}
        {showDot && (
          <span className="relative flex h-2 w-2">
            {animateDot && (
              <motion.span
                className={cn(
                  'absolute inline-flex h-full w-full rounded-full opacity-75',
                  config.dot
                )}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.75, 0, 0.75],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              />
            )}
            <span
              className={cn('relative inline-flex h-2 w-2 rounded-full', config.dot)}
            />
          </span>
        )}

        {/* Icon */}
        {icon && <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}

        {/* Label */}
        <span>{children || config.label}</span>
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// ===== HELPER COMPONENTS =====

/**
 * Generic Badge component (non-status)
 */
const genericBadgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'font-medium rounded-full',
    'transition-colors duration-200',
  ],
  {
    variants: {
      color: {
        primary: 'bg-primary/10 text-primary border border-primary/20',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-emerald-100 text-emerald-700',
        warning: 'bg-amber-100 text-amber-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        gray: 'bg-slate-100 text-slate-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      color: 'gray',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof genericBadgeVariants> {
  /** Remove button callback */
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color, size, children, onRemove, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(genericBadgeVariants({ color, size }), className)}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 -mr-1 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Remove"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ===== EXPORTS =====
export { StatusBadge, Badge, badgeVariants, genericBadgeVariants, statusConfig };
export default StatusBadge;
