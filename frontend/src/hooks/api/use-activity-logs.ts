import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { queryKeys, STALE_TIME } from '@/lib/query-client';
import type {
  ActivityLog,
  ActivityType,
  ActivityLogsResponse,
  UpdateActivityLogInput,
  ActivityLogQueryParams,
} from '@/schemas';
import { activityLogService } from '@/services';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch paginated list of activity logs
 *
 * @param params - Query parameters for filtering and pagination
 * @param options - Additional React Query options
 *
 * @example
 * const { data, isLoading } = useActivityLogs({ crop_cycle_id: 1 });
 */
export function useActivityLogs(
  params?: ActivityLogQueryParams,
  options?: Omit<
    UseQueryOptions<ActivityLogsResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.activityLogs.list(params),
    queryFn: () => activityLogService.getAll(params),
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
}

/**
 * Fetch a single activity log by ID
 *
 * @param id - Activity log ID
 * @param options - Additional React Query options
 *
 * @example
 * const { data: log } = useActivityLog(1);
 */
export function useActivityLog(
  id: number,
  options?: Omit<UseQueryOptions<ActivityLog>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.activityLogs.detail(id),
    queryFn: () => activityLogService.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
}

/**
 * Fetch all activity types
 *
 * @param options - Additional React Query options
 *
 * @example
 * const { data: types } = useActivityTypes();
 * // Returns: [{ id: 1, code: 'PLANTING', name: 'Gieo trồng' }, ...]
 */
export function useActivityTypes(
  options?: Omit<UseQueryOptions<ActivityType[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.activityLogs.types(),
    queryFn: activityLogService.getActivityTypes,
    staleTime: STALE_TIME.STATIC,
    ...options,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new activity log entry
 *
 * @example
 * const createMutation = useCreateActivityLog();
 * createMutation.mutate({
 *   crop_cycle_id: 1,
 *   activity_type_id: 2,
 *   activity_date: '2026-01-29',
 *   description: 'Bón phân NPK',
 * });
 */
export function useCreateActivityLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityLogService.create,
    onSuccess: (_data, variables) => {
      // Invalidate all activity log lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityLogs.lists(),
      });

      // Also invalidate related crop cycle to update counts
      if (variables.crop_cycle_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.cropCycles.detail(variables.crop_cycle_id),
        });
      }
    },
  });
}

/**
 * Update an existing activity log
 *
 * Features:
 * - Optimistic updates
 * - Automatic rollback on error
 *
 * @example
 * const updateMutation = useUpdateActivityLog();
 * updateMutation.mutate({
 *   id: 1,
 *   data: { notes: 'Cập nhật ghi chú' },
 * });
 */
export function useUpdateActivityLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActivityLogInput }) => activityLogService.update(id, data),
    onMutate: async ({ id, data }): Promise<{ previousLog: ActivityLog | undefined }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.activityLogs.detail(id),
      });

      const previousLog = queryClient.getQueryData<ActivityLog>(
        queryKeys.activityLogs.detail(id)
      );

      if (previousLog) {
        queryClient.setQueryData<ActivityLog>(
          queryKeys.activityLogs.detail(id),
          {
            ...previousLog,
            ...data,
          }
        );
      }

      return { previousLog };
    },
    onError: (_error, variables, context) => {
      if (context?.previousLog) {
        queryClient.setQueryData(
          queryKeys.activityLogs.detail(variables.id),
          context.previousLog
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityLogs.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityLogs.lists(),
      });
    },
  });
}

/**
 * Delete an activity log
 *
 * @example
 * const deleteMutation = useDeleteActivityLog();
 * deleteMutation.mutate(1);
 */
export function useDeleteActivityLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityLogService.delete,
    onMutate: async (id): Promise<{ previousLists: [queryKey: readonly unknown[], data: ActivityLogsResponse | undefined][] }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.activityLogs.lists(),
      });

      const previousLists = queryClient.getQueriesData<ActivityLogsResponse>({
        queryKey: queryKeys.activityLogs.lists(),
      });

      previousLists.forEach(([queryKey, data]) => {
        if (data?.data) {
          queryClient.setQueryData<ActivityLogsResponse>(queryKey, {
            ...data,
            data: data.data.filter((log) => log.id !== id),
          });
        }
      });

      return { previousLists };
    },
    onError: (_error, _id, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activityLogs.lists(),
      });
    },
  });
}

// ============================================================================
// PREFETCH HELPERS
// ============================================================================

/**
 * Prefetch activity logs list
 */
export async function prefetchActivityLogs(
  queryClient: ReturnType<typeof useQueryClient>,
  params?: ActivityLogQueryParams
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.activityLogs.list(params),
    queryFn: () => activityLogService.getAll(params),
  });
}

/**
 * Prefetch activity types (static data)
 */
export async function prefetchActivityTypes(
  queryClient: ReturnType<typeof useQueryClient>
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.activityLogs.types(),
    queryFn: activityLogService.getActivityTypes,
  });
}
