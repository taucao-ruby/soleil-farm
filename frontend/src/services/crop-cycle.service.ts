import type {
  CropCycle,
  CropCycleResponse,
  CropCyclesResponse,
  CreateCropCycleInput,
  UpdateCropCycleInput,
  ActivateCropCycleInput,
  CompleteCropCycleInput,
  FailCropCycleInput,
  AbandonCropCycleInput,
  CropCycleQueryParams,
  CropCycleStage,
} from '@/schemas';
import { cropCycleResponseSchema, cropCyclesResponseSchema } from '@/schemas';
import { http } from '@/services/api/http-client';

// ============================================================================
// API ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  BASE: '/crop-cycles',
  DETAIL: (id: number) => `/crop-cycles/${id}`,
  ACTIVATE: (id: number) => `/crop-cycles/${id}/activate`,
  COMPLETE: (id: number) => `/crop-cycles/${id}/complete`,
  FAIL: (id: number) => `/crop-cycles/${id}/fail`,
  ABANDON: (id: number) => `/crop-cycles/${id}/abandon`,
  CANCEL: (id: number) => `/crop-cycles/${id}/cancel`,
  DUPLICATE: (id: number) => `/crop-cycles/${id}/duplicate`,
  STAGES: (id: number) => `/crop-cycles/${id}/stages`,
  STAGE_COMPLETE: (cycleId: number, stageId: number) =>
    `/crop-cycles/${cycleId}/stages/${stageId}/complete`,
  VALIDATE_DATES: '/crop-cycles/validate-dates',
  CHECK_AVAILABILITY: (parcelId: number) => `/land-parcels/${parcelId}/availability`,
} as const;

// ============================================================================
// CROP CYCLE SERVICE
// ============================================================================

/**
 * Crop Cycle Service
 * ==================
 * Handles all API operations for crop cycle management.
 *
 * @example
 * // Get all cycles
 * const { data } = await cropCycleService.getAll({ status: 'in_progress' });
 *
 * // Activate a cycle
 * await cropCycleService.activate(1, { actual_start_date: '2026-01-15' });
 */
