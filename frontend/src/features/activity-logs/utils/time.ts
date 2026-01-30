/**
 * Time Utility Functions
 * =======================
 * Utilities for time formatting and date calculations
 */

import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachHourOfInterval,
  isSameDay,
  parseISO,
  addDays,
  subDays,
} from 'date-fns';
import { vi } from 'date-fns/locale';

import type { ActivityLog, ActivityGroup, DateRangePreset } from '../types';

// ============================================================================
// TIME AGO FORMATTING
// ============================================================================

/**
 * Format date as relative time ("2 giờ trước", "hôm qua")
 */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: vi });
}

/**
 * Format date for display
 */
export function formatActivityDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) {
    return `Hôm nay, ${format(d, 'HH:mm', { locale: vi })}`;
  }

  if (isYesterday(d)) {
    return `Hôm qua, ${format(d, 'HH:mm', { locale: vi })}`;
  }

  if (isThisWeek(d)) {
    return format(d, 'EEEE, HH:mm', { locale: vi });
  }

  return format(d, 'dd/MM/yyyy, HH:mm', { locale: vi });
}

/**
 * Format date for calendar display
 */
export function formatCalendarDate(date: Date): string {
  return format(date, 'dd/MM/yyyy', { locale: vi });
}

/**
 * Format time only
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale: vi });
}

/**
 * Format duration in hours
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} phút`;
  }

  if (hours === Math.floor(hours)) {
    return `${hours} giờ`;
  }

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours} giờ ${minutes} phút`;
}

// ============================================================================
// DATE GROUPING
// ============================================================================

/**
 * Get group label for a date
 */
export function getDateGroupLabel(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return 'Hôm nay';
  if (isYesterday(d)) return 'Hôm qua';
  if (isThisWeek(d)) return 'Tuần này';
  if (isThisMonth(d)) return 'Tháng này';

  return format(d, 'MMMM yyyy', { locale: vi });
}

/**
 * Group activities by date
 */
export function groupActivitiesByDate(
  activities: ActivityLog[]
): ActivityGroup[] {
  const groups = new Map<string, ActivityLog[]>();

  activities.forEach((activity) => {
    const dateKey = format(parseISO(activity.activity_date), 'yyyy-MM-dd');
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, activity]);
  });

  const result: ActivityGroup[] = [];
  groups.forEach((groupActivities, dateKey) => {
    result.push({
      date: dateKey,
      label: getDateGroupLabel(parseISO(dateKey)),
      activities: groupActivities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    });
  });

  // Sort groups by date (newest first)
  return result.sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  );
}

// ============================================================================
// DATE RANGE CALCULATIONS
// ============================================================================

/**
 * Get date range from preset
 */
export function getDateRangeFromPreset(
  preset: DateRangePreset
): { from: Date; to: Date } {
  const today = new Date();

  switch (preset) {
    case 'today':
      return { from: startOfDay(today), to: endOfDay(today) };

    case 'this_week':
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      };

    case 'this_month':
      return { from: startOfMonth(today), to: endOfMonth(today) };

    case 'custom':
    default:
      // Return last 30 days for custom (default)
      return { from: subDays(today, 30), to: endOfDay(today) };
  }
}

/**
 * Get formatted date range string
 */
export function formatDateRange(from: Date, to: Date): string {
  if (isSameDay(from, to)) {
    return formatCalendarDate(from);
  }

  return `${format(from, 'dd/MM', { locale: vi })} - ${format(to, 'dd/MM/yyyy', { locale: vi })}`;
}

// ============================================================================
// CALENDAR HELPERS
// ============================================================================

/**
 * Get days of month for calendar view
 */
export function getMonthDays(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  // Extend to include padding days
  const calendarStart = startOfWeek(start, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(end, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

/**
 * Get days of week
 */
export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

/**
 * Get hours of day for timeline view
 */
export function getDayHours(date: Date): Date[] {
  const start = startOfDay(date);
  const end = endOfDay(date);
  return eachHourOfInterval({ start, end });
}

/**
 * Check if two dates are same day
 */
export function areSameDay(a: Date | string, b: Date | string): boolean {
  const dateA = typeof a === 'string' ? parseISO(a) : a;
  const dateB = typeof b === 'string' ? parseISO(b) : b;
  return isSameDay(dateA, dateB);
}

/**
 * Navigate dates
 */
export function navigateDate(
  date: Date,
  direction: 'prev' | 'next',
  view: 'month' | 'week' | 'day'
): Date {
  const days = view === 'month' ? 30 : view === 'week' ? 7 : 1;
  return direction === 'next' ? addDays(date, days) : subDays(date, days);
}

/**
 * Get current time string (HH:mm)
 */
export function getCurrentTimeString(): string {
  return format(new Date(), 'HH:mm');
}

/**
 * Get current date string (yyyy-MM-dd)
 */
export function getCurrentDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// Re-exports for convenience
export {
  format,
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  addDays,
  subDays,
};
