/**
 * Quick Log Form Component
 * =========================
 * Floating action button + modal form for quick activity logging
 */

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  X,
  Clock,
  FileText,
  Loader2,
  Sparkles,
  Save,
} from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useActivityTypes } from '@/hooks/api/use-activity-logs';
import { useCropCycles } from '@/hooks/api/use-crop-cycles';

import type { QuickLogTemplate } from '../types';
import { DEFAULT_TEMPLATES, getActivityTypeConfig } from '../types';
import { getCurrentDateString, getCurrentTimeString } from '../utils';
import { useQuickCreateActivity, useActivityTemplates } from '../hooks';
import { ActivityTypeIcon } from './ActivityTypeIcon';

// ============================================================================
// FORM SCHEMA
// ============================================================================

const quickLogSchema = z.object({
  activity_type_id: z.number().int().positive('Vui lòng chọn loại hoạt động'),
  crop_cycle_id: z.number().int().positive('Vui lòng chọn chu kỳ canh tác'),
  activity_date: z.string().min(1, 'Vui lòng chọn ngày'),
  start_time: z.string().optional(),
  duration_hours: z.number().positive().optional(),
  description: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
});

type QuickLogFormData = z.infer<typeof quickLogSchema>;

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface QuickLogFormProps {
  defaultCropCycleId?: number;
  onSuccess?: () => void;
}

// ============================================================================
// FAB COMPONENT
// ============================================================================

/**
 * Floating Action Button for Quick Log
 */
export function QuickLogFAB({
  defaultCropCycleId,
  onSuccess,
}: QuickLogFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'flex items-center justify-center',
          'w-14 h-14 rounded-full shadow-lg',
          'bg-farm-green-600 text-white',
          'hover:bg-farm-green-700 hover:scale-110',
          'focus:outline-none focus:ring-4 focus:ring-farm-green-200',
          'transition-all duration-200'
        )}
        aria-label="Thêm hoạt động mới"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      <QuickLogModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultCropCycleId={defaultCropCycleId}
        onSuccess={() => {
          setIsOpen(false);
          onSuccess?.();
        }}
      />
    </>
  );
}

// ============================================================================
// MODAL COMPONENT
// ============================================================================

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCropCycleId?: number;
  onSuccess?: () => void;
}

/**
 * Quick Log Modal Form
 */
