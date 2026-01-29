<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InvalidStatusTransitionException;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Http\Resources\CropCycleResource;
use App\Models\CropCycle;
use App\Models\LandParcel;
use App\Services\CropCycleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CropCycleController extends Controller
{
    public function __construct(
        protected CropCycleService $cropCycleService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = CropCycle::with(['landParcel', 'cropType', 'season', 'yieldUnit']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('land_parcel_id')) {
            $query->where('land_parcel_id', $request->land_parcel_id);
        }

        if ($request->has('crop_type_id')) {
            $query->where('crop_type_id', $request->crop_type_id);
        }

        return CropCycleResource::collection(
            $query->orderBy('planned_start_date', 'desc')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'land_parcel_id' => 'required|exists:land_parcels,id',
            'crop_type_id' => 'required|exists:crop_types,id',
            'season_id' => 'nullable|exists:seasons,id',
            'planned_start_date' => 'required|date',
            'planned_end_date' => 'required|date|after:planned_start_date',
            'notes' => 'nullable|string',
        ]);

        // Check for overlapping cycles
        if ($this->cropCycleService->hasOverlappingCycle(
            $validated['land_parcel_id'],
            $validated['planned_start_date'],
            $validated['planned_end_date']
        )) {
            return response()->json([
                'message' => 'This land parcel already has an overlapping crop cycle for the specified dates.'
            ], 422);
        }

        $landParcel = LandParcel::find($validated['land_parcel_id']);
        $year = date('Y', strtotime($validated['planned_start_date']));

        $validated['cycle_code'] = $this->cropCycleService->generateCycleCode($landParcel, $year);
        $validated['status'] = 'planned';

        $cropCycle = CropCycle::create($validated);
        $cropCycle->load(['landParcel', 'cropType', 'season']);

        return response()->json([
            'data' => new CropCycleResource($cropCycle)
        ], 201);
    }

    public function show(CropCycle $cropCycle): CropCycleResource
    {
        $cropCycle->load(['landParcel', 'cropType', 'season', 'yieldUnit', 'stages']);

        return new CropCycleResource($cropCycle);
    }

    public function update(Request $request, CropCycle $cropCycle): JsonResponse
    {
        if (!in_array($cropCycle->status, ['planned', 'active'])) {
            return response()->json([
                'message' => 'Cannot update a completed, failed, or abandoned crop cycle.'
            ], 422);
        }

        $validated = $request->validate([
            'season_id' => 'nullable|exists:seasons,id',
            'planned_start_date' => 'sometimes|date',
            'planned_end_date' => 'sometimes|date|after:planned_start_date',
            'notes' => 'nullable|string',
        ]);

        // Check for overlapping if dates changed
        if (isset($validated['planned_start_date']) || isset($validated['planned_end_date'])) {
            $startDate = $validated['planned_start_date'] ?? $cropCycle->planned_start_date->toDateString();
            $endDate = $validated['planned_end_date'] ?? $cropCycle->planned_end_date->toDateString();

            if ($this->cropCycleService->hasOverlappingCycle(
                $cropCycle->land_parcel_id,
                $startDate,
                $endDate,
                $cropCycle->id
            )) {
                return response()->json([
                    'message' => 'The updated dates would overlap with another crop cycle.'
                ], 422);
            }
        }

        $cropCycle->update($validated);
        $cropCycle->load(['landParcel', 'cropType', 'season']);

        return response()->json(['data' => new CropCycleResource($cropCycle)]);
    }

    public function destroy(CropCycle $cropCycle): JsonResponse
    {
        if ($cropCycle->status !== 'planned') {
            return response()->json([
                'message' => 'Only planned crop cycles can be deleted.'
            ], 422);
        }

        $cropCycle->delete();

        return response()->json(['message' => 'Crop cycle deleted successfully.']);
    }

    public function activate(CropCycle $cropCycle): JsonResponse
    {
        try {
            $cropCycle->activate();
            $cropCycle->load(['landParcel', 'cropType', 'season']);

            return response()->json(['data' => new CropCycleResource($cropCycle)]);
        } catch (InvalidStatusTransitionException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function complete(Request $request, CropCycle $cropCycle): JsonResponse
    {
        $validated = $request->validate([
            'yield_value' => 'nullable|numeric|min:0',
            'yield_unit_id' => 'nullable|exists:units_of_measure,id',
            'quality_rating' => 'nullable|in:excellent,good,average,below_average,poor',
        ]);

        try {
            $cropCycle->complete($validated);
            $cropCycle->load(['landParcel', 'cropType', 'season', 'yieldUnit']);

            return response()->json(['data' => new CropCycleResource($cropCycle)]);
        } catch (InvalidStatusTransitionException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function fail(Request $request, CropCycle $cropCycle): JsonResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        try {
            $cropCycle->fail($validated['notes'] ?? null);
            $cropCycle->load(['landParcel', 'cropType', 'season']);

            return response()->json(['data' => new CropCycleResource($cropCycle)]);
        } catch (InvalidStatusTransitionException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function abandon(Request $request, CropCycle $cropCycle): JsonResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        try {
            $cropCycle->abandon($validated['notes'] ?? null);
            $cropCycle->load(['landParcel', 'cropType', 'season']);

            return response()->json(['data' => new CropCycleResource($cropCycle)]);
        } catch (InvalidStatusTransitionException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function activityLogs(CropCycle $cropCycle): AnonymousResourceCollection
    {
        return ActivityLogResource::collection(
            $cropCycle->activityLogs()
                ->with(['activityType', 'landParcel'])
                ->orderBy('activity_date', 'desc')
                ->get()
        );
    }
}
