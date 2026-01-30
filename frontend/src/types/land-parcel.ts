/**
 * Domain Types - Land Parcels
 * ===========================
 * Types for land parcel management
 */

import type { Timestamps } from './api';

export interface LandParcel extends Timestamps {
  id: number;
  code: string;
  name: string;
  description: string | null;
  area_value: number;
  area_unit_id: number;
  location_description: string | null;
  gps_coordinates: string | null;
  soil_type: string | null;
  is_active: boolean;
}

export interface LandParcelCreateInput {
  code: string;
  name: string;
  description?: string;
  area_value: number;
  area_unit_id: number;
  location_description?: string;
  gps_coordinates?: string;
  soil_type?: string;
}

export interface LandParcelUpdateInput extends Partial<LandParcelCreateInput> {
  is_active?: boolean;
}
