<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function store(Request $request): CropTypeResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:30|unique:crop_types,code',
            'scientific_name' => 'nullable|string|max:150',
            'variety' => 'nullable|string|max:100',
            'category' => 'required|in:grain,vegetable,fruit,legume,tuber,herb,flower,fodder,other',
            'description' => 'nullable|string',
            'typical_grow_duration_days' => 'nullable|integer|min:1',
            'default_yield_unit_id' => 'nullable|exists:units_of_measure,id',
            'is_active' => 'nullable|boolean',
        ]);

        $cropType = CropType::create($validated);
        $cropType->load('defaultYieldUnit');

        return new CropTypeResource($cropType);
    }

    public function show(CropType $cropType): CropTypeResource
    {
        $cropType->load('defaultYieldUnit');

        return new CropTypeResource($cropType);
    }

    public function update(Request $request, CropType $cropType): CropTypeResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30|unique:crop_types,code,' . $cropType->id,
            'scientific_name' => 'nullable|string|max:150',
            'variety' => 'nullable|string|max:100',
            'category' => 'sometimes|in:grain,vegetable,fruit,legume,tuber,herb,flower,fodder,other',
            'description' => 'nullable|string',
            'typical_grow_duration_days' => 'nullable|integer|min:1',
            'default_yield_unit_id' => 'nullable|exists:units_of_measure,id',
            'is_active' => 'nullable|boolean',
        ]);

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
