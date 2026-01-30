/**
 * Step 5: Configure Stages
 * =========================
 * Auto-generate and manually adjust crop stages
 */

import { useState, useEffect, useCallback } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { WizardStepProps, WizardStageConfig } from './types';

// Default stages for different crop types
const DEFAULT_STAGES: Record<string, WizardStageConfig[]> = {
  'Lúa': [
    { stage_name: 'Chuẩn bị đất', stage_order: 1, planned_duration_days: 7 },
    { stage_name: 'Gieo mạ', stage_order: 2, planned_duration_days: 14 },
    { stage_name: 'Cấy lúa', stage_order: 3, planned_duration_days: 7 },
    { stage_name: 'Đẻ nhánh', stage_order: 4, planned_duration_days: 30 },
    { stage_name: 'Làm đòng', stage_order: 5, planned_duration_days: 25 },
    { stage_name: 'Trổ bông', stage_order: 6, planned_duration_days: 7 },
    { stage_name: 'Chín', stage_order: 7, planned_duration_days: 25 },
    { stage_name: 'Thu hoạch', stage_order: 8, planned_duration_days: 5 },
  ],
  'Ngô': [
    { stage_name: 'Chuẩn bị đất', stage_order: 1, planned_duration_days: 5 },
    { stage_name: 'Gieo hạt', stage_order: 2, planned_duration_days: 7 },
    { stage_name: 'Cây con', stage_order: 3, planned_duration_days: 20 },
    { stage_name: 'Phát triển thân lá', stage_order: 4, planned_duration_days: 30 },
    { stage_name: 'Trổ cờ phun râu', stage_order: 5, planned_duration_days: 15 },
    { stage_name: 'Chín sữa', stage_order: 6, planned_duration_days: 20 },
    { stage_name: 'Thu hoạch', stage_order: 7, planned_duration_days: 5 },
  ],
  'default': [
    { stage_name: 'Chuẩn bị', stage_order: 1, planned_duration_days: 7 },
    { stage_name: 'Gieo trồng', stage_order: 2, planned_duration_days: 14 },
    { stage_name: 'Sinh trưởng', stage_order: 3, planned_duration_days: 45 },
    { stage_name: 'Ra hoa/Quả', stage_order: 4, planned_duration_days: 21 },
    { stage_name: 'Thu hoạch', stage_order: 5, planned_duration_days: 7 },
  ],
};

function getDefaultStages(cropTypeName?: string): WizardStageConfig[] {
  if (!cropTypeName) return DEFAULT_STAGES.default;
  
  for (const [key, stages] of Object.entries(DEFAULT_STAGES)) {
    if (cropTypeName.toLowerCase().includes(key.toLowerCase())) {
      return stages;
    }
  }
  return DEFAULT_STAGES.default;
}

