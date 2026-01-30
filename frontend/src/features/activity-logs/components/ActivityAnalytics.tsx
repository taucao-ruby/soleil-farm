/**
 * Activity Analytics Component
 * =============================
 * Charts and statistics for activity logs
 */

import { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Activity,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { ActivityAnalytics as AnalyticsData } from '../types';
import { getActivityTypeConfig } from '../types';
import { ActivityTypeIcon } from './ActivityTypeIcon';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ActivityAnalyticsProps {
  analytics: AnalyticsData | null;
  isLoading?: boolean;
  className?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Activity Analytics Dashboard
 *
 * @example
 * <ActivityAnalytics analytics={analyticsData} isLoading={isLoading} />
 */
export function ActivityAnalytics({
  analytics,
  isLoading,
  className,
}: ActivityAnalyticsProps) {
  if (isLoading || !analytics) {
    return <AnalyticsSkeleton className={className} />;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Tổng hoạt động"
          value={analytics.totalActivities}
          iconColor="text-farm-green-600"
          iconBg="bg-farm-green-50"
        />
        <StatCard
          icon={<Calendar className="w-5 h-5" />}
          label="Ngày tích cực nhất"
          value={analytics.mostActiveDay ? formatMostActiveDay(analytics.mostActiveDay) : '-'}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="TB hoạt động/ngày"
          value={analytics.averageActivitiesPerDay.toFixed(1)}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Tổng thời gian"
          value={formatTotalDuration(analytics.totalDuration)}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
      </div>

      {/* Activity by Type Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            Hoạt động theo loại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityByTypeChart data={analytics.activitiesByType} />
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            Hoạt động theo ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap data={analytics.activitiesByDay} />
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// STAT CARD
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor: string;
  iconBg: string;
}

function StatCard({ icon, label, value, iconColor, iconBg }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('p-2 rounded-lg', iconBg, iconColor)}>{icon}</div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// ACTIVITY BY TYPE CHART
// ============================================================================

interface ActivityByTypeChartProps {
  data: Record<string, number>;
}

function ActivityByTypeChart({ data }: ActivityByTypeChartProps) {
  const sortedData = useMemo(() => {
    return Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
  }, [data]);

  const maxValue = Math.max(...Object.values(data), 1);

  if (sortedData.length === 0) {
    return (
      <p className="text-center text-gray-500 text-sm py-4">
        Chưa có dữ liệu
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sortedData.map(([code, count]) => {
        const config = getActivityTypeConfig(code);
        const percentage = (count / maxValue) * 100;

        return (
          <div key={code} className="flex items-center gap-3">
            <ActivityTypeIcon code={code} size="sm" showBackground />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {config.label}
                </span>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', config.bgColor)}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color.replace('text-', '').includes('-')
                      ? undefined
                      : undefined,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// ACTIVITY HEATMAP
// ============================================================================

interface ActivityHeatmapProps {
  data: Record<string, number>;
}

function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { cells, maxCount, weeks } = useMemo(() => {
    const entries = Object.entries(data);
    const max = Math.max(...entries.map(([, v]) => v), 1);

    // Get last 12 weeks
    const today = new Date();
    const cells: { date: string; count: number; weekIndex: number; dayIndex: number }[] = [];

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const weekIndex = Math.floor((83 - i) / 7);
      const dayIndex = date.getDay();

      cells.push({
        date: dateStr,
        count: data[dateStr] || 0,
        weekIndex,
        dayIndex,
      });
    }

    return { cells, maxCount: max, weeks: 12 };
  }, [data]);

  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'bg-gray-100';
    const intensity = count / maxCount;
    if (intensity < 0.25) return 'bg-farm-green-200';
    if (intensity < 0.5) return 'bg-farm-green-400';
    if (intensity < 0.75) return 'bg-farm-green-500';
    return 'bg-farm-green-600';
  };

  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-1">
        {/* Weekday labels */}
        <div className="flex flex-col gap-1 mr-2">
          {weekdays.map((day, i) => (
            <div
              key={day}
              className="h-3 text-[10px] text-gray-400 flex items-center"
            >
              {i % 2 === 1 ? day : ''}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const cell = cells.find(
                  (c) => c.weekIndex === weekIndex && c.dayIndex === dayIndex
                );
                if (!cell) return <div key={dayIndex} className="w-3 h-3" />;

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'w-3 h-3 rounded-sm transition-colors',
                      getIntensityClass(cell.count)
                    )}
                    title={`${cell.date}: ${cell.count} hoạt động`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-500">
        <span>Ít</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-farm-green-200" />
          <div className="w-3 h-3 rounded-sm bg-farm-green-400" />
          <div className="w-3 h-3 rounded-sm bg-farm-green-500" />
          <div className="w-3 h-3 rounded-sm bg-farm-green-600" />
        </div>
        <span>Nhiều</span>
      </div>
    </div>
  );
}

// ============================================================================
// SKELETON LOADER
// ============================================================================

function AnalyticsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-6 w-12 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="h-48 bg-gray-50 rounded animate-pulse" />
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatMostActiveDay(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  } catch {
    return dateStr;
  }
}

function formatTotalDuration(hours: number): string {
  if (hours === 0) return '-';
  if (hours < 1) return `${Math.round(hours * 60)} phút`;
  return `${hours.toFixed(1)} giờ`;
}

export default ActivityAnalytics;
