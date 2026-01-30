/**
 * Activity Log Item Component
 * ============================
 * Display a single activity log entry in the feed
 */

import { MoreHorizontal, Pencil, Trash2, Eye, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import type { ActivityLog } from '../types';
import { formatTimeAgo, formatActivityDate } from '../utils';
import { ActivityTypeIcon, ActivityTypeBadge } from './ActivityTypeIcon';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ActivityLogItemProps {
  activity: ActivityLog;
  onEdit?: (activity: ActivityLog) => void;
  onDelete?: (activity: ActivityLog) => void;
  onView?: (activity: ActivityLog) => void;
  showCropCycle?: boolean;
  showUser?: boolean;
  isCompact?: boolean;
  className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Activity Log Item
 *
 * @example
 * <ActivityLogItem
 *   activity={activity}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 *   showCropCycle
 * />
 */
export function ActivityLogItem({
  activity,
  onEdit,
  onDelete,
  onView,
  showCropCycle = true,
  showUser = true,
  isCompact = false,
  className,
}: ActivityLogItemProps) {
  const activityTypeCode = activity.activity_type?.code;
  const activityTypeName = activity.activity_type?.name;

  // Get user initials
  const userInitials =
    activity.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U';

  return (
    <article
      className={cn(
        'group relative flex gap-3 p-4 bg-white rounded-lg border border-gray-100',
        'hover:border-gray-200 hover:shadow-sm transition-all duration-200',
        className
      )}
    >
      {/* Activity Type Icon */}
      <div className="flex-shrink-0">
        <ActivityTypeIcon code={activityTypeCode} size="lg" showBackground />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Activity Type Badge */}
            <ActivityTypeBadge code={activityTypeCode} name={activityTypeName} />

            {/* Description */}
            {activity.description && (
              <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                {activity.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              {/* Time */}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <time
                  dateTime={activity.activity_date}
                  title={formatActivityDate(activity.activity_date)}
                >
                  {formatTimeAgo(activity.created_at)}
                </time>
              </span>

              {/* User */}
              {showUser && activity.user && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {activity.user.name}
                </span>
              )}

              {/* Crop Cycle */}
              {showCropCycle && activity.crop_cycle && (
                <Link
                  to={`/chu-ky-canh-tac/${activity.crop_cycle.id}`}
                  className="text-farm-green-600 hover:text-farm-green-700 hover:underline"
                >
                  {activity.crop_cycle.name}
                </Link>
              )}
            </div>

            {/* Notes Preview */}
            {!isCompact && activity.notes && (
              <p className="mt-2 text-xs text-gray-400 line-clamp-1 italic">
                📝 {activity.notes}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(activity)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(activity)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(activity)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* User Avatar (positioned at bottom right on hover) */}
      {showUser && activity.user && (
        <div className="absolute bottom-2 right-2">
          <Avatar className="h-6 w-6 border border-white shadow-sm">
            <AvatarFallback className="text-[10px] bg-farm-green-100 text-farm-green-700">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </article>
  );
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

export function ActivityLogItemSkeleton() {
  return (
    <div className="flex gap-3 p-4 bg-white rounded-lg border border-gray-100">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT VARIANT
// ============================================================================

interface ActivityLogItemCompactProps {
  activity: ActivityLog;
  onClick?: (activity: ActivityLog) => void;
}

/**
 * Compact activity log item for calendar/timeline views
 */
export function ActivityLogItemCompact({
  activity,
  onClick,
}: ActivityLogItemCompactProps) {
  const config = activity.activity_type;

  return (
    <button
      onClick={() => onClick?.(activity)}
      className={cn(
        'w-full flex items-center gap-2 p-2 rounded-md text-left',
        'hover:bg-gray-50 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-farm-green-500 focus:ring-offset-1'
      )}
    >
      <ActivityTypeIcon code={config?.code} size="sm" showBackground />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {config?.name || 'Hoạt động'}
        </p>
        {activity.description && (
          <p className="text-xs text-gray-500 truncate">{activity.description}</p>
        )}
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {formatTimeAgo(activity.created_at)}
      </span>
    </button>
  );
}

export default ActivityLogItem;
