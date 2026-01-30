import { z } from 'zod';

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

/**
 * Timestamps schema (from Laravel models)
 */
export const timestampsSchema = z.object({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Soft deletes schema
 */
export const softDeletesSchema = z.object({
  deleted_at: z.string().datetime().nullable(),
});

/**
 * Pagination meta schema
 */
export const paginationMetaSchema = z.object({
  current_page: z.number().int().positive(),
  from: z.number().int().nullable(),
  last_page: z.number().int().positive(),
  path: z.string().url(),
  per_page: z.number().int().positive(),
  to: z.number().int().nullable(),
  total: z.number().int().nonnegative(),
});

/**
 * Pagination links schema
 */
export const paginationLinksSchema = z.object({
  first: z.string().url().nullable(),
  last: z.string().url().nullable(),
  prev: z.string().url().nullable(),
  next: z.string().url().nullable(),
});

/**
 * Generic paginated response schema factory
 */
export function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
  });
}

/**
 * Generic single resource response schema factory
 */
export function createResourceResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
  });
}

/**
 * API Error schema
 */
export const apiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
});

// ============================================================================
// QUERY PARAMS SCHEMAS
// ============================================================================

/**
 * Sort direction
 */
export const sortDirectionSchema = z.enum(['asc', 'desc']);

/**
 * Base query params (pagination + sorting)
 */
export const baseQueryParamsSchema = z.object({
  page: z.number().int().positive().optional(),
  per_page: z.number().int().positive().max(100).optional(),
  sort_by: z.string().optional(),
  sort_direction: sortDirectionSchema.optional(),
  search: z.string().optional(),
});

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type Timestamps = z.infer<typeof timestampsSchema>;
export type SoftDeletes = z.infer<typeof softDeletesSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginationLinks = z.infer<typeof paginationLinksSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type SortDirection = z.infer<typeof sortDirectionSchema>;
export type BaseQueryParams = z.infer<typeof baseQueryParamsSchema>;