interface StageItemProps {
  stage: WizardStageConfig;
  index: number;
  totalDuration: number;
  onUpdate: (updates: Partial<WizardStageConfig>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

function StageItem({
  stage,
  index,
  totalDuration,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: StageItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = totalDuration > 0 
    ? Math.round((stage.planned_duration_days / totalDuration) * 100) 
    : 0;

  return (
    <Card className="group">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <div className="cursor-move text-muted-foreground hover:text-foreground">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Stage number */}
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
            {index + 1}
          </div>

          {/* Stage name input */}
          <div className="flex-1">
            <Input
              value={stage.stage_name}
              onChange={(e) => onUpdate({ stage_name: e.target.value })}
              className="font-medium"
              placeholder="Tên giai đoạn"
            />
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={stage.planned_duration_days}
              onChange={(e) => onUpdate({ planned_duration_days: parseInt(e.target.value) || 0 })}
              className="w-16 text-center"
              min={1}
            />
            <span className="text-sm text-muted-foreground">ngày</span>
          </div>

          {/* Percentage */}
          <Badge variant="outline" className="min-w-[50px] justify-center">
            {percentage}%
          </Badge>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              disabled={isFirst}
              className="h-8 w-8"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              disabled={isLast}
              className="h-8 w-8"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 pl-14 space-y-3 pt-3 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Ngày bắt đầu dự kiến</Label>
                <Input
                  type="date"
                  value={stage.planned_start_date || ''}
                  onChange={(e) => onUpdate({ planned_start_date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Ngày kết thúc dự kiến</Label>
                <Input
                  type="date"
                  value={stage.planned_end_date || ''}
                  onChange={(e) => onUpdate({ planned_end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Ghi chú giai đoạn</Label>
              <Input
                value={stage.notes || ''}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                placeholder="Thêm ghi chú cho giai đoạn này..."
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Step5ConfigureStages({
  data,
  onUpdate,
  onNext,
  onPrev,
  isLastStep,
}: WizardStepProps) {
  const [stages, setStages] = useState<WizardStageConfig[]>(data.stages || []);

  // Auto-generate stages if empty
  useEffect(() => {
    if (stages.length === 0 && data.crop_type?.name) {
      const defaultStages = getDefaultStages(data.crop_type.name);
      setStages(defaultStages);
      onUpdate({ stages: defaultStages });
    }
  }, [data.crop_type, stages.length, onUpdate]);

  // Calculate total duration
  const totalDuration = stages.reduce((sum, s) => sum + s.planned_duration_days, 0);
  const expectedDuration = data.crop_type?.growth_duration_days || 0;
  const durationDiff = totalDuration - expectedDuration;

  // Update stages in form data
  const updateStages = useCallback((newStages: WizardStageConfig[]) => {
    setStages(newStages);
    onUpdate({ stages: newStages });
  }, [onUpdate]);

  const handleStageUpdate = (index: number, updates: Partial<WizardStageConfig>) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], ...updates };
    updateStages(newStages);
  };

  const handleStageDelete = (index: number) => {
    if (stages.length <= 1) return;
    const newStages = stages.filter((_, i) => i !== index);
    // Re-order
    newStages.forEach((s, i) => {
      s.stage_order = i + 1;
    });
    updateStages(newStages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newStages = [...stages];
    [newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]];
    newStages.forEach((s, i) => {
      s.stage_order = i + 1;
    });
    updateStages(newStages);
  };

  const handleMoveDown = (index: number) => {
    if (index === stages.length - 1) return;
    const newStages = [...stages];
    [newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
    newStages.forEach((s, i) => {
      s.stage_order = i + 1;
    });
    updateStages(newStages);
  };

  const handleAddStage = () => {
    const newStage: WizardStageConfig = {
      stage_name: `Giai đoạn ${stages.length + 1}`,
      stage_order: stages.length + 1,
      planned_duration_days: 7,
    };
    updateStages([...stages, newStage]);
  };

  const handleResetToDefault = () => {
    const defaultStages = getDefaultStages(data.crop_type?.name);
    updateStages(defaultStages);
  };

  const handleSubmit = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Cấu hình giai đoạn</h3>
        <p className="text-sm text-muted-foreground">
          Thiết lập các giai đoạn phát triển cho chu kỳ canh tác
        </p>
      </div>

      {/* Duration summary */}
      <Card className={cn(
        'border-l-4',
        Math.abs(durationDiff) <= 7 ? 'border-l-green-500' : 'border-l-amber-500'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tổng thời gian</p>
                <p className="text-2xl font-bold">{totalDuration} ngày</p>
              </div>
              {expectedDuration > 0 && (
                <div className="pl-4 border-l">
                  <p className="text-sm text-muted-foreground">Khuyến nghị</p>
                  <p className="text-lg font-medium">{expectedDuration} ngày</p>
                </div>
              )}
            </div>
            {durationDiff !== 0 && expectedDuration > 0 && (
              <Badge variant={Math.abs(durationDiff) <= 7 ? 'secondary' : 'outline'}>
                {durationDiff > 0 ? '+' : ''}{durationDiff} ngày
              </Badge>
            )}
          </div>

          {/* Visual timeline */}
          <div className="mt-4 flex h-4 rounded-full overflow-hidden bg-muted">
            {stages.map((stage, index) => {
              const width = totalDuration > 0 
                ? (stage.planned_duration_days / totalDuration) * 100 
                : 0;
              return (
                <div
                  key={index}
                  className={cn(
                    'h-full transition-all',
                    index % 2 === 0 ? 'bg-primary' : 'bg-primary/70'
                  )}
                  style={{ width: `${width}%` }}
                  title={`${stage.stage_name}: ${stage.planned_duration_days} ngày`}
                />
              );
            })}
          </div>

          {/* Stage labels */}
          <div className="mt-2 flex text-xs">
            {stages.map((stage, index) => {
              const width = totalDuration > 0 
                ? (stage.planned_duration_days / totalDuration) * 100 
                : 0;
              return (
                <div
                  key={index}
                  className="truncate text-muted-foreground"
                  style={{ width: `${width}%` }}
                >
                  {stage.stage_name}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Warning if duration mismatch */}
      {Math.abs(durationDiff) > 14 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-100">
              Thời gian không khớp
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              Tổng thời gian các giai đoạn ({totalDuration} ngày) khác khuyến nghị
              ({expectedDuration} ngày). Điều chỉnh nếu cần thiết.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={handleResetToDefault}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Đặt lại mặc định
        </Button>
        <Button variant="outline" size="sm" onClick={handleAddStage}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm giai đoạn
        </Button>
      </div>

      {/* Stages list */}
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <StageItem
            key={index}
            stage={stage}
            index={index}
            totalDuration={totalDuration}
            onUpdate={(updates) => handleStageUpdate(index, updates)}
            onDelete={() => handleStageDelete(index)}
            onMoveUp={() => handleMoveUp(index)}
            onMoveDown={() => handleMoveDown(index)}
            isFirst={index === 0}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onPrev}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit} disabled={stages.length === 0}>
          {isLastStep ? 'Tạo chu kỳ' : 'Tiếp tục'}
        </Button>
      </div>
    </div>
  );
}
