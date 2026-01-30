import { z } from 'zod';

// ============================================================================
// DASHBOARD SCHEMAS
// ============================================================================

/**
 * Land parcel status breakdown
 */
export const landParcelStatusBreakdownSchema = z.object({
  active: z.number().int().nonnegative(),
  inactive: z.number().int().nonnegative(),
});

/**
 * Crop cycle by season data point
 */
export const cropCycleBySeasonSchema = z.object({
  season_id: z.number().int().positive(),
  season_name: z.string(),
  year: z.number().int().positive(),
  count: z.number().int().nonnegative(),
  month: z.string().optional(), // For chart display
});

/**
 * Land parcel status distribution for pie chart
 */
export const landParcelStatusDistributionSchema = z.object({
  status: z.string(),
  label: z.string(),
  count: z.number().int().nonnegative(),
  color: z.string(),
});

/**
 * Activity frequency timeline data point
 */
export const activityFrequencySchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative(),
  label: z.string().optional(),
});

/**
 * Active crop cycle for timeline display
 */
export const activeCropCycleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  land_parcel_name: z.string(),
  crop_type_name: z.string(),
  status: z.enum(['planned', 'in_progress', 'harvesting', 'completed', 'cancelled']),
  planned_start_date: z.string(),
  planned_end_date: z.string(),
  actual_start_date: z.string().nullable(),
  actual_end_date: z.string().nullable(),
  progress_percentage: z.number().min(0).max(100),
});

/**
 * Recent activity log entry
 */
export const recentActivitySchema = z.object({
  id: z.number().int().positive(),
  activity_type_name: z.string(),
  activity_type_code: z.string(),
  crop_cycle_name: z.string(),
  land_parcel_name: z.string(),
  user_name: z.string(),
  activity_date: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
});

/**
 * Dashboard stats response schema
 */
export const dashboardStatsSchema = z.object({
  // Key metrics
  total_area: z.number().nonnegative(),
  total_area_unit: z.string(), // 'm²' or 'hectares'
  land_parcels_count: z.number().int().nonnegative(),
  land_parcels_breakdown: landParcelStatusBreakdownSchema,
  active_crop_cycles: z.number().int().nonnegative(),
  activities_today: z.number().int().nonnegative(),
  
  // Chart data
  crop_cycles_by_season: z.array(cropCycleBySeasonSchema),
  land_parcel_status_distribution: z.array(landParcelStatusDistributionSchema),
  activity_frequency: z.array(activityFrequencySchema),
  
  // Table data
  active_crop_cycles_list: z.array(activeCropCycleSchema),
  recent_activities: z.array(recentActivitySchema),
});

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type LandParcelStatusBreakdown = z.infer<typeof landParcelStatusBreakdownSchema>;
export type CropCycleBySeason = z.infer<typeof cropCycleBySeasonSchema>;
export type LandParcelStatusDistribution = z.infer<typeof landParcelStatusDistributionSchema>;
export type ActivityFrequency = z.infer<typeof activityFrequencySchema>;
export type ActiveCropCycle = z.infer<typeof activeCropCycleSchema>;
export type RecentActivity = z.infer<typeof recentActivitySchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
