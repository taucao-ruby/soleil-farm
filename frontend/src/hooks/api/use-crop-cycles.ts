import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { queryKeys, STALE_TIME } from '@/lib/query-client';
import type {
  CropCycle,
  CropCyclesResponse,
  CropCycleStage,
  UpdateCropCycleInput,
  CropCycleQueryParams,
} from '@/schemas';
import { cropCycleService } from '@/services';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch paginated list of crop cycles
 *
 * @param params - Query parameters for filtering and pagination
 * @param options - Additional React Query options
 *
 * @example
 * const { data, isLoading } = useCropCycles({ status: 'active' });
 */
export function useCropCycles(
  params?: CropCycleQueryParams,
  options?: Omit<UseQueryOptions<CropCyclesResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.cropCycles.list(params),
    queryFn: () => cropCycleService.getAll(params),
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
}

/**
 * Fetch a single crop cycle by ID
 *
 * @param id - Crop cycle ID
 * @param options - Additional React Query options
 *
 * @example
 * const { data: cycle } = useCropCycle(1);
 */
export function useCropCycle(
  id: number,
  options?: Omit<UseQueryOptions<CropCycle>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.cropCycles.detail(id),
    queryFn: () => cropCycleService.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
}

/**
 * Fetch stages for a crop cycle
 *
 * @param cycleId - Crop cycle ID
 * @param options - Additional React Query options
 *
 * @example
 * const { data: stages } = useCropCycleStages(1);
 */
export function useCropCycleStages(
  cycleId: number,
  options?: Omit<UseQueryOptions<CropCycleStage[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.cropCycles.stages(cycleId),
    queryFn: () => cropCycleService.getStages(cycleId),
    enabled: !!cycleId,
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new crop cycle
 *
 * @example
 * const createMutation = useCreateCropCycle();
 * createMutation.mutate({
 *   land_parcel_id: 1,
 *   crop_type_id: 1,
 *   season_id: 1,
 *   planned_start_date: '2026-02-01',
 * });
 */
export function useCreateCropCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cropCycleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
  });
}

/**
 * Update an existing crop cycle
 *
 * Features:
 * - Optimistic updates
 * - Automatic rollback on error
 *
 * @example
 * const updateMutation = useUpdateCropCycle();
 * updateMutation.mutate({
 *   id: 1,
 *   data: { notes: 'Cập nhật ghi chú' },
 * });
 */
export function useUpdateCropCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCropCycleInput }) => cropCycleService.update(id, data),
    onMutate: async ({ id, data }): Promise<{ previousCycle: CropCycle | undefined }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cropCycles.detail(id),
      });

      const previousCycle = queryClient.getQueryData<CropCycle>(
        queryKeys.cropCycles.detail(id)
      );

      if (previousCycle) {
        queryClient.setQueryData<CropCycle>(queryKeys.cropCycles.detail(id), {
          ...previousCycle,
          ...data,
        });
      }

      return { previousCycle };
    },
    onError: (_error, variables, context) => {
      if (context?.previousCycle) {
        queryClient.setQueryData(
          queryKeys.cropCycles.detail(variables.id),
          context.previousCycle
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
  });
}

/**
 * Delete a crop cycle
 *
 * @example
 * const deleteMutation = useDeleteCropCycle();
 * deleteMutation.mutate(1);
 */
export function useDeleteCropCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cropCycleService.delete,
    onMutate: async (id): Promise<{ previousLists: [queryKey: readonly unknown[], data: CropCyclesResponse | undefined][] }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });

      const previousLists = queryClient.getQueriesData<CropCyclesResponse>({
        queryKey: queryKeys.cropCycles.lists(),
      });

      previousLists.forEach(([queryKey, data]) => {
        if (data?.data) {
          queryClient.setQueryData<CropCyclesResponse>(queryKey, {
            ...data,
            data: data.data.filter((cycle) => cycle.id !== id),
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
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
  });
}

// ============================================================================
// STATUS TRANSITION HOOKS
// ============================================================================

/**
 * Activate a crop cycle (planned -> active)
 *
 * @example
 * const activateMutation = useActivateCropCycle();
 * activateMutation.mutate(1);
 */
export function useActivateCropCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cropCycleService.activate(id),
    onMutate: async (id): Promise<{ previousCycle: CropCycle | undefined }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cropCycles.detail(id),
      });

      const previousCycle = queryClient.getQueryData<CropCycle>(
        queryKeys.cropCycles.detail(id)
      );

      if (previousCycle) {
        queryClient.setQueryData<CropCycle>(queryKeys.cropCycles.detail(id), {
          ...previousCycle,
          status: 'in_progress',
          actual_start_date: new Date().toISOString().split('T')[0] ?? null,
        });
      }

      return { previousCycle };
    },
    onError: (_error, id, context) => {
      if (context?.previousCycle) {
        queryClient.setQueryData(
          queryKeys.cropCycles.detail(id),
          context.previousCycle
        );
      }
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
  });
}

/**
 * Complete a crop cycle (active -> completed)
 *
 * @example
 * const completeMutation = useCompleteCropCycle();
 * completeMutation.mutate(1);
 */
export function useCompleteCropCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cropCycleService.complete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
  });
}

/**
 * Cancel a crop cycle (any -> cancelled)
 *
 * @example
 * const cancelMutation = useCancelCropCycle();
 * cancelMutation.mutate(1);
 */
export function useCancelCropCycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cropCycleService.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
  });
}

/**
 * Complete a stage within a crop cycle
 *
 * @example
 * const completeStage = useCompleteCropCycleStage();
 * completeStage.mutate({ cycleId: 1, stageId: 2 });
 */
export function useCompleteCropCycleStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cycleId, stageId }: { cycleId: number; stageId: number }) =>
      cropCycleService.completeStage(cycleId, stageId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.stages(variables.cycleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.detail(variables.cycleId),
      });
    },
  });
}

// ============================================================================
// PREFETCH HELPERS
// ============================================================================

/**
 * Prefetch crop cycles list
 */
export async function prefetchCropCycles(
  queryClient: ReturnType<typeof useQueryClient>,
  params?: CropCycleQueryParams
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.cropCycles.list(params),
    queryFn: () => cropCycleService.getAll(params),
  });
}

/**
 * Prefetch a single crop cycle
 */
export async function prefetchCropCycle(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.cropCycles.detail(id),
    queryFn: () => cropCycleService.getById(id),
  });
}
