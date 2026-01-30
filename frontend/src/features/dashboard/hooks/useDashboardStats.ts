import { useQuery } from '@tanstack/react-query';

import type { DashboardStats } from '@/schemas/dashboard.schema';
import dashboardService from '@/services/dashboard.service';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to fetch dashboard statistics with real-time updates
 *
 * @param options - Query options
 * @returns Query result with dashboard stats
 *
 * @example
 * const { data, isLoading, error, refetch } = useDashboardStats();
 */
export function useDashboardStats(options?: {
  refetchInterval?: number | false;
  enabled?: boolean;
}) {
  const { refetchInterval = 30000, enabled = true } = options ?? {};

  return useQuery<DashboardStats, Error>({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getStats(),
    refetchInterval, // Auto-refresh every 30 seconds by default
    refetchOnWindowFocus: true,
    staleTime: 10000, // Consider data stale after 10 seconds
    enabled,
  });
}

/**
 * Hook to export dashboard data
 */
export function useExportDashboard() {
  const exportCsv = async () => {
    try {
      const blob = await dashboardService.exportCsv();
      downloadBlob(blob, `soleil-farm-dashboard-${formatDate()}.csv`);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      throw error;
    }
  };

  const exportPdf = async () => {
    try {
      const blob = await dashboardService.exportPdf();
      downloadBlob(blob, `soleil-farm-dashboard-${formatDate()}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      throw error;
    }
  };

  return { exportCsv, exportPdf };
}

// ============================================================================
// HELPERS
// ============================================================================

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function formatDate() {
  return new Date().toISOString().split('T')[0];
}
