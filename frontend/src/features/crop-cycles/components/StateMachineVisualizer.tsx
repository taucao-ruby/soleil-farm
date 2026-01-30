/**
 * State Machine Visualizer
 * =========================
 * Visual display of crop cycle state machine
 */

import {
  Calendar,
  Play,
  CheckCircle2,
  XCircle,
  Ban,
  X,
  ArrowRight,
  Scissors,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { CropCycleStatus } from '@/schemas';

import {
  CROP_CYCLE_STATES,
  STATE_TRANSITIONS,
  getStatusConfig,
} from '../hooks';

// Icon mapping for statuses
const STATUS_ICONS: Record<CropCycleStatus, React.ReactNode> = {
  planned: <Calendar className="h-5 w-5" />,
  active: <Play className="h-5 w-5" />,
  in_progress: <Play className="h-5 w-5" />,
  harvesting: <Scissors className="h-5 w-5" />,
  completed: <CheckCircle2 className="h-5 w-5" />,
  failed: <XCircle className="h-5 w-5" />,
  abandoned: <Ban className="h-5 w-5" />,
  cancelled: <X className="h-5 w-5" />,
};

interface StatusBadgeProps {
  status: CropCycleStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={cn(
              'gap-1.5 font-medium transition-colors cursor-default',
              config.bgColor,
              config.color,
              config.borderColor,
              'border',
              sizeClasses[size]
            )}
          >
            {showIcon && <span className="[&>svg]:h-4 [&>svg]:w-4">{STATUS_ICONS[status]}</span>}
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface LargeStatusIndicatorProps {
  status: CropCycleStatus;
}

export function LargeStatusIndicator({ status }: LargeStatusIndicatorProps) {
  const config = getStatusConfig(status);

  return (
    <Card className={cn('overflow-hidden border-2', config.borderColor)}>
      <CardContent className="p-0">
        <div className={cn('p-6', config.bgColor)}>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center',
                config.color,
                'bg-white dark:bg-background'
              )}
            >
              <span className="[&>svg]:h-8 [&>svg]:w-8">{STATUS_ICONS[status]}</span>
            </div>
            <div>
              <p className={cn('text-2xl font-bold', config.color)}>
                {config.label}
              </p>
              <p className={cn('text-sm mt-1', config.color, 'opacity-80')}>
                {config.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface StateMachineVisualizerProps {
  currentStatus: CropCycleStatus;
  showTransitions?: boolean;
}

export function StateMachineVisualizer({
  currentStatus,
  showTransitions = true,
}: StateMachineVisualizerProps) {
  // Define the visual layout of states
  const mainFlow: CropCycleStatus[] = ['planned', 'active', 'completed'];
  const failureStates: CropCycleStatus[] = ['failed', 'abandoned'];

  const isActiveState = (status: CropCycleStatus) => status === currentStatus;
  const isPastState = (status: CropCycleStatus) => {
    const order: CropCycleStatus[] = ['planned', 'active', 'harvesting', 'completed'];
    const currentIndex = order.indexOf(currentStatus);
    const statusIndex = order.indexOf(status);
    return statusIndex >= 0 && currentIndex >= 0 && statusIndex < currentIndex;
  };

  const renderStateNode = (status: CropCycleStatus) => {
    const config = getStatusConfig(status);
    const isActive = isActiveState(status);
    const isPast = isPastState(status);

    return (
      <TooltipProvider key={status}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex flex-col items-center gap-2 transition-all',
                isActive && 'scale-110'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors',
                  isActive
                    ? cn(config.bgColor, config.borderColor, config.color)
                    : isPast
                    ? 'bg-muted border-muted-foreground/30 text-muted-foreground'
                    : 'bg-background border-muted text-muted-foreground'
                )}
              >
                <span className="[&>svg]:h-5 [&>svg]:w-5">{STATUS_ICONS[status]}</span>
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? config.color : 'text-muted-foreground'
                )}
              >
                {config.label}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Main flow */}
        <div className="flex items-center justify-center gap-4">
          {mainFlow.map((status, index) => (
            <div key={status} className="flex items-center">
              {renderStateNode(status)}
              {index < mainFlow.length - 1 && (
                <ArrowRight className="h-5 w-5 mx-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Failure branches */}
        <div className="mt-6 flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <div className="h-8 w-px bg-muted-foreground/30" />
            <div className="flex items-center gap-4">
              {failureStates.map((status) => renderStateNode(status))}
            </div>
          </div>
        </div>

        {/* Available transitions */}
        {showTransitions && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Chuyển đổi khả dụng:
            </p>
            <div className="flex flex-wrap gap-2">
              {STATE_TRANSITIONS.filter((t) =>
                t.from.includes(currentStatus)
              ).map((transition) => (
                <Badge key={transition.action} variant="outline">
                  {transition.label}
                  <ArrowRight className="h-3 w-3 mx-1" />
                  {CROP_CYCLE_STATES[transition.to].label}
                </Badge>
              ))}
              {STATE_TRANSITIONS.filter((t) =>
                t.from.includes(currentStatus)
              ).length === 0 && (
                <span className="text-sm text-muted-foreground italic">
                  Không có chuyển đổi khả dụng (trạng thái cuối)
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
