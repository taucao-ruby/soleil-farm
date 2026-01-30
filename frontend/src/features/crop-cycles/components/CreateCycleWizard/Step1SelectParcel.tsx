/**
 * Step 1: Select Land Parcel
 * ===========================
 * Display available parcels with hover details
 */

import { useState } from 'react';
import { MapPin, Check, AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLandParcels } from '@/hooks/api';
import { cn } from '@/lib/utils';

import type { WizardStepProps } from './types';

interface ParcelCardProps {
  parcel: {
    id: number;
    code: string;
    name: string;
    area_value: number;
    soil_type?: string | null;
    location_description?: string | null;
    is_active: boolean;
  };
  isSelected: boolean;
  isAvailable: boolean;
  onSelect: () => void;
}

function ParcelCard({ parcel, isSelected, isAvailable, onSelect }: ParcelCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              isSelected && 'ring-2 ring-primary border-primary',
              !isAvailable && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => isAvailable && onSelect()}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{parcel.name}</p>
                    <p className="text-sm text-muted-foreground">{parcel.code}</p>
                  </div>
                </div>
                {!isAvailable && (
                  <Badge variant="destructive" className="text-xs">
                    Đang sử dụng
                  </Badge>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Diện tích:</span>
                  <span className="ml-1 font-medium">{parcel.area_value} m²</span>
                </div>
                {parcel.soil_type && (
                  <div>
                    <span className="text-muted-foreground">Đất:</span>
                    <span className="ml-1 font-medium">{parcel.soil_type}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">{parcel.name}</p>
            <p className="text-sm">Mã: {parcel.code}</p>
            <p className="text-sm">Diện tích: {parcel.area_value} m²</p>
            {parcel.soil_type && (
              <p className="text-sm">Loại đất: {parcel.soil_type}</p>
            )}
            {parcel.location_description && (
              <p className="text-sm">Vị trí: {parcel.location_description}</p>
            )}
            {!isAvailable && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Lô đất đang có chu kỳ hoạt động
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function Step1SelectParcel({
  data,
  onUpdate,
  onNext,
  isFirstStep,
}: WizardStepProps) {
  const [selectedId, setSelectedId] = useState<number | null>(data.land_parcel_id);

  const { data: parcelsData, isLoading, error } = useLandParcels({ is_active: true });

  const handleSelect = (parcel: { id: number; name: string }) => {
    setSelectedId(parcel.id);
    onUpdate({
      land_parcel_id: parcel.id,
      land_parcel_name: parcel.name,
    });
  };

  const handleNext = () => {
    if (selectedId) {
      onNext();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Không thể tải danh sách lô đất</p>
      </div>
    );
  }

  const parcels = parcelsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Chọn lô đất canh tác</h3>
        <p className="text-sm text-muted-foreground">
          Chọn lô đất bạn muốn sử dụng cho chu kỳ canh tác mới
        </p>
      </div>

      {/* Parcels Grid */}
      {parcels.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có lô đất nào được đăng ký</p>
          <p className="text-sm mt-1">
            Vui lòng thêm lô đất trước khi tạo chu kỳ canh tác
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parcels.map((parcel) => (
            <ParcelCard
              key={parcel.id}
              parcel={parcel}
              isSelected={selectedId === parcel.id}
              isAvailable={parcel.is_active}
              onSelect={() => handleSelect(parcel)}
            />
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" disabled={isFirstStep}>
          Quay lại
        </Button>
        <Button onClick={handleNext} disabled={!selectedId}>
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
