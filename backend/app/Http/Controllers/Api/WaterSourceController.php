<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LandParcelResource;
use App\Http\Resources\WaterSourceResource;
use App\Models\WaterSource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WaterSourceController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = WaterSource::query();

        if ($request->has('source_type')) {
            $query->where('source_type', $request->source_type);
        }

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        return WaterSourceResource::collection($query->get());
    }

    public function store(Request $request): WaterSourceResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:30|unique:water_sources,code',
            'source_type' => 'required|in:well,river,stream,pond,irrigation_canal,rainwater,municipal',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric|min:-90|max:90',
            'longitude' => 'nullable|numeric|min:-180|max:180',
            'reliability' => 'nullable|in:permanent,seasonal,intermittent',
            'water_quality' => 'nullable|in:excellent,good,fair,poor',
            'is_active' => 'nullable|boolean',
        ]);

        $waterSource = WaterSource::create($validated);

        return new WaterSourceResource($waterSource);
    }

    public function show(WaterSource $waterSource): WaterSourceResource
    {
        return new WaterSourceResource($waterSource);
    }

    public function update(Request $request, WaterSource $waterSource): WaterSourceResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30|unique:water_sources,code,' . $waterSource->id,
            'source_type' => 'sometimes|in:well,river,stream,pond,irrigation_canal,rainwater,municipal',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric|min:-90|max:90',
            'longitude' => 'nullable|numeric|min:-180|max:180',
            'reliability' => 'nullable|in:permanent,seasonal,intermittent',
            'water_quality' => 'nullable|in:excellent,good,fair,poor',
            'is_active' => 'nullable|boolean',
        ]);

        $waterSource->update($validated);

        return new WaterSourceResource($waterSource);
    }

    public function destroy(WaterSource $waterSource): JsonResponse
    {
        $waterSource->update(['is_active' => false]);

        return response()->json(['message' => 'Water source deactivated successfully.']);
    }

    public function landParcels(WaterSource $waterSource): AnonymousResourceCollection
    {
        return LandParcelResource::collection($waterSource->landParcels);
    }
}
