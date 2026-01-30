import React, { useMemo } from 'react';

import { format, parseISO, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ActiveCropCycle } from '@/schemas/dashboard.schema';

// ============================================================================
// TYPES
// ============================================================================

interface CropCycleTimelineProps {
  /** Timeline data */
  data: ActiveCropCycle[];
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for drill-down */
  onCycleClick?: (cycleId: number) => void;
  /** Max items to show */
  maxItems?: number;
}

// ============================================================================
// STATUS CONFIG
// ============================================================================

const STATUS_CONFIG: Record<
  ActiveCropCycle['status'],
  { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'destructive'; color: string }
> = {
  planned: { label: 'Kế hoạch', variant: 'info', color: 'bg-blue-500' },
  in_progress: { label: 'Đang chạy', variant: 'success', color: 'bg-green-500' },
  harvesting: { label: 'Thu hoạch', variant: 'warning', color: 'bg-amber-500' },
  completed: { label: 'Hoàn thành', variant: 'default', color: 'bg-gray-500' },
  cancelled: { label: 'Đã hủy', variant: 'destructive', color: 'bg-red-500' },
};

// ============================================================================
// TIMELINE ITEM
// ============================================================================

interface TimelineItemProps {
  cycle: ActiveCropCycle;
  minDate: Date;
  maxDate: Date;
  onClick?: () => void;
}

function TimelineItem({ cycle, minDate, maxDate, onClick }: TimelineItemProps) {
  const config = STATUS_CONFIG[cycle.status];
  
  // Calculate position and width
  const startDate = parseISO(cycle.actual_start_date || cycle.planned_start_date);
  const endDate = parseISO(cycle.actual_end_date || cycle.planned_end_date);
  
  const totalDays = differenceInDays(maxDate, minDate) || 1;
  const startOffset = differenceInDays(startDate, minDate);
  const duration = differenceInDays(endDate, startDate) || 1;
  
  const leftPercent = Math.max(0, (startOffset / totalDays) * 100);
  const widthPercent = Math.min(100 - leftPercent, (duration / totalDays) * 100);

  return (
    <div 
      className={cn(
        'group py-3 border-b last:border-0',
        onClick && 'cursor-pointer hover:bg-muted/50'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{cycle.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {cycle.land_parcel_name} • {cycle.crop_type_name}
          </p>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
      
      {/* Gantt bar */}
      <div className="relative h-6 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('absolute h-full rounded-full transition-all', config.color)}
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />
        {/* Progress indicator */}
        {cycle.status === 'in_progress' && (
          <div
            className="absolute h-full bg-green-700/50"
            style={{
              left: `${leftPercent}%`,
              width: `${(widthPercent * cycle.progress_percentage) / 100}%`,
            }}
          />
        )}
      </div>
      
      {/* Date labels */}
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>{format(startDate, 'dd/MM/yy', { locale: vi })}</span>
        <span className="font-medium">{cycle.progress_percentage}%</span>
        <span>{format(endDate, 'dd/MM/yy', { locale: vi })}</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * CropCycleTimeline
 * =================
 * Gantt-style timeline showing active crop cycles.
 *
 * @example
 * <CropCycleTimeline
 *   data={activeCropCycles}
 *   onCycleClick={(id) => navigate(`/chu-ky-canh-tac/${id}`)}
 * />
 */
export const CropCycleTimeline = React.memo(function CropCycleTimeline({
  data,
  isLoading = false,
  onCycleClick,
  maxItems = 5,
}: CropCycleTimelineProps) {
  // Calculate date range for timeline
  const { minDate, maxDate, displayData } = useMemo(() => {
    const slicedData = data.slice(0, maxItems);
    
    if (!slicedData.length) {
      const now = new Date();
      return { minDate: now, maxDate: now, displayData: [] };
    }
    
    const allDates = slicedData.flatMap((c) => [
      parseISO(c.actual_start_date || c.planned_start_date),
      parseISO(c.actual_end_date || c.planned_end_date),
    ]);
    
    return {
      minDate: new Date(Math.min(...allDates.map((d) => d.getTime()))),
      maxDate: new Date(Math.max(...allDates.map((d) => d.getTime()))),
      displayData: slicedData,
    };
  }, [data, maxItems]);

  if (isLoading) {
    return <ChartSkeleton height={300} />;
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chu kỳ đang hoạt động</CardTitle>
          <CardDescription>Timeline các chu kỳ canh tác</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>Chưa có chu kỳ nào đang hoạt động</p>
            <p className="text-sm mt-1">Bắt đầu một chu kỳ mới để theo dõi tiến độ</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chu kỳ đang hoạt động</CardTitle>
        <CardDescription>
          Timeline các chu kỳ canh tác ({data.length} chu kỳ)
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {displayData.map((cycle) => (
          <TimelineItem
            key={cycle.id}
            cycle={cycle}
            minDate={minDate}
            maxDate={maxDate}
            onClick={onCycleClick ? () => onCycleClick(cycle.id) : undefined}
          />
        ))}
        
        {data.length > maxItems && (
          <div className="pt-3 text-center">
            <button
              className="text-sm text-primary hover:underline"
              onClick={() => onCycleClick?.(0)} // Signal to show all
            >
              Xem thêm {data.length - maxItems} chu kỳ khác
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
