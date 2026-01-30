/**
 * Crop Cycle Detail Page
 * =======================
 * Displays detailed information about a crop cycle with state machine controls
 */

import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sprout,
  Clock,
  FileText,
  Activity,
  ImageIcon,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCropCycle, useCropCycleStages } from '@/hooks/api';

import {
  LargeStatusIndicator,
  StateMachineVisualizer,
  StageProgressTimeline,
  CycleActionButtons,
} from '../components';
import { getStatusConfig, isTerminalStatus } from '../hooks';

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function calculateDaysDiff(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function CropCycleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const cycleId = parseInt(id || '0');

  const {
    data: cycle,
    isLoading: cycleLoading,
    error: cycleError,
  } = useCropCycle(cycleId);

  const {
    data: stages,
    isLoading: stagesLoading,
  } = useCropCycleStages(cycleId);

  if (cycleLoading) {
    return <DetailPageSkeleton />;
  }

  if (cycleError || !cycle) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-semibold">Không tìm thấy chu kỳ</h2>
        <p className="text-muted-foreground mt-1">
          Chu kỳ canh tác không tồn tại hoặc đã bị xóa
        </p>
        <Button onClick={() => navigate('/crop-cycles')} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(cycle.status);
  const isTerminal = isTerminalStatus(cycle.status);

  const plannedDuration = calculateDaysDiff(
    cycle.planned_start_date,
    cycle.planned_end_date
  );

  const actualDuration =
    cycle.actual_start_date && cycle.actual_end_date
      ? calculateDaysDiff(cycle.actual_start_date, cycle.actual_end_date)
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/crop-cycles')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{cycle.name}</h1>
              <Badge
                className={`${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
              >
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              {cycle.land_parcel && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {cycle.land_parcel.name}
                </span>
              )}
              {cycle.crop_type && (
                <span className="flex items-center gap-1">
                  <Sprout className="h-4 w-4" />
                  {cycle.crop_type.name}
                </span>
              )}
              {cycle.season && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {cycle.season.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <CycleActionButtons
          cycle={cycle}
          onEdit={() => navigate(`/crop-cycles/${cycle.id}/edit`)}
          onViewReport={() => navigate(`/crop-cycles/${cycle.id}/report`)}
        />
      </div>

      {/* Large status indicator */}
      <LargeStatusIndicator status={cycle.status} />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dates & Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Thời gian & Tiến độ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Planned dates */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Kế hoạch
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bắt đầu</p>
                      <p className="font-medium">
                        {formatDate(cycle.planned_start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kết thúc</p>
                      <p className="font-medium">
                        {formatDate(cycle.planned_end_date)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian</p>
                    <p className="font-medium">{plannedDuration} ngày</p>
                  </div>
                </div>

                {/* Actual dates */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Thực tế
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bắt đầu</p>
                      <p className="font-medium">
                        {formatDate(cycle.actual_start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Kết thúc</p>
                      <p className="font-medium">
                        {formatDate(cycle.actual_end_date)}
                      </p>
                    </div>
                  </div>
                  {actualDuration && (
                    <div>
                      <p className="text-sm text-muted-foreground">Thời gian</p>
                      <p className="font-medium">
                        {actualDuration} ngày
                        {actualDuration !== plannedDuration && (
                          <span
                            className={`ml-2 text-sm ${
                              actualDuration > plannedDuration
                                ? 'text-amber-600'
                                : 'text-green-600'
                            }`}
                          >
                            ({actualDuration > plannedDuration ? '+' : ''}
                            {actualDuration - plannedDuration})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Yield info if completed */}
              {isTerminal && (cycle.expected_yield || cycle.actual_yield) && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground mb-4">
                    Năng suất
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Dự kiến</p>
                      <p className="font-medium">
                        {cycle.expected_yield ? `${cycle.expected_yield} kg` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Thực tế</p>
                      <p className="font-medium">
                        {cycle.actual_yield ? `${cycle.actual_yield} kg` : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stages Progress */}
          {stages && stages.length > 0 && (
            <StageProgressTimeline
              stages={stages}
              cycleStartDate={cycle.planned_start_date}
              cycleEndDate={cycle.planned_end_date}
              actualStartDate={cycle.actual_start_date}
              actualEndDate={cycle.actual_end_date}
            />
          )}

          {stagesLoading && (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {cycle.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{cycle.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-6">
          {/* State Machine */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sơ đồ trạng thái</CardTitle>
              <CardDescription>
                Các chuyển đổi trạng thái có thể thực hiện
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <StateMachineVisualizer
                currentStatus={cycle.status}
                showTransitions={true}
              />
            </CardContent>
          </Card>

          {/* Related info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin liên quan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Land parcel */}
              {cycle.land_parcel && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{cycle.land_parcel.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cycle.land_parcel.code}
                    </p>
                  </div>
                </div>
              )}

              {/* Crop type */}
              {cycle.crop_type && (
                <div className="flex items-start gap-3">
                  <Sprout className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{cycle.crop_type.name}</p>
                    {cycle.crop_type.variety && (
                      <p className="text-sm text-muted-foreground">
                        Giống: {cycle.crop_type.variety}
                      </p>
                    )}
                    {cycle.crop_type.growth_duration_days && (
                      <p className="text-sm text-muted-foreground">
                        Thời gian sinh trưởng: {cycle.crop_type.growth_duration_days} ngày
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Season */}
              {cycle.season && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{cycle.season.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Năm {cycle.season.year}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Liên kết nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate(`/crop-cycles/${cycle.id}/activities`)}
              >
                <Activity className="h-4 w-4 mr-2" />
                Nhật ký hoạt động
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Thư viện ảnh
                <Badge variant="secondary" className="ml-auto text-xs">
                  Sắp có
                </Badge>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Status skeleton */}
      <Skeleton className="h-32 w-full rounded-lg" />

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
