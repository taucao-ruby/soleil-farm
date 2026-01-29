<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Http\Resources\CropCycleResource;
use App\Http\Resources\LandParcelResource;
use App\Http\Resources\WaterSourceResource;
use App\Models\LandParcel;
use App\Models\LandParcelWaterSource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LandParcelController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = LandParcel::with('areaUnit');

        if ($request->has('land_type')) {
            $query->where('land_type', $request->land_type);
        }

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        return LandParcelResource::collection($query->get());
    }

    public function store(Request $request): LandParcelResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:30|unique:land_parcels,code',
            'description' => 'nullable|string',
            'land_type' => 'required|in:rice_field,garden,fish_pond,mixed,fallow,other',
            'area_value' => 'required|numeric|min:0',
            'area_unit_id' => 'required|exists:units_of_measure,id',
            'terrain_type' => 'nullable|in:flat,sloped,terraced,lowland',
            'soil_type' => 'nullable|in:clay,sandy,loamy,alluvial,mixed',
            'latitude' => 'nullable|numeric|min:-90|max:90',
            'longitude' => 'nullable|numeric|min:-180|max:180',
            'is_active' => 'nullable|boolean',
        ]);

        $landParcel = LandParcel::create($validated);
        $landParcel->load('areaUnit');

        return new LandParcelResource($landParcel);
    }

    public function show(LandParcel $landParcel): LandParcelResource
    {
        $landParcel->load(['areaUnit', 'waterSources']);

        return new LandParcelResource($landParcel);
    }

    public function update(Request $request, LandParcel $landParcel): LandParcelResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30|unique:land_parcels,code,' . $landParcel->id,
            'description' => 'nullable|string',
            'land_type' => 'sometimes|in:rice_field,garden,fish_pond,mixed,fallow,other',
            'area_value' => 'sometimes|numeric|min:0',
            'area_unit_id' => 'sometimes|exists:units_of_measure,id',
            'terrain_type' => 'nullable|in:flat,sloped,terraced,lowland',
            'soil_type' => 'nullable|in:clay,sandy,loamy,alluvial,mixed',
            'latitude' => 'nullable|numeric|min:-90|max:90',
            'longitude' => 'nullable|numeric|min:-180|max:180',
            'is_active' => 'nullable|boolean',
        ]);

        $landParcel->update($validated);
        $landParcel->load('areaUnit');

        return new LandParcelResource($landParcel);
    }

    public function destroy(LandParcel $landParcel): JsonResponse
    {
        if ($landParcel->hasActiveCropCycle()) {
            return response()->json([
                'message' => 'Cannot deactivate land parcel with active crop cycles.'
            ], 422);
        }

        $landParcel->update(['is_active' => false]);

        return response()->json(['message' => 'Land parcel deactivated successfully.']);
    }

    public function waterSources(LandParcel $landParcel): AnonymousResourceCollection
    {
        return WaterSourceResource::collection($landParcel->waterSources);
    }

    public function attachWaterSource(Request $request, LandParcel $landParcel): JsonResponse
    {
        $validated = $request->validate([
            'water_source_id' => 'required|exists:water_sources,id',
            'accessibility' => 'nullable|in:direct,pumped,gravity_fed,manual',
            'is_primary_source' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        // Check if already attached
        if ($landParcel->waterSources()->where('water_source_id', $validated['water_source_id'])->exists()) {
            return response()->json(['message' => 'Water source already attached.'], 422);
        }

        $landParcel->waterSources()->attach($validated['water_source_id'], [
            'accessibility' => $validated['accessibility'] ?? 'direct',
            'is_primary_source' => $validated['is_primary_source'] ?? false,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['message' => 'Water source attached successfully.']);
    }

    public function detachWaterSource(LandParcel $landParcel, int $waterSource): JsonResponse
    {
        $landParcel->waterSources()->detach($waterSource);

        return response()->json(['message' => 'Water source detached successfully.']);
    }

    public function cropCycles(LandParcel $landParcel): AnonymousResourceCollection
    {
        return CropCycleResource::collection(
            $landParcel->cropCycles()->with(['cropType', 'season'])->get()
        );
    }

    public function activityLogs(LandParcel $landParcel): AnonymousResourceCollection
    {
        return ActivityLogResource::collection(
            $landParcel->activityLogs()
                ->with(['activityType', 'cropCycle'])
                ->orderBy('activity_date', 'desc')
                ->get()
        );
    }
}
