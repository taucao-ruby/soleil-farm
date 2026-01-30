import React, { useMemo } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartSkeleton } from '@/components/ui/skeleton';
import type { CropCycleBySeason } from '@/schemas/dashboard.schema';

// ============================================================================
// TYPES
// ============================================================================

interface CropCyclesBySeasonChartProps {
  /** Chart data */
  data: CropCycleBySeason[];
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for drill-down */
  onBarClick?: (seasonId: number) => void;
  /** Height of the chart */
  height?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CHART_COLORS = [
  '#22c55e', // green-500 - Đông Xuân
  '#f59e0b', // amber-500 - Hè Thu
  '#3b82f6', // blue-500 - Thu Đông
  '#8b5cf6', // violet-500 - Mùa (other)
];

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: CropCycleBySeason;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="font-medium">{data.season_name}</p>
      <p className="text-sm text-muted-foreground">Năm: {data.year}</p>
      <p className="text-sm font-semibold text-primary mt-1">
        {data.count} chu kỳ
      </p>
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * CropCyclesBySeasonChart
 * =======================
 * Bar chart showing crop cycles grouped by season.
 *
 * @example
 * <CropCyclesBySeasonChart
 *   data={cropCyclesBySeasonData}
 *   onBarClick={(seasonId) => filterByseason(seasonId)}
 * />
 */
export const CropCyclesBySeasonChart = React.memo(function CropCyclesBySeasonChart({
  data,
  isLoading = false,
  onBarClick,
  height = 300,
}: CropCyclesBySeasonChartProps) {
  // Format data for display
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      displayName: `${item.season_name} ${item.year}`,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [data]);

  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chu kỳ theo mùa vụ</CardTitle>
          <CardDescription>12 tháng gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height }}
          >
            Chưa có dữ liệu chu kỳ canh tác
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chu kỳ theo mùa vụ</CardTitle>
        <CardDescription>Số lượng chu kỳ canh tác trong 12 tháng gần đây</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="displayName"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              cursor={onBarClick ? 'pointer' : 'default'}
              onClick={(data) => onBarClick?.(data.season_id)}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
