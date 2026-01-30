<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\InvalidStatusTransitionException;
use App\Http\Controllers\Controller;
use App\Http\Requests\CropCycle\CompleteCropCycleRequest;
use App\Http\Requests\CropCycle\FailCropCycleRequest;
use App\Http\Requests\CropCycle\StoreCropCycleRequest;
use App\Http\Requests\CropCycle\UpdateCropCycleRequest;
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

    public function store(StoreCropCycleRequest $request): JsonResponse
    {
        $validated = $request->validated();

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

    public function update(UpdateCropCycleRequest $request, CropCycle $cropCycle): JsonResponse
    {
        $validated = $request->validated();

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

    public function complete(CompleteCropCycleRequest $request, CropCycle $cropCycle): JsonResponse
    {
        $validated = $request->validated();

        try {
            $cropCycle->complete($validated);
            $cropCycle->load(['landParcel', 'cropType', 'season', 'yieldUnit']);

            return response()->json(['data' => new CropCycleResource($cropCycle)]);
        } catch (InvalidStatusTransitionException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function fail(FailCropCycleRequest $request, CropCycle $cropCycle): JsonResponse
    {
        $validated = $request->validated();

        try {
            $cropCycle->fail($validated['notes'] ?? null);
            $cropCycle->load(['landParcel', 'cropType', 'season']);

            return response()->json(['data' => new CropCycleResource($cropCycle)]);
        } catch (InvalidStatusTransitionException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function abandon(FailCropCycleRequest $request, CropCycle $cropCycle): JsonResponse
    {
        $validated = $request->validated();

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
