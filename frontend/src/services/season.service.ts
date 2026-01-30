import type {
  Season,
  SeasonDefinition,
  SeasonResponse,
  SeasonsResponse,
  CreateSeasonInput,
  UpdateSeasonInput,
  SeasonQueryParams,
} from '@/schemas';
import { seasonResponseSchema, seasonsResponseSchema } from '@/schemas';
import { http } from '@/services/api/http-client';

// ============================================================================
// API ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  BASE: '/seasons',
  DETAIL: (id: number) => `/seasons/${id}`,
  DEFINITIONS: '/season-definitions',
  CURRENT: '/seasons/current',
} as const;

// ============================================================================
// SEASON SERVICE
// ============================================================================

/**
 * Season Service
 * ==============
 * Handles all API operations for season management.
 *
 * @example
 * // Get current season
 * const current = await seasonService.getCurrent();
 *
 * // Get all season definitions
 * const definitions = await seasonService.getDefinitions();
 */
export const seasonService = {
  /**
   * Get paginated list of seasons
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated response with seasons
   *
   * @example
   * const seasons = await seasonService.getAll({ year: 2026 });
   */
  async getAll(params?: SeasonQueryParams): Promise<SeasonsResponse> {
    const response = await http.get<SeasonsResponse>(ENDPOINTS.BASE, {
      params,
    });

    if (import.meta.env.DEV) {
      seasonsResponseSchema.parse(response);
    }

    return response;
  },

  /**
   * Get a single season by ID
   *
   * @param id - Season ID
   * @returns Season data
   *
   * @example
   * const season = await seasonService.getById(1);
   */
  async getById(id: number): Promise<Season> {
    const response = await http.get<SeasonResponse>(ENDPOINTS.DETAIL(id));

    if (import.meta.env.DEV) {
      seasonResponseSchema.parse(response);
    }

    return response.data;
  },

  /**
   * Get the current active season
   *
   * @returns Current season or null if none active
   *
   * @example
   * const current = await seasonService.getCurrent();
   * if (current) {
   *   console.log(`Mùa vụ hiện tại: ${current.name}`);
   * }
   */
  async getCurrent(): Promise<Season | null> {
    try {
      const response = await http.get<SeasonResponse>(ENDPOINTS.CURRENT);
      return response.data;
    } catch (_error) {
      // Return null if no current season found (404)
      return null;
    }
  },

  /**
   * Create a new season
   *
   * @param data - Season data
   * @returns Created season
   *
   * @example
   * const season = await seasonService.create({
   *   season_definition_id: 1,
   *   year: 2026,
   *   name: 'Đông Xuân 2025-2026',
   *   start_date: '2025-11-01',
   *   end_date: '2026-03-31',
   * });
   */
  async create(data: CreateSeasonInput): Promise<Season> {
    const response = await http.post<SeasonResponse>(ENDPOINTS.BASE, data);
    return response.data;
  },

  /**
   * Update an existing season
   *
   * @param id - Season ID
   * @param data - Partial season data to update
   * @returns Updated season
   *
   * @example
   * const updated = await seasonService.update(1, {
   *   notes: 'Cập nhật ghi chú mùa vụ',
   * });
   */
  async update(id: number, data: UpdateSeasonInput): Promise<Season> {
    const response = await http.put<SeasonResponse>(ENDPOINTS.DETAIL(id), data);
    return response.data;
  },

  /**
   * Delete a season
   *
   * @param id - Season ID
   *
   * @example
   * await seasonService.delete(1);
   */
  async delete(id: number): Promise<void> {
    await http.delete(ENDPOINTS.DETAIL(id));
  },

  /**
   * Toggle active status of a season
   *
   * @param id - Season ID
   * @param isActive - New active status
   * @returns Updated season
   *
   * @example
   * const season = await seasonService.toggleActive(1, true);
   */
  async toggleActive(id: number, isActive: boolean): Promise<Season> {
    const response = await http.patch<SeasonResponse>(ENDPOINTS.DETAIL(id), {
      is_active: isActive,
    });
    return response.data;
  },

  /**
   * Get all season definitions (templates)
   *
   * @returns Array of season definitions
   *
   * @example
   * const definitions = await seasonService.getDefinitions();
   * // Returns: [{ id: 1, name: 'Đông Xuân' }, { id: 2, name: 'Hè Thu' }, ...]
   */
  async getDefinitions(): Promise<SeasonDefinition[]> {
    const response = await http.get<{ data: SeasonDefinition[] }>(
      ENDPOINTS.DEFINITIONS
    );
    return response.data;
  },
} as const;

export default seasonService;
