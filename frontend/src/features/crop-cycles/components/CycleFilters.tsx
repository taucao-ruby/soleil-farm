/**
 * Cycle Filters
 * ==============
 * Filter and search controls for crop cycles
 */

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  Calendar,
  MapPin,
  Sprout,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useLandParcels, useSeasons } from '@/hooks/api';
import type { CropCycleStatus, CropCycleQueryParams } from '@/schemas';

import { CROP_CYCLE_STATES } from '../hooks';

interface CycleFiltersProps {
  filters: CropCycleQueryParams;
  onFiltersChange: (filters: CropCycleQueryParams) => void;
  onSearch?: (query: string) => void;
}

const STATUS_OPTIONS: { value: CropCycleStatus; label: string }[] = [
  { value: 'planned', label: 'Đã lên kế hoạch' },
  { value: 'active', label: 'Đang thực hiện' },
  { value: 'in_progress', label: 'Đang thực hiện' },
  { value: 'harvesting', label: 'Đang thu hoạch' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'failed', label: 'Thất bại' },
  { value: 'abandoned', label: 'Đã hủy bỏ' },
];

export function CycleFilters({
  filters,
  onFiltersChange,
  onSearch,
}: CycleFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { data: parcelsData } = useLandParcels({ is_active: true });
  const { data: seasonsData } = useSeasons();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const activeFiltersCount = [
    filters.status,
    filters.land_parcel_id,
    filters.season_id,
    filters.date_from,
    filters.date_to,
  ].filter(Boolean).length;

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value === 'all' ? undefined : (value as CropCycleStatus),
    });
  };

  const handleParcelChange = (value: string) => {
    onFiltersChange({
      ...filters,
      land_parcel_id: value === 'all' ? undefined : parseInt(value),
    });
  };

  const handleSeasonChange = (value: string) => {
    onFiltersChange({
      ...filters,
      season_id: value === 'all' ? undefined : parseInt(value),
    });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({
      ...filters,
      date_from: value || undefined,
    });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({
      ...filters,
      date_to: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    setSearchQuery('');
  };

  const parcels = parcelsData?.data || [];
  const seasons = seasonsData?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm chu kỳ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick status filter */}
        <Select
          value={filters.status || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            {STATUS_OPTIONS.filter(
              (opt, idx, arr) =>
                arr.findIndex((o) => o.label === opt.label) === idx
            ).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Advanced filters popover */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Bộ lọc
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Bộ lọc nâng cao</h4>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-1 text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa tất cả
                  </Button>
                )}
              </div>

              {/* Land parcel filter */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  Lô đất
                </Label>
                <Select
                  value={filters.land_parcel_id?.toString() || 'all'}
                  onValueChange={handleParcelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lô đất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả lô đất</SelectItem>
                    {parcels.map((parcel) => (
                      <SelectItem key={parcel.id} value={parcel.id.toString()}>
                        {parcel.name} ({parcel.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season filter */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Sprout className="h-4 w-4" />
                  Mùa vụ
                </Label>
                <Select
                  value={filters.season_id?.toString() || 'all'}
                  onValueChange={handleSeasonChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mùa vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả mùa vụ</SelectItem>
                    {seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id.toString()}>
                        {season.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date range filter */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  Khoảng thời gian
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Từ</Label>
                    <Input
                      type="date"
                      value={filters.date_from || ''}
                      onChange={(e) => handleDateFromChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Đến</Label>
                    <Input
                      type="date"
                      value={filters.date_to || ''}
                      onChange={(e) => handleDateToChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsOpen(false)}
                className="w-full"
              >
                Áp dụng
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filters badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              {CROP_CYCLE_STATES[filters.status]?.label || filters.status}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.land_parcel_id && (
            <Badge variant="secondary" className="gap-1">
              {parcels.find((p) => p.id === filters.land_parcel_id)?.name || 'Lô đất'}
              <button
                onClick={() => handleParcelChange('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.season_id && (
            <Badge variant="secondary" className="gap-1">
              {seasons.find((s) => s.id === filters.season_id)?.name || 'Mùa vụ'}
              <button
                onClick={() => handleSeasonChange('all')}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {(filters.date_from || filters.date_to) && (
            <Badge variant="secondary" className="gap-1">
              {filters.date_from || '...'} - {filters.date_to || '...'}
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    date_from: undefined,
                    date_to: undefined,
                  });
                }}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
