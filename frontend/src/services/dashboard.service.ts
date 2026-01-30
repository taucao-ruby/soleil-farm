import type { DashboardStats } from '@/schemas/dashboard.schema';
import { dashboardStatsSchema } from '@/schemas/dashboard.schema';
import { http } from '@/services/api/http-client';

// ============================================================================
// API ENDPOINTS
// ============================================================================

const ENDPOINTS = {
  STATS: '/dashboard/stats',
  EXPORT_CSV: '/dashboard/export/csv',
  EXPORT_PDF: '/dashboard/export/pdf',
} as const;

// ============================================================================
// DASHBOARD SERVICE
// ============================================================================

/**
 * Dashboard Service
 * =================
 * Handles all API operations for dashboard analytics.
 *
 * @example
 * // Get dashboard stats
 * const stats = await dashboardService.getStats();
 *
 * // Export data
 * await dashboardService.exportCsv();
 */
export const dashboardService = {
  /**
   * Get dashboard statistics and analytics data
   *
   * @returns Dashboard stats including metrics, chart data, and recent activities
   *
   * @example
   * const stats = await dashboardService.getStats();
   * console.log(stats.total_area); // 50000
   * console.log(stats.active_crop_cycles); // 5
   */
  async getStats(): Promise<DashboardStats> {
    const response = await http.get<{ data: DashboardStats }>(ENDPOINTS.STATS);
    
    if (import.meta.env.DEV) {
      dashboardStatsSchema.parse(response.data);
    }
    
    return response.data;
  },

  /**
   * Export dashboard data as CSV
   *
   * @returns Blob with CSV data
   */
  async exportCsv(): Promise<Blob> {
    const response = await http.get<Blob>(ENDPOINTS.EXPORT_CSV, {
      responseType: 'blob',
    });
    return response;
  },

  /**
   * Export dashboard data as PDF
   *
   * @returns Blob with PDF data
   */
  async exportPdf(): Promise<Blob> {
    const response = await http.get<Blob>(ENDPOINTS.EXPORT_PDF, {
      responseType: 'blob',
    });
    return response;
  },
};

export default dashboardService;
