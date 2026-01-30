/**
 * Stage Progress Timeline
 * ========================
 * Visual timeline showing stage progress
 */

import { useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Play,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { CropCycleStage } from '@/schemas';

interface StageProgressTimelineProps {
  stages: CropCycleStage[];
  cycleStartDate: string;
  cycleEndDate: string;
  actualStartDate?: string | null;
  actualEndDate?: string | null;
}

interface StageProgress {
  stage: CropCycleStage;
  status: 'completed' | 'in_progress' | 'upcoming' | 'overdue';
  plannedDays: number;
  actualDays?: number;
  startOffset: number; // Days from cycle start
  progress: number; // 0-100
}

function calculateDays(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function StageProgressTimeline({
  stages,
  cycleStartDate,
  cycleEndDate,
  actualStartDate,
  actualEndDate,
}: StageProgressTimelineProps) {
  const today = new Date().toISOString().split('T')[0];

  // Calculate total cycle duration
  const totalDays = calculateDays(cycleStartDate, cycleEndDate);

  // Process stages with progress info
  const processedStages = useMemo<StageProgress[]>(() => {
    let cumulativeOffset = 0;

    return stages
      .sort((a, b) => a.stage_order - b.stage_order)
      .map((stage) => {
        const plannedDays = calculateDays(
          stage.planned_start_date,
          stage.planned_end_date
        );

        const startOffset = cumulativeOffset;
        cumulativeOffset += plannedDays;

        // Determine status
        let status: StageProgress['status'] = 'upcoming';
        let progress = 0;
        let actualDays: number | undefined;

        if (stage.actual_end_date || stage.is_completed) {
          status = 'completed';
          progress = 100;
          if (stage.actual_start_date && stage.actual_end_date) {
            actualDays = calculateDays(stage.actual_start_date, stage.actual_end_date);
          }
        } else if (stage.actual_start_date) {
          // Currently in progress
          const todayDate = new Date(today);
          const plannedEndDate = new Date(stage.planned_end_date);

          if (todayDate > plannedEndDate) {
            status = 'overdue';
            progress = 100;
          } else {
            status = 'in_progress';
            const elapsed = calculateDays(stage.actual_start_date, today);
            progress = Math.min(100, Math.round((elapsed / plannedDays) * 100));
          }
        } else {
          // Check if should have started
          if (stage.planned_start_date < today) {
            status = 'overdue';
            progress = 0;
          }
        }

        return {
          stage,
          status,
          plannedDays,
          actualDays,
          startOffset,
          progress,
        };
      });
  }, [stages, today]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const completedStages = processedStages.filter(
      (s) => s.status === 'completed'
    ).length;
    return Math.round((completedStages / processedStages.length) * 100);
  }, [processedStages]);

  // Get current stage
  const currentStage = processedStages.find((s) => s.status === 'in_progress');

  const getStatusIcon = (status: StageProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-600" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: StageProgress['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'overdue':
        return 'bg-amber-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Tiến độ giai đoạn</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {processedStages.filter((s) => s.status === 'completed').length}/
              {processedStages.length} giai đoạn
            </Badge>
            <Badge variant="secondary">{overallProgress}%</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ tổng thể</span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Current stage highlight */}
        {currentStage && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                Giai đoạn hiện tại: {currentStage.stage.stage_name}
              </span>
            </div>
            <div className="mt-2">
              <Progress value={currentStage.progress} className="h-2" />
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                {currentStage.progress}% hoàn thành •{' '}
                {formatDate(currentStage.stage.planned_start_date)} -{' '}
                {formatDate(currentStage.stage.planned_end_date)}
              </p>
            </div>
          </div>
        )}

        {/* Visual timeline */}
        <div className="relative">
          {/* Timeline bar */}
          <TooltipProvider>
            <div className="h-8 flex rounded-lg overflow-hidden bg-muted">
              {processedStages.map((item, index) => {
                const width = (item.plannedDays / totalDays) * 100;

                return (
                  <Tooltip key={item.stage.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'h-full transition-colors cursor-pointer hover:opacity-80',
                          getStatusColor(item.status),
                          index > 0 && 'border-l border-background'
                        )}
                        style={{ width: `${width}%` }}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="space-y-1">
                        <p className="font-medium">{item.stage.stage_name}</p>
                        <p className="text-sm">
                          Kế hoạch: {formatDate(item.stage.planned_start_date)} -{' '}
                          {formatDate(item.stage.planned_end_date)} ({item.plannedDays} ngày)
                        </p>
                        {item.actualDays && (
                          <p className="text-sm">
                            Thực tế: {item.actualDays} ngày
                            {item.actualDays !== item.plannedDays && (
                              <span
                                className={cn(
                                  'ml-1',
                                  item.actualDays > item.plannedDays
                                    ? 'text-amber-500'
                                    : 'text-green-500'
                                )}
                              >
                                ({item.actualDays > item.plannedDays ? '+' : ''}
                                {item.actualDays - item.plannedDays})
                              </span>
                            )}
                          </p>
                        )}
                        {item.stage.notes && (
                          <p className="text-sm text-muted-foreground">
                            {item.stage.notes}
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>

          {/* Today marker */}
          {actualStartDate && !actualEndDate && (
            <div
              className="absolute top-0 h-10 w-0.5 bg-destructive z-10"
              style={{
                left: `${Math.min(
                  100,
                  (calculateDays(cycleStartDate, today) / totalDays) * 100
                )}%`,
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-destructive">
                Hôm nay
              </div>
            </div>
          )}
        </div>

        {/* Stages list */}
        <div className="space-y-3">
          {processedStages.map((item) => (
            <div
              key={item.stage.id}
              className={cn(
                'flex items-center gap-4 p-3 rounded-lg transition-colors',
                item.status === 'in_progress' && 'bg-blue-50 dark:bg-blue-900/10',
                item.status === 'overdue' && 'bg-amber-50 dark:bg-amber-900/10'
              )}
            >
              {getStatusIcon(item.status)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      'font-medium',
                      item.status === 'completed' && 'line-through text-muted-foreground'
                    )}
                  >
                    {item.stage.stage_name}
                  </p>
                  {item.status === 'overdue' && (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      Quá hạn
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.plannedDays} ngày
                  </span>
                  <span>
                    {formatDate(item.stage.planned_start_date)} -{' '}
                    {formatDate(item.stage.planned_end_date)}
                  </span>
                </div>
              </div>

              {item.status !== 'upcoming' && (
                <div className="w-20">
                  <Progress value={item.progress} className="h-1.5" />
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    {item.progress}%
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Hoàn thành</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Đang thực hiện</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Quá hạn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span>Chưa bắt đầu</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
