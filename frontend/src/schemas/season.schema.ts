import { z } from 'zod';

import {
  timestampsSchema,
  baseQueryParamsSchema,
  createPaginatedResponseSchema,
  createResourceResponseSchema,
} from './common.schema';

// ============================================================================
// SEASON SCHEMAS
// ============================================================================

/**
 * Season definition schema (templates like Đông Xuân, Hè Thu, etc.)
 */
export const seasonDefinitionSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string(),
    description: z.string().nullable(),
    typical_start_month: z.number().int().min(1).max(12),
    typical_end_month: z.number().int().min(1).max(12),
    is_active: z.boolean(),
  })
  .merge(timestampsSchema);

/**
 * Season model schema
 */
export const seasonSchema = z
  .object({
    id: z.number().int().positive(),
    season_definition_id: z.number().int().positive(),
    year: z.number().int().min(2000).max(2100),
    name: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    notes: z.string().nullable(),
    is_active: z.boolean(),
    // Computed fields
    crop_cycles_count: z.number().int().nonnegative().optional(),
    active_cycles_count: z.number().int().nonnegative().optional(),
    // Relations
    season_definition: seasonDefinitionSchema.optional(),
  })
  .merge(timestampsSchema);

/**
 * Create season input schema
 */
export const createSeasonSchema = z
  .object({
    season_definition_id: z.number().int().positive('Vui lòng chọn loại mùa vụ'),
    year: z
      .number()
      .int()
      .min(2000, 'Năm không hợp lệ')
      .max(2100, 'Năm không hợp lệ'),
    name: z
      .string()
      .min(1, 'Tên mùa vụ không được để trống')
      .max(255, 'Tên mùa vụ không được quá 255 ký tự'),
    start_date: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
    end_date: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
    notes: z.string().max(1000).nullable().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end > start;
    },
    {
      message: 'Ngày kết thúc phải sau ngày bắt đầu',
      path: ['end_date'],
    }
  );

/**
 * Update season input schema
 */
export const updateSeasonSchema = z
  .object({
    season_definition_id: z.number().int().positive().optional(),
    year: z.number().int().min(2000).max(2100).optional(),
    name: z.string().min(1).max(255).optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    notes: z.string().max(1000).nullable().optional(),
    is_active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        return end > start;
      }
      return true;
    },
    {
      message: 'Ngày kết thúc phải sau ngày bắt đầu',
      path: ['end_date'],
    }
  );

/**
 * Season query params schema
 */
export const seasonQueryParamsSchema = baseQueryParamsSchema.extend({
  is_active: z.boolean().optional(),
  year: z.number().int().optional(),
  season_definition_id: z.number().int().positive().optional(),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const seasonResponseSchema = createResourceResponseSchema(seasonSchema);
export const seasonsResponseSchema = createPaginatedResponseSchema(seasonSchema);
export const seasonDefinitionsResponseSchema = createResourceResponseSchema(
  z.array(seasonDefinitionSchema)
);

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type SeasonDefinition = z.infer<typeof seasonDefinitionSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type CreateSeasonInput = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonInput = z.infer<typeof updateSeasonSchema>;
export type SeasonQueryParams = z.infer<typeof seasonQueryParamsSchema>;
export type SeasonResponse = z.infer<typeof seasonResponseSchema>;
export type SeasonsResponse = z.infer<typeof seasonsResponseSchema>;
