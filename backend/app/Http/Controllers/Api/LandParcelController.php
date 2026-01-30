<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LandParcel\AttachWaterSourceRequest;
use App\Http\Requests\LandParcel\StoreLandParcelRequest;
use App\Http\Requests\LandParcel\UpdateLandParcelRequest;
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

    public function store(StoreLandParcelRequest $request): LandParcelResource
    {
        $validated = $request->validated();

        $landParcel = LandParcel::create($validated);
        $landParcel->load('areaUnit');

        return new LandParcelResource($landParcel);
    }

    public function show(LandParcel $landParcel): LandParcelResource
    {
        $landParcel->load(['areaUnit', 'waterSources']);

        return new LandParcelResource($landParcel);
    }

    public function update(UpdateLandParcelRequest $request, LandParcel $landParcel): LandParcelResource
    {
        $validated = $request->validated();

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

    public function attachWaterSource(AttachWaterSourceRequest $request, LandParcel $landParcel): JsonResponse
    {
        $validated = $request->validated();

        // Check if already attached
        if ($landParcel->waterSources()->where('water_source_id', $validated['water_source_id'])->exists()) {
            return response()->json(['message' => 'Nguồn nước đã được gắn với lô đất này.'], 422);
        }

        $landParcel->waterSources()->attach($validated['water_source_id'], [
            'accessibility' => $validated['accessibility'] ?? 'direct',
            'is_primary_source' => $validated['is_primary_source'] ?? false,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['message' => 'Đã gắn nguồn nước thành công.']);
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
