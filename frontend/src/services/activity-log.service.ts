import type {
  ActivityLog,
  ActivityType,
  ActivityLogsResponse,
  CreateActivityLogInput,
  UpdateActivityLogInput,
  ActivityLogQueryParams,
} from '@/schemas';
import { activityLogsResponseSchema } from '@/schemas';
import { http } from '@/services/api/http-client';

// ============================================================================
// API ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  BASE: '/activity-logs',
  DETAIL: (id: number) => `/activity-logs/${id}`,
  TYPES: '/activity-types',
} as const;

// ============================================================================
// ACTIVITY LOG SERVICE
// ============================================================================

/**
 * Activity Log Service
 * ====================
 * Handles all API operations for activity log management.
 *
 * @example
 * // Get logs for a crop cycle
 * const logs = await activityLogService.getAll({ crop_cycle_id: 1 });
 *
 * // Create a new log entry
 * await activityLogService.create({
 *   crop_cycle_id: 1,
 *   activity_type_id: 2,
 *   activity_date: '2026-01-29',
 * });
 */
export const activityLogService = {
  /**
   * Get paginated list of activity logs
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated response with activity logs
   *
   * @example
   * const logs = await activityLogService.getAll({
   *   crop_cycle_id: 1,
   *   date_from: '2026-01-01',
   *   date_to: '2026-01-31',
   * });
   */
  async getAll(params?: ActivityLogQueryParams): Promise<ActivityLogsResponse> {
    const response = await http.get<ActivityLogsResponse>(ENDPOINTS.BASE, {
      params,
    });

    if (import.meta.env.DEV) {
      activityLogsResponseSchema.parse(response);
    }

    return response;
  },

  /**
   * Get a single activity log by ID
   *
   * @param id - Activity log ID
   * @returns Activity log data
   *
   * @example
   * const log = await activityLogService.getById(1);
   */
  async getById(id: number): Promise<ActivityLog> {
    const response = await http.get<{ data: ActivityLog }>(ENDPOINTS.DETAIL(id));
    return response.data;
  },

  /**
   * Create a new activity log entry
   *
   * @param data - Activity log data
   * @returns Created activity log
   *
   * @example
   * const log = await activityLogService.create({
   *   crop_cycle_id: 1,
   *   activity_type_id: 2,
   *   activity_date: '2026-01-29',
   *   description: 'Bón phân NPK lần 1',
   * });
   */
  async create(data: CreateActivityLogInput): Promise<ActivityLog> {
    const response = await http.post<{ data: ActivityLog }>(ENDPOINTS.BASE, data);
    return response.data;
  },

  /**
   * Update an existing activity log
   *
   * @param id - Activity log ID
   * @param data - Partial activity log data to update
   * @returns Updated activity log
   *
   * @example
   * const updated = await activityLogService.update(1, {
   *   notes: 'Cập nhật ghi chú',
   * });
   */
  async update(id: number, data: UpdateActivityLogInput): Promise<ActivityLog> {
    const response = await http.put<{ data: ActivityLog }>(
      ENDPOINTS.DETAIL(id),
      data
    );
    return response.data;
  },

  /**
   * Delete an activity log
   *
   * @param id - Activity log ID
   *
   * @example
   * await activityLogService.delete(1);
   */
  async delete(id: number): Promise<void> {
    await http.delete(ENDPOINTS.DETAIL(id));
  },

  /**
   * Get all activity types
   *
   * @returns Array of activity types
   *
   * @example
   * const types = await activityLogService.getActivityTypes();
   * // Returns: [{ id: 1, code: 'PLANTING', name: 'Gieo trồng' }, ...]
   */
  async getActivityTypes(): Promise<ActivityType[]> {
    const response = await http.get<{ data: ActivityType[] }>(ENDPOINTS.TYPES);
    return response.data;
  },
} as const;

export default activityLogService;
