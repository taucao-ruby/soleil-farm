/**
 * Timeline View Component
 * ========================
 * Vertical timeline view for activities grouped by date
 */

import { useRef, useEffect } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ActivityLog, ActivityGroup } from '../types';
import { ActivityLogItem, ActivityLogItemSkeleton } from './ActivityLogItem';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface TimelineViewProps {
  groups: ActivityGroup[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  onActivityClick?: (activity: ActivityLog) => void;
  onActivityEdit?: (activity: ActivityLog) => void;
  onActivityDelete?: (activity: ActivityLog) => void;
  onRefresh?: () => void;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Timeline View
 *
 * @example
 * <TimelineView
 *   groups={groupedActivities}
 *   isLoading={isLoading}
 *   hasNextPage={hasNextPage}
 *   fetchNextPage={fetchNextPage}
 *   onActivityClick={handleClick}
 * />
 */
export function TimelineView({
  groups,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onActivityClick,
  onActivityEdit,
  onActivityDelete,
  onRefresh,
  className,
}: TimelineViewProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state
  if (isLoading && groups.length === 0) {
    return (
      <div className={cn('space-y-6', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 w-24 bg-gray-100 rounded animate-pulse" />
            <ActivityLogItemSkeleton />
            <ActivityLogItemSkeleton />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (groups.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">📝</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Chưa có hoạt động nào
        </h3>
        <p className="text-gray-500 text-sm">
          Bắt đầu ghi nhận hoạt động canh tác của bạn
        </p>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Refresh button */}
      {onRefresh && (
        <div className="absolute -top-10 right-0">
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-8">
        {groups.map((group) => (
          <TimelineGroup
            key={group.date}
            group={group}
            onActivityClick={onActivityClick}
            onActivityEdit={onActivityEdit}
            onActivityDelete={onActivityDelete}
          />
        ))}
      </div>

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="py-4">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Đang tải thêm...</span>
          </div>
        )}

        {!hasNextPage && groups.length > 0 && (
          <p className="text-center text-sm text-gray-400">
            Đã tải hết hoạt động
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// TIMELINE GROUP
// ============================================================================

interface TimelineGroupProps {
  group: ActivityGroup;
  onActivityClick?: (activity: ActivityLog) => void;
  onActivityEdit?: (activity: ActivityLog) => void;
  onActivityDelete?: (activity: ActivityLog) => void;
}

function TimelineGroup({
  group,
  onActivityClick,
  onActivityEdit,
  onActivityDelete,
}: TimelineGroupProps) {
  return (
    <div className="relative">
      {/* Date Header */}
      <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm py-2 -mx-2 px-2">
        <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-farm-green-500" />
          {group.label}
          <span className="text-xs font-normal text-gray-400">
            ({group.activities.length} hoạt động)
          </span>
        </h3>
      </div>

      {/* Activities */}
      <div className="relative ml-4 pl-4 border-l-2 border-gray-100 space-y-3 pt-2">
        {group.activities.map((activity) => (
          <div key={activity.id} className="relative">
            {/* Timeline Dot */}
            <div
              className={cn(
                'absolute -left-[21px] top-4 w-3 h-3 rounded-full border-2 border-white',
                'bg-farm-green-400'
              )}
            />

            {/* Activity Item */}
            <ActivityLogItem
              activity={activity}
              onView={onActivityClick}
              onEdit={onActivityEdit}
              onDelete={onActivityDelete}
              showUser
              showCropCycle
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT TIMELINE
// ============================================================================

interface CompactTimelineProps {
  activities: ActivityLog[];
  maxItems?: number;
  onActivityClick?: (activity: ActivityLog) => void;
  onViewAll?: () => void;
  className?: string;
}

/**
 * Compact Timeline for dashboard or sidebar
 */
export function CompactTimeline({
  activities,
  maxItems = 5,
  onActivityClick,
  onViewAll,
  className,
}: CompactTimelineProps) {
  const displayActivities = activities.slice(0, maxItems);
  const hasMore = activities.length > maxItems;

  if (activities.length === 0) {
    return (
      <div className={cn('text-center py-6 text-gray-500 text-sm', className)}>
        Chưa có hoạt động
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {displayActivities.map((activity) => (
        <button
          key={activity.id}
          onClick={() => onActivityClick?.(activity)}
          className={cn(
            'w-full flex items-center gap-3 p-2 rounded-lg text-left',
            'hover:bg-gray-50 transition-colors'
          )}
        >
          <div className="flex-shrink-0">
            <span className="text-lg">
              {activity.activity_type?.code === 'IRRIGATION' && '💧'}
              {activity.activity_type?.code === 'FERTILIZING' && '🧪'}
              {activity.activity_type?.code === 'PLANTING' && '🌱'}
              {activity.activity_type?.code === 'HARVESTING' && '🚜'}
              {!['IRRIGATION', 'FERTILIZING', 'PLANTING', 'HARVESTING'].includes(
                activity.activity_type?.code || ''
              ) && '📝'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.activity_type?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {activity.crop_cycle?.name}
            </p>
          </div>
        </button>
      ))}

      {hasMore && onViewAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="w-full text-farm-green-600"
        >
          Xem tất cả ({activities.length})
        </Button>
      )}
    </div>
  );
}

export default TimelineView;
