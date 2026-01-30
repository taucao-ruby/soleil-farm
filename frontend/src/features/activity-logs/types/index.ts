/**
 * Activity Logs Types
 * ====================
 * Comprehensive type definitions for activity logging system
 */

import type {
  ActivityLog,
  ActivityType,
  ActivityLogQueryParams,
} from '@/schemas';

// ============================================================================
// ACTIVITY TYPE ENUMS & ICONS
// ============================================================================

/**
 * Activity type codes for icon mapping
 */
export type ActivityTypeCode =
  | 'PLANTING'
  | 'IRRIGATION'
  | 'FERTILIZING'
  | 'PESTICIDE'
  | 'WEEDING'
  | 'PRUNING'
  | 'HARVESTING'
  | 'SOIL_PREPARATION'
  | 'TRANSPLANTING'
  | 'MONITORING'
  | 'OTHER';

/**
 * Activity type icon and color configuration
 */
export interface ActivityTypeConfig {
  code: ActivityTypeCode;
  icon: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}

/**
 * Activity type configuration map
 */
export const ACTIVITY_TYPE_CONFIG: Record<ActivityTypeCode, ActivityTypeConfig> = {
  PLANTING: {
    code: 'PLANTING',
    icon: 'Sprout',
    emoji: '🌱',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Gieo trồng',
  },
  IRRIGATION: {
    code: 'IRRIGATION',
    icon: 'Droplets',
    emoji: '💧',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Tưới nước',
  },
  FERTILIZING: {
    code: 'FERTILIZING',
    icon: 'Leaf',
    emoji: '🧪',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    label: 'Bón phân',
  },
  PESTICIDE: {
    code: 'PESTICIDE',
    icon: 'Bug',
    emoji: '🐛',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Phun thuốc',
  },
  WEEDING: {
    code: 'WEEDING',
    icon: 'Scissors',
    emoji: '🌿',
    color: 'text-lime-600',
    bgColor: 'bg-lime-50',
    borderColor: 'border-lime-200',
    label: 'Làm cỏ',
  },
  PRUNING: {
    code: 'PRUNING',
    icon: 'TreeDeciduous',
    emoji: '✂️',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    label: 'Tỉa cành',
  },
  HARVESTING: {
    code: 'HARVESTING',
    icon: 'Wheat',
    emoji: '🚜',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Thu hoạch',
  },
  SOIL_PREPARATION: {
    code: 'SOIL_PREPARATION',
    icon: 'Mountain',
    emoji: '🪨',
    color: 'text-stone-600',
    bgColor: 'bg-stone-50',
    borderColor: 'border-stone-200',
    label: 'Chuẩn bị đất',
  },
  TRANSPLANTING: {
    code: 'TRANSPLANTING',
    icon: 'MoveRight',
    emoji: '🌾',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    label: 'Cấy ghép',
  },
  MONITORING: {
    code: 'MONITORING',
    icon: 'Eye',
    emoji: '👁️',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'Theo dõi',
  },
  OTHER: {
    code: 'OTHER',
    icon: 'MoreHorizontal',
    emoji: '📝',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Khác',
  },
};

// ============================================================================
// FILTER TYPES
// ============================================================================

/**
 * Date range presets
 */
export type DateRangePreset = 'today' | 'this_week' | 'this_month' | 'custom';

/**
 * Extended filter state for activity logs
 */
export interface ActivityLogFilters extends ActivityLogQueryParams {
  dateRangePreset?: DateRangePreset;
  land_parcel_id?: number;
}

/**
 * Filter chip display
 */
export interface FilterChip {
  key: string;
  label: string;
  value: string | number;
  onRemove: () => void;
}

// ============================================================================
// CALENDAR VIEW TYPES
// ============================================================================

/**
 * Calendar view modes
 */
export type CalendarViewMode = 'month' | 'week' | 'day';

/**
 * Calendar day data
 */
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  activities: ActivityLog[];
}

/**
 * Calendar week data for swimlane view
 */
export interface CalendarWeek {
  startDate: Date;
  endDate: Date;
  days: CalendarDay[];
}

