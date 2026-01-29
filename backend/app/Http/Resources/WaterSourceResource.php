<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WaterSourceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'source_type' => $this->source_type,
            'description' => $this->description,
            'latitude' => $this->latitude ? (float) $this->latitude : null,
            'longitude' => $this->longitude ? (float) $this->longitude : null,
            'reliability' => $this->reliability,
            'water_quality' => $this->water_quality,
            'is_active' => $this->is_active,
            'pivot' => $this->when($this->pivot, [
                'accessibility' => $this->pivot?->accessibility,
                'is_primary_source' => $this->pivot?->is_primary_source,
                'notes' => $this->pivot?->notes,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
