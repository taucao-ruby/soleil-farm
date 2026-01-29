<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeasonDefinitionResource;
use App\Models\SeasonDefinition;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SeasonDefinitionController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = SeasonDefinition::query();

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        return SeasonDefinitionResource::collection($query->get());
    }

    public function store(Request $request): SeasonDefinitionResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:20|unique:season_definitions,code',
            'description' => 'nullable|string',
            'typical_start_month' => 'required|integer|min:1|max:12',
            'typical_end_month' => 'required|integer|min:1|max:12',
            'is_active' => 'nullable|boolean',
        ]);

        $seasonDefinition = SeasonDefinition::create($validated);

        return new SeasonDefinitionResource($seasonDefinition);
    }

    public function show(SeasonDefinition $seasonDefinition): SeasonDefinitionResource
    {
        return new SeasonDefinitionResource($seasonDefinition);
    }

    public function update(Request $request, SeasonDefinition $seasonDefinition): SeasonDefinitionResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:20|unique:season_definitions,code,' . $seasonDefinition->id,
            'description' => 'nullable|string',
            'typical_start_month' => 'sometimes|integer|min:1|max:12',
            'typical_end_month' => 'sometimes|integer|min:1|max:12',
            'is_active' => 'nullable|boolean',
        ]);

        $seasonDefinition->update($validated);

        return new SeasonDefinitionResource($seasonDefinition);
    }

    public function destroy(SeasonDefinition $seasonDefinition): JsonResponse
    {
        $seasonDefinition->update(['is_active' => false]);

        return response()->json(['message' => 'Season definition deactivated successfully.']);
    }
}