export const cropCycleService = {
  /**
   * Get paginated list of crop cycles
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated response with crop cycles
   *
   * @example
   * const cycles = await cropCycleService.getAll({
   *   status: 'in_progress',
   *   land_parcel_id: 1,
   * });
   */
  async getAll(params?: CropCycleQueryParams): Promise<CropCyclesResponse> {
    const response = await http.get<CropCyclesResponse>(ENDPOINTS.BASE, {
      params,
    });

    if (import.meta.env.DEV) {
      cropCyclesResponseSchema.parse(response);
    }

    return response;
  },

  /**
   * Get a single crop cycle by ID
   *
   * @param id - Crop cycle ID
   * @returns Crop cycle data with relations
   *
   * @example
   * const cycle = await cropCycleService.getById(1);
   * console.log(cycle.stages);
   */
  async getById(id: number): Promise<CropCycle> {
    const response = await http.get<CropCycleResponse>(ENDPOINTS.DETAIL(id));

    if (import.meta.env.DEV) {
      cropCycleResponseSchema.parse(response);
    }

    return response.data;
  },

  /**
   * Create a new crop cycle
   *
   * @param data - Crop cycle data
   * @returns Created crop cycle
   *
   * @example
   * const cycle = await cropCycleService.create({
   *   name: 'Vụ Đông Xuân 2025 - Lô A1',
   *   land_parcel_id: 1,
   *   crop_type_id: 1,
   *   season_id: 1,
   *   planned_start_date: '2025-11-01',
   *   planned_end_date: '2026-03-15',
   * });
   */
  async create(data: CreateCropCycleInput): Promise<CropCycle> {
    const response = await http.post<CropCycleResponse>(ENDPOINTS.BASE, data);
    return response.data;
  },

  /**
   * Update an existing crop cycle
   *
   * @param id - Crop cycle ID
   * @param data - Partial crop cycle data to update
   * @returns Updated crop cycle
   *
   * @example
   * const updated = await cropCycleService.update(1, {
   *   notes: 'Cập nhật ghi chú',
   * });
   */
  async update(id: number, data: UpdateCropCycleInput): Promise<CropCycle> {
    const response = await http.put<CropCycleResponse>(ENDPOINTS.DETAIL(id), data);
    return response.data;
  },

  /**
   * Delete a crop cycle
   *
   * @param id - Crop cycle ID
   *
   * @example
   * await cropCycleService.delete(1);
   */
  async delete(id: number): Promise<void> {
    await http.delete(ENDPOINTS.DETAIL(id));
  },

  /**
   * Activate a planned crop cycle (change status to in_progress)
   *
   * @param id - Crop cycle ID
   * @param data - Activation data (optional actual start date)
   * @returns Updated crop cycle
   *
   * @example
   * const activated = await cropCycleService.activate(1, {
   *   actual_start_date: '2026-01-15',
   *   notes: 'Bắt đầu gieo giống',
   * });
   */
  async activate(id: number, data?: ActivateCropCycleInput): Promise<CropCycle> {
    const response = await http.post<CropCycleResponse>(ENDPOINTS.ACTIVATE(id), data);
    return response.data;
  },

  /**
   * Complete a crop cycle (change status to completed)
   *
   * @param id - Crop cycle ID
   * @param data - Completion data (yield, actual end date)
   * @returns Updated crop cycle
   *
   * @example
   * const completed = await cropCycleService.complete(1, {
   *   actual_end_date: '2026-03-20',
   *   actual_yield: 5500,
   *   yield_unit_id: 1,
   *   notes: 'Thu hoạch thành công',
   * });
   */
  async complete(id: number, data?: CompleteCropCycleInput): Promise<CropCycle> {
    const response = await http.post<CropCycleResponse>(ENDPOINTS.COMPLETE(id), data);
    return response.data;
  },

  /**
   * Cancel a crop cycle (change status to cancelled)
   *
   * @param id - Crop cycle ID
   * @param reason - Reason for cancellation
   * @returns Updated crop cycle
   *
   * @example
   * const cancelled = await cropCycleService.cancel(1, 'Thiên tai');
   */
  async cancel(id: number, reason?: string): Promise<CropCycle> {
    const response = await http.post<CropCycleResponse>(ENDPOINTS.CANCEL(id), {
      reason,
    });
    return response.data;
  },

  /**
   * Get stages for a crop cycle
   *
   * @param id - Crop cycle ID
   * @returns Array of crop cycle stages
   *
   * @example
   * const stages = await cropCycleService.getStages(1);
   */
  async getStages(id: number): Promise<CropCycleStage[]> {
    const response = await http.get<{ data: CropCycleStage[] }>(ENDPOINTS.STAGES(id));
    return response.data;
  },

  /**
   * Complete a specific stage in a crop cycle
   *
   * @param cycleId - Crop cycle ID
   * @param stageId - Stage ID
   * @param actualEndDate - Actual completion date
   * @returns Updated stage
   *
   * @example
   * await cropCycleService.completeStage(1, 2, '2026-02-15');
   */
  async completeStage(
    cycleId: number,
    stageId: number,
    actualEndDate?: string
  ): Promise<CropCycleStage> {
    const response = await http.post<{ data: CropCycleStage }>(
      ENDPOINTS.STAGE_COMPLETE(cycleId, stageId),
      { actual_end_date: actualEndDate }
    );
    return response.data;
  },

  /**
   * Mark a crop cycle as failed
   *
   * @param id - Crop cycle ID
   * @param data - Failure data (reason, notes)
   * @returns Updated crop cycle
   *
   * @example
   * const failed = await cropCycleService.fail(1, {
   *   reason: 'Sâu bệnh phá hoại',
   *   notes: 'Cây bị nhiễm bệnh vàng lá',
   * });
   */
  async fail(id: number, data: FailCropCycleInput): Promise<CropCycle> {
    const response = await http.post<CropCycleResponse>(ENDPOINTS.FAIL(id), data);
    return response.data;
  },

  /**
   * Abandon a crop cycle
   *
   * @param id - Crop cycle ID
   * @param data - Abandon data (reason, notes)
   * @returns Updated crop cycle
   *
   * @example
   * const abandoned = await cropCycleService.abandon(1, {
   *   reason: 'Thiếu nước tưới',
   *   notes: 'Hạn hán kéo dài',
   * });
   */
  async abandon(id: number, data: AbandonCropCycleInput): Promise<CropCycle> {
    const response = await http.post<CropCycleResponse>(ENDPOINTS.ABANDON(id), data);
    return response.data;
  },

  /**
   * Duplicate a crop cycle with new configuration
   *
   * @param id - Source crop cycle ID
   * @param data - Optional overrides for the new cycle
   * @returns Newly created crop cycle
   *
   * @example
   * const duplicated = await cropCycleService.duplicate(1, {
   *   season_id: 2,
   *   planned_start_date: '2026-06-01',
   * });
   */
  async duplicate(id: number, data?: Partial<CreateCropCycleInput>): Promise<CropCycle> {
    const response = await http.post<CropCycleResponse>(ENDPOINTS.DUPLICATE(id), data);
    return response.data;
  },

  /**
   * Validate dates for a new or existing crop cycle
   * Checks for overlapping cycles on the same parcel
   *
   * @param landParcelId - Land parcel ID
   * @param startDate - Planned start date
   * @param endDate - Planned end date
   * @param excludeCycleId - Optional cycle ID to exclude (for updates)
   * @returns Validation result
   */
  async validateDates(
    landParcelId: number,
    startDate: string,
    endDate: string,
    excludeCycleId?: number
  ): Promise<{ valid: boolean; conflictingCycles?: CropCycle[] }> {
    const response = await http.post<{ valid: boolean; conflictingCycles?: CropCycle[] }>(
      ENDPOINTS.VALIDATE_DATES,
      {
        land_parcel_id: landParcelId,
        start_date: startDate,
        end_date: endDate,
        exclude_cycle_id: excludeCycleId,
      }
    );
    return response;
  },

  /**
   * Check land parcel availability for a date range
   *
   * @param parcelId - Land parcel ID
   * @param startDate - Start date
   * @param endDate - End date
   * @returns Availability status
   */
  async checkParcelAvailability(
    parcelId: number,
    startDate: string,
    endDate: string
  ): Promise<{ available: boolean; conflicts?: CropCycle[] }> {
    const response = await http.get<{ available: boolean; conflicts?: CropCycle[] }>(
      ENDPOINTS.CHECK_AVAILABILITY(parcelId),
      {
        params: { start_date: startDate, end_date: endDate },
      }
    );
    return response;
  },
} as const;

export default cropCycleService;
