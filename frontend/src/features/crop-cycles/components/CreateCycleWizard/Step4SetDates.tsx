/**
 * Step 4: Set Dates
 * ==================
 * Configure planned start/end dates with validation
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { useCropCycleValidation } from '../../hooks/useCropCycleValidation';
import type { WizardStepProps } from './types';

export function Step4SetDates({
  data,
  onUpdate,
  onNext,
  onPrev,
}: WizardStepProps) {
  const [name, setName] = useState(data.name || '');
  const [startDate, setStartDate] = useState(data.planned_start_date || '');
  const [endDate, setEndDate] = useState(data.planned_end_date || '');
  const [notes, setNotes] = useState(data.notes || '');

  // Auto-generate name if empty
  useEffect(() => {
    if (!name && data.season_name && data.land_parcel_name) {
      const generatedName = `${data.season_name} - ${data.land_parcel_name}`;
      setName(generatedName);
      onUpdate({ name: generatedName });
    }
  }, [data.season_name, data.land_parcel_name, name, onUpdate]);

  // Auto-calculate end date based on crop type duration
  useEffect(() => {
    if (startDate && data.crop_type?.growth_duration_days && !endDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + data.crop_type.growth_duration_days);
      const calculatedEnd = end.toISOString().split('T')[0];
      setEndDate(calculatedEnd);
      onUpdate({ planned_end_date: calculatedEnd });
    }
  }, [startDate, data.crop_type, endDate, onUpdate]);

  // Validation
  const validation = useCropCycleValidation({
    landParcelId: data.land_parcel_id || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Calculate duration
  const duration = useMemo(() => {
    if (!startDate || !endDate) return null;
    return validation.calculateDuration(startDate, endDate);
  }, [startDate, endDate, validation]);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    onUpdate({ planned_start_date: value });

    // Auto-update end date if crop type has duration
    if (value && data.crop_type?.growth_duration_days) {
      const calculatedEnd = validation.calculateEndDate(
        value,
        data.crop_type.growth_duration_days
      );
      setEndDate(calculatedEnd);
      onUpdate({ planned_end_date: calculatedEnd });
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    onUpdate({ planned_end_date: value });
  };

  const handleNameChange = (value: string) => {
    setName(value);
    onUpdate({ name: value });
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    onUpdate({ notes: value });
  };

  const handleNext = () => {
    if (validation.valid && name && startDate && endDate) {
      onNext();
    }
  };

  const isValid = validation.valid && name.trim() && startDate && endDate;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Thiết lập thời gian</h3>
        <p className="text-sm text-muted-foreground">
          Đặt tên và thời gian cho chu kỳ canh tác
        </p>
      </div>

      {/* Summary of previous selections */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
        <Badge variant="secondary">{data.land_parcel_name}</Badge>
        <Badge variant="secondary">{data.crop_type?.name}</Badge>
        <Badge variant="secondary">{data.season_name}</Badge>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        {/* Cycle Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Tên chu kỳ *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="VD: Vụ Đông Xuân 2026 - Lô A1"
            className={cn(!name.trim() && 'border-destructive')}
          />
          <p className="text-xs text-muted-foreground">
            Tên mô tả ngắn gọn để nhận diện chu kỳ
          </p>
        </div>

        {/* Date inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start-date">Ngày bắt đầu *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Ngày kết thúc *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                min={startDate}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Duration info */}
        {duration !== null && (
          <Card className={cn(
            'border-l-4',
            validation.valid ? 'border-l-green-500' : 'border-l-amber-500'
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Thời gian chu kỳ: <span className="text-primary">{duration} ngày</span>
                  </span>
                </div>
                {data.crop_type?.growth_duration_days && (
                  <Badge variant={duration === data.crop_type.growth_duration_days ? 'default' : 'outline'}>
                    Khuyến nghị: {data.crop_type.growth_duration_days} ngày
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Validation feedback */}
        {validation.isValidating && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Đang kiểm tra...</span>
          </div>
        )}

        {validation.errors.length > 0 && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Lỗi xác thực</p>
                  <ul className="mt-1 text-sm text-destructive list-disc list-inside">
                    {validation.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {validation.warnings.length > 0 && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-400">Lưu ý</p>
                  <ul className="mt-1 text-sm text-amber-600 dark:text-amber-300">
                    {validation.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {validation.valid && validation.errors.length === 0 && startDate && endDate && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">Thời gian hợp lệ, không có xung đột</span>
          </div>
        )}

        {/* Conflicting cycles info */}
        {validation.conflictingCycles.length > 0 && (
          <Card className="border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Chu kỳ xung đột
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {validation.conflictingCycles.map((cycle) => (
                  <li key={cycle.id} className="text-sm flex items-center justify-between p-2 bg-muted rounded">
                    <span>{cycle.name}</span>
                    <span className="text-muted-foreground">
                      {validation.formatDate(cycle.planned_start_date)} - {validation.formatDate(cycle.planned_end_date)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Thêm ghi chú về chu kỳ canh tác..."
            rows={3}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onPrev}>
          Quay lại
        </Button>
        <Button onClick={handleNext} disabled={!isValid}>
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
