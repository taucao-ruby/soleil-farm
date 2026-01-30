import { useCallback, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LandParcelQueryParams, LandParcelStatus, SoilType } from '@/schemas';
import { STATUS_LABELS, SOIL_TYPE_LABELS } from '@/schemas';

interface LandParcelFiltersProps {
  filters: LandParcelQueryParams;
  onFiltersChange: (filters: LandParcelQueryParams) => void;
  onSearch: (search: string) => void;
  searchValue: string;
}

/**
 * LandParcelFilters Component
 * ===========================
 * Filters and search for land parcel list
 */
export function LandParcelFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchValue,
}: LandParcelFiltersProps) {
  const hasActiveFilters = useMemo(() => {
    return filters.status || filters.soil_type || filters.area_min || filters.area_max;
  }, [filters]);

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        status: value === 'all' ? undefined : (value as LandParcelStatus),
        page: 1,
      });
    },
    [filters, onFiltersChange]
  );

  const handleSoilTypeChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        soil_type: value === 'all' ? undefined : (value as SoilType),
        page: 1,
      });
    },
    [filters, onFiltersChange]
  );

  const handleAreaMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value ? Number(e.target.value) : undefined;
      onFiltersChange({
        ...filters,
        area_min: value,
        page: 1,
      });
    },
    [filters, onFiltersChange]
  );

  const handleAreaMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value ? Number(e.target.value) : undefined;
      onFiltersChange({
        ...filters,
        area_max: value,
        page: 1,
      });
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({
      ...filters,
      status: undefined,
      soil_type: undefined,
      area_min: undefined,
      area_max: undefined,
      page: 1,
    });
    onSearch('');
  }, [filters, onFiltersChange, onSearch]);

  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã lô đất..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
            aria-label="Tìm kiếm lô đất"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Select
            value={filters.status || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[160px]" aria-label="Lọc theo trạng thái">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Soil Type Filter */}
          <Select
            value={filters.soil_type || 'all'}
            onValueChange={handleSoilTypeChange}
          >
            <SelectTrigger className="w-[160px]" aria-label="Lọc theo loại đất">
              <SelectValue placeholder="Loại đất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại đất</SelectItem>
              {Object.entries(SOIL_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Area Range Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Diện tích:</span>
        <Input
          type="number"
          placeholder="Từ"
          value={filters.area_min || ''}
          onChange={handleAreaMinChange}
          className="w-24"
          min={0}
          aria-label="Diện tích tối thiểu"
        />
        <span className="text-muted-foreground">-</span>
        <Input
          type="number"
          placeholder="Đến"
          value={filters.area_max || ''}
          onChange={handleAreaMaxChange}
          className="w-24"
          min={0}
          aria-label="Diện tích tối đa"
        />
        <span className="text-sm text-muted-foreground">ha</span>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="ml-auto"
          >
            <X className="mr-1 h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    </div>
  );
}
