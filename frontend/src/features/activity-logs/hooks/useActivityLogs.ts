/**
 * Activity Logs Hooks
 * ====================
 * Extended hooks for activity logging with infinite scroll and real-time updates
 */

import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import { useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import { queryKeys, STALE_TIME } from '@/lib/query-client';
import type {
  ActivityLog,
  ActivityLogsResponse,
  ActivityLogQueryParams,
  CreateActivityLogInput,
} from '@/schemas';
import { activityLogService } from '@/services';

import type { ActivityLogFilters, ActivityAnalytics } from '../types';
import { groupActivitiesByDate, getDateRangeFromPreset, format } from '../utils';

// Re-export base hooks
export * from '@/hooks/api/use-activity-logs';

// ============================================================================
// INFINITE SCROLL HOOK
// ============================================================================

/**
 * Fetch activity logs with infinite scroll
 *
 * @param filters - Filter parameters
 * @param options - Additional React Query options
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteActivityLogs({
 *   crop_cycle_id: 1,
 * });
 */
export function useInfiniteActivityLogs(
  filters?: ActivityLogFilters,
  options?: Omit<
    UseInfiniteQueryOptions<ActivityLogsResponse, Error>,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
) {
  // Convert preset to date range
  const dateParams = useMemo(() => {
    if (filters?.dateRangePreset && filters.dateRangePreset !== 'custom') {
      const range = getDateRangeFromPreset(filters.dateRangePreset);
      return {
        date_from: format(range.from, 'yyyy-MM-dd'),
        date_to: format(range.to, 'yyyy-MM-dd'),
      };
    }
    return {
      date_from: filters?.date_from,
      date_to: filters?.date_to,
    };
  }, [filters?.dateRangePreset, filters?.date_from, filters?.date_to]);

  const queryParams = useMemo(
    () => ({
      ...filters,
      ...dateParams,
      per_page: filters?.per_page || 20,
    }),
    [filters, dateParams]
  );

  return useInfiniteQuery({
    queryKey: [...queryKeys.activityLogs.list(queryParams), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      return activityLogService.getAll({
        ...queryParams,
        page: pageParam as number,
      });
    },
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: STALE_TIME.REALTIME,
    ...options,
  });
}

// ============================================================================
// REAL-TIME UPDATES HOOK
// ============================================================================

/**
 * Auto-refresh activity logs for real-time updates
 *
 * @param enabled - Whether to enable polling
 * @param intervalMs - Polling interval in milliseconds (default: 30000)
 *
 * @example
 * useActivityLogsPolling(true, 30000);
 */
export function useActivityLogsPolling(
  enabled: boolean = true,
  intervalMs: number = 30000
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityLogs.lists(),
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [enabled, intervalMs, queryClient]);
}

// ============================================================================
// GROUPED ACTIVITIES HOOK
// ============================================================================

/**
 * Get activities grouped by date
 *
 * @param filters - Filter parameters
 *
 * @example
 * const { groups, activities } = useGroupedActivities({ crop_cycle_id: 1 });
 */
export function useGroupedActivities(filters?: ActivityLogFilters) {
  const infiniteQuery = useInfiniteActivityLogs(filters);

  const activities = useMemo(() => {
    if (!infiniteQuery.data) return [];
    // Cast to InfiniteData which has pages property
    const infiniteData = infiniteQuery.data as unknown as InfiniteData<ActivityLogsResponse>;
    return infiniteData.pages.flatMap((page) => page.data);
  }, [infiniteQuery.data]);

  const groups = useMemo(() => {
    return groupActivitiesByDate(activities);
  }, [activities]);

  const totalCount = useMemo(() => {
    if (!infiniteQuery.data) return 0;
    const infiniteData = infiniteQuery.data as unknown as InfiniteData<ActivityLogsResponse>;
    return infiniteData.pages[0]?.meta.total ?? 0;
  }, [infiniteQuery.data]);

  return {
    ...infiniteQuery,
    activities,
    groups,
    totalCount,
  };
}

// ============================================================================
// CALENDAR DATA HOOK
// ============================================================================

/**
 * Fetch activities for calendar view
 *
 * @param month - Month to fetch (Date object)
 * @param filters - Additional filters
 *
 * @example
 * const { activitiesByDate } = useCalendarActivities(new Date(), { crop_cycle_id: 1 });
 */
export function useCalendarActivities(month: Date, filters?: ActivityLogFilters) {
  const startDate = format(
    new Date(month.getFullYear(), month.getMonth(), 1),
    'yyyy-MM-dd'
  );
  const endDate = format(
    new Date(month.getFullYear(), month.getMonth() + 1, 0),
    'yyyy-MM-dd'
  );

  const query = useQuery({
    queryKey: [
      ...queryKeys.activityLogs.list({ ...filters, date_from: startDate, date_to: endDate }),
      'calendar',
    ],
    queryFn: () =>
      activityLogService.getAll({
        ...filters,
        date_from: startDate,
        date_to: endDate,
        per_page: 500, // Get all activities for the month
      }),
    staleTime: STALE_TIME.SHORT,
  });

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, ActivityLog[]>();
    query.data?.data.forEach((activity) => {
      const dateKey = activity.activity_date.split('T')[0];
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, activity]);
    });
    return map;
  }, [query.data?.data]);

  return {
    ...query,
    activitiesByDate,
  };
}

// ============================================================================
// QUICK CREATE MUTATION
// ============================================================================

/**
 * Quick create activity log mutation with optimistic updates
 *
 * @example
 * const { mutate: quickCreate } = useQuickCreateActivity();
 * quickCreate({
 *   activity_type_id: 1,
 *   crop_cycle_id: 1,
 *   activity_date: '2026-01-29',
 * });
 */
