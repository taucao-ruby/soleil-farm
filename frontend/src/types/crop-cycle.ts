/**
 * Domain Types - Crop Cycles
 * ==========================
 * Types for crop cycle management
 */

import type { Timestamps } from './api';

export type CropCycleStatus =
  | 'planned'
  | 'in_progress'
  | 'harvesting'
  | 'completed'
  | 'cancelled';

export interface CropCycle extends Timestamps {
  id: number;
  land_parcel_id: number;
  crop_type_id: number;
  season_id: number;
  name: string;
  status: CropCycleStatus;
  planned_start_date: string;
  actual_start_date: string | null;
  planned_end_date: string;
  actual_end_date: string | null;
  notes: string | null;
}

export interface CropCycleStage extends Timestamps {
  id: number;
  crop_cycle_id: number;
  stage_name: string;
  stage_order: number;
  planned_start_date: string;
  actual_start_date: string | null;
  planned_end_date: string;
  actual_end_date: string | null;
  notes: string | null;
}

export interface CropCycleCreateInput {
  land_parcel_id: number;
  crop_type_id: number;
  season_id: number;
  name: string;
  planned_start_date: string;
  planned_end_date: string;
  notes?: string;
}

export interface CropCycleUpdateInput extends Partial<CropCycleCreateInput> {
  status?: CropCycleStatus;
  actual_start_date?: string;
  actual_end_date?: string;
}
