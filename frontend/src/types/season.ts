/**
 * Domain Types - Seasons
 * ======================
 * Types for season management
 */

import type { Timestamps } from './api';

export interface SeasonDefinition extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  typical_start_month: number;
  typical_end_month: number;
}

export interface Season extends Timestamps {
  id: number;
  season_definition_id: number;
  year: number;
  name: string;
  start_date: string;
  end_date: string;
  notes: string | null;
  is_active: boolean;
}

export interface SeasonCreateInput {
  season_definition_id: number;
  year: number;
  name: string;
  start_date: string;
  end_date: string;
  notes?: string;
}

export interface SeasonUpdateInput extends Partial<SeasonCreateInput> {
  is_active?: boolean;
}
