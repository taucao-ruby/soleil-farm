import * as React from 'react';

import { cn } from '@/lib/utils';

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
}

function Skeleton({ className, width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

// ============================================================================
// SKELETON VARIANTS
// ============================================================================

/**
 * Skeleton for stat cards
 */
function StatCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
        <div className="flex items-center gap-1 mt-2">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for chart containers
 */
function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6 pb-2">
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="p-6 pt-0">
        <Skeleton height={height} className="w-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for table rows
 */
function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b last:border-0">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 / columns}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for data tables
 */
function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="p-6 pb-2">
        <Skeleton className="h-6 w-40 mb-1" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="divide-y">
        {/* Header */}
        <div className="flex items-center gap-4 py-3 px-4 bg-muted/50">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{ width: `${100 / columns}%` }}
            />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for timeline items
 */
function TimelineItemSkeleton() {
  return (
    <div className="flex items-center gap-4 py-2">
      <Skeleton className="h-3 w-3 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

/**
 * Full dashboard skeleton
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TableSkeleton rows={5} columns={4} />
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  );
}

export {
  Skeleton,
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  TableRowSkeleton,
  TimelineItemSkeleton,
  DashboardSkeleton,
};
