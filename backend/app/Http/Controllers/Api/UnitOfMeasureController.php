<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UnitOfMeasureResource;
use App\Models\UnitOfMeasure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UnitOfMeasureController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = UnitOfMeasure::query();

        if ($request->has('type')) {
            $query->where('unit_type', $request->type);
        }

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        return UnitOfMeasureResource::collection($query->get());
    }

    public function store(Request $request): UnitOfMeasureResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'abbreviation' => 'required|string|max:20',
            'unit_type' => 'required|in:area,weight,volume,quantity,currency,time',
            'conversion_factor_to_base' => 'nullable|numeric|min:0',
            'is_base_unit' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $unit = UnitOfMeasure::create($validated);

        return new UnitOfMeasureResource($unit);
    }

    public function show(UnitOfMeasure $unitOfMeasure): UnitOfMeasureResource
    {
        return new UnitOfMeasureResource($unitOfMeasure);
    }

    public function update(Request $request, UnitOfMeasure $unitOfMeasure): UnitOfMeasureResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'abbreviation' => 'sometimes|string|max:20',
            'unit_type' => 'sometimes|in:area,weight,volume,quantity,currency,time',
            'conversion_factor_to_base' => 'nullable|numeric|min:0',
            'is_base_unit' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $unitOfMeasure->update($validated);

        return new UnitOfMeasureResource($unitOfMeasure);
    }

    public function destroy(UnitOfMeasure $unitOfMeasure): JsonResponse
    {
        $unitOfMeasure->update(['is_active' => false]);

        return response()->json(['message' => 'Unit of measure deactivated successfully.']);
    }

    public function byType(string $type): AnonymousResourceCollection
    {
        $units = UnitOfMeasure::where('unit_type', $type)
            ->where('is_active', true)
            ->get();

        return UnitOfMeasureResource::collection($units);
    }
}
