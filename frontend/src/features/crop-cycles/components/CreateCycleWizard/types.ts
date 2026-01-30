/**
 * Create Cycle Wizard Types
 * ==========================
 * Shared types for the create cycle wizard
 */

import type { CropType } from '@/schemas';

export interface WizardStageConfig {
  stage_name: string;
  stage_order: number;
  planned_duration_days: number;
  planned_start_date?: string;
  planned_end_date?: string;
  notes?: string;
}

export interface WizardFormData {
  // Step 1: Land Parcel
  land_parcel_id: number | null;
  land_parcel_name?: string;

  // Step 2: Crop Type
  crop_type_id: number | null;
  crop_type?: CropType;

  // Step 3: Season
  season_id: number | null;
  season_name?: string;

  // Step 4: Dates
  name: string;
  planned_start_date: string;
  planned_end_date: string;
  expected_yield?: number;
  yield_unit_id?: number;
  notes?: string;

  // Step 5: Stages
  stages: WizardStageConfig[];
}

export const initialWizardData: WizardFormData = {
  land_parcel_id: null,
  crop_type_id: null,
  season_id: null,
  name: '',
  planned_start_date: '',
  planned_end_date: '',
  stages: [],
};

export interface WizardStepProps {
  data: WizardFormData;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const WIZARD_STEPS = [
  {
    id: 1,
    title: 'Chọn lô đất',
    description: 'Chọn lô đất để canh tác',
    icon: 'map-pin',
  },
  {
    id: 2,
    title: 'Chọn loại cây',
    description: 'Chọn loại cây trồng',
    icon: 'sprout',
  },
  {
    id: 3,
    title: 'Chọn mùa vụ',
    description: 'Chọn mùa vụ canh tác',
    icon: 'calendar',
  },
  {
    id: 4,
    title: 'Thiết lập ngày',
    description: 'Đặt thời gian bắt đầu và kết thúc',
    icon: 'clock',
  },
  {
    id: 5,
    title: 'Cấu hình giai đoạn',
    description: 'Thiết lập các giai đoạn phát triển',
    icon: 'list-checks',
  },
] as const;

export type WizardStepId = (typeof WIZARD_STEPS)[number]['id'];
