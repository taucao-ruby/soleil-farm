import React, { useMemo } from 'react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartSkeleton } from '@/components/ui/skeleton';
import type { LandParcelStatusDistribution } from '@/schemas/dashboard.schema';

// ============================================================================
// TYPES
// ============================================================================

interface LandParcelStatusChartProps {
  /** Chart data */
  data: LandParcelStatusDistribution[];
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for drill-down */
  onSliceClick?: (status: string) => void;
  /** Height of the chart */
  height?: number;
}

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: LandParcelStatusDistribution & { percentage: number };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <p className="font-medium">{data.label}</p>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        {data.count} lô ({data.percentage.toFixed(1)}%)
      </p>
    </div>
  );
}

// ============================================================================
// CUSTOM LEGEND
// ============================================================================

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: LandParcelStatusDistribution & { percentage: number };
  }>;
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.payload.label} ({entry.payload.count})
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * LandParcelStatusChart
 * =====================
 * Pie chart showing land parcel distribution by status.
 *
 * @example
 * <LandParcelStatusChart
 *   data={statusDistributionData}
 *   onSliceClick={(status) => filterByStatus(status)}
 * />
 */
export const LandParcelStatusChart = React.memo(function LandParcelStatusChart({
  data,
  isLoading = false,
  onSliceClick,
  height = 300,
}: LandParcelStatusChartProps) {
  // Calculate percentages
  const chartData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return data.map((item) => ({
      ...item,
      percentage: total > 0 ? (item.count / total) * 100 : 0,
    }));
  }, [data]);

  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái lô đất</CardTitle>
          <CardDescription>Phân bố theo tình trạng hoạt động</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height }}
          >
            Chưa có dữ liệu lô đất
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái lô đất</CardTitle>
        <CardDescription>Phân bố theo tình trạng hoạt động</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="count"
              nameKey="label"
              cursor={onSliceClick ? 'pointer' : 'default'}
              onClick={(data) => onSliceClick?.(data.status)}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
