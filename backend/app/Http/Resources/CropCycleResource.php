<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CropCycleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cycle_code' => $this->cycle_code,
            'land_parcel_id' => $this->land_parcel_id,
            'land_parcel' => new LandParcelResource($this->whenLoaded('landParcel')),
            'crop_type_id' => $this->crop_type_id,
            'crop_type' => new CropTypeResource($this->whenLoaded('cropType')),
            'season_id' => $this->season_id,
            'season' => new SeasonResource($this->whenLoaded('season')),
            'status' => $this->status,
            'planned_start_date' => $this->planned_start_date?->toDateString(),
            'planned_end_date' => $this->planned_end_date?->toDateString(),
            'actual_start_date' => $this->actual_start_date?->toDateString(),
            'actual_end_date' => $this->actual_end_date?->toDateString(),
            'yield_value' => $this->yield_value ? (float) $this->yield_value : null,
            'yield_unit_id' => $this->yield_unit_id,
            'yield_unit' => new UnitOfMeasureResource($this->whenLoaded('yieldUnit')),
            'quality_rating' => $this->quality_rating,
            'notes' => $this->notes,
            'duration_days' => $this->getDurationDays(),
            'is_overdue' => $this->isOverdue(),
            'stages' => CropCycleStageResource::collection($this->whenLoaded('stages')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
