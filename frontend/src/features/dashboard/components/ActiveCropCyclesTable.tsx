import React from 'react';

import { useNavigate } from 'react-router-dom';
import { Plus, Sprout, ClipboardList } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TableSkeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { ActiveCropCycle } from '@/schemas/dashboard.schema';

// ============================================================================
// TYPES
// ============================================================================

interface ActiveCropCyclesTableProps {
  /** Table data */
  data: ActiveCropCycle[];
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for row */
  onRowClick?: (cycleId: number) => void;
  /** Action handlers */
  actions?: {
    onAddActivity?: (cycleId: number) => void;
    onStartNewCycle?: () => void;
  };
}

// ============================================================================
// STATUS CONFIG
// ============================================================================

const STATUS_CONFIG: Record<
  ActiveCropCycle['status'],
  { label: string; variant: 'default' | 'success' | 'warning' | 'info' | 'destructive' }
> = {
  planned: { label: 'Kế hoạch', variant: 'info' },
  in_progress: { label: 'Đang chạy', variant: 'success' },
  harvesting: { label: 'Thu hoạch', variant: 'warning' },
  completed: { label: 'Hoàn thành', variant: 'default' },
  cancelled: { label: 'Đã hủy', variant: 'destructive' },
};

// ============================================================================
// PROGRESS BAR
// ============================================================================

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            value < 25 && 'bg-blue-500',
            value >= 25 && value < 50 && 'bg-green-500',
            value >= 50 && value < 75 && 'bg-amber-500',
            value >= 75 && 'bg-green-600'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-10 text-right">
        {value}%
      </span>
    </div>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ActiveCropCyclesTable
 * =====================
 * Table showing active crop cycles with status badges and quick actions.
 *
 * @example
 * <ActiveCropCyclesTable
 *   data={activeCycles}
 *   onRowClick={(id) => viewCycleDetail(id)}
 *   actions={{
 *     onAddActivity: (id) => openAddActivityDialog(id),
 *     onStartNewCycle: () => openNewCycleDialog(),
 *   }}
 * />
 */
export const ActiveCropCyclesTable = React.memo(function ActiveCropCyclesTable({
  data,
  isLoading = false,
  onRowClick,
  actions,
}: ActiveCropCyclesTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chu kỳ đang hoạt động</CardTitle>
            <CardDescription>
              {data.length} chu kỳ đang trong tiến trình
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {actions?.onStartNewCycle && (
              <Button
                size="sm"
                onClick={actions.onStartNewCycle}
              >
                <Plus className="mr-2 h-4 w-4" />
                Chu kỳ mới
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!data.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Sprout className="h-12 w-12 mb-4 opacity-50" />
            <p>Chưa có chu kỳ nào đang hoạt động</p>
            <p className="text-sm mt-1">Bắt đầu một chu kỳ mới để theo dõi</p>
            {actions?.onStartNewCycle && (
              <Button
                className="mt-4"
                onClick={actions.onStartNewCycle}
              >
                <Plus className="mr-2 h-4 w-4" />
                Tạo chu kỳ mới
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên chu kỳ</TableHead>
                  <TableHead>Lô đất</TableHead>
                  <TableHead>Loại cây</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((cycle) => {
                  const config = STATUS_CONFIG[cycle.status];
                  return (
                    <TableRow
                      key={cycle.id}
                      className={cn(
                        onRowClick && 'cursor-pointer hover:bg-muted/50'
                      )}
                      onClick={() => onRowClick?.(cycle.id)}
                    >
                      <TableCell className="font-medium">
                        {cycle.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cycle.land_parcel_name}
                      </TableCell>
                      <TableCell>{cycle.crop_type_name}</TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        <ProgressBar value={cycle.progress_percentage} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          {actions?.onAddActivity && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => actions.onAddActivity!(cycle.id)}
                              title="Thêm hoạt động"
                            >
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {data.length > 0 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/chu-ky-canh-tac')}
            >
              Xem tất cả chu kỳ
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
