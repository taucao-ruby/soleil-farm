/**
 * Soleil Farm Design System - StatCard Component
 * ==============================================
 * Card component for displaying statistics and metrics.
 * Features trend indicators, icons, and animated numbers.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

// ===== STAT CARD VARIANTS =====
const statCardVariants = cva(
  [
    'relative overflow-hidden rounded-xl',
    'bg-card text-card-foreground',
    'border border-border',
    'transition-all duration-200',
  ],
  {
    variants: {
      size: {
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-lg hover:border-primary/30 active:scale-[0.99]',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      interactive: false,
    },
  }
);

// ===== TREND TYPE =====
type TrendDirection = 'up' | 'down' | 'neutral';

interface TrendInfo {
  value: string | number;
  direction: TrendDirection;
  label?: string;
}

// ===== COMPONENT TYPES =====
export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  /** Card title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Previous value for comparison */
  previousValue?: string | number;
  /** Trend information */
  trend?: TrendInfo | string;
  /** Icon to display */
  icon?: React.ReactNode;
  /** Icon background color */
  iconBg?: string;
  /** Description or helper text */
  description?: string;
  /** Unit of measurement */
  unit?: string;
  /** Animate number on mount */
  animateValue?: boolean;
  /** Show loading state */
  loading?: boolean;
  /** Additional action button */
  action?: React.ReactNode;
}

// ===== ANIMATED NUMBER COMPONENT =====
interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
}

function AnimatedNumber({
  value,
  duration = 0.8,
  formatValue = (v) => v.toLocaleString('vi-VN'),
}: AnimatedNumberProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => formatValue(Math.round(latest)));
  const [displayValue, setDisplayValue] = React.useState(formatValue(0));

  React.useEffect(() => {
    const unsubscribe = rounded.on('change', setDisplayValue);
    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, motionValue, rounded]);

  return <span>{displayValue}</span>;
}

// ===== TREND INDICATOR COMPONENT =====
interface TrendIndicatorProps {
  trend: TrendInfo | string;
}

function TrendIndicator({ trend }: TrendIndicatorProps) {
  // Parse trend if it's a string like "+12%" or "-5%"
  const parseTrend = (t: TrendInfo | string): TrendInfo => {
    if (typeof t === 'object') return t;

    const numMatch = t.match(/([+-]?\d+\.?\d*)%?/);
    if (!numMatch) return { value: t, direction: 'neutral' };

    const numValue = parseFloat(numMatch[1]);
    return {
      value: t,
      direction: numValue > 0 ? 'up' : numValue < 0 ? 'down' : 'neutral',
    };
  };

  const trendInfo = parseTrend(trend);
  const { value, direction, label } = trendInfo;

  const trendStyles = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50',
  };

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }[direction];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        trendStyles[direction]
      )}
    >
      <TrendIcon className="h-3 w-3" />
      <span>{value}</span>
      {label && <span className="text-muted-foreground">{label}</span>}
    </div>
  );
}

// ===== STAT CARD COMPONENT =====
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      size,
      interactive,
      title,
      value,
      previousValue,
      trend,
      icon,
      iconBg = 'bg-primary/10',
      description,
      unit,
      animateValue = false,
      loading = false,
      action,
      ...props
    },
    ref
  ) => {
    // Parse numeric value for animation
    const numericValue =
      typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    const isNumeric = !isNaN(numericValue);

    return (
      <motion.div
        ref={ref}
        className={cn(statCardVariants({ size, interactive }), className)}
        initial={animateValue ? { opacity: 0, y: 20 } : false}
        animate={animateValue ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3 }}
        whileHover={interactive ? { y: -2 } : undefined}
        {...props}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Header: Title + Action */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>

          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                iconBg,
                '[&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary'
              )}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {animateValue && isNumeric ? (
              <AnimatedNumber value={numericValue} />
            ) : (
              value
            )}
          </span>
          {unit && (
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          )}
        </div>

        {/* Trend & Description */}
        {(trend || description) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {trend && <TrendIndicator trend={trend} />}
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
        )}

        {/* Action */}
        {action && <div className="mt-4">{action}</div>}

        {/* Decorative gradient (optional) */}
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5" />
      </motion.div>
    );
  }
);

StatCard.displayName = 'StatCard';

// ===== STAT CARD GROUP =====
interface StatCardGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4;
}

const StatCardGroup = React.forwardRef<HTMLDivElement, StatCardGroupProps>(
  ({ className, columns = 4, children, ...props }, ref) => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    };

    return (
      <div
        ref={ref}
        className={cn('grid gap-4', gridCols[columns], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatCardGroup.displayName = 'StatCardGroup';

// ===== EXPORTS =====
export { StatCard, StatCardGroup, statCardVariants, AnimatedNumber, TrendIndicator };
export default StatCard;
