/**
 * Crop Cycle State Machine Hook
 * ==============================
 * Manages state transitions for crop cycles with validation.
 * 
 * State Machine:
 * planned → active → completed
 *    ↓         ↓
 *    └──→ failed/abandoned
 * 
 * Transitions:
 * - planned → active: "activate" (check: land parcel available)
 * - active → completed: "complete" (record actual dates)
 * - active → failed: "fail" (record failure reason)
 * - active → abandoned: "abandon" (record abandon reason)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/query-client';
import type {
  CropCycle,
  CropCycleStatus,
  ActivateCropCycleInput,
  CompleteCropCycleInput,
  FailCropCycleInput,
  AbandonCropCycleInput,
} from '@/schemas';
import { cropCycleService } from '@/services';

// ============================================================================
// TYPES
// ============================================================================

export interface StateTransition {
  from: CropCycleStatus[];
  to: CropCycleStatus;
  action: string;
  label: string;
  icon?: string;
  variant: 'default' | 'destructive' | 'warning' | 'success';
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// ============================================================================
// STATE MACHINE CONFIGURATION
// ============================================================================

export const CROP_CYCLE_STATES: Record<CropCycleStatus, {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}> = {
  planned: {
    label: 'Đã lên kế hoạch',
    description: 'Chu kỳ đã được lập kế hoạch, chưa bắt đầu',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    icon: 'calendar',
  },
  active: {
    label: 'Đang thực hiện',
    description: 'Chu kỳ đang trong quá trình canh tác',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: 'play',
  },
  in_progress: {
    label: 'Đang thực hiện',
    description: 'Chu kỳ đang trong quá trình canh tác',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    icon: 'play',
  },
  harvesting: {
    label: 'Đang thu hoạch',
    description: 'Đang trong giai đoạn thu hoạch',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    icon: 'scissors',
  },
  completed: {
    label: 'Hoàn thành',
    description: 'Chu kỳ đã hoàn thành thành công',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
    icon: 'check-circle',
  },
  failed: {
    label: 'Thất bại',
    description: 'Chu kỳ đã thất bại',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    icon: 'x-circle',
  },
  abandoned: {
    label: 'Đã hủy bỏ',
    description: 'Chu kỳ đã bị hủy bỏ',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: 'ban',
  },
  cancelled: {
    label: 'Đã hủy',
    description: 'Chu kỳ đã bị hủy',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    icon: 'x',
  },
};

export const STATE_TRANSITIONS: StateTransition[] = [
  {
    from: ['planned'],
    to: 'active',
    action: 'activate',
    label: 'Bắt đầu',
    icon: 'play',
    variant: 'success',
  },
  {
    from: ['active', 'in_progress', 'harvesting'],
    to: 'completed',
    action: 'complete',
    label: 'Hoàn thành',
    icon: 'check',
    variant: 'success',
  },
  {
    from: ['active', 'in_progress'],
    to: 'failed',
    action: 'fail',
    label: 'Đánh dấu thất bại',
    icon: 'x-circle',
    variant: 'destructive',
  },
  {
    from: ['active', 'in_progress', 'planned'],
    to: 'abandoned',
    action: 'abandon',
    label: 'Hủy bỏ',
    icon: 'ban',
    variant: 'warning',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get available transitions for a given status
 */
export function getAvailableTransitions(currentStatus: CropCycleStatus): StateTransition[] {
  return STATE_TRANSITIONS.filter((t) => t.from.includes(currentStatus));
}

/**
 * Check if a transition is valid
 */
export function canTransition(
  currentStatus: CropCycleStatus,
  targetStatus: CropCycleStatus
): boolean {
  return STATE_TRANSITIONS.some(
    (t) => t.from.includes(currentStatus) && t.to === targetStatus
  );
}

/**
 * Get status configuration
 */
export function getStatusConfig(status: CropCycleStatus) {
  return CROP_CYCLE_STATES[status] || CROP_CYCLE_STATES.planned;
}

/**
 * Check if status is terminal (no further transitions)
 */
export function isTerminalStatus(status: CropCycleStatus): boolean {
  return ['completed', 'failed', 'abandoned', 'cancelled'].includes(status);
}

/**
 * Check if cycle is editable
 */
