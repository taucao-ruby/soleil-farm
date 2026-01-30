/**
 * Calendar View Component
 * ========================
 * Month/Week/Day calendar view for activities
 */

import { useState, useMemo, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ActivityLog, CalendarViewMode } from '../types';
import {
  getMonthDays,
  getWeekDays,
  format,
  isToday,
  addDays,
  subDays,
  parseISO,
} from '../utils';
import { useCalendarActivities } from '../hooks';
import { ActivityTypeIcon } from './ActivityTypeIcon';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface CalendarViewProps {
  onDateClick?: (date: Date) => void;
  onActivityClick?: (activity: ActivityLog) => void;
  onAddActivity?: (date: Date) => void;
  cropCycleId?: number;
  className?: string;
}

// ============================================================================
// WEEKDAY NAMES
// ============================================================================

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Calendar View
 *
 * @example
 * <CalendarView
 *   onDateClick={handleDateClick}
 *   onActivityClick={handleActivityClick}
 *   onAddActivity={handleAddActivity}
 * />
 */
export function CalendarView({
  onDateClick,
  onActivityClick,
  onAddActivity,
  cropCycleId,
  className,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  // Fetch activities for current view
  const { activitiesByDate } = useCalendarActivities(currentDate, {
    crop_cycle_id: cropCycleId,
  });

  // Navigation handlers
  const goToPrevious = useCallback(() => {
    const days = viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 1;
    setCurrentDate((d) => subDays(d, days));
  }, [viewMode]);

  const goToNext = useCallback(() => {
    const days = viewMode === 'month' ? 30 : viewMode === 'week' ? 7 : 1;
    setCurrentDate((d) => addDays(d, days));
  }, [viewMode]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Get days for current view
  const days = useMemo(() => {
    if (viewMode === 'month') {
      return getMonthDays(currentDate);
    }
    if (viewMode === 'week') {
      return getWeekDays(currentDate);
    }
    return [currentDate];
  }, [currentDate, viewMode]);

  // Current month info
  const monthYear = format(currentDate, 'MMMM yyyy', { locale: undefined });

  return (
    <div className={cn('bg-white rounded-lg border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold capitalize">{monthYear}</h2>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hôm nay
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Tabs */}
          <div className="flex rounded-lg border p-1">
            {(['month', 'week', 'day'] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  'px-3 py-1 text-sm rounded-md transition-colors',
                  viewMode === mode
                    ? 'bg-farm-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {mode === 'month' && 'Tháng'}
                {mode === 'week' && 'Tuần'}
                {mode === 'day' && 'Ngày'}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={goToPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'month' && (
        <MonthView
          days={days}
          currentDate={currentDate}
          activitiesByDate={activitiesByDate}
          onDateClick={onDateClick}
          onActivityClick={onActivityClick}
          onAddActivity={onAddActivity}
        />
      )}

      {viewMode === 'week' && (
        <WeekView
          days={days}
          activitiesByDate={activitiesByDate}
          onActivityClick={onActivityClick}
          onAddActivity={onAddActivity}
        />
      )}

      {viewMode === 'day' && (
        <DayView
          date={currentDate}
          activities={activitiesByDate.get(format(currentDate, 'yyyy-MM-dd')) || []}
          onActivityClick={onActivityClick}
          onAddActivity={onAddActivity}
        />
      )}
    </div>
  );
}

// ============================================================================
// MONTH VIEW
// ============================================================================

interface MonthViewProps {
  days: Date[];
  currentDate: Date;
  activitiesByDate: Map<string, ActivityLog[]>;
  onDateClick?: (date: Date) => void;
  onActivityClick?: (activity: ActivityLog) => void;
  onAddActivity?: (date: Date) => void;
}

function MonthView({
  days,
  currentDate,
  activitiesByDate,
  onDateClick,
  onActivityClick,
  onAddActivity,
}: MonthViewProps) {
  const currentMonth = currentDate.getMonth();

  return (
    <div className="p-2">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const activities = activitiesByDate.get(dateKey) || [];
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isCurrentDay = isToday(day);

          return (
            <CalendarDayCell
              key={dateKey}
              date={day}
              activities={activities}
              isCurrentMonth={isCurrentMonth}
              isToday={isCurrentDay}
              onClick={() => onDateClick?.(day)}
              onActivityClick={onActivityClick}
              onAddClick={() => onAddActivity?.(day)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// CALENDAR DAY CELL
// ============================================================================

interface CalendarDayCellProps {
  date: Date;
  activities: ActivityLog[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick?: () => void;
  onActivityClick?: (activity: ActivityLog) => void;
  onAddClick?: () => void;
}

function CalendarDayCell({
  date,
  activities,
  isCurrentMonth,
  isToday,
  onClick,
  onActivityClick,
  onAddClick,
}: CalendarDayCellProps) {
  const maxDots = 3;
  const hasMore = activities.length > maxDots;

  return (
    <div
      className={cn(
        'group relative min-h-[80px] p-1 rounded-md border border-transparent',
        'hover:border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer',
        !isCurrentMonth && 'opacity-40'
      )}
      onClick={onClick}
    >
      {/* Date Number */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full',
            isToday && 'bg-farm-green-600 text-white',
            !isToday && 'text-gray-700'
          )}
        >
          {format(date, 'd')}
        </span>

        {/* Add Button (shown on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddClick?.();
          }}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'w-5 h-5 flex items-center justify-center rounded',
            'text-gray-400 hover:text-farm-green-600 hover:bg-farm-green-50'
          )}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Activity Dots */}
      <div className="flex flex-wrap gap-0.5">
        {activities.slice(0, maxDots).map((activity) => (
          <button
            key={activity.id}
            onClick={(e) => {
              e.stopPropagation();
              onActivityClick?.(activity);
            }}
            className="focus:outline-none focus:ring-2 focus:ring-farm-green-500 rounded-full"
            title={activity.activity_type?.name}
          >
            <ActivityTypeIcon
              code={activity.activity_type?.code}
              size="sm"
              showBackground
            />
          </button>
        ))}
        {hasMore && (
          <span className="w-5 h-5 flex items-center justify-center text-[10px] text-gray-500 bg-gray-100 rounded-full">
            +{activities.length - maxDots}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// WEEK VIEW
// ============================================================================

interface WeekViewProps {
  days: Date[];
  activitiesByDate: Map<string, ActivityLog[]>;
  onDateClick?: (date: Date) => void;
  onActivityClick?: (activity: ActivityLog) => void;
  onAddActivity?: (date: Date) => void;
}

function WeekView({
  days,
  activitiesByDate,
  onActivityClick,
  onAddActivity,
}: WeekViewProps) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const activities = activitiesByDate.get(dateKey) || [];
          const isCurrentDay = isToday(day);

          return (
            <div
              key={dateKey}
              className={cn(
                'min-h-[200px] p-2 rounded-lg border',
                isCurrentDay ? 'border-farm-green-300 bg-farm-green-50/30' : 'border-gray-200'
              )}
            >
              {/* Day Header */}
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">{format(day, 'EEE')}</p>
                <p
                  className={cn(
                    'text-lg font-semibold',
                    isCurrentDay ? 'text-farm-green-600' : 'text-gray-900'
                  )}
                >
                  {format(day, 'd')}
                </p>
              </div>

              {/* Activities */}
              <div className="space-y-1">
                {activities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => onActivityClick?.(activity)}
                    className={cn(
                      'w-full flex items-center gap-1.5 p-1.5 rounded text-left',
                      'hover:bg-gray-100 transition-colors text-xs'
                    )}
                  >
                    <ActivityTypeIcon
                      code={activity.activity_type?.code}
                      size="sm"
                      showBackground={false}
                    />
                    <span className="truncate">
                      {activity.activity_type?.name}
                    </span>
                  </button>
                ))}

                {/* Add Activity Button */}
                <button
                  onClick={() => onAddActivity?.(day)}
                  className={cn(
                    'w-full flex items-center justify-center gap-1 p-1.5 rounded',
                    'text-gray-400 hover:text-farm-green-600 hover:bg-farm-green-50',
                    'transition-colors text-xs'
                  )}
                >
                  <Plus className="w-3 h-3" />
                  Thêm
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// DAY VIEW
// ============================================================================

interface DayViewProps {
  date: Date;
  activities: ActivityLog[];
  onActivityClick?: (activity: ActivityLog) => void;
  onAddActivity?: (date: Date) => void;
}

function DayView({
  date,
  activities,
  onActivityClick,
  onAddActivity,
}: DayViewProps) {
  // Generate 24 hours
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="p-4">
      {/* Day Header */}
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">{format(date, 'EEEE')}</p>
        <p className="text-2xl font-semibold">{format(date, 'd MMMM yyyy')}</p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-gray-200 ml-12">
        {hours.map((hour) => {
          const hourActivities = activities.filter((a) => {
            const activityDate = parseISO(a.created_at);
            return activityDate.getHours() === hour;
          });

          return (
            <div key={hour} className="relative min-h-[60px] pl-6 pb-2">
              {/* Hour Label */}
              <span className="absolute -left-12 top-0 text-xs text-gray-400 w-8 text-right">
                {hour.toString().padStart(2, '0')}:00
              </span>

              {/* Hour Dot */}
              <div className="absolute -left-1.5 top-1 w-3 h-3 bg-gray-200 rounded-full" />

              {/* Activities */}
              {hourActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => onActivityClick?.(activity)}
                  className={cn(
                    'w-full flex items-center gap-2 p-2 mb-1 rounded-lg',
                    'bg-gray-50 hover:bg-gray-100 transition-colors text-left'
                  )}
                >
                  <ActivityTypeIcon
                    code={activity.activity_type?.code}
                    size="md"
                    showBackground
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {activity.activity_type?.name}
                    </p>
                    {activity.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add Activity FAB */}
      <button
        onClick={() => onAddActivity?.(date)}
        className={cn(
          'fixed bottom-20 right-6 z-40',
          'flex items-center gap-2 px-4 py-2 rounded-full shadow-lg',
          'bg-white border border-farm-green-200 text-farm-green-600',
          'hover:bg-farm-green-50 transition-colors'
        )}
      >
        <Plus className="w-4 h-4" />
        Thêm vào ngày này
      </button>
    </div>
  );
}

export default CalendarView;
