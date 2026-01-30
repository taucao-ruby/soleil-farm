import { useMemo } from 'react';
import { Sprout, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CropCycleHistoryItem } from '@/schemas';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  planning: {
    label: 'Lên kế hoạch',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-muted-foreground',
  },
  active: {
    label: 'Đang thực hiện',
    icon: <Sprout className="h-4 w-4" />,
    color: 'text-green-600',
  },
  harvesting: {
    label: 'Đang thu hoạch',
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-amber-600',
  },
  completed: {
    label: 'Hoàn thành',
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-blue-600',
  },
  cancelled: {
    label: 'Đã hủy',
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-red-600',
  },
};

interface CropCycleHistoryTimelineProps {
  cropCycles: CropCycleHistoryItem[];
  isLoading?: boolean;
}

/**
 * CropCycleHistoryTimeline Component
 * ===================================
 * Timeline view of crop cycle history for a land parcel
 */
export function CropCycleHistoryTimeline({
  cropCycles,
  isLoading,
}: CropCycleHistoryTimelineProps) {
  const sortedCycles = useMemo(() => {
    return [...cropCycles].sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );
  }, [cropCycles]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatYield = (amount: number | null, unit: string | null) => {
    if (amount === null) return null;
    return `${amount.toLocaleString('vi-VN')} ${unit || 'kg'}`;
  };

  if (isLoading) {
    return <TimelineSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-600" />
          Lịch sử canh tác
        </CardTitle>
        <CardDescription>
          Các chu kỳ canh tác đã và đang thực hiện trên lô đất này
        </CardDescription>
      </CardHeader>

      <CardContent>
        {sortedCycles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sprout className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              Chưa có chu kỳ canh tác nào được ghi nhận
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {/* Timeline items */}
            <div className="space-y-6">
              {sortedCycles.map((cycle, index) => {
                const statusConfig = STATUS_CONFIG[cycle.status] || STATUS_CONFIG.planning;

                return (
                  <div key={cycle.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-2 top-1.5 h-4 w-4 rounded-full border-2 bg-background ${
                        index === 0 ? 'border-primary' : 'border-muted-foreground/30'
                      }`}
                    />

                    {/* Content */}
                    <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-medium">{cycle.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cycle.crop_type}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${statusConfig.color} border-current`}
                        >
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {/* Date Range */}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(cycle.start_date)}
                            {cycle.end_date && ` → ${formatDate(cycle.end_date)}`}
                          </span>
                        </div>

                        {/* Yield */}
                        {cycle.yield_amount !== null && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>
                              Sản lượng: {formatYield(cycle.yield_amount, cycle.yield_unit)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Timeline Skeleton for loading state
 */
function TimelineSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6 pl-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="mt-3 flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
