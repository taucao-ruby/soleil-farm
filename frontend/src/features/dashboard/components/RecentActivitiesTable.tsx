import React, { useMemo, useState } from 'react';

import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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
import type { RecentActivity } from '@/schemas/dashboard.schema';

// ============================================================================
// TYPES
// ============================================================================

interface RecentActivitiesTableProps {
  /** Table data */
  data: RecentActivity[];
  /** Loading state */
  isLoading?: boolean;
  /** Click handler for row */
  onRowClick?: (activityId: number) => void;
  /** Max items to show initially */
  initialRows?: number;
}

type SortField = 'activity_date' | 'activity_type_name' | 'crop_cycle_name';
type SortDirection = 'asc' | 'desc';

// ============================================================================
// ACTIVITY TYPE COLORS
// ============================================================================

const ACTIVITY_TYPE_COLORS: Record<string, 'default' | 'success' | 'warning' | 'info' | 'secondary'> = {
  seeding: 'success',
  planting: 'success',
  watering: 'info',
  fertilizing: 'warning',
  harvesting: 'default',
  pest_control: 'warning',
  default: 'secondary',
};

// ============================================================================
// SORTABLE HEADER
// ============================================================================

interface SortableHeaderProps {
  field: SortField;
  label: string;
  currentSort: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

function SortableHeader({ field, label, currentSort, direction, onSort }: SortableHeaderProps) {
  const isActive = currentSort === field;
  
  return (
    <TableHead
      className="cursor-pointer select-none hover:bg-muted/50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (
          direction === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        )}
      </div>
    </TableHead>
  );
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * RecentActivitiesTable
 * =====================
 * Sortable table showing recent activity logs.
 *
 * @example
 * <RecentActivitiesTable
 *   data={recentActivities}
 *   onRowClick={(id) => openActivityDetail(id)}
 * />
 */
export const RecentActivitiesTable = React.memo(function RecentActivitiesTable({
  data,
  isLoading = false,
  onRowClick,
  initialRows = 10,
}: RecentActivitiesTableProps) {
  const [sortField, setSortField] = useState<SortField>('activity_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showAll, setShowAll] = useState(false);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort and slice data
  const displayData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const compare = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? compare : -compare;
    });
    return showAll ? sorted : sorted.slice(0, initialRows);
  }, [data, sortField, sortDirection, showAll, initialRows]);

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>10 hoạt động mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <p>Chưa có hoạt động nào được ghi nhận</p>
            <p className="text-sm mt-1">Thêm hoạt động để theo dõi tiến độ canh tác</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              {data.length} hoạt động được ghi nhận
            </CardDescription>
          </div>
          {onRowClick && (
            <Button variant="outline" size="sm" onClick={() => onRowClick(0)}>
              Xem tất cả
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader
                  field="activity_date"
                  label="Ngày"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="activity_type_name"
                  label="Loại hoạt động"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="crop_cycle_name"
                  label="Chu kỳ"
                  currentSort={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <TableHead>Lô đất</TableHead>
                <TableHead>Người thực hiện</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.map((activity) => (
                <TableRow
                  key={activity.id}
                  className={cn(
                    onRowClick && 'cursor-pointer hover:bg-muted/50'
                  )}
                  onClick={() => onRowClick?.(activity.id)}
                >
                  <TableCell className="font-medium">
                    {format(parseISO(activity.activity_date), 'dd/MM/yyyy', {
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ACTIVITY_TYPE_COLORS[activity.activity_type_code] ||
                        ACTIVITY_TYPE_COLORS.default
                      }
                    >
                      {activity.activity_type_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {activity.crop_cycle_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.land_parcel_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {activity.user_name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length > initialRows && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Thu gọn' : `Xem thêm ${data.length - initialRows} hoạt động`}
              {showAll ? (
                <ChevronUp className="ml-2 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
