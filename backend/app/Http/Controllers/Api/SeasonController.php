<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SeasonResource;
use App\Models\Season;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SeasonController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Season::with('seasonDefinition');

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        return SeasonResource::collection($query->orderBy('year', 'desc')->get());
    }

    public function store(Request $request): SeasonResource
    {
        $validated = $request->validate([
            'season_definition_id' => 'required|exists:season_definitions,id',
            'year' => 'required|integer|min:2000|max:2100',
            'actual_start_date' => 'nullable|date',
            'actual_end_date' => 'nullable|date|after_or_equal:actual_start_date',
            'notes' => 'nullable|string',
        ]);

        $season = Season::create($validated);
        $season->load('seasonDefinition');

        return new SeasonResource($season);
    }

    public function show(Season $season): SeasonResource
    {
        $season->load('seasonDefinition');

        return new SeasonResource($season);
    }

    public function update(Request $request, Season $season): SeasonResource
    {
        $validated = $request->validate([
            'season_definition_id' => 'sometimes|exists:season_definitions,id',
            'year' => 'sometimes|integer|min:2000|max:2100',
            'actual_start_date' => 'nullable|date',
            'actual_end_date' => 'nullable|date|after_or_equal:actual_start_date',
            'notes' => 'nullable|string',
        ]);

        $season->update($validated);
        $season->load('seasonDefinition');

        return new SeasonResource($season);
    }

    public function destroy(Season $season): JsonResponse
    {
        if ($season->cropCycles()->exists()) {
            return response()->json([
                'message' => 'Cannot delete season with existing crop cycles.'
            ], 422);
        }

        $season->delete();

        return response()->json(['message' => 'Season deleted successfully.']);
    }

    public function byYear(int $year): AnonymousResourceCollection
    {
        $seasons = Season::with('seasonDefinition')
            ->where('year', $year)
            ->get();

        return SeasonResource::collection($seasons);
    }

    public function current(): JsonResponse
    {
        $today = now()->toDateString();
        
        $season = Season::with('seasonDefinition')
            ->where('actual_start_date', '<=', $today)
            ->where('actual_end_date', '>=', $today)
            ->first();

        if (!$season) {
            return response()->json(['data' => null, 'message' => 'No current season found.']);
        }

        return response()->json(['data' => new SeasonResource($season)]);
    }
}
