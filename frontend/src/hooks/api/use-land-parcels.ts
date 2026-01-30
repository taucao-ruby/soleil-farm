import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { queryKeys, STALE_TIME } from '@/lib/query-client';
import type {
  LandParcel,
  LandParcelsResponse,
  UpdateLandParcelInput,
  LandParcelQueryParams,
  LandParcelStatus,
  CropCycleHistoryItem,
} from '@/schemas';
import { landParcelService } from '@/services';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch paginated list of land parcels
 *
 * @param params - Query parameters for filtering and pagination
 * @param options - Additional React Query options
 *
 * @example
 * const { data, isLoading, error } = useLandParcels({ is_active: true });
 */
export function useLandParcels(
  params?: LandParcelQueryParams,
  options?: Omit<
    UseQueryOptions<LandParcelsResponse>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: queryKeys.landParcels.list(params),
    queryFn: () => landParcelService.getAll(params),
    staleTime: STALE_TIME.MEDIUM,
    ...options,
  });
}

/**
 * Fetch a single land parcel by ID
 *
 * @param id - Land parcel ID
 * @param options - Additional React Query options
 *
 * @example
 * const { data: parcel } = useLandParcel(1);
 */
export function useLandParcel(
  id: number,
  options?: Omit<UseQueryOptions<LandParcel>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.landParcels.detail(id),
    queryFn: () => landParcelService.getById(id),
    enabled: !!id,
    staleTime: STALE_TIME.MEDIUM,
    ...options,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new land parcel
 *
 * Features:
 * - Automatic cache invalidation on success
 * - Loading state management
 *
 * @example
 * const createMutation = useCreateLandParcel();
 *
 * createMutation.mutate({
 *   name: 'Thửa đất A1',
 *   area: 1000,
 *   area_unit_id: 1,
 * });
 */
export function useCreateLandParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: landParcelService.create,
    onSuccess: () => {
      // Invalidate list queries to refetch with new data
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.lists(),
      });
    },
  });
}

/**
 * Update an existing land parcel
 *
 * Features:
 * - Optimistic updates
 * - Automatic rollback on error
 * - Cache invalidation
 *
 * @example
 * const updateMutation = useUpdateLandParcel();
 *
 * updateMutation.mutate({
 *   id: 1,
 *   data: { name: 'Thửa đất A1 (cập nhật)' },
 * });
 */
export function useUpdateLandParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLandParcelInput }) => landParcelService.update(id, data),
    onMutate: async ({ id, data }): Promise<{ previousParcel: LandParcel | undefined }> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.landParcels.detail(id),
      });

      // Snapshot the previous value
      const previousParcel = queryClient.getQueryData<LandParcel>(
        queryKeys.landParcels.detail(id)
      );

      // Optimistically update to the new value
      if (previousParcel) {
        queryClient.setQueryData<LandParcel>(queryKeys.landParcels.detail(id), {
          ...previousParcel,
          ...data,
        });
      }

      return { previousParcel };
    },
    onError: (_error, variables, context) => {
      // Rollback to the previous value on error
      if (context?.previousParcel) {
        queryClient.setQueryData(
          queryKeys.landParcels.detail(variables.id),
          context.previousParcel
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure we have the correct data
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.lists(),
      });
    },
  });
}

/**
 * Delete a land parcel
 *
 * Features:
 * - Optimistic removal from list
 * - Automatic rollback on error
 *
 * @example
 * const deleteMutation = useDeleteLandParcel();
 * deleteMutation.mutate(1);
 */
export function useDeleteLandParcel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: landParcelService.delete,
    onMutate: async (id): Promise<{ previousLists: [queryKey: readonly unknown[], data: LandParcelsResponse | undefined][] }> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.landParcels.lists(),
      });

      // Snapshot all list queries
      const previousLists = queryClient.getQueriesData<LandParcelsResponse>({
        queryKey: queryKeys.landParcels.lists(),
      });

      // Optimistically remove from all lists
      previousLists.forEach(([queryKey, data]) => {
        if (data?.data) {
          queryClient.setQueryData<LandParcelsResponse>(queryKey, {
            ...data,
            data: data.data.filter((parcel) => parcel.id !== id),
          });
        }
      });

      return { previousLists };
    },
    onError: (_error, _id, context) => {
      // Rollback all lists to previous values
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      // Refetch lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.lists(),
      });
    },
  });
}

/**
 * Toggle active status of a land parcel
 *
 * @example
 * const toggleMutation = useToggleLandParcelActive();
 * toggleMutation.mutate({ id: 1, isActive: false });
 */
