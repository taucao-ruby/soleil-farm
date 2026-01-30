import type {
  LandParcel,
  LandParcelResponse,
  LandParcelsResponse,
  CreateLandParcelInput,
  UpdateLandParcelInput,
  LandParcelQueryParams,
  LandParcelStatus,
  CropCycleHistoryItem,
} from '@/schemas';
import { landParcelResponseSchema, landParcelsResponseSchema } from '@/schemas';
import { http } from '@/services/api/http-client';

// ============================================================================
// API ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  BASE: '/land-parcels',
  DETAIL: (id: number) => `/land-parcels/${id}`,
  WATER_SOURCES: (id: number) => `/land-parcels/${id}/water-sources`,
  CROP_CYCLES: (id: number) => `/land-parcels/${id}/crop-cycles`,
  BULK: '/land-parcels/bulk',
  EXPORT: '/land-parcels/export',
} as const;

// ============================================================================
// LAND PARCEL SERVICE
// ============================================================================

/**
 * Land Parcel Service
 * ===================
 * Handles all API operations for land parcel management.
 *
 * @example
 * // Get all parcels
 * const { data, meta } = await landParcelService.getAll();
 *
 * // Get single parcel
 * const parcel = await landParcelService.getById(1);
 *
 * // Create parcel
 * const newParcel = await landParcelService.create({ name: 'Lô A1', ... });
 */
export const landParcelService = {
  /**
   * Get paginated list of land parcels
   *
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated response with land parcels
   *
   * @example
   * const parcels = await landParcelService.getAll({ page: 1, per_page: 10 });
   */
  async getAll(params?: LandParcelQueryParams): Promise<LandParcelsResponse> {
    const response = await http.get<LandParcelsResponse>(ENDPOINTS.BASE, {
      params,
    });

    // Runtime validation (optional, can be removed in production for performance)
    if (import.meta.env.DEV) {
      landParcelsResponseSchema.parse(response);
    }

    return response;
  },

  /**
   * Get a single land parcel by ID
   *
   * @param id - Land parcel ID
   * @returns Land parcel data
   *
   * @example
   * const parcel = await landParcelService.getById(1);
   */
  async getById(id: number): Promise<LandParcel> {
    const response = await http.get<LandParcelResponse>(ENDPOINTS.DETAIL(id));

    if (import.meta.env.DEV) {
      landParcelResponseSchema.parse(response);
    }

    return response.data;
  },

  /**
   * Create a new land parcel
   *
   * @param data - Land parcel data
   * @returns Created land parcel
   *
   * @example
   * const parcel = await landParcelService.create({
   *   code: 'LOT-A1',
   *   name: 'Lô A1 - Đồng Bắc',
   *   area_value: 5.5,
   *   area_unit_id: 1,
   * });
   */
  async create(data: CreateLandParcelInput): Promise<LandParcel> {
    const response = await http.post<LandParcelResponse>(ENDPOINTS.BASE, data);
    return response.data;
  },

  /**
   * Update an existing land parcel
   *
   * @param id - Land parcel ID
   * @param data - Partial land parcel data to update
   * @returns Updated land parcel
   *
   * @example
   * const updated = await landParcelService.update(1, { name: 'New Name' });
   */
  async update(id: number, data: UpdateLandParcelInput): Promise<LandParcel> {
    const response = await http.put<LandParcelResponse>(ENDPOINTS.DETAIL(id), data);
    return response.data;
  },

  /**
   * Delete a land parcel
   *
   * @param id - Land parcel ID
   *
   * @example
   * await landParcelService.delete(1);
   */
  async delete(id: number): Promise<void> {
    await http.delete(ENDPOINTS.DETAIL(id));
  },

  /**
   * Toggle active status of a land parcel
   *
   * @param id - Land parcel ID
   * @param isActive - New active status
   * @returns Updated land parcel
   *
   * @example
   * const parcel = await landParcelService.toggleActive(1, false);
   */
  async toggleActive(id: number, isActive: boolean): Promise<LandParcel> {
    const response = await http.patch<LandParcelResponse>(ENDPOINTS.DETAIL(id), {
      is_active: isActive,
    });
    return response.data;
  },

  /**
   * Attach water sources to a land parcel
   *
   * @param id - Land parcel ID
   * @param waterSourceIds - Array of water source IDs
   *
   * @example
   * await landParcelService.attachWaterSources(1, [1, 2, 3]);
   */
  async attachWaterSources(id: number, waterSourceIds: number[]): Promise<void> {
    await http.post(ENDPOINTS.WATER_SOURCES(id), {
      water_source_ids: waterSourceIds,
    });
  },

  /**
   * Detach a water source from a land parcel
   *
   * @param id - Land parcel ID
   * @param waterSourceId - Water source ID to detach
   */
  async detachWaterSource(id: number, waterSourceId: number): Promise<void> {
    await http.delete(`${ENDPOINTS.WATER_SOURCES(id)}/${waterSourceId}`);
  },

  /**
   * Get crop cycle history for a land parcel
   *
   * @param id - Land parcel ID
   * @returns Array of crop cycle history items
   */
  async getCropCycleHistory(id: number): Promise<CropCycleHistoryItem[]> {
    const response = await http.get<{ data: CropCycleHistoryItem[] }>(ENDPOINTS.CROP_CYCLES(id));
    return response.data;
  },

  /**
   * Bulk delete land parcels
   *
   * @param ids - Array of land parcel IDs to delete
   */
  async bulkDelete(ids: number[]): Promise<void> {
    await http.post(`${ENDPOINTS.BULK}/delete`, { ids });
  },

  /**
   * Bulk change status of land parcels
   *
   * @param ids - Array of land parcel IDs
   * @param status - New status to apply
   */
  async bulkChangeStatus(ids: number[], status: LandParcelStatus): Promise<void> {
    await http.post(`${ENDPOINTS.BULK}/status`, { ids, status });
  },

  /**
   * Export land parcels to CSV/Excel
   *
   * @param ids - Optional array of specific IDs to export
   * @param params - Query parameters for filtering
   * @returns Blob of the exported file
   */
  async export(ids?: number[], params?: LandParcelQueryParams): Promise<Blob> {
    const response = await http.post<Blob>(
      ENDPOINTS.EXPORT,
      { ids },
      { params, responseType: 'blob' }
    );
    return response;
  },

  /**
   * Get impact analysis before deletion
   *
   * @param id - Land parcel ID
   * @returns Impact information (affected crop cycles, etc.)
   */
  async getDeleteImpact(id: number): Promise<{ crop_cycles_count: number; activity_logs_count: number }> {
    const response = await http.get<{ data: { crop_cycles_count: number; activity_logs_count: number } }>(
      `${ENDPOINTS.DETAIL(id)}/impact`
    );
    return response.data;
  },
} as const;

export default landParcelService;