/**
 * Swimlane data for week view
 */
export interface Swimlane {
  cropCycleId: number;
  cropCycleName: string;
  activities: Map<string, ActivityLog[]>; // key: date string
}

// ============================================================================
// TIMELINE VIEW TYPES
// ============================================================================

/**
 * Timeline item for day view
 */
export interface TimelineItem {
  time: string;
  activities: ActivityLog[];
}

/**
 * Grouped activities by date
 */
export interface ActivityGroup {
  date: string;
  label: string; // "Hôm nay", "Hôm qua", "Tuần này", etc.
  activities: ActivityLog[];
}

// ============================================================================
// QUICK LOG TYPES
// ============================================================================

/**
 * Quick log template
 */
export interface QuickLogTemplate {
  id: string;
  name: string;
  activityTypeId: number;
  description?: string;
  defaultDuration?: number;
  icon: string;
}

/**
 * Default quick log templates
 */
export const DEFAULT_TEMPLATES: QuickLogTemplate[] = [
  {
    id: 'water-crops',
    name: 'Tưới cây',
    activityTypeId: 2, // IRRIGATION
    description: 'Tưới nước cho cây trồng',
    defaultDuration: 1,
    icon: '💧',
  },
  {
    id: 'apply-fertilizer',
    name: 'Bón phân',
    activityTypeId: 3, // FERTILIZING
    description: 'Bón phân cho cây',
    defaultDuration: 2,
    icon: '🧪',
  },
  {
    id: 'pest-control',
    name: 'Phun thuốc',
    activityTypeId: 4, // PESTICIDE
    description: 'Phun thuốc trừ sâu',
    defaultDuration: 2,
    icon: '🐛',
  },
  {
    id: 'weeding',
    name: 'Làm cỏ',
    activityTypeId: 5, // WEEDING
    description: 'Làm cỏ vườn',
    defaultDuration: 3,
    icon: '🌿',
  },
  {
    id: 'monitoring',
    name: 'Kiểm tra',
    activityTypeId: 10, // MONITORING
    description: 'Kiểm tra tình trạng cây trồng',
    defaultDuration: 0.5,
    icon: '👁️',
  },
];

/**
 * Quick log form data
 */
export interface QuickLogFormData {
  activity_type_id: number;
  crop_cycle_id: number;
  activity_date: string;
  start_time?: string;
  end_time?: string;
  duration_hours?: number;
  description?: string;
  notes?: string;
  resources_used?: ResourceUsed[];
  photos?: File[];
  is_draft?: boolean;
}

/**
 * Resource used in activity
 */
export interface ResourceUsed {
  type: 'fertilizer' | 'pesticide' | 'water' | 'seed' | 'other';
  name: string;
  quantity: number;
  unit: string;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

/**
 * Export format options
 */
export type ExportFormat = 'csv' | 'pdf';

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat;
  dateFrom?: string;
  dateTo?: string;
  includePhotos?: boolean;
  groupBy?: 'date' | 'crop_cycle' | 'activity_type';
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Activity analytics data
 */
export interface ActivityAnalytics {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByDay: Record<string, number>;
  averageActivitiesPerDay: number;
  mostActiveDay: string;
  totalDuration: number;
  resourceConsumption: ResourceConsumption[];
}

/**
 * Resource consumption tracking
 */
export interface ResourceConsumption {
  resourceType: string;
  totalQuantity: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get activity type config by code
 */
export function getActivityTypeConfig(
  code: string | undefined
): ActivityTypeConfig {
  if (!code) return ACTIVITY_TYPE_CONFIG.OTHER;
  return (
    ACTIVITY_TYPE_CONFIG[code as ActivityTypeCode] ?? ACTIVITY_TYPE_CONFIG.OTHER
  );
}

/**
 * Get activity type config by activity type object
 */
export function getConfigFromType(
  activityType: ActivityType | undefined
): ActivityTypeConfig {
  return getActivityTypeConfig(activityType?.code);
}

// Re-export schema types
export type { ActivityLog, ActivityType, ActivityLogQueryParams };
