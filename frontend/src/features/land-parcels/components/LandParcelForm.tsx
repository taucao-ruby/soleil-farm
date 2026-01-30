import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { LandParcel, CreateLandParcelInput, LandParcelStatus, SoilType } from '@/schemas';
import {
  createLandParcelSchema,
  STATUS_LABELS,
  SOIL_TYPE_LABELS,
} from '@/schemas';

// Mock area units - in production, fetch from API
const AREA_UNITS = [
  { id: 1, name: 'Mét vuông', symbol: 'm²' },
  { id: 2, name: 'Hecta', symbol: 'ha' },
  { id: 3, name: 'Sào', symbol: 'sào' },
  { id: 4, name: 'Công', symbol: 'công' },
];

interface LandParcelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateLandParcelInput) => void;
  defaultValues?: Partial<LandParcel>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

/**
 * LandParcelForm Component
 * ========================
 * Form dialog for creating/editing land parcels
 * Features:
 * - Validation with Zod + react-hook-form
 * - Vietnamese error messages
 * - Auto-save drafts
 * - Keyboard shortcuts (Esc to close)
 */
export function LandParcelForm({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isLoading = false,
  mode,
}: LandParcelFormProps) {
  const [draftKey] = useState(() => `land-parcel-draft-${mode}`);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<CreateLandParcelInput>({
    resolver: zodResolver(createLandParcelSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      area_value: undefined,
      area_unit_id: 2, // Default to hecta
      soil_type: undefined,
      status: 'available',
      location_description: '',
      gps_coordinates: '',
      ...defaultValues,
    },
  });

  const formValues = watch();

  // Load draft on mount
  useEffect(() => {
    if (mode === 'create' && !defaultValues) {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          Object.keys(draft).forEach((key) => {
            setValue(key as keyof CreateLandParcelInput, draft[key]);
          });
        } catch {
          // Invalid draft, ignore
        }
      }
    }
  }, [draftKey, mode, defaultValues, setValue]);

  // Auto-save draft
  useEffect(() => {
    if (mode === 'create' && isDirty) {
      const timer = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(formValues));
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [formValues, isDirty, mode, draftKey]);

  // Reset form when dialog opens/closes or defaultValues change
  useEffect(() => {
    if (open) {
      reset({
        name: '',
        code: '',
        description: '',
        area_value: undefined,
        area_unit_id: 2,
        soil_type: undefined,
        status: 'available',
        location_description: '',
        gps_coordinates: '',
        ...defaultValues,
      });
    }
  }, [open, defaultValues, reset]);

  const handleFormSubmit = useCallback(
    (data: CreateLandParcelInput) => {
      onSubmit(data);
      // Clear draft on successful submit
      localStorage.removeItem(draftKey);
    },
    [onSubmit, draftKey]
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Thêm lô đất mới' : 'Chỉnh sửa lô đất'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Điền thông tin để tạo lô đất mới trong trang trại.'
              : 'Cập nhật thông tin lô đất.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên lô đất <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="VD: Lô A1 - Đồng Bắc"
                maxLength={100}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã lô đất{' '}
                <span className="text-muted-foreground text-xs">(tự động nếu để trống)</span>
              </Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="VD: LOT-A1"
                maxLength={50}
                aria-invalid={!!errors.code}
                aria-describedby={errors.code ? 'code-error' : undefined}
              />
              {errors.code && (
                <p id="code-error" className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>

          {/* Area Section */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Area Value */}
            <div className="space-y-2">
              <Label htmlFor="area_value">
                Diện tích <span className="text-destructive">*</span>
              </Label>
              <Input
                id="area_value"
                type="number"
                step="0.01"
                min={1}
                {...register('area_value', { valueAsNumber: true })}
                placeholder="VD: 5.5"
                aria-invalid={!!errors.area_value}
                aria-describedby={errors.area_value ? 'area-error' : undefined}
              />
              {errors.area_value && (
                <p id="area-error" className="text-sm text-destructive">
                  {errors.area_value.message}
                </p>
              )}
            </div>

            {/* Area Unit */}
            <div className="space-y-2">
              <Label htmlFor="area_unit_id">
                Đơn vị diện tích <span className="text-destructive">*</span>
              </Label>
              <Select
                value={String(formValues.area_unit_id || '')}
                onValueChange={(value) => setValue('area_unit_id', Number(value))}
              >
                <SelectTrigger id="area_unit_id" aria-invalid={!!errors.area_unit_id}>
                  <SelectValue placeholder="Chọn đơn vị" />
                </SelectTrigger>
                <SelectContent>
                  {AREA_UNITS.map((unit) => (
                    <SelectItem key={unit.id} value={String(unit.id)}>
                      {unit.name} ({unit.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.area_unit_id && (
                <p className="text-sm text-destructive">
                  {errors.area_unit_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Classification Section */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Soil Type */}
            <div className="space-y-2">
              <Label htmlFor="soil_type">Loại đất</Label>
              <Select
                value={formValues.soil_type || ''}
                onValueChange={(value) =>
                  setValue('soil_type', value as SoilType | undefined)
                }
              >
                <SelectTrigger id="soil_type">
                  <SelectValue placeholder="Chọn loại đất" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SOIL_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formValues.status || 'available'}
                onValueChange={(value) =>
                  setValue('status', value as LandParcelStatus)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Mô tả thêm về lô đất (tùy chọn)"
              rows={3}
              maxLength={1000}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Location Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Location Description */}
            <div className="space-y-2">
              <Label htmlFor="location_description">Vị trí</Label>
              <Input
                id="location_description"
                {...register('location_description')}
                placeholder="VD: Cánh đồng phía Bắc, gần kênh chính"
                maxLength={500}
              />
            </div>

            {/* GPS Coordinates */}
            <div className="space-y-2">
              <Label htmlFor="gps_coordinates">Tọa độ GPS</Label>
              <Input
                id="gps_coordinates"
                {...register('gps_coordinates')}
                placeholder="VD: 10.762622, 106.660172"
                aria-invalid={!!errors.gps_coordinates}
                aria-describedby={errors.gps_coordinates ? 'gps-error' : undefined}
              />
              {errors.gps_coordinates && (
                <p id="gps-error" className="text-sm text-destructive">
                  {errors.gps_coordinates.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Tạo lô đất' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
