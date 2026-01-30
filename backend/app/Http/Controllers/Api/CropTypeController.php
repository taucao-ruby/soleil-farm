<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CropType\StoreCropTypeRequest;
use App\Http\Requests\CropType\UpdateCropTypeRequest;
use App\Http\Resources\CropTypeResource;
use App\Models\CropType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CropTypeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = CropType::with('defaultYieldUnit');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        return CropTypeResource::collection($query->get());
    }

    public function store(StoreCropTypeRequest $request): CropTypeResource
    {
        $validated = $request->validated();

        $cropType = CropType::create($validated);
        $cropType->load('defaultYieldUnit');

        return new CropTypeResource($cropType);
    }

    public function show(CropType $cropType): CropTypeResource
    {
        $cropType->load('defaultYieldUnit');

        return new CropTypeResource($cropType);
    }

    public function update(UpdateCropTypeRequest $request, CropType $cropType): CropTypeResource
    {
        $validated = $request->validated();

        $cropType->update($validated);
        $cropType->load('defaultYieldUnit');

        return new CropTypeResource($cropType);
    }

    public function destroy(CropType $cropType): JsonResponse
    {
        $cropType->update(['is_active' => false]);

        return response()->json(['message' => 'Crop type deactivated successfully.']);
    }

    public function statistics(CropType $cropType): JsonResponse
    {
        $stats = [
            'average_yield' => $cropType->getAverageYield(),
            'completed_cycles' => $cropType->getCompletedCyclesCount(),
            'active_cycles' => $cropType->cropCycles()->where('status', 'active')->count(),
        ];

        return response()->json(['data' => $stats]);
    }
}
