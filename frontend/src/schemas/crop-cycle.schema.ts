import { z } from 'zod';

import {
  timestampsSchema,
  baseQueryParamsSchema,
  createPaginatedResponseSchema,
  createResourceResponseSchema,
} from './common.schema';

// ============================================================================
// CROP CYCLE SCHEMAS
// ============================================================================

/**
 * Crop cycle status enum
 * State Machine: planned → active → completed
 *                  ↓         ↓
 *                  └──→ failed/abandoned
 */
export const cropCycleStatusSchema = z.enum([
  'planned',
  'active',
  'in_progress', // Alias for active (backward compatibility)
  'harvesting',
  'completed',
  'failed',
  'abandoned',
  'cancelled', // Legacy status
]);

/**
 * Status transition reasons schema
 */
export const statusTransitionReasonSchema = z.object({
  reason: z.string().min(1, 'Vui lòng nhập lý do').max(500, 'Lý do không quá 500 ký tự'),
  notes: z.string().max(2000).optional(),
});

/**
 * Fail crop cycle schema
 */
export const failCropCycleSchema = statusTransitionReasonSchema.extend({
  actual_end_date: z.string().optional(),
});

/**
 * Abandon crop cycle schema
 */
export const abandonCropCycleSchema = statusTransitionReasonSchema.extend({
  actual_end_date: z.string().optional(),
});

/**
 * Crop cycle stage schema
 */
export const cropCycleStageSchema = z
  .object({
    id: z.number().int().positive(),
    crop_cycle_id: z.number().int().positive(),
    stage_name: z.string(),
    stage_order: z.number().int().nonnegative(),
    planned_start_date: z.string(),
    actual_start_date: z.string().nullable(),
    planned_end_date: z.string(),
    actual_end_date: z.string().nullable(),
    notes: z.string().nullable(),
    is_completed: z.boolean(),
  })
  .merge(timestampsSchema);

/**
 * Crop type schema
 */
export const cropTypeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  variety: z.string().nullable(),
  growth_duration_days: z.number().int().positive().nullable(),
  description: z.string().nullable(),
});

/**
 * Crop cycle model schema
 */
export const cropCycleSchema = z
  .object({
    id: z.number().int().positive(),
    land_parcel_id: z.number().int().positive(),
    crop_type_id: z.number().int().positive(),
    season_id: z.number().int().positive(),
    name: z.string(),
    status: cropCycleStatusSchema,
    planned_start_date: z.string(),
    actual_start_date: z.string().nullable(),
    planned_end_date: z.string(),
    actual_end_date: z.string().nullable(),
    expected_yield: z.number().nullable(),
    actual_yield: z.number().nullable(),
    yield_unit_id: z.number().int().positive().nullable(),
    notes: z.string().nullable(),
    // Relations
    land_parcel: z
      .object({
        id: z.number().int().positive(),
        code: z.string(),
        name: z.string(),
      })
      .optional(),
    crop_type: cropTypeSchema.optional(),
    season: z
      .object({
        id: z.number().int().positive(),
        name: z.string(),
        year: z.number().int(),
      })
      .optional(),
    stages: z.array(cropCycleStageSchema).optional(),
    current_stage: cropCycleStageSchema.nullable().optional(),
  })
  .merge(timestampsSchema);

/**
 * Create crop cycle input schema
 */
export const createCropCycleSchema = z.object({
  land_parcel_id: z.number().int().positive('Vui lòng chọn lô đất'),
  crop_type_id: z.number().int().positive('Vui lòng chọn loại cây trồng'),
  season_id: z.number().int().positive('Vui lòng chọn mùa vụ'),
  name: z
    .string()
    .min(1, 'Tên chu kỳ không được để trống')
    .max(255, 'Tên chu kỳ không được quá 255 ký tự'),
  planned_start_date: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
  planned_end_date: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  expected_yield: z.number().positive().nullable().optional(),
  yield_unit_id: z.number().int().positive().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

/**
 * Update crop cycle input schema
 */
export const updateCropCycleSchema = createCropCycleSchema.partial().extend({
  status: cropCycleStatusSchema.optional(),
  actual_start_date: z.string().nullable().optional(),
  actual_end_date: z.string().nullable().optional(),
  actual_yield: z.number().positive().nullable().optional(),
});

/**
 * Activate crop cycle schema
 */
export const activateCropCycleSchema = z.object({
  actual_start_date: z.string().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Complete crop cycle schema
 */
export const completeCropCycleSchema = z.object({
  actual_end_date: z.string().optional(),
  actual_yield: z.number().positive().nullable().optional(),
  yield_unit_id: z.number().int().positive().nullable().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Crop cycle query params schema
 */
export const cropCycleQueryParamsSchema = baseQueryParamsSchema.extend({
  status: cropCycleStatusSchema.optional(),
  land_parcel_id: z.number().int().positive().optional(),
  crop_type_id: z.number().int().positive().optional(),
  season_id: z.number().int().positive().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const cropCycleResponseSchema = createResourceResponseSchema(cropCycleSchema);
export const cropCyclesResponseSchema = createPaginatedResponseSchema(cropCycleSchema);
export const cropCycleStagesResponseSchema = createResourceResponseSchema(
  z.array(cropCycleStageSchema)
);

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type CropCycleStatus = z.infer<typeof cropCycleStatusSchema>;
export type CropCycleStage = z.infer<typeof cropCycleStageSchema>;
export type CropType = z.infer<typeof cropTypeSchema>;
export type CropCycle = z.infer<typeof cropCycleSchema>;
export type CreateCropCycleInput = z.infer<typeof createCropCycleSchema>;
export type UpdateCropCycleInput = z.infer<typeof updateCropCycleSchema>;
export type ActivateCropCycleInput = z.infer<typeof activateCropCycleSchema>;
export type CompleteCropCycleInput = z.infer<typeof completeCropCycleSchema>;
export type FailCropCycleInput = z.infer<typeof failCropCycleSchema>;
export type AbandonCropCycleInput = z.infer<typeof abandonCropCycleSchema>;
export type CropCycleQueryParams = z.infer<typeof cropCycleQueryParamsSchema>;
export type CropCycleResponse = z.infer<typeof cropCycleResponseSchema>;
export type CropCyclesResponse = z.infer<typeof cropCyclesResponseSchema>;
