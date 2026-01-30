import React from 'react';

import { LucideIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

interface StatCardProps {
  /** Card title */
  title: string;
  /** Main value to display */
  value: string | number;
  /** Additional description */
  description?: string;
  /** Icon component */
  icon?: LucideIcon;
  /** Icon color class */
  iconColor?: string;
  /** Trend indicator */
  trend?: {
    value: string;
    isPositive?: boolean;
    icon?: LucideIcon;
  };
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for drill-down */
  onClick?: () => void;
  /** Additional className */
  className?: string;
}

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

/**
 * StatCard Component
 * ==================
 * Displays a key metric with icon, value, description, and trend indicator.
 *
 * @example
 * <StatCard
 *   title="Tổng diện tích"
 *   value="50,000 m²"
 *   description="12 lô đất"
 *   icon={Map}
 *   iconColor="text-farm-leaf"
 *   trend={{ value: "+2 lô tháng này", isPositive: true }}
 * />
 */
export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
  isLoading = false,
  onClick,
  className,
}: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  const TrendIcon = trend?.icon;
  const isClickable = Boolean(onClick);

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        isClickable && 'cursor-pointer hover:shadow-md hover:border-primary/50',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className={cn('h-5 w-5', iconColor)} />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 mt-2 text-xs',
              trend.isPositive === true && 'text-green-600 dark:text-green-400',
              trend.isPositive === false && 'text-red-600 dark:text-red-400',
              trend.isPositive === undefined && 'text-muted-foreground'
            )}
          >
            {TrendIcon && <TrendIcon className="h-3 w-3" />}
            <span>{trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// STAT CARDS GRID
// ============================================================================

interface StatCardsGridProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Grid container for stat cards
 */
export function StatCardsGrid({ children, className }: StatCardsGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {children}
    </div>
  );
}
