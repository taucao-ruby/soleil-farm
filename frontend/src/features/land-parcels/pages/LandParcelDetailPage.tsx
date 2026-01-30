import { useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Map,
  Pencil,
  Trash2,
  MapPin,
  Ruler,
  Layers,
  CheckCircle,
  Clock,
  Save,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDisclosure } from '@/hooks/useDisclosure';
import {
  useLandParcel,
  useUpdateLandParcel,
  useDeleteLandParcel,
  useAttachWaterSources,
  useDetachWaterSource,
  useLandParcelCropCycles,
} from '@/hooks/api/use-land-parcels';
import type { CreateLandParcelInput } from '@/schemas';
import {
  STATUS_LABELS,
  STATUS_COLORS,
  SOIL_TYPE_LABELS,
  SoilType,
} from '@/schemas';

import {
  LandParcelForm,
  DeleteConfirmDialog,
  WaterSourcesSection,
  CropCycleHistoryTimeline,
} from '../components';

/**
 * LandParcelDetailPage
 * ====================
 * Detail page for a single land parcel
 * Features:
 * - Basic info card with inline editing
 * - Water sources management
 * - Crop cycle history timeline
 * - Map view placeholder
 * - Activity logs section
 */
export function LandParcelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parcelId = Number(id);

  // ============================================================================
  // STATE
  // ============================================================================

  const editDialog = useDisclosure();
  const deleteDialog = useDisclosure();

  // Inline editing
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [detachingWaterSourceId, setDetachingWaterSourceId] = useState<number | null>(null);

  // ============================================================================
  // QUERIES
  // ============================================================================

  const { data: parcel, isLoading, error } = useLandParcel(parcelId);
  const { data: cropCycles, isLoading: isLoadingCropCycles } = useLandParcelCropCycles(parcelId);

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  const updateMutation = useUpdateLandParcel();
  const deleteMutation = useDeleteLandParcel();
  const attachWaterSourcesMutation = useAttachWaterSources();
  const detachWaterSourceMutation = useDetachWaterSource();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleStartInlineEdit = useCallback(() => {
    if (parcel) {
      setEditedName(parcel.name);
      setIsInlineEditing(true);
    }
  }, [parcel]);

  const handleCancelInlineEdit = useCallback(() => {
    setIsInlineEditing(false);
    setEditedName('');
  }, []);

  const handleSaveInlineName = useCallback(() => {
    if (!parcel || !editedName.trim()) return;

    updateMutation.mutate(
      { id: parcel.id, data: { name: editedName.trim() } },
      {
        onSuccess: () => {
          toast.success('Đã cập nhật tên lô đất!');
          setIsInlineEditing(false);
        },
        onError: (error: Error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      }
    );
  }, [parcel, editedName, updateMutation]);

  const handleUpdate = useCallback(
    (data: CreateLandParcelInput) => {
      if (!parcel) return;

      updateMutation.mutate(
        { id: parcel.id, data },
        {
          onSuccess: () => {
            toast.success('Cập nhật lô đất thành công!');
            editDialog.onClose();
          },
          onError: (error: Error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        }
      );
    },
    [parcel, updateMutation, editDialog]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!parcel) return;

    deleteMutation.mutate(parcel.id, {
      onSuccess: () => {
        toast.success('Xóa lô đất thành công!');
        navigate('/dat-canh-tac');
      },
      onError: (error: Error) => {
        toast.error(`Lỗi: ${error.message}`);
      },
    });
  }, [parcel, deleteMutation, navigate]);

  const handleAttachWaterSources = useCallback(
    (waterSourceIds: number[]) => {
      if (!parcel) return;

      attachWaterSourcesMutation.mutate(
        { id: parcel.id, waterSourceIds },
        {
          onSuccess: () => {
            toast.success('Đã thêm nguồn nước!');
          },
          onError: (error: Error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        }
      );
    },
    [parcel, attachWaterSourcesMutation]
  );

  const handleDetachWaterSource = useCallback(
    (waterSourceId: number) => {
      if (!parcel) return;

      setDetachingWaterSourceId(waterSourceId);
      detachWaterSourceMutation.mutate(
        { id: parcel.id, waterSourceId },
        {
          onSuccess: () => {
            toast.success('Đã gỡ nguồn nước!');
            setDetachingWaterSourceId(null);
          },
          onError: (error: Error) => {
            toast.error(`Lỗi: ${error.message}`);
            setDetachingWaterSourceId(null);
          },
        }
      );
    },
    [parcel, detachWaterSourceMutation]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (error || !parcel) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Map className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold">Không tìm thấy lô đất</h2>
        <p className="text-muted-foreground mt-2">
          Lô đất này không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild className="mt-4">
          <Link to="/dat-canh-tac">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dat-canh-tac" aria-label="Quay lại">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Map className="h-8 w-8 text-farm-leaf" />
            <div>
              {isInlineEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-8 text-xl font-bold"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveInlineName();
                      if (e.key === 'Escape') handleCancelInlineEdit();
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleSaveInlineName}
                    disabled={updateMutation.isPending}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleCancelInlineEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <h1
                  className="text-2xl font-bold md:text-3xl cursor-pointer hover:text-primary transition-colors"
                  onClick={handleStartInlineEdit}
                  title="Nhấn để chỉnh sửa tên"
                >
                  {parcel.name}
                </h1>
              )}
              <p className="text-muted-foreground font-mono">{parcel.code}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={editDialog.onOpen}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button
            variant="destructive"
            onClick={deleteDialog.onOpen}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Basic Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Thông tin chi tiết về lô đất này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Area */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Ruler className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diện tích</p>
                    <p className="font-semibold">
                      {parcel.area_value} {parcel.area_unit?.symbol || 'ha'}
                    </p>
                  </div>
                </div>

                {/* Soil Type */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2">
                    <Layers className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loại đất</p>
                    <p className="font-semibold">
                      {parcel.soil_type
                        ? SOIL_TYPE_LABELS[parcel.soil_type as SoilType] || parcel.soil_type
                        : 'Chưa xác định'}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <Badge variant={STATUS_COLORS[parcel.status] || 'secondary'}>
                      {STATUS_LABELS[parcel.status] || parcel.status}
                    </Badge>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vị trí</p>
                    <p className="font-semibold">
                      {parcel.location_description || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {parcel.description && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Mô tả</p>
                  <p className="text-sm">{parcel.description}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-6 pt-6 border-t flex gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Tạo:{' '}
                    {new Date(parcel.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    Cập nhật:{' '}
                    {new Date(parcel.updated_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Water Sources */}
          <WaterSourcesSection
            waterSources={parcel.water_sources || []}
            onAttach={handleAttachWaterSources}
            onDetach={handleDetachWaterSource}
            isAttaching={attachWaterSourcesMutation.isPending}
            isDetaching={detachWaterSourceMutation.isPending}
            detachingId={detachingWaterSourceId}
          />

          {/* Crop Cycle History */}
          <CropCycleHistoryTimeline
            cropCycles={cropCycles || []}
            isLoading={isLoadingCropCycles}
          />
        </div>

        {/* Right Column - Map & Activity */}
        <div className="space-y-6">
          {/* Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Bản đồ
              </CardTitle>
              <CardDescription>
                Vị trí lô đất trên bản đồ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg bg-muted flex flex-col items-center justify-center text-center p-4">
                <Map className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Tính năng bản đồ đang được phát triển
                </p>
                {parcel.gps_coordinates && (
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    GPS: {parcel.gps_coordinates}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Log Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Chưa có hoạt động nào</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <LandParcelForm
        open={editDialog.isOpen}
        onOpenChange={editDialog.onClose}
        onSubmit={handleUpdate}
        defaultValues={parcel}
        isLoading={updateMutation.isPending}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.onClose}
        parcel={parcel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

/**
 * Detail Page Skeleton for loading state
 */
function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-24 mt-2" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-32 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-square rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
