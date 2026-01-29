<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SeasonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'season_definition_id' => $this->season_definition_id,
            'season_definition' => new SeasonDefinitionResource($this->whenLoaded('seasonDefinition')),
            'year' => $this->year,
            'full_name' => $this->whenLoaded('seasonDefinition', fn() => $this->full_name),
            'actual_start_date' => $this->actual_start_date?->toDateString(),
            'actual_end_date' => $this->actual_end_date?->toDateString(),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
