import { z } from 'zod';

import {
  timestampsSchema,
  baseQueryParamsSchema,
  createPaginatedResponseSchema,
} from './common.schema';

// ============================================================================
// ACTIVITY LOG SCHEMAS
// ============================================================================

/**
 * Activity type schema
 */
export const activityTypeSchema = z.object({
  id: z.number().int().positive(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  is_active: z.boolean(),
});

/**
 * Activity log model schema
 */
export const activityLogSchema = z
  .object({
    id: z.number().int().positive(),
    crop_cycle_id: z.number().int().positive(),
    crop_cycle_stage_id: z.number().int().positive().nullable(),
    activity_type_id: z.number().int().positive(),
    user_id: z.number().int().positive(),
    activity_date: z.string(),
    description: z.string().nullable(),
    notes: z.string().nullable(),
    metadata: z.record(z.unknown()).nullable(),
    // Relations
    activity_type: activityTypeSchema.optional(),
    crop_cycle: z
      .object({
        id: z.number().int().positive(),
        name: z.string(),
      })
      .optional(),
    user: z
      .object({
        id: z.number().int().positive(),
        name: z.string(),
      })
      .optional(),
  })
  .merge(timestampsSchema);

/**
 * Create activity log input schema
 */
export const createActivityLogSchema = z.object({
  crop_cycle_id: z.number().int().positive('Vui lòng chọn chu kỳ canh tác'),
  crop_cycle_stage_id: z.number().int().positive().nullable().optional(),
  activity_type_id: z.number().int().positive('Vui lòng chọn loại hoạt động'),
  activity_date: z.string().min(1, 'Vui lòng chọn ngày hoạt động'),
  description: z.string().max(500).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

/**
 * Update activity log input schema
 */
export const updateActivityLogSchema = createActivityLogSchema.partial();

/**
 * Activity log query params schema
 */
export const activityLogQueryParamsSchema = baseQueryParamsSchema.extend({
  crop_cycle_id: z.number().int().positive().optional(),
  activity_type_id: z.number().int().positive().optional(),
  user_id: z.number().int().positive().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const activityLogsResponseSchema = createPaginatedResponseSchema(activityLogSchema);

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type ActivityType = z.infer<typeof activityTypeSchema>;
export type ActivityLog = z.infer<typeof activityLogSchema>;
export type CreateActivityLogInput = z.infer<typeof createActivityLogSchema>;
export type UpdateActivityLogInput = z.infer<typeof updateActivityLogSchema>;
export type ActivityLogQueryParams = z.infer<typeof activityLogQueryParamsSchema>;
export type ActivityLogsResponse = z.infer<typeof activityLogsResponseSchema>;
