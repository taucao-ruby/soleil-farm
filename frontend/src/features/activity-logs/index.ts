/**
 * Activity Logs Feature
 * ======================
 * Comprehensive activity logging system for farm management
 *
 * Features:
 * - Infinite scroll activity feed (GitHub/Slack style)
 * - Real-time updates with polling
 * - Advanced filtering (date, type, cycle, user)
 * - Full-text search
 * - Calendar view (month/week/day)
 * - Timeline view with date grouping
 * - Quick log entry with templates
 * - Activity analytics & heatmap
 * - Export to CSV/PDF
 * - Keyboard shortcuts
 */

// Pages
export {
  ActivityLogListPage,
  ActivityCalendarPage,
  ActivityDetailPage,
} from './pages';

// Components
export {
  ActivityTypeIcon,
  ActivityTypeBadge,
  ActivityLogItem,
  ActivityLogItemSkeleton,
  ActivityLogItemCompact,
  ActivityFilters,
  QuickLogFAB,
  QuickLogModal,
  CalendarView,
  TimelineView,
  CompactTimeline,
  ActivityAnalytics,
} from './components';

// Hooks
export {
  useInfiniteActivityLogs,
  useActivityLogsPolling,
  useGroupedActivities,
  useCalendarActivities,
  useQuickCreateActivity,
  useActivityTemplates,
  useActivitySearch,
  useActivityAnalytics,
  useKeyboardShortcuts,
} from './hooks';

// Types
export type {
  ActivityTypeCode,
  ActivityTypeConfig,
  DateRangePreset,
  ActivityLogFilters,
  CalendarViewMode,
  CalendarDay,
  CalendarWeek,
  Swimlane,
  TimelineItem,
  ActivityGroup,
  QuickLogTemplate,
  QuickLogFormData,
  ResourceUsed,
  ExportFormat,
  ExportOptions,
  ActivityAnalytics as ActivityAnalyticsData,
  ResourceConsumption,
} from './types';

export {
  ACTIVITY_TYPE_CONFIG,
  DEFAULT_TEMPLATES,
  getActivityTypeConfig,
  getConfigFromType,
} from './types';

// Utils
export {
  formatTimeAgo,
  formatActivityDate,
  formatCalendarDate,
  formatTime,
  formatDuration,
  getDateGroupLabel,
  groupActivitiesByDate,
  getDateRangeFromPreset,
  formatDateRange,
  getMonthDays,
  getWeekDays,
  getDayHours,
  areSameDay,
  navigateDate,
  getCurrentTimeString,
  getCurrentDateString,
} from './utils';
