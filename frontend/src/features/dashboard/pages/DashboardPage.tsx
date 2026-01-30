import { useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';
import {
  Map,
  Sprout,
  Calendar,
  Activity,
  TrendingUp,
  Sun,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/schemas/dashboard.schema';

import {
  StatCard,
  StatCardsGrid,
  CropCyclesBySeasonChart,
  LandParcelStatusChart,
  ActivityTimelineChart,
  CropCycleTimeline,
  RecentActivitiesTable,
  ActiveCropCyclesTable,
  DashboardErrorState,
  ExportButton,
} from '../components';
import {
  useDashboardStats,
  useExportDashboard,
} from '../hooks/useDashboardStats';

// ============================================================================
// MOCK DATA (sẽ được thay bằng API data)
// ============================================================================

const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_area: 45500,
  total_area_unit: 'm²',
  land_parcels_count: 12,
  land_parcels_breakdown: {
    active: 10,
    inactive: 2,
  },
  active_crop_cycles: 8,
  activities_today: 5,
  crop_cycles_by_season: [
    { season_id: 1, season_name: 'Đông Xuân', year: 2025, count: 12 },
    { season_id: 2, season_name: 'Hè Thu', year: 2025, count: 8 },
    { season_id: 3, season_name: 'Thu Đông', year: 2025, count: 6 },
    { season_id: 1, season_name: 'Đông Xuân', year: 2026, count: 10 },
  ],
  land_parcel_status_distribution: [
    { status: 'active', label: 'Đang hoạt động', count: 10, color: '#22c55e' },
    { status: 'inactive', label: 'Tạm nghỉ', count: 2, color: '#94a3b8' },
  ],
  activity_frequency: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    count: Math.floor(Math.random() * 8) + 1,
  })),
  active_crop_cycles_list: [
    {
      id: 1,
      name: 'Lúa ST25 - Vụ Đông Xuân 2026',
      land_parcel_name: 'Lô A1',
      crop_type_name: 'Lúa ST25',
      status: 'in_progress',
      planned_start_date: '2026-01-01',
      planned_end_date: '2026-04-30',
      actual_start_date: '2026-01-05',
      actual_end_date: null,
      progress_percentage: 25,
    },
    {
      id: 2,
      name: 'Rau muống - Đợt 1',
      land_parcel_name: 'Lô B2',
      crop_type_name: 'Rau muống',
      status: 'harvesting',
      planned_start_date: '2025-12-15',
      planned_end_date: '2026-02-15',
      actual_start_date: '2025-12-18',
      actual_end_date: null,
      progress_percentage: 80,
    },
    {
      id: 3,
      name: 'Dưa hấu - Tết 2026',
      land_parcel_name: 'Lô C1',
      crop_type_name: 'Dưa hấu',
      status: 'in_progress',
      planned_start_date: '2025-11-20',
      planned_end_date: '2026-02-01',
      actual_start_date: '2025-11-22',
      actual_end_date: null,
      progress_percentage: 65,
    },
    {
      id: 4,
      name: 'Cà chua bi - Vụ 1',
      land_parcel_name: 'Lô A2',
      crop_type_name: 'Cà chua bi',
      status: 'planned',
      planned_start_date: '2026-02-01',
      planned_end_date: '2026-05-01',
      actual_start_date: null,
      actual_end_date: null,
      progress_percentage: 0,
    },
    {
      id: 5,
      name: 'Bắp ngọt - Vụ Xuân',
      land_parcel_name: 'Lô D1',
      crop_type_name: 'Bắp ngọt',
      status: 'in_progress',
      planned_start_date: '2026-01-10',
      planned_end_date: '2026-04-10',
      actual_start_date: '2026-01-12',
      actual_end_date: null,
      progress_percentage: 15,
    },
  ],
  recent_activities: [
    {
      id: 1,
      activity_type_name: 'Gieo giống',
      activity_type_code: 'seeding',
      crop_cycle_name: 'Lúa ST25 - Vụ Đông Xuân 2026',
      land_parcel_name: 'Lô A1',
      user_name: 'Nguyễn Văn A',
      activity_date: '2026-01-29',
      description: 'Gieo giống lúa ST25, 15kg/công',
      created_at: '2026-01-29T08:00:00Z',
    },
    {
      id: 2,
      activity_type_name: 'Tưới nước',
      activity_type_code: 'watering',
      crop_cycle_name: 'Rau muống - Đợt 1',
      land_parcel_name: 'Lô B2',
      user_name: 'Trần Văn B',
      activity_date: '2026-01-29',
      description: 'Tưới nước buổi sáng',
      created_at: '2026-01-29T07:30:00Z',
    },
    {
      id: 3,
      activity_type_name: 'Bón phân',
      activity_type_code: 'fertilizing',
      crop_cycle_name: 'Dưa hấu - Tết 2026',
      land_parcel_name: 'Lô C1',
      user_name: 'Lê Văn C',
      activity_date: '2026-01-28',
      description: 'Bón phân NPK 16-16-8',
      created_at: '2026-01-28T14:00:00Z',
    },
    {
      id: 4,
      activity_type_name: 'Thu hoạch',
      activity_type_code: 'harvesting',
      crop_cycle_name: 'Rau muống - Đợt 1',
      land_parcel_name: 'Lô B2',
      user_name: 'Nguyễn Văn A',
      activity_date: '2026-01-28',
      description: 'Thu hoạch đợt 1, 50kg',
      created_at: '2026-01-28T10:00:00Z',
    },
    {
      id: 5,
      activity_type_name: 'Phun thuốc',
      activity_type_code: 'pest_control',
      crop_cycle_name: 'Bắp ngọt - Vụ Xuân',
      land_parcel_name: 'Lô D1',
      user_name: 'Trần Văn B',
      activity_date: '2026-01-27',
      description: 'Phun thuốc trừ sâu sinh học',
      created_at: '2026-01-27T09:00:00Z',
    },
  ],
};

