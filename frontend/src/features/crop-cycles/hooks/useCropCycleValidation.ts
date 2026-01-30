/**
 * Crop Cycle Validation Hook
 * ===========================
 * Validates crop cycle data including date overlap checks.
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryKeys } from '@/lib/query-client';
import type { CropCycle, CropCycleStatus } from '@/schemas';
import { cropCycleService } from '@/services';

// ============================================================================
// TYPES
// ============================================================================

export interface DateValidationResult {
  valid: boolean;
  conflictingCycles: CropCycle[];
  errors: string[];
  warnings: string[];
}

export interface CycleValidationContext {
  landParcelId?: number;
  startDate?: string;
  endDate?: string;
  excludeCycleId?: number;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if two date ranges overlap
 */
export function datesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);

  return s1 <= e2 && e1 >= s2;
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Vui lòng chọn cả ngày bắt đầu và kết thúc' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Ngày không hợp lệ' };
  }

  if (end <= start) {
    return { valid: false, error: 'Ngày kết thúc phải sau ngày bắt đầu' };
  }

  // Minimum duration: 7 days
  const daysDiff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff < 7) {
    return { valid: false, error: 'Thời gian tối thiểu là 7 ngày' };
  }

  // Maximum duration: 365 days
  if (daysDiff > 365) {
    return { valid: false, error: 'Thời gian tối đa là 365 ngày' };
  }

  return { valid: true };
}

/**
 * Calculate end date from start date and duration
 */
export function calculateEndDate(
  startDate: string,
  durationDays: number
): string {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays);
  return end.toISOString().split('T')[0];
}

/**
 * Calculate duration in days between two dates
 */
export function calculateDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Check if a status transition is valid
 */
export function validateStatusTransition(
  currentStatus: CropCycleStatus,
  targetStatus: CropCycleStatus
): { valid: boolean; error?: string } {
  const validTransitions: Record<CropCycleStatus, CropCycleStatus[]> = {
    planned: ['active', 'abandoned'],
    active: ['completed', 'failed', 'abandoned', 'harvesting'],
    in_progress: ['completed', 'failed', 'abandoned', 'harvesting'],
    harvesting: ['completed', 'failed', 'abandoned'],
    completed: [],
    failed: [],
    abandoned: [],
    cancelled: [],
  };

  const allowed = validTransitions[currentStatus] || [];

  if (!allowed.includes(targetStatus)) {
    return {
      valid: false,
      error: `Không thể chuyển từ "${currentStatus}" sang "${targetStatus}"`,
    };
  }

  return { valid: true };
}

/**
 * Check if cycle can be activated
 */
export function canActivateCycle(cycle: CropCycle): {
  canActivate: boolean;
  reason?: string;
} {
  if (cycle.status !== 'planned') {
    return {
      canActivate: false,
      reason: 'Chỉ có thể kích hoạt chu kỳ ở trạng thái "Đã lên kế hoạch"',
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const plannedStart = cycle.planned_start_date;

  // Can activate if planned start date is today or in the past
  if (plannedStart > today) {
    return {
      canActivate: true,
      reason: `Lưu ý: Ngày bắt đầu dự kiến là ${formatDate(plannedStart)}`,
    };
  }

  return { canActivate: true };
}

/**
 * Check if cycle can be deleted
 */
export function canDeleteCycle(cycle: CropCycle): {
  canDelete: boolean;
  reason?: string;
} {
  if (cycle.status !== 'planned') {
    return {
      canDelete: false,
      reason: 'Chỉ có thể xóa chu kỳ ở trạng thái "Đã lên kế hoạch"',
    };
  }

  return { canDelete: true };
}

/**
 * Check if cycle can be edited
 */
export function canEditCycle(cycle: CropCycle): {
  canEdit: boolean;
  reason?: string;
  partialEdit?: boolean;
} {
  if (cycle.status === 'planned') {
    return { canEdit: true };
  }

  if (['active', 'in_progress', 'harvesting'].includes(cycle.status)) {
    return {
      canEdit: true,
      partialEdit: true,
      reason: 'Chỉ có thể chỉnh sửa ghi chú khi chu kỳ đang thực hiện',
    };
  }

  return {
    canEdit: false,
    reason: 'Không thể chỉnh sửa chu kỳ đã hoàn thành hoặc hủy bỏ',
  };
}

// ============================================================================
// VALIDATION HOOK
// ============================================================================

export function useCropCycleValidation(context: CycleValidationContext) {
  const { landParcelId, startDate, endDate, excludeCycleId } = context;

  // Query for date validation
  const dateValidation = useQuery({
    queryKey: [
      ...queryKeys.cropCycles.all,
      'validate-dates',
      landParcelId,
      startDate,
      endDate,
      excludeCycleId,
    ],
    queryFn: () =>
      cropCycleService.validateDates(
        landParcelId!,
        startDate!,
        endDate!,
        excludeCycleId
      ),
    enabled: !!(landParcelId && startDate && endDate),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Basic date validation
  const dateRangeValidation = useMemo(() => {
    if (!startDate || !endDate) {
      return { valid: false, error: undefined };
    }
    return validateDateRange(startDate, endDate);
  }, [startDate, endDate]);

  // Combined validation result
  const validationResult = useMemo<DateValidationResult>(() => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const conflictingCycles: CropCycle[] = [];

    // Check date range
    if (!dateRangeValidation.valid && dateRangeValidation.error) {
      errors.push(dateRangeValidation.error);
    }

    // Check for conflicts
    if (dateValidation.data && !dateValidation.data.valid) {
      errors.push('Thời gian trùng với chu kỳ khác trên cùng lô đất');
      if (dateValidation.data.conflictingCycles) {
        conflictingCycles.push(...dateValidation.data.conflictingCycles);
      }
    }

    // Check if start date is in the past
    if (startDate) {
      const today = new Date().toISOString().split('T')[0];
      if (startDate < today) {
        warnings.push('Ngày bắt đầu đã qua');
      }
    }

    return {
      valid: errors.length === 0,
      conflictingCycles,
      errors,
      warnings,
    };
  }, [dateRangeValidation, dateValidation.data, startDate]);

  return {
    // Validation result
    ...validationResult,

    // Query state
    isValidating: dateValidation.isLoading,
    isError: dateValidation.isError,

    // Utility functions
    validateDateRange,
    calculateEndDate,
    calculateDuration,
    formatDate,
    validateStatusTransition,
    canActivateCycle,
    canDeleteCycle,
    canEditCycle,
    datesOverlap,
  };
}

export type CropCycleValidation = ReturnType<typeof useCropCycleValidation>;