export function useToggleLandParcelActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      landParcelService.toggleActive(id, isActive),
    onMutate: async ({ id, isActive }): Promise<{ previousParcel: LandParcel | undefined }> => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.landParcels.detail(id),
      });

      const previousParcel = queryClient.getQueryData<LandParcel>(
        queryKeys.landParcels.detail(id)
      );

      if (previousParcel) {
        queryClient.setQueryData<LandParcel>(queryKeys.landParcels.detail(id), {
          ...previousParcel,
          is_active: isActive,
        });
      }

      return { previousParcel };
    },
    onError: (_error, variables, context) => {
      if (context?.previousParcel) {
        queryClient.setQueryData(
          queryKeys.landParcels.detail(variables.id),
          context.previousParcel
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.lists(),
      });
    },
  });
}

/**
 * Attach water sources to a land parcel
 *
 * @example
 * const attachMutation = useAttachWaterSources();
 * attachMutation.mutate({ id: 1, waterSourceIds: [1, 2, 3] });
 */
export function useAttachWaterSources() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, waterSourceIds }: { id: number; waterSourceIds: number[] }) =>
      landParcelService.attachWaterSources(id, waterSourceIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.detail(variables.id),
      });
    },
  });
}

// ============================================================================
// PREFETCH HELPERS
// ============================================================================

/**
 * Prefetch land parcels list for faster navigation
 *
 * @param queryClient - Query client instance
 * @param params - Optional query parameters
 */
export async function prefetchLandParcels(
  queryClient: ReturnType<typeof useQueryClient>,
  params?: LandParcelQueryParams
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.landParcels.list(params),
    queryFn: () => landParcelService.getAll(params),
  });
}

/**
 * Prefetch a single land parcel
 *
 * @param queryClient - Query client instance
 * @param id - Land parcel ID
 */
export async function prefetchLandParcel(
  queryClient: ReturnType<typeof useQueryClient>,
  id: number
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.landParcels.detail(id),
    queryFn: () => landParcelService.getById(id),
  });
}

// ============================================================================
// ADDITIONAL QUERY HOOKS
// ============================================================================

/**
 * Fetch crop cycle history for a land parcel
 *
 * @param id - Land parcel ID
 * @param options - Additional React Query options
 */
export function useLandParcelCropCycles(
  id: number,
  options?: Omit<UseQueryOptions<CropCycleHistoryItem[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...queryKeys.landParcels.detail(id), 'crop-cycles'],
    queryFn: () => landParcelService.getCropCycleHistory(id),
    enabled: !!id,
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
}

/**
 * Get deletion impact analysis
 *
 * @param id - Land parcel ID
 * @param options - Additional React Query options
 */
export function useLandParcelDeleteImpact(
  id: number | null,
  options?: Omit<UseQueryOptions<{ crop_cycles_count: number; activity_logs_count: number }>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...queryKeys.landParcels.detail(id!), 'impact'],
    queryFn: () => landParcelService.getDeleteImpact(id!),
    enabled: !!id,
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
}

// ============================================================================
// BULK MUTATION HOOKS
// ============================================================================

/**
 * Bulk delete land parcels
 *
 * @example
 * const bulkDeleteMutation = useBulkDeleteLandParcels();
 * bulkDeleteMutation.mutate([1, 2, 3]);
 */
export function useBulkDeleteLandParcels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: landParcelService.bulkDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.lists(),
      });
    },
  });
}

/**
 * Bulk change status of land parcels
 *
 * @example
 * const bulkStatusMutation = useBulkChangeLandParcelStatus();
 * bulkStatusMutation.mutate({ ids: [1, 2], status: 'resting' });
 */
export function useBulkChangeLandParcelStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: LandParcelStatus }) =>
      landParcelService.bulkChangeStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.lists(),
      });
    },
  });
}

/**
 * Detach water source from land parcel
 *
 * @example
 * const detachMutation = useDetachWaterSource();
 * detachMutation.mutate({ id: 1, waterSourceId: 2 });
 */
export function useDetachWaterSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, waterSourceId }: { id: number; waterSourceId: number }) =>
      landParcelService.detachWaterSource(id, waterSourceId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.landParcels.detail(variables.id),
      });
    },
  });
}

/**
 * Export land parcels
 *
 * @example
 * const exportMutation = useExportLandParcels();
 * exportMutation.mutate({ ids: [1, 2, 3] });
 */
export function useExportLandParcels() {
  return useMutation({
    mutationFn: ({ ids, params }: { ids?: number[]; params?: LandParcelQueryParams }) =>
      landParcelService.export(ids, params),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `land-parcels-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}