// ============================================================================
// DASHBOARD PAGE COMPONENT
// ============================================================================

/**
 * DashboardPage
 * =============
 * Trang tổng quan farming analytics với real-time insights.
 *
 * Features:
 * - 4 stat cards: Diện tích, Lô đất, Chu kỳ, Hoạt động hôm nay
 * - Bar chart: Chu kỳ theo mùa vụ
 * - Pie chart: Phân bố trạng thái lô đất
 * - Line chart: Hoạt động theo thời gian
 * - Gantt timeline: Chu kỳ đang hoạt động
 * - Data tables: Hoạt động gần đây, Chu kỳ đang chạy
 * - Export: CSV/PDF
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const { exportCsv, exportPdf } = useExportDashboard();

  // Fetch dashboard data with real-time updates
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDashboardStats({
    refetchInterval: 30000, // Refresh every 30 seconds
    enabled: true,
  });

  // Use mock data while API is not ready
  const dashboardData: DashboardStats = stats ?? MOCK_DASHBOARD_STATS;

  // Format total area for display
  const formattedArea = useMemo(() => {
    const area = dashboardData.total_area;
    if (area >= 10000) {
      return `${(area / 10000).toFixed(1)} ha`;
    }
    return `${area.toLocaleString('vi-VN')} m²`;
  }, [dashboardData.total_area]);

  // Navigation handlers
  const handleNavigateToLandParcels = useCallback(() => {
    navigate('/dat-canh-tac');
  }, [navigate]);

  const handleNavigateToCropCycles = useCallback(() => {
    navigate('/chu-ky-canh-tac');
  }, [navigate]);

  const handleNavigateToActivities = useCallback(() => {
    navigate('/nhat-ky');
  }, [navigate]);

  const handleCycleClick = useCallback(
    (cycleId: number) => {
      if (cycleId === 0) {
        navigate('/chu-ky-canh-tac');
      } else {
        navigate(`/chu-ky-canh-tac/${cycleId}`);
      }
    },
    [navigate]
  );

  const handleActivityClick = useCallback(
    (activityId: number) => {
      if (activityId === 0) {
        navigate('/nhat-ky');
      } else {
        navigate(`/nhat-ky/${activityId}`);
      }
    },
    [navigate]
  );

  const handleAddActivity = useCallback(
    (cycleId: number) => {
      navigate(`/nhat-ky/them-moi?crop_cycle_id=${cycleId}`);
    },
    [navigate]
  );

  const handleStartNewCycle = useCallback(() => {
    navigate('/chu-ky-canh-tac/them-moi');
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (isError && error) {
    return <DashboardErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sun className="h-8 w-8 text-farm-sun" />
            <h1 className="text-2xl font-bold md:text-3xl">
              Chào mừng đến Soleil Farm
            </h1>
          </div>
          <p className="text-muted-foreground">
            Tổng quan hoạt động trang trại hôm nay -{' '}
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
            Làm mới
          </Button>
          <ExportButton
            onExportCsv={exportCsv}
            onExportPdf={exportPdf}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Key Metrics - Stat Cards */}
      <StatCardsGrid>
        <StatCard
          title="Tổng diện tích đất"
          value={formattedArea}
          description={`${dashboardData.land_parcels_count} lô đất canh tác`}
          icon={Map}
          iconColor="text-farm-leaf"
          trend={{
            value: `${dashboardData.land_parcels_breakdown.active} đang hoạt động`,
            isPositive: true,
            icon: TrendingUp,
          }}
          onClick={handleNavigateToLandParcels}
        />
        <StatCard
          title="Số lô đất"
          value={dashboardData.land_parcels_count}
          description={`${dashboardData.land_parcels_breakdown.active} hoạt động, ${dashboardData.land_parcels_breakdown.inactive} tạm nghỉ`}
          icon={Map}
          iconColor="text-primary"
          onClick={handleNavigateToLandParcels}
        />
        <StatCard
          title="Chu kỳ đang chạy"
          value={dashboardData.active_crop_cycles}
          description="Chu kỳ canh tác đang hoạt động"
          icon={Sprout}
          iconColor="text-farm-leaf"
          trend={{
            value: 'Xem chi tiết',
            icon: Calendar,
          }}
          onClick={handleNavigateToCropCycles}
        />
        <StatCard
          title="Hoạt động hôm nay"
          value={dashboardData.activities_today}
          description="Hoạt động được ghi nhận"
          icon={Activity}
          iconColor="text-farm-sun"
          trend={{
            value: 'Cập nhật mới nhất',
            isPositive: true,
          }}
          onClick={handleNavigateToActivities}
        />
      </StatCardsGrid>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CropCyclesBySeasonChart
          data={dashboardData.crop_cycles_by_season}
          isLoading={isLoading}
        />
        <LandParcelStatusChart
          data={dashboardData.land_parcel_status_distribution}
          isLoading={isLoading}
          onSliceClick={(status) => navigate(`/dat-canh-tac?status=${status}`)}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityTimelineChart
          data={dashboardData.activity_frequency}
          isLoading={isLoading}
          variant="area"
          onPointClick={(date) => navigate(`/nhat-ky?date=${date}`)}
        />
        <CropCycleTimeline
          data={dashboardData.active_crop_cycles_list}
          isLoading={isLoading}
          onCycleClick={handleCycleClick}
          maxItems={5}
        />
      </div>

      {/* Data Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivitiesTable
          data={dashboardData.recent_activities}
          isLoading={isLoading}
          onRowClick={handleActivityClick}
          initialRows={10}
        />
        <ActiveCropCyclesTable
          data={dashboardData.active_crop_cycles_list}
          isLoading={isLoading}
          onRowClick={handleCycleClick}
          actions={{
            onAddActivity: handleAddActivity,
            onStartNewCycle: handleStartNewCycle,
          }}
        />
      </div>
    </div>
  );
}
