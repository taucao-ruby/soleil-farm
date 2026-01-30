/**
 * Activity Filters Component
 * ===========================
 * Filter controls for activity logs with quick chips
 */

import { useState, useCallback } from 'react';
import {
  Calendar,
  Filter,
  X,
  Search,
  ChevronDown,
  Download,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useActivityTypes } from '@/hooks/api/use-activity-logs';
import { useCropCycles } from '@/hooks/api/use-crop-cycles';

import type { ActivityLogFilters, DateRangePreset, ExportFormat } from '../types';
import { getDateRangeFromPreset, format, formatDateRange } from '../utils';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ActivityFiltersProps {
  filters: ActivityLogFilters;
  onFiltersChange: (filters: ActivityLogFilters) => void;
  onSearch: (query: string) => void;
  searchQuery?: string;
  onExport?: (format: ExportFormat) => void;
  className?: string;
  /** Compact mode for mobile - shows simplified filters */
  compact?: boolean;
}

// ============================================================================
// DATE RANGE PRESETS
// ============================================================================

const DATE_PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'this_week', label: 'Tuần này' },
  { value: 'this_month', label: 'Tháng này' },
  { value: 'custom', label: 'Tùy chọn' },
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Activity Filters
 *
 * @example
 * <ActivityFilters
 *   filters={filters}
 *   onFiltersChange={setFilters}
 *   onSearch={handleSearch}
 *   onExport={handleExport}
 * />
 */
export function ActivityFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery = '',
  onExport,
  className,
  compact = false,
}: ActivityFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch filter options
  const { data: activityTypes = [] } = useActivityTypes();
  const { data: cropCyclesData } = useCropCycles({ per_page: 100 });
  const cropCycles = cropCyclesData?.data ?? [];

  // Handle search submit
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(localSearch);
    },
    [localSearch, onSearch]
  );

  // Handle filter change
  const updateFilter = useCallback(
    <K extends keyof ActivityLogFilters>(key: K, value: ActivityLogFilters[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  // Handle date preset change
  const handleDatePresetChange = useCallback(
    (preset: DateRangePreset) => {
      const range = getDateRangeFromPreset(preset);
      onFiltersChange({
        ...filters,
        dateRangePreset: preset,
        date_from: format(range.from, 'yyyy-MM-dd'),
        date_to: format(range.to, 'yyyy-MM-dd'),
      });
    },
    [filters, onFiltersChange]
  );

  // Clear single filter
  const clearFilter = useCallback(
    (key: keyof ActivityLogFilters) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    onFiltersChange({});
    setLocalSearch('');
    onSearch('');
  }, [onFiltersChange, onSearch]);

  // Count active filters
  const activeFilterCount = [
    filters.activity_type_id,
    filters.crop_cycle_id,
    filters.user_id,
    filters.dateRangePreset,
  ].filter(Boolean).length;

  // Get current date range display
  const dateRangeDisplay = filters.date_from && filters.date_to
    ? formatDateRange(new Date(filters.date_from), new Date(filters.date_to))
    : 'Chọn ngày';

  // Compact mode for mobile
  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="pl-9 pr-4 h-10 bg-gray-50"
          />
        </form>

        {/* Horizontal scroll filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {/* Date Preset Pills */}
          {DATE_PRESETS.slice(0, 3).map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleDatePresetChange(preset.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors shrink-0',
                filters.dateRangePreset === preset.value
                  ? 'bg-farm-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {preset.label}
            </button>
          ))}

          {/* Activity Type Select */}
          <Select
            value={filters.activity_type_id?.toString() ?? ''}
            onValueChange={(v) =>
              updateFilter('activity_type_id', v ? Number(v) : undefined)
            }
          >
            <SelectTrigger className="h-8 w-auto min-w-[120px] rounded-full text-sm">
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filter count */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-farm-green-600 underline"
          >
            Xóa {activeFilterCount} bộ lọc
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Top Row: Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Tìm kiếm trong ghi chú..."
            className="pl-9 pr-4"
          />
        </form>

        {/* Filter & Export Buttons */}
        <div className="flex gap-2">
          {/* Date Range Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">{dateRangeDisplay}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Khoảng thời gian</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {DATE_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.value}
                  onClick={() => handleDatePresetChange(preset.value)}
                  className={cn(
                    filters.dateRangePreset === preset.value && 'bg-farm-green-50'
                  )}
                >
                  {preset.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Filters Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Lọc</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Bộ lọc</h4>

                {/* Activity Type */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Loại hoạt động</label>
                  <Select
                    value={filters.activity_type_id?.toString() ?? ''}
                    onValueChange={(v) =>
                      updateFilter('activity_type_id', v ? Number(v) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Crop Cycle */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Chu kỳ canh tác</label>
                  <Select
                    value={filters.crop_cycle_id?.toString() ?? ''}
                    onValueChange={(v) =>
                      updateFilter('crop_cycle_id', v ? Number(v) : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả chu kỳ" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropCycles.map((cycle) => (
                        <SelectItem key={cycle.id} value={cycle.id.toString()}>
                          {cycle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="w-full text-gray-500"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Export Dropdown */}
          {onExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Xuất</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Xuất dữ liệu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Xuất CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Xuất PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.dateRangePreset && (
            <FilterChip
              label={`📅 ${DATE_PRESETS.find((p) => p.value === filters.dateRangePreset)?.label}`}
              onRemove={() => clearFilter('dateRangePreset')}
            />
          )}

          {filters.activity_type_id && (
            <FilterChip
              label={`🏷️ ${activityTypes.find((t) => t.id === filters.activity_type_id)?.name}`}
              onRemove={() => clearFilter('activity_type_id')}
            />
          )}

          {filters.crop_cycle_id && (
            <FilterChip
              label={`🌱 ${cropCycles.find((c) => c.id === filters.crop_cycle_id)?.name}`}
              onRemove={() => clearFilter('crop_cycle_id')}
            />
          )}

          {searchQuery && (
            <FilterChip
              label={`🔍 "${searchQuery}"`}
              onRemove={() => {
                setLocalSearch('');
                onSearch('');
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FILTER CHIP
// ============================================================================

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="ml-1 hover:text-gray-900 focus:outline-none"
        aria-label="Remove filter"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export default ActivityFilters;