export function QuickLogModal({
  isOpen,
  onClose,
  defaultCropCycleId,
  onSuccess,
}: QuickLogModalProps) {
  const [showTemplates, setShowTemplates] = useState(true);

  // Data fetching
  const { data: activityTypes = [] } = useActivityTypes();
  const { data: cropCyclesData } = useCropCycles({ per_page: 100 });
  const cropCycles = cropCyclesData?.data ?? [];
  const { templates } = useActivityTemplates();

  // Mutation
  const createMutation = useQuickCreateActivity();

  // Form
  const form = useForm<QuickLogFormData>({
    resolver: zodResolver(quickLogSchema),
    defaultValues: {
      activity_type_id: undefined,
      crop_cycle_id: defaultCropCycleId,
      activity_date: getCurrentDateString(),
      start_time: getCurrentTimeString(),
      duration_hours: undefined,
      description: '',
      notes: '',
    },
  });

  // Apply template
  const applyTemplate = useCallback(
    (template: QuickLogTemplate) => {
      form.setValue('activity_type_id', template.activityTypeId);
      form.setValue('description', template.description || '');
      if (template.defaultDuration) {
        form.setValue('duration_hours', template.defaultDuration);
      }
      setShowTemplates(false);
    },
    [form]
  );

  // Submit handler
  const onSubmit = useCallback(
    async (data: QuickLogFormData) => {
      await createMutation.mutateAsync({
        activity_type_id: data.activity_type_id,
        crop_cycle_id: data.crop_cycle_id,
        activity_date: data.activity_date,
        description: data.description || null,
        notes: data.notes || null,
        metadata: data.duration_hours
          ? { duration_hours: data.duration_hours, start_time: data.start_time }
          : null,
      });
      form.reset();
      setShowTemplates(true);
      onSuccess?.();
    },
    [createMutation, form, onSuccess]
  );

  // Selected activity type config
  const selectedTypeId = form.watch('activity_type_id');
  const selectedType = activityTypes.find((t) => t.id === selectedTypeId);
  const selectedConfig = getActivityTypeConfig(selectedType?.code);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-farm-green-600" />
            Ghi nhận hoạt động
          </DialogTitle>
          <DialogDescription>
            Ghi nhanh hoạt động canh tác của bạn
          </DialogDescription>
        </DialogHeader>

        {/* Quick Templates */}
        {showTemplates && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Mẫu nhanh</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(templates.length > 0 ? templates : DEFAULT_TEMPLATES).map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template as QuickLogTemplate)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-lg border',
                    'hover:bg-gray-50 hover:border-farm-green-300',
                    'transition-colors text-center'
                  )}
                >
                  <span className="text-xl">{'icon' in template ? template.icon : '📝'}</span>
                  <span className="text-xs font-medium">{template.name}</span>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplates(false)}
              className="w-full text-gray-500"
            >
              Hoặc nhập thủ công
            </Button>
          </div>
        )}

        {/* Form */}
        {!showTemplates && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Activity Type */}
            <div className="space-y-2">
              <Label htmlFor="activity_type_id">
                Loại hoạt động <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.watch('activity_type_id')?.toString() ?? ''}
                onValueChange={(v) => form.setValue('activity_type_id', Number(v))}
              >
                <SelectTrigger
                  id="activity_type_id"
                  className={cn(
                    selectedType && selectedConfig.bgColor,
                    selectedType && selectedConfig.borderColor
                  )}
                >
                  <SelectValue placeholder="Chọn loại hoạt động">
                    {selectedType && (
                      <span className="flex items-center gap-2">
                        <ActivityTypeIcon
                          code={selectedType.code}
                          size="sm"
                          showBackground={false}
                        />
                        {selectedType.name}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => {
                    const config = getActivityTypeConfig(type.code);
                    return (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        <span className="flex items-center gap-2">
                          <span>{config.emoji}</span>
                          {type.name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {form.formState.errors.activity_type_id && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.activity_type_id.message}
                </p>
              )}
            </div>

            {/* Crop Cycle */}
            <div className="space-y-2">
              <Label htmlFor="crop_cycle_id">
                Chu kỳ canh tác <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.watch('crop_cycle_id')?.toString() ?? ''}
                onValueChange={(v) => form.setValue('crop_cycle_id', Number(v))}
              >
                <SelectTrigger id="crop_cycle_id">
                  <SelectValue placeholder="Chọn chu kỳ canh tác" />
                </SelectTrigger>
                <SelectContent>
                  {cropCycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id.toString()}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.crop_cycle_id && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.crop_cycle_id.message}
                </p>
              )}
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity_date">
                  Ngày <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="activity_date"
                  type="date"
                  {...form.register('activity_date')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_time">Giờ bắt đầu</Label>
                <Input
                  id="start_time"
                  type="time"
                  {...form.register('start_time')}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration_hours" className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Thời lượng (giờ)
              </Label>
              <Input
                id="duration_hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="VD: 2.5"
                {...form.register('duration_hours', { valueAsNumber: true })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Mô tả
              </Label>
              <Input
                id="description"
                placeholder="VD: Bón phân NPK 16-16-8"
                {...form.register('description')}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú chi tiết</Label>
              <Textarea
                id="notes"
                placeholder="Thêm ghi chú chi tiết về hoạt động..."
                rows={3}
                {...form.register('notes')}
              />
            </div>

            {/* Footer Actions */}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowTemplates(true)}
              >
                ← Quay lại
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-farm-green-600 hover:bg-farm-green-700"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Lưu
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default QuickLogFAB;