export function isCycleEditable(status: CropCycleStatus): boolean {
  return status === 'planned';
}

/**
 * Check if cycle is deletable
 */
export function isCycleDeletable(status: CropCycleStatus): boolean {
  return status === 'planned';
}

// ============================================================================
// STATE MACHINE HOOK
// ============================================================================

export function useCropCycleStateMachine(cycleId: number) {
  const queryClient = useQueryClient();

  // Invalidate related queries after mutation
  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.cropCycles.detail(cycleId),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.cropCycles.lists(),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.cropCycles.stages(cycleId),
    });
  };

  // Activate mutation (planned → active)
  const activate = useMutation({
    mutationFn: (data?: ActivateCropCycleInput) =>
      cropCycleService.activate(cycleId, data),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.cropCycles.detail(cycleId),
      });

      const previousCycle = queryClient.getQueryData<CropCycle>(
        queryKeys.cropCycles.detail(cycleId)
      );

      if (previousCycle) {
        queryClient.setQueryData<CropCycle>(
          queryKeys.cropCycles.detail(cycleId),
          {
            ...previousCycle,
            status: 'active',
            actual_start_date: new Date().toISOString().split('T')[0],
          }
        );
      }

      return { previousCycle };
    },
    onSuccess: () => {
      toast.success('Đã bắt đầu vụ mùa!', {
        description: 'Chu kỳ canh tác đã được kích hoạt thành công.',
      });
      invalidateQueries();
    },
    onError: (error, _variables, context) => {
      if (context?.previousCycle) {
        queryClient.setQueryData(
          queryKeys.cropCycles.detail(cycleId),
          context.previousCycle
        );
      }
      toast.error('Không thể kích hoạt chu kỳ', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
  });

  // Complete mutation (active → completed)
  const complete = useMutation({
    mutationFn: (data?: CompleteCropCycleInput) =>
      cropCycleService.complete(cycleId, data),
    onSuccess: () => {
      toast.success('Hoàn thành vụ mùa!', {
        description: 'Chu kỳ canh tác đã được đánh dấu hoàn thành.',
      });
      invalidateQueries();
    },
    onError: (error) => {
      toast.error('Không thể hoàn thành chu kỳ', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
  });

  // Fail mutation (active → failed)
  const fail = useMutation({
    mutationFn: (data: FailCropCycleInput) =>
      cropCycleService.fail(cycleId, data),
    onSuccess: () => {
      toast.error('Đã đánh dấu thất bại', {
        description: 'Chu kỳ canh tác đã được đánh dấu là thất bại.',
      });
      invalidateQueries();
    },
    onError: (error) => {
      toast.error('Không thể cập nhật trạng thái', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
  });

  // Abandon mutation (active → abandoned)
  const abandon = useMutation({
    mutationFn: (data: AbandonCropCycleInput) =>
      cropCycleService.abandon(cycleId, data),
    onSuccess: () => {
      toast.warning('Đã hủy bỏ vụ mùa', {
        description: 'Chu kỳ canh tác đã được hủy bỏ.',
      });
      invalidateQueries();
    },
    onError: (error) => {
      toast.error('Không thể hủy bỏ chu kỳ', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
  });

  // Duplicate mutation
  const duplicate = useMutation({
    mutationFn: (data?: Partial<Parameters<typeof cropCycleService.create>[0]>) =>
      cropCycleService.duplicate(cycleId, data),
    onSuccess: (newCycle) => {
      toast.success('Đã nhân bản chu kỳ!', {
        description: `Chu kỳ mới "${newCycle.name}" đã được tạo.`,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cropCycles.lists(),
      });
    },
    onError: (error) => {
      toast.error('Không thể nhân bản chu kỳ', {
        description: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
      });
    },
  });

  return {
    // Mutations
    activate,
    complete,
    fail,
    abandon,
    duplicate,

    // Loading states
    isTransitioning:
      activate.isPending ||
      complete.isPending ||
      fail.isPending ||
      abandon.isPending,

    // Helpers
    getAvailableTransitions,
    canTransition,
    getStatusConfig,
    isTerminalStatus,
    isCycleEditable,
    isCycleDeletable,
  };
}

export type CropCycleStateMachine = ReturnType<typeof useCropCycleStateMachine>;
