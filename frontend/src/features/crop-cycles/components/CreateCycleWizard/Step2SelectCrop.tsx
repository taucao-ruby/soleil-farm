/**
 * Step 2: Select Crop Type
 * =========================
 * Grid view with crop images and typical duration
 */

import { useState } from 'react';
import { Sprout, Check, Loader2, AlertCircle, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import type { WizardStepProps } from './types';
import type { CropType } from '@/schemas';

// Mock data - in real implementation, this would come from an API
const MOCK_CROP_TYPES: CropType[] = [
  {
    id: 1,
    name: 'Lúa ST25',
    variety: 'ST25',
    growth_duration_days: 105,
    description: 'Gạo ST25 - Gạo ngon nhất thế giới 2019',
  },
  {
    id: 2,
    name: 'Lúa OM18',
    variety: 'OM18',
    growth_duration_days: 95,
    description: 'Giống lúa cao sản, kháng sâu bệnh tốt',
  },
  {
    id: 3,
    name: 'Lúa Jasmine',
    variety: 'Jasmine 85',
    growth_duration_days: 100,
    description: 'Gạo thơm Jasmine, phù hợp xuất khẩu',
  },
  {
    id: 4,
    name: 'Lúa IR50404',
    variety: 'IR50404',
    growth_duration_days: 90,
    description: 'Giống lúa ngắn ngày, năng suất cao',
  },
  {
    id: 5,
    name: 'Ngô lai',
    variety: 'NK7328',
    growth_duration_days: 110,
    description: 'Ngô lai năng suất cao, chịu hạn tốt',
  },
  {
    id: 6,
    name: 'Đậu phộng',
    variety: 'L14',
    growth_duration_days: 95,
    description: 'Đậu phộng vỏ mỏng, hạt to',
  },
];

// Crop icons/colors based on type
const CROP_ICONS: Record<string, { bg: string; icon: string }> = {
  'Lúa': { bg: 'bg-green-100 dark:bg-green-900', icon: '🌾' },
  'Ngô': { bg: 'bg-yellow-100 dark:bg-yellow-900', icon: '🌽' },
  'Đậu': { bg: 'bg-amber-100 dark:bg-amber-900', icon: '🥜' },
  'Rau': { bg: 'bg-emerald-100 dark:bg-emerald-900', icon: '🥬' },
  'default': { bg: 'bg-primary/10', icon: '🌱' },
};

function getCropIcon(name: string) {
  for (const [key, value] of Object.entries(CROP_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return CROP_ICONS.default;
}

interface CropCardProps {
  crop: CropType;
  isSelected: boolean;
  onSelect: () => void;
}

function CropCard({ crop, isSelected, onSelect }: CropCardProps) {
  const iconConfig = getCropIcon(crop.name);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary border-primary'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
              iconConfig.bg
            )}
          >
            {isSelected ? (
              <Check className="h-6 w-6 text-primary" />
            ) : (
              iconConfig.icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium truncate">{crop.name}</p>
              {crop.variety && (
                <Badge variant="secondary" className="text-xs ml-2">
                  {crop.variety}
                </Badge>
              )}
            </div>
            {crop.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {crop.description}
              </p>
            )}
          </div>
        </div>

        {crop.growth_duration_days && (
          <div className="mt-3 pt-3 border-t flex items-center text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-muted-foreground">Thời gian sinh trưởng:</span>
            <span className="ml-1 font-medium">{crop.growth_duration_days} ngày</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Step2SelectCrop({
  data,
  onUpdate,
  onNext,
  onPrev,
}: WizardStepProps) {
  const [selectedId, setSelectedId] = useState<number | null>(data.crop_type_id);
  const [searchQuery, setSearchQuery] = useState('');

  // In real implementation, use useQuery to fetch crop types
  const cropTypes = MOCK_CROP_TYPES;
  const isLoading = false;
  const error = null;

  const filteredCrops = cropTypes.filter((crop) =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crop.variety?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (crop: CropType) => {
    setSelectedId(crop.id);
    onUpdate({
      crop_type_id: crop.id,
      crop_type: crop,
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
        <p>Không thể tải danh sách loại cây trồng</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Chọn loại cây trồng</h3>
        <p className="text-sm text-muted-foreground">
          Chọn loại cây bạn muốn trồng trong chu kỳ này
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm loại cây..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Crop Grid */}
      {filteredCrops.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Sprout className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Không tìm thấy loại cây phù hợp</p>
          <p className="text-sm mt-1">
            Thử tìm kiếm với từ khóa khác
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              isSelected={selectedId === crop.id}
              onSelect={() => handleSelect(crop)}
            />
          ))}
        </div>
      )}

      {/* Selected crop info */}
      {selectedId && data.crop_type && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">Đã chọn:</p>
          <p className="text-lg font-semibold">{data.crop_type.name}</p>
          {data.crop_type.growth_duration_days && (
            <p className="text-sm text-muted-foreground">
              Thời gian sinh trưởng dự kiến: {data.crop_type.growth_duration_days} ngày
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onPrev}>
          Quay lại
        </Button>
        <Button onClick={handleNext} disabled={!selectedId}>
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
