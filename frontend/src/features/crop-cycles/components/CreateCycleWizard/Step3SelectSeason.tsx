/**
 * Step 3: Select Season
 * ======================
 * Calendar view with optimal planting periods
 */

import { useState } from 'react';
import { Calendar, Check, Loader2, AlertCircle, Sun, Cloud, Droplets } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSeasons } from '@/hooks/api';
import { cn } from '@/lib/utils';

import type { WizardStepProps } from './types';

// Season icons and colors
const SEASON_CONFIG: Record<string, { icon: React.ReactNode; bg: string; description: string }> = {
  'Đông Xuân': {
    icon: <Sun className="h-5 w-5" />,
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    description: 'Mùa vụ chính, thời tiết thuận lợi',
  },
  'Hè Thu': {
    icon: <Droplets className="h-5 w-5" />,
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Mùa mưa, cần chú ý thoát nước',
  },
  'Thu Đông': {
    icon: <Cloud className="h-5 w-5" />,
    bg: 'bg-gray-100 dark:bg-gray-800',
    description: 'Mùa vụ phụ, thời tiết se lạnh',
  },
  'default': {
    icon: <Calendar className="h-5 w-5" />,
    bg: 'bg-muted',
    description: '',
  },
};

function getSeasonConfig(name: string) {
  for (const [key, value] of Object.entries(SEASON_CONFIG)) {
    if (name.includes(key)) {
      return value;
    }
  }
  return SEASON_CONFIG.default;
}

interface SeasonCardProps {
  season: {
    id: number;
    name: string;
    year: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
  };
  isSelected: boolean;
  isOptimal: boolean;
  onSelect: () => void;
}

function SeasonCard({ season, isSelected, isOptimal, onSelect }: SeasonCardProps) {
  const config = getSeasonConfig(season.name);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md relative',
        isSelected && 'ring-2 ring-primary border-primary',
        !season.is_active && 'opacity-50'
      )}
      onClick={() => season.is_active && onSelect()}
    >
      {isOptimal && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-green-500 text-white text-xs">
            Khuyến nghị
          </Badge>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isSelected ? 'bg-primary text-primary-foreground' : config.bg
            )}
          >
            {isSelected ? <Check className="h-5 w-5" /> : config.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{season.name}</p>
              <Badge variant="outline" className="text-xs">
                {season.year}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {config.description}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground">Bắt đầu:</span>
                <span className="ml-1 font-medium">{formatDate(season.start_date)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Kết thúc:</span>
                <span className="ml-1 font-medium">{formatDate(season.end_date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual timeline */}
        <div className="mt-3 relative h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'absolute h-full rounded-full transition-all',
              isSelected ? 'bg-primary' : 'bg-primary/50'
            )}
            style={{ width: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function Step3SelectSeason({
  data,
  onUpdate,
  onNext,
  onPrev,
}: WizardStepProps) {
  const [selectedId, setSelectedId] = useState<number | null>(data.season_id);

  const { data: seasonsData, isLoading, error } = useSeasons({ is_active: true });

  // Determine optimal season based on selected crop type
  const getOptimalSeasons = () => {
    // In real implementation, this would be based on crop type requirements
    // For now, mark first season as optimal
    return [1];
  };

  const optimalSeasons = getOptimalSeasons();

  const handleSelect = (season: { id: number; name: string }) => {
    setSelectedId(season.id);
    onUpdate({
      season_id: season.id,
      season_name: season.name,
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
        <p>Không thể tải danh sách mùa vụ</p>
      </div>
    );
  }

  const seasons = seasonsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Chọn mùa vụ</h3>
        <p className="text-sm text-muted-foreground">
          Chọn mùa vụ cho chu kỳ canh tác. Các mùa được đánh dấu "Khuyến nghị" phù hợp
          nhất với loại cây đã chọn.
        </p>
      </div>

      {/* Crop info reminder */}
      {data.crop_type && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm">
          <span className="text-muted-foreground">Đang chọn cho:</span>
          <Badge variant="secondary">{data.crop_type.name}</Badge>
          {data.crop_type.growth_duration_days && (
            <span className="text-muted-foreground">
              ({data.crop_type.growth_duration_days} ngày)
            </span>
          )}
        </div>
      )}

      {/* Seasons Grid */}
      {seasons.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có mùa vụ nào được đăng ký</p>
          <p className="text-sm mt-1">
            Vui lòng thêm mùa vụ trước khi tạo chu kỳ canh tác
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {seasons.map((season) => (
            <SeasonCard
              key={season.id}
              season={season}
              isSelected={selectedId === season.id}
              isOptimal={optimalSeasons.includes(season.id)}
              onSelect={() => handleSelect(season)}
            />
          ))}
        </div>
      )}

      {/* Calendar visualization hint */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Gợi ý lập kế hoạch
            </p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              Thời điểm gieo trồng lý tưởng thường vào đầu mùa vụ. Bạn sẽ thiết lập
              ngày cụ thể ở bước tiếp theo.
            </p>
          </div>
        </div>
      </div>

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