export function useQuickCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityLogInput) => activityLogService.create(data),
    onMutate: async (_newActivity) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.activityLogs.lists(),
      });

      // Snapshot previous value
      const previousData = queryClient.getQueriesData<ActivityLogsResponse>({
        queryKey: queryKeys.activityLogs.lists(),
      });

      return { previousData };
    },
    onSuccess: (data) => {
      toast.success('Đã ghi nhận hoạt động!', {
        description: `Hoạt động "${data.activity_type?.name || 'Mới'}" đã được lưu.`,
      });
    },
    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Không thể lưu hoạt động', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityLogs.lists(),
      });
    },
  });
}

// ============================================================================
// ACTIVITY TEMPLATES HOOK
// ============================================================================

/**
 * Local storage key for templates
 */
const TEMPLATES_STORAGE_KEY = 'soleil-farm:activity-templates';

/**
 * Default templates
 */
const DEFAULT_TEMPLATES = [
  { id: '1', name: 'Tưới cây', activityTypeId: 2, description: 'Tưới nước cho cây trồng' },
  { id: '2', name: 'Bón phân', activityTypeId: 3, description: 'Bón phân cho cây' },
  { id: '3', name: 'Phun thuốc', activityTypeId: 4, description: 'Phun thuốc trừ sâu' },
  { id: '4', name: 'Làm cỏ', activityTypeId: 5, description: 'Làm cỏ vườn' },
  { id: '5', name: 'Kiểm tra', activityTypeId: 10, description: 'Kiểm tra tình trạng cây' },
];

interface Template {
  id: string;
  name: string;
  activityTypeId: number;
  description?: string;
  icon?: string;
}

/**
 * Manage activity templates
 *
 * @example
 * const { templates, addTemplate, removeTemplate, useTemplate } = useActivityTemplates();
 */
export function useActivityTemplates() {
  const queryClient = useQueryClient();

  const { data: templates = DEFAULT_TEMPLATES } = useQuery<Template[]>({
    queryKey: ['activityTemplates'],
    queryFn: () => {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return DEFAULT_TEMPLATES;
        }
      }
      return DEFAULT_TEMPLATES;
    },
    staleTime: Infinity,
  });

  const saveTemplates = useCallback(
    (newTemplates: Template[]) => {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(newTemplates));
      queryClient.setQueryData(['activityTemplates'], newTemplates);
    },
    [queryClient]
  );

  const addTemplate = useCallback(
    (template: Omit<Template, 'id'>) => {
      const newTemplate = {
        ...template,
        id: Date.now().toString(),
      };
      saveTemplates([...templates, newTemplate]);
      toast.success('Đã lưu template!');
    },
    [templates, saveTemplates]
  );

  const removeTemplate = useCallback(
    (id: string) => {
      saveTemplates(templates.filter((t) => t.id !== id));
      toast.success('Đã xóa template!');
    },
    [templates, saveTemplates]
  );

  return {
    templates,
    addTemplate,
    removeTemplate,
  };
}

// ============================================================================
// ACTIVITY SEARCH HOOK
// ============================================================================

/**
 * Search activities with full-text search
 *
 * @param searchQuery - Search query string
 * @param filters - Additional filters
 *
 * @example
 * const { data } = useActivitySearch('bón phân', { crop_cycle_id: 1 });
 */
export function useActivitySearch(
  searchQuery: string,
  filters?: ActivityLogQueryParams
) {
  return useQuery({
    queryKey: [...queryKeys.activityLogs.list(filters), 'search', searchQuery],
    queryFn: () =>
      activityLogService.getAll({
        ...filters,
        search: searchQuery,
      }),
    enabled: searchQuery.length > 0,
    staleTime: STALE_TIME.SHORT,
  });
}

// ============================================================================
// ANALYTICS HOOK
// ============================================================================

/**
 * Get activity analytics
 *
 * @param filters - Filter parameters
 *
 * @example
 * const { analytics } = useActivityAnalytics({ date_from: '2026-01-01' });
 */
export function useActivityAnalytics(filters?: ActivityLogQueryParams) {
  const query = useQuery({
    queryKey: [...queryKeys.activityLogs.list(filters), 'analytics'],
    queryFn: async () => {
      // Fetch all activities for analytics
      const response = await activityLogService.getAll({
        ...filters,
        per_page: 1000,
      });
      return response.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });

  const analytics = useMemo<ActivityAnalytics | null>(() => {
    if (!query.data) return null;

    const activities = query.data;

    // Count by type
    const activitiesByType: Record<string, number> = {};
    activities.forEach((a) => {
      const typeCode = a.activity_type?.code || 'OTHER';
      activitiesByType[typeCode] = (activitiesByType[typeCode] || 0) + 1;
    });

    // Count by day
    const activitiesByDay: Record<string, number> = {};
    activities.forEach((a) => {
      const day = a.activity_date.split('T')[0];
      activitiesByDay[day] = (activitiesByDay[day] || 0) + 1;
    });

    // Find most active day
    const mostActiveDay = Object.entries(activitiesByDay).reduce(
      (max, [day, count]) => (count > max.count ? { day, count } : max),
      { day: '', count: 0 }
    ).day;

    // Calculate average
    const uniqueDays = Object.keys(activitiesByDay).length;
    const averageActivitiesPerDay = uniqueDays > 0 ? activities.length / uniqueDays : 0;

    return {
      totalActivities: activities.length,
      activitiesByType,
      activitiesByDay,
      averageActivitiesPerDay,
      mostActiveDay,
      totalDuration: 0, // TODO: Calculate from metadata
      resourceConsumption: [], // TODO: Extract from metadata
    };
  }, [query.data]);

  return {
    ...query,
    analytics,
  };
}
