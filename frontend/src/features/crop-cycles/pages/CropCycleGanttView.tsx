/**
 * Crop Cycle Gantt View
 * ======================
 * Horizontal timeline visualization of all crop cycles
 * Features:
 * - Color-coded by status
 * - Drag-to-reschedule (if planned)
 * - Overlap warnings
 * - Month/quarter/year views
 */

import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Calendar,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { CropCycle } from '@/schemas';

import { getStatusConfig } from '../hooks';
import { useCropCyclesForGantt } from '../hooks/useCropCycles';
import { StatusBadge } from '../components/StateMachineVisualizer';

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'month' | 'quarter' | 'year';

interface GanttConfig {
  startDate: Date;
  endDate: Date;
  viewMode: ViewMode;
  dayWidth: number;
}

interface TimelineBar {
  cycle: CropCycle;
  startOffset: number; // pixels from timeline start
  width: number; // pixels
  hasOverlap: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const VIEW_CONFIGS: Record<ViewMode, { dayWidth: number; label: string }> = {
  month: { dayWidth: 24, label: 'Tháng' },
  quarter: { dayWidth: 8, label: 'Quý' },
  year: { dayWidth: 3, label: 'Năm' },
};

const MONTHS_VI = [
  'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
  'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12',
];

// ============================================================================
// HELPERS
// ============================================================================

function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function checkOverlaps(
  cycles: CropCycle[],
  targetCycle: CropCycle
): boolean {
  return cycles.some((cycle) => {
    if (cycle.id === targetCycle.id) return false;
    if (cycle.land_parcel_id !== targetCycle.land_parcel_id) return false;

    const start1 = new Date(targetCycle.actual_start_date || targetCycle.planned_start_date);
    const end1 = new Date(targetCycle.actual_end_date || targetCycle.planned_end_date);
    const start2 = new Date(cycle.actual_start_date || cycle.planned_start_date);
    const end2 = new Date(cycle.actual_end_date || cycle.planned_end_date);

    return start1 <= end2 && end1 >= start2;
  });
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface TimelineHeaderProps {
  config: GanttConfig;
}

function TimelineHeader({ config }: TimelineHeaderProps) {
  const { startDate, endDate, viewMode, dayWidth } = config;
  const totalDays = getDaysBetween(startDate, endDate);

  // Generate month markers
  const months: { date: Date; width: number; label: string }[] = [];
  let currentMonth = getStartOfMonth(startDate);

  while (currentMonth < endDate) {
    const monthEnd = addMonths(currentMonth, 1);
    const visibleStart = currentMonth < startDate ? startDate : currentMonth;
    const visibleEnd = monthEnd > endDate ? endDate : monthEnd;
    const daysInView = getDaysBetween(visibleStart, visibleEnd);

    months.push({
      date: currentMonth,
      width: daysInView * dayWidth,
      label: `${MONTHS_VI[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`,
    });

    currentMonth = monthEnd;
  }

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      {/* Months row */}
      <div className="flex h-8 border-b">
        {months.map((month, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center text-xs font-medium border-r text-muted-foreground"
            style={{ width: month.width }}
          >
            {month.width > 50 && month.label}
          </div>
        ))}
      </div>

      {/* Days row (only for month view) */}
      {viewMode === 'month' && (
        <div className="flex h-6">
          {Array.from({ length: totalDays }).map((_, idx) => {
            const date = addDays(startDate, idx);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isFirstOfMonth = date.getDate() === 1;

            return (
              <div
                key={idx}
                className={cn(
                  'flex items-center justify-center text-[10px] border-r',
                  isWeekend && 'bg-muted/50',
                  isFirstOfMonth && 'border-l-2 border-l-primary/30'
                )}
                style={{ width: dayWidth }}
              >
                {dayWidth >= 20 && date.getDate()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface GanttRowProps {
  parcelName: string;
  cycles: TimelineBar[];
  config: GanttConfig;
  onCycleClick: (cycle: CropCycle) => void;
}

function GanttRow({ parcelName, cycles, config, onCycleClick }: GanttRowProps) {
  const totalWidth = getDaysBetween(config.startDate, config.endDate) * config.dayWidth;

  return (
    <div className="flex border-b hover:bg-muted/30">
      {/* Parcel label */}
      <div className="w-40 flex-shrink-0 px-3 py-2 border-r bg-muted/20 sticky left-0 z-[5]">
        <p className="font-medium text-sm truncate">{parcelName}</p>
      </div>

      {/* Timeline bars */}
      <div className="relative flex-1 h-12" style={{ minWidth: totalWidth }}>
        {/* Today marker */}
        {(() => {
          const today = new Date();
          if (today >= config.startDate && today <= config.endDate) {
            const offset = getDaysBetween(config.startDate, today) * config.dayWidth;
            return (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-destructive z-[2]"
                style={{ left: offset }}
              />
            );
          }
          return null;
        })()}

        {/* Cycle bars */}
        {cycles.map((bar) => {
          const statusConfig = getStatusConfig(bar.cycle.status);

          return (
            <TooltipProvider key={bar.cycle.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'absolute top-2 h-8 rounded-md px-2 flex items-center gap-1 text-xs font-medium transition-all',
                      'hover:ring-2 hover:ring-primary hover:z-10',
                      'cursor-pointer select-none',
                      statusConfig.bgColor,
                      statusConfig.color,
                      bar.hasOverlap && 'ring-2 ring-amber-500'
                    )}
                    style={{
                      left: bar.startOffset,
                      width: Math.max(bar.width, 24),
                    }}
                    onClick={() => onCycleClick(bar.cycle)}
                  >
                    {bar.hasOverlap && (
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                    )}
                    <span className="truncate">
                      {bar.width > 100 ? bar.cycle.name : bar.cycle.crop_type?.name || ''}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-semibold">{bar.cycle.name}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={bar.cycle.status} size="sm" />
                    </div>
                    <p className="text-sm">
                      {formatDate(new Date(bar.cycle.actual_start_date || bar.cycle.planned_start_date))} -{' '}
                      {formatDate(new Date(bar.cycle.actual_end_date || bar.cycle.planned_end_date))}
                    </p>
                    {bar.cycle.crop_type && (
                      <p className="text-sm text-muted-foreground">
                        {bar.cycle.crop_type.name}
                      </p>
                    )}
                    {bar.hasOverlap && (
                      <p className="text-sm text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Có xung đột lịch
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface CropCycleGanttViewProps {
  onCycleClick?: (cycle: CropCycle) => void;
}

export function CropCycleGanttView({ onCycleClick }: CropCycleGanttViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [centerDate, setCenterDate] = useState(() => new Date());

  const { data: cyclesData, isLoading, error } = useCropCyclesForGantt();

  // Calculate timeline bounds
  const config = useMemo<GanttConfig>(() => {
    const dayWidth = VIEW_CONFIGS[viewMode].dayWidth;
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case 'month':
        startDate = addMonths(getStartOfMonth(centerDate), -1);
        endDate = addMonths(getStartOfMonth(centerDate), 2);
        break;
      case 'quarter':
        startDate = addMonths(getStartOfMonth(centerDate), -3);
        endDate = addMonths(getStartOfMonth(centerDate), 6);
        break;
      case 'year':
        startDate = new Date(centerDate.getFullYear(), 0, 1);
        endDate = new Date(centerDate.getFullYear() + 1, 11, 31);
        break;
    }

    return { startDate, endDate, viewMode, dayWidth };
  }, [viewMode, centerDate]);

  // Process cycles into bars grouped by parcel
  const groupedBars = useMemo(() => {
    if (!cyclesData?.items) return new Map<string, TimelineBar[]>();

    const groups = new Map<string, TimelineBar[]>();
    const allCycles = cyclesData.items;

    allCycles.forEach((cycle) => {
      const parcelName = cycle.land_parcel?.name || `Lô ${cycle.land_parcel_id}`;
      const startDate = new Date(cycle.actual_start_date || cycle.planned_start_date);
      const endDate = new Date(cycle.actual_end_date || cycle.planned_end_date);

      // Skip cycles outside view
      if (endDate < config.startDate || startDate > config.endDate) return;

      // Calculate position
      const visibleStart = startDate < config.startDate ? config.startDate : startDate;
      const visibleEnd = endDate > config.endDate ? config.endDate : endDate;

      const startOffset = getDaysBetween(config.startDate, visibleStart) * config.dayWidth;
      const width = getDaysBetween(visibleStart, visibleEnd) * config.dayWidth;

      const bar: TimelineBar = {
        cycle,
        startOffset,
        width,
        hasOverlap: checkOverlaps(allCycles, cycle),
      };

      const existing = groups.get(parcelName) || [];
      existing.push(bar);
      groups.set(parcelName, existing);
    });

    return groups;
  }, [cyclesData, config]);

  // Navigation handlers
  const handlePrev = () => {
    switch (viewMode) {
      case 'month':
        setCenterDate(addMonths(centerDate, -1));
        break;
      case 'quarter':
        setCenterDate(addMonths(centerDate, -3));
        break;
      case 'year':
        setCenterDate(new Date(centerDate.getFullYear() - 1, 0, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case 'month':
        setCenterDate(addMonths(centerDate, 1));
        break;
      case 'quarter':
        setCenterDate(addMonths(centerDate, 3));
        break;
      case 'year':
        setCenterDate(new Date(centerDate.getFullYear() + 1, 0, 1));
        break;
    }
  };

  const handleToday = () => {
    setCenterDate(new Date());
  };

  const handleCycleClick = (cycle: CropCycle) => {
    onCycleClick?.(cycle);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-destructive">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p>Không thể tải dữ liệu timeline</p>
        </CardContent>
      </Card>
    );
  }

  const totalWidth = getDaysBetween(config.startDate, config.endDate) * config.dayWidth;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline Gantt
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* View mode selector */}
            <Select
              value={viewMode}
              onValueChange={(v) => setViewMode(v as ViewMode)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Tháng</SelectItem>
                <SelectItem value="quarter">Quý</SelectItem>
                <SelectItem value="year">Năm</SelectItem>
              </SelectContent>
            </Select>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Hôm nay
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current view info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {formatDate(config.startDate)} - {formatDate(config.endDate)}
          </span>
          <Badge variant="outline">
            {groupedBars.size} lô đất • {cyclesData?.items?.length || 0} chu kỳ
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {groupedBars.size === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4 opacity-50" />
            <p>Không có chu kỳ nào trong khoảng thời gian này</p>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="min-w-max">
              {/* Timeline header */}
              <div className="flex">
                <div className="w-40 flex-shrink-0 px-3 py-2 bg-muted/50 border-r border-b sticky left-0 z-20">
                  <p className="font-medium text-sm">Lô đất</p>
                </div>
                <div style={{ width: totalWidth }}>
                  <TimelineHeader config={config} />
                </div>
              </div>

              {/* Gantt rows */}
              {Array.from(groupedBars.entries()).map(([parcelName, bars]) => (
                <GanttRow
                  key={parcelName}
                  parcelName={parcelName}
                  cycles={bars}
                  config={config}
                  onCycleClick={handleCycleClick}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-4 p-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300" />
            <span>Đã lên kế hoạch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
            <span>Đang thực hiện</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
            <span>Hoàn thành</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
            <span>Thất bại</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 bg-destructive" />
            <span>Hôm nay</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Xung đột lịch</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
