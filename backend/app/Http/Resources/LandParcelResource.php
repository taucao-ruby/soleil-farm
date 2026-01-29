<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LandParcelResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'land_type' => $this->land_type,
            'area_value' => (float) $this->area_value,
            'area_unit_id' => $this->area_unit_id,
            'area_unit' => new UnitOfMeasureResource($this->whenLoaded('areaUnit')),
            'terrain_type' => $this->terrain_type,
            'soil_type' => $this->soil_type,
            'latitude' => $this->latitude ? (float) $this->latitude : null,
            'longitude' => $this->longitude ? (float) $this->longitude : null,
            'is_active' => $this->is_active,
            'has_active_crop_cycle' => $this->when(
                $this->relationLoaded('cropCycles'),
                fn() => $this->hasActiveCropCycle()
            ),
            'water_sources' => WaterSourceResource::collection($this->whenLoaded('waterSources')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
