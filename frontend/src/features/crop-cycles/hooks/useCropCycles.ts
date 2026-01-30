/**
 * Crop Cycles Hook
 * =================
 * Extended hook for crop cycle operations with wizard support.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryKeys, STALE_TIME } from '@/lib/query-client';
import type {
  CreateCropCycleInput,
  CropCycleQueryParams,
  CropCycleStage,
} from '@/schemas';
import { cropCycleService, landParcelService } from '@/services';

// Re-export base hooks
export * from '@/hooks/api/use-crop-cycles';

// ============================================================================
// EXTENDED QUERY HOOKS
// ============================================================================

/**
 * Fetch crop cycles with Gantt timeline data
 */
export function useCropCyclesForGantt(
  params?: CropCycleQueryParams & { includeCompleted?: boolean }
) {
  return useQuery({
    queryKey: [...queryKeys.cropCycles.list(params), 'gantt'],
    queryFn: async () => {
      const response = await cropCycleService.getAll({
        ...params,
        per_page: 100, // Get more for timeline view
      });
      return response;
    },
    staleTime: STALE_TIME.SHORT,
    select: (data) => {
      // Transform data for Gantt chart
      return {
        ...data,
        items: data.data.map((cycle) => ({
          ...cycle,
          ganttStart: cycle.actual_start_date || cycle.planned_start_date,
          ganttEnd: cycle.actual_end_date || cycle.planned_end_date,
        })),
      };
    },
  });
}

/**
 * Fetch available land parcels (not having active cycles in date range)
 */
export function useAvailableParcels(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['availableParcels', startDate, endDate],
    queryFn: async () => {
      const parcels = await landParcelService.getAll({ is_active: true });
      
      // If no dates provided, return all active parcels
      if (!startDate || !endDate) {
        return parcels.data;
      }

      // Check availability for each parcel
      const availabilityChecks = await Promise.all(
        parcels.data.map(async (parcel) => {
          try {
            const result = await cropCycleService.checkParcelAvailability(
              parcel.id,
              startDate,
              endDate
            );
            return { parcel, available: result.available, conflicts: result.conflicts };
          } catch {
            return { parcel, available: true, conflicts: [] };
          }
        })
      );

      return availabilityChecks;
    },
    enabled: true,
    staleTime: STALE_TIME.SHORT,
  });
}

/**
 * Create crop cycle with wizard data
 */
export function useCreateCropCycleWizard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCropCycleInput & { stages?: Partial<CropCycleStage>[] }) => {
      const { stages, ...cycleData } = data;
      
      // Create the cycle
      const cycle = await cropCycleService.create(cycleData);
      
      // If stages are provided, they will be handled by backend
      // Or we could make additional calls here if needed
      
      return cycle;
    },
    onSuccess: (data) => {
      toast.success('Đã tạo chu kỳ mới!', {
        description: `Chu kỳ "${data.name}" đã được tạo thành công.`,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
    onError: (error) => {
      toast.error('Không thể tạo chu kỳ', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
  });
}

/**
 * Batch activate multiple cycles
 */
export function useBatchActivate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cycleIds: number[]) => {
      const results = await Promise.allSettled(
        cycleIds.map((id) => cropCycleService.activate(id))
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      return { successful, failed, total: cycleIds.length };
    },
    onSuccess: ({ successful, failed }) => {
      if (failed === 0) {
        toast.success(`Đã kích hoạt ${successful} chu kỳ!`);
      } else {
        toast.warning(`Kích hoạt ${successful} thành công, ${failed} thất bại`);
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
    onError: (error) => {
      toast.error('Lỗi kích hoạt hàng loạt', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
  });
}

/**
 * Get cycle statistics
 */
export function useCropCycleStats() {
  return useQuery({
    queryKey: [...queryKeys.cropCycles.all, 'stats'],
    queryFn: async () => {
      const [planned, active, completed, failed] = await Promise.all([
        cropCycleService.getAll({ status: 'planned' }),
        cropCycleService.getAll({ status: 'in_progress' }),
        cropCycleService.getAll({ status: 'completed' }),
        cropCycleService.getAll({ status: 'failed' }),
      ]);

      return {
        planned: planned.meta?.total || planned.data.length,
        active: active.meta?.total || active.data.length,
        completed: completed.meta?.total || completed.data.length,
        failed: failed.meta?.total || failed.data.length,
      };
    },
    staleTime: STALE_TIME.MEDIUM,
  });
}
