import { useCallback, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Square,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { LandParcel } from '@/schemas';
import { STATUS_LABELS, STATUS_COLORS, SOIL_TYPE_LABELS, SoilType } from '@/schemas';

interface LandParcelTableProps {
  data: LandParcel[];
  isLoading?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort: (column: string) => void;
  onEdit: (parcel: LandParcel) => void;
  onDelete: (parcel: LandParcel) => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

type SortableColumn = 'code' | 'name' | 'area_value' | 'soil_type' | 'status';

const COLUMN_HEADERS: { key: SortableColumn; label: string }[] = [
  { key: 'code', label: 'Mã' },
  { key: 'name', label: 'Tên lô đất' },
  { key: 'area_value', label: 'Diện tích' },
  { key: 'soil_type', label: 'Loại đất' },
  { key: 'status', label: 'Trạng thái' },
];

/**
 * LandParcelTable Component
 * =========================
 * Data table for displaying land parcels
 * Features:
 * - Sortable columns
 * - Row selection (single/bulk)
 * - Actions dropdown
 * - Loading skeleton
 * - Keyboard navigation
 */
export function LandParcelTable({
  data,
  isLoading,
  sortBy,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
}: LandParcelTableProps) {
  const navigate = useNavigate();
  const [focusedRowIndex, setFocusedRowIndex] = useState<number>(-1);

  const allSelected = useMemo(
    () => data.length > 0 && selectedIds.length === data.length,
    [data.length, selectedIds.length]
  );

  const someSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length < data.length,
    [data.length, selectedIds.length]
  );

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((p) => p.id));
    }
  }, [allSelected, data, onSelectionChange]);

  const handleSelectRow = useCallback(
    (id: number) => {
      if (selectedIds.includes(id)) {
        onSelectionChange(selectedIds.filter((i) => i !== id));
      } else {
        onSelectionChange([...selectedIds, id]);
      }
    },
    [selectedIds, onSelectionChange]
  );

  const handleViewDetail = useCallback(
    (parcel: LandParcel) => {
      navigate(`/dat-canh-tac/${parcel.id}`);
    },
    [navigate]
  );

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (data.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedRowIndex((prev) => Math.min(prev + 1, data.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedRowIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          if (focusedRowIndex >= 0 && focusedRowIndex < data.length) {
            handleViewDetail(data[focusedRowIndex]);
          }
          break;
        case ' ':
          if (focusedRowIndex >= 0 && focusedRowIndex < data.length) {
            e.preventDefault();
            handleSelectRow(data[focusedRowIndex].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, focusedRowIndex, handleSelectRow, handleViewDetail]);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Square className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Không có lô đất nào</h3>
        <p className="text-muted-foreground mt-1">
          Bắt đầu bằng cách thêm lô đất đầu tiên của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Select All Checkbox */}
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Chọn tất cả"
                className={someSelected ? 'data-[state=checked]:bg-primary/50' : ''}
              />
            </TableHead>

            {/* Sortable Column Headers */}
            {COLUMN_HEADERS.map((column) => (
              <TableHead key={column.key}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-accent"
                  onClick={() => onSort(column.key)}
                >
                  {column.label}
                  {getSortIcon(column.key)}
                </Button>
              </TableHead>
            ))}

            {/* Actions Column */}
            <TableHead className="w-12">
              <span className="sr-only">Thao tác</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((parcel, index) => (
            <TableRow
              key={parcel.id}
              data-state={selectedIds.includes(parcel.id) ? 'selected' : undefined}
              className={`cursor-pointer ${
                focusedRowIndex === index ? 'bg-muted/50' : ''
              }`}
              onClick={() => handleViewDetail(parcel)}
              onFocus={() => setFocusedRowIndex(index)}
              tabIndex={0}
              role="row"
              aria-selected={selectedIds.includes(parcel.id)}
            >
              {/* Row Checkbox */}
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedIds.includes(parcel.id)}
                  onCheckedChange={() => handleSelectRow(parcel.id)}
                  aria-label={`Chọn ${parcel.name}`}
                />
              </TableCell>

              {/* Code */}
              <TableCell className="font-mono text-sm">{parcel.code}</TableCell>

              {/* Name */}
              <TableCell className="font-medium">{parcel.name}</TableCell>

              {/* Area */}
              <TableCell>
                {parcel.area_value} {parcel.area_unit?.symbol || 'ha'}
              </TableCell>

              {/* Soil Type */}
              <TableCell>
                {parcel.soil_type
                  ? SOIL_TYPE_LABELS[parcel.soil_type as SoilType] || parcel.soil_type
                  : '-'}
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge variant={STATUS_COLORS[parcel.status] || 'secondary'}>
                  {STATUS_LABELS[parcel.status] || parcel.status}
                </Badge>
              </TableCell>

              {/* Actions */}
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Mở menu thao tác"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetail(parcel)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(parcel)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(parcel)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Table Skeleton for loading state
 */
function TableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            {COLUMN_HEADERS.map((column) => (
              <TableHead key={column.key}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-8 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
