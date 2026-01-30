/**
 * Crop Cycles Page
 * ================
 * Main listing page for crop cycle management with:
 * - Filter/search
 * - List and Gantt views
 * - Create wizard integration
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Plus,
  LayoutGrid,
  GanttChart,
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useCropCycles } from '@/hooks/api';
import type { CropCycleQueryParams, CropCycle } from '@/schemas';

import {
  StatusBadge,
  CycleFilters,
  CreateCycleWizard,
  CycleActionButtons,
} from '../components';
import { CropCycleGanttView } from './CropCycleGanttView';
import { useCropCycleStats } from '../hooks/useCropCycles';

type ViewMode = 'grid' | 'gantt';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function calculateProgress(cycle: CropCycle): number {
  if (cycle.status === 'completed') return 100;
  if (cycle.status === 'planned') return 0;
  if (['failed', 'abandoned', 'cancelled'].includes(cycle.status)) return 0;

  const start = new Date(cycle.actual_start_date || cycle.planned_start_date);
  const end = new Date(cycle.planned_end_date);
  const today = new Date();

  if (today <= start) return 0;
  if (today >= end) return 100;

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return Math.min(100, Math.round((elapsedDays / totalDays) * 100));
}

interface CycleCardProps {
  cycle: CropCycle;
  onClick: () => void;
}

function CycleCard({ cycle, onClick }: CycleCardProps) {
  const progress = calculateProgress(cycle);

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{cycle.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              {cycle.crop_type && (
                <span className="flex items-center gap-1">
                  <Sprout className="h-3 w-3" />
                  {cycle.crop_type.name}
                </span>
              )}
              {cycle.land_parcel && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {cycle.land_parcel.code}
                </span>
              )}
            </CardDescription>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <CycleActionButtons cycle={cycle} variant="dropdown" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <StatusBadge status={cycle.status} size="sm" />
          {cycle.current_stage && (
            <span className="text-sm text-muted-foreground">
              {cycle.current_stage.stage_name}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Bắt đầu
            </p>
            <p className="font-medium">
              {formatDate(cycle.actual_start_date || cycle.planned_start_date)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Kết thúc
            </p>
            <p className="font-medium">
              {formatDate(cycle.actual_end_date || cycle.planned_end_date)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCards() {
  const { data: stats, isLoading } = useCropCycleStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã lên kế hoạch</p>
              <p className="text-2xl font-bold">{stats?.planned || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đang thực hiện</p>
              <p className="text-2xl font-bold">{stats?.active || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Sprout className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Hoàn thành</p>
              <p className="text-2xl font-bold">{stats?.completed || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Thất bại</p>
              <p className="text-2xl font-bold">{stats?.failed || 0}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CropCyclesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [filters, setFilters] = useState<CropCycleQueryParams>({});

  const { data: cyclesData, isLoading, error } = useCropCycles(filters);

  const handleCycleClick = (cycle: CropCycle) => {
    navigate(`/crop-cycles/${cycle.id}`);
  };

  const handleWizardSuccess = (cycleId: number) => {
    navigate(`/crop-cycles/${cycleId}`);
  };

  const cycles = cyclesData?.data || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Chu kỳ canh tác</h1>
            <p className="text-muted-foreground">
              Theo dõi và quản lý các vụ mùa
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'gantt' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode('gantt')}
            >
              <GanttChart className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => setWizardOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo chu kỳ mới
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Filters */}
      <CycleFilters filters={filters} onFiltersChange={setFilters} />

      {/* Content */}
      {viewMode === 'gantt' ? (
        <CropCycleGanttView onCycleClick={handleCycleClick} />
      ) : (
        <>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-destructive">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">Không thể tải dữ liệu</p>
              <p className="text-sm text-muted-foreground mt-1">
                Vui lòng thử lại sau
              </p>
            </div>
          ) : cycles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Sprout className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Chưa có chu kỳ canh tác</p>
              <p className="text-sm mt-1">
                Bắt đầu bằng cách tạo chu kỳ mới
              </p>
              <Button onClick={() => setWizardOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Tạo chu kỳ đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cycles.map((cycle) => (
                <CycleCard
                  key={cycle.id}
                  cycle={cycle}
                  onClick={() => handleCycleClick(cycle)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {cyclesData?.meta && cyclesData.meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={cyclesData.meta.current_page <= 1}
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: (cyclesData.meta?.current_page || 1) - 1,
                  })
                }
              >
                Trang trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {cyclesData.meta.current_page} / {cyclesData.meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  cyclesData.meta.current_page >= cyclesData.meta.last_page
                }
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: (cyclesData.meta?.current_page || 1) + 1,
                  })
                }
              >
                Trang sau
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create Wizard */}
      <CreateCycleWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onSuccess={handleWizardSuccess}
      />
    </div>
  );
}
