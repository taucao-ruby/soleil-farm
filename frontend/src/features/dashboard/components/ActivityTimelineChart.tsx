import React, { useMemo } from 'react';

import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartSkeleton } from '@/components/ui/skeleton';
import type { ActivityFrequency } from '@/schemas/dashboard.schema';

// ============================================================================
// TYPES
// ============================================================================

interface ActivityTimelineChartProps {
  /** Chart data */
  data: ActivityFrequency[];
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for drill-down */
  onPointClick?: (date: string) => void;
  /** Height of the chart */
  height?: number;
  /** Chart type */
  variant?: 'line' | 'area';
}

// ============================================================================
// CUSTOM TOOLTIP
// ============================================================================

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ActivityFrequency & { formattedDate: string };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="font-medium">{data.formattedDate}</p>
      <p className="text-sm font-semibold text-primary mt-1">
        {data.count} hoạt động
      </p>
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ActivityTimelineChart
 * =====================
 * Line/Area chart showing activity frequency over time.
 *
 * @example
 * <ActivityTimelineChart
 *   data={activityFrequencyData}
 *   variant="area"
 *   onPointClick={(date) => filterByDate(date)}
 * />
 */
export const ActivityTimelineChart = React.memo(function ActivityTimelineChart({
  data,
  isLoading = false,
  onPointClick,
  height = 300,
  variant = 'area',
}: ActivityTimelineChartProps) {
  // Format dates for display
  const chartData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'dd/MM', { locale: vi }),
      fullDate: format(parseISO(item.date), 'EEEE, dd MMMM yyyy', { locale: vi }),
    }));
  }, [data]);

  if (isLoading) {
    return <ChartSkeleton height={height} />;
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động theo thời gian</CardTitle>
          <CardDescription>Số lượng hoạt động trong 30 ngày qua</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center text-muted-foreground"
            style={{ height }}
          >
            Chưa có dữ liệu hoạt động
          </div>
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = variant === 'area' ? AreaChart : LineChart;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động theo thời gian</CardTitle>
        <CardDescription>Số lượng hoạt động trong 30 ngày qua</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            onClick={(data) => {
              if (data?.activePayload?.[0]) {
                onPointClick?.(data.activePayload[0].payload.date);
              }
            }}
          >
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            {variant === 'area' ? (
              <Area
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#colorActivity)"
                cursor={onPointClick ? 'pointer' : 'default'}
              />
            ) : (
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 3, fill: '#22c55e' }}
                activeDot={{ r: 5, fill: '#22c55e' }}
                cursor={onPointClick ? 'pointer' : 'default'}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
