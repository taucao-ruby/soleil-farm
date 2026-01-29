<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CropTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'scientific_name' => $this->scientific_name,
            'variety' => $this->variety,
            'category' => $this->category,
            'description' => $this->description,
            'typical_grow_duration_days' => $this->typical_grow_duration_days,
            'default_yield_unit_id' => $this->default_yield_unit_id,
            'default_yield_unit' => new UnitOfMeasureResource($this->whenLoaded('defaultYieldUnit')),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
