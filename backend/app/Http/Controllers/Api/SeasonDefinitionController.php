<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SeasonDefinition\StoreSeasonDefinitionRequest;
use App\Http\Requests\SeasonDefinition\UpdateSeasonDefinitionRequest;
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

    public function store(StoreSeasonDefinitionRequest $request): SeasonDefinitionResource
    {
        $validated = $request->validated();

        $seasonDefinition = SeasonDefinition::create($validated);

        return new SeasonDefinitionResource($seasonDefinition);
    }

    public function show(SeasonDefinition $seasonDefinition): SeasonDefinitionResource
    {
        return new SeasonDefinitionResource($seasonDefinition);
    }

    public function update(UpdateSeasonDefinitionRequest $request, SeasonDefinition $seasonDefinition): SeasonDefinitionResource
    {
        $validated = $request->validated();

        $seasonDefinition->update($validated);

        return new SeasonDefinitionResource($seasonDefinition);
    }

    public function destroy(SeasonDefinition $seasonDefinition): JsonResponse
    {
        $seasonDefinition->update(['is_active' => false]);

        return response()->json(['message' => 'Season definition deactivated successfully.']);
    }
}
