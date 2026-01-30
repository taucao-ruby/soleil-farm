<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\WaterSource\StoreWaterSourceRequest;
use App\Http\Requests\WaterSource\UpdateWaterSourceRequest;
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

    public function store(StoreWaterSourceRequest $request): WaterSourceResource
    {
        $validated = $request->validated();

        $waterSource = WaterSource::create($validated);

        return new WaterSourceResource($waterSource);
    }

    public function show(WaterSource $waterSource): WaterSourceResource
    {
        return new WaterSourceResource($waterSource);
    }

    public function update(UpdateWaterSourceRequest $request, WaterSource $waterSource): WaterSourceResource
    {
        $validated = $request->validated();

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
