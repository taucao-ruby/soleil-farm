<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'activity_type_id' => $this->activity_type_id,
            'activity_type' => new ActivityTypeResource($this->whenLoaded('activityType')),
            'crop_cycle_id' => $this->crop_cycle_id,
            'crop_cycle' => new CropCycleResource($this->whenLoaded('cropCycle')),
            'land_parcel_id' => $this->land_parcel_id,
            'land_parcel' => new LandParcelResource($this->whenLoaded('landParcel')),
            'water_source_id' => $this->water_source_id,
            'water_source' => new WaterSourceResource($this->whenLoaded('waterSource')),
            'activity_date' => $this->activity_date?->toDateString(),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'description' => $this->description,
            'quantity_value' => $this->quantity_value ? (float) $this->quantity_value : null,
            'quantity_unit_id' => $this->quantity_unit_id,
            'quantity_unit' => new UnitOfMeasureResource($this->whenLoaded('quantityUnit')),
            'cost_value' => $this->cost_value ? (float) $this->cost_value : null,
            'cost_unit_id' => $this->cost_unit_id,
            'cost_unit' => new UnitOfMeasureResource($this->whenLoaded('costUnit')),
            'performed_by' => $this->performed_by,
            'weather_conditions' => $this->weather_conditions,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
