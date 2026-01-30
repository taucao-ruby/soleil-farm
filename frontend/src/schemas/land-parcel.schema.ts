import { z } from 'zod';

import {
  timestampsSchema,
  baseQueryParamsSchema,
  createPaginatedResponseSchema,
  createResourceResponseSchema,
} from './common.schema';

// ============================================================================
// LAND PARCEL SCHEMAS
// ============================================================================

/**
 * Land Parcel status enum - available, in_use, resting, maintenance
 */
export const landParcelStatusSchema = z.enum([
  'available',
  'in_use',
  'resting',
  'maintenance',
]);

/**
 * Soil type enum
 */
export const soilTypeSchema = z.enum([
  'phu_sa',       // Đất phù sa
  'cat',          // Đất cát
  'set',          // Đất sét
  'pha',          // Đất pha
]);

/**
 * Area unit schema
 */
export const areaUnitSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  symbol: z.string(),
});

/**
 * Water source schema (simplified for land parcel)
 */
export const waterSourceSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  type: z.string(),
});

/**
 * Crop cycle history item schema
 */
export const cropCycleHistoryItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  crop_type: z.string(),
  status: z.string(),
  start_date: z.string(),
  end_date: z.string().nullable(),
  yield_amount: z.number().nullable(),
  yield_unit: z.string().nullable(),
});

/**
 * Land Parcel model schema
 */
export const landParcelSchema = z
  .object({
    id: z.number().int().positive(),
    code: z.string().min(1).max(50),
    name: z.string().min(1).max(100),
    description: z.string().nullable(),
    area_value: z.number().positive(),
    area_unit_id: z.number().int().positive(),
    area_unit: areaUnitSchema.optional(),
    location_description: z.string().nullable(),
    gps_coordinates: z.string().nullable(),
    soil_type: soilTypeSchema.nullable(),
    status: landParcelStatusSchema.default('available'),
    is_active: z.boolean(),
    water_sources: z.array(waterSourceSchema).optional(),
    crop_cycles: z.array(cropCycleHistoryItemSchema).optional(),
    active_crop_cycles_count: z.number().int().nonnegative().optional(),
  })
  .merge(timestampsSchema);

/**
 * Create land parcel input schema - Form validation
 */
export const createLandParcelSchema = z.object({
  code: z
    .string()
    .min(1, 'Mã lô đất không được để trống')
    .max(50, 'Mã lô đất không được quá 50 ký tự')
    .regex(/^[A-Z0-9-]+$/, 'Mã lô đất chỉ được chứa chữ in hoa, số và dấu gạch ngang')
    .optional()
    .or(z.literal('')),
  name: z
    .string()
    .min(1, 'Tên lô đất không được để trống')
    .max(100, 'Tên lô đất không được quá 100 ký tự'),
  description: z.string().max(1000, 'Mô tả không được quá 1000 ký tự').nullable().optional(),
  area_value: z
    .number({ required_error: 'Diện tích không được để trống', invalid_type_error: 'Diện tích phải là số' })
    .positive('Diện tích phải lớn hơn 0')
    .min(1, 'Diện tích tối thiểu là 1')
    .max(10000, 'Diện tích không được quá 10,000'),
  area_unit_id: z
    .number({ required_error: 'Vui lòng chọn đơn vị diện tích' })
    .int()
    .positive('Vui lòng chọn đơn vị diện tích'),
  location_description: z.string().max(500).nullable().optional(),
  gps_coordinates: z
    .string()
    .regex(/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/, 'Tọa độ GPS không hợp lệ (VD: 10.762622, 106.660172)')
    .nullable()
    .optional()
    .or(z.literal('')),
  soil_type: soilTypeSchema.nullable().optional(),
  status: landParcelStatusSchema.default('available'),
  water_source_ids: z.array(z.number().int().positive()).optional(),
});

/**
 * Update land parcel input schema
 */
export const updateLandParcelSchema = createLandParcelSchema.partial().extend({
  is_active: z.boolean().optional(),
});

/**
 * Land parcel query params schema
 */
export const landParcelQueryParamsSchema = baseQueryParamsSchema.extend({
  is_active: z.boolean().optional(),
  status: landParcelStatusSchema.optional(),
  soil_type: soilTypeSchema.optional(),
  area_min: z.number().optional(),
  area_max: z.number().optional(),
});

/**
 * Bulk action schema
 */
export const bulkActionSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, 'Vui lòng chọn ít nhất một lô đất'),
  action: z.enum(['delete', 'change_status', 'export']),
  status: landParcelStatusSchema.optional(),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const landParcelResponseSchema = createResourceResponseSchema(landParcelSchema);
export const landParcelsResponseSchema = createPaginatedResponseSchema(landParcelSchema);

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type LandParcelStatus = z.infer<typeof landParcelStatusSchema>;
export type SoilType = z.infer<typeof soilTypeSchema>;
export type AreaUnit = z.infer<typeof areaUnitSchema>;
export type WaterSource = z.infer<typeof waterSourceSchema>;
export type CropCycleHistoryItem = z.infer<typeof cropCycleHistoryItemSchema>;
export type LandParcel = z.infer<typeof landParcelSchema>;
export type CreateLandParcelInput = z.infer<typeof createLandParcelSchema>;
export type UpdateLandParcelInput = z.infer<typeof updateLandParcelSchema>;
export type LandParcelQueryParams = z.infer<typeof landParcelQueryParamsSchema>;
export type BulkAction = z.infer<typeof bulkActionSchema>;
export type LandParcelResponse = z.infer<typeof landParcelResponseSchema>;
export type LandParcelsResponse = z.infer<typeof landParcelsResponseSchema>;

// ============================================================================
// CONSTANTS
// ============================================================================

export const SOIL_TYPE_LABELS: Record<SoilType, string> = {
  phu_sa: 'Đất phù sa',
  cat: 'Đất cát',
  set: 'Đất sét',
  pha: 'Đất pha',
};

export const STATUS_LABELS: Record<LandParcelStatus, string> = {
  available: 'Sẵn sàng',
  in_use: 'Đang sử dụng',
  resting: 'Nghỉ đất',
  maintenance: 'Bảo trì',
};

export const STATUS_COLORS: Record<LandParcelStatus, 'success' | 'warning' | 'secondary' | 'destructive'> = {
  available: 'success',
  in_use: 'warning',
  resting: 'secondary',
  maintenance: 'destructive',
};
