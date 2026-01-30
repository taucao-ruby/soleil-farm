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

    public function index(Request $request): JsonResponse
    {
        $query = CropCycle::query()
            ->with(['landParcel', 'cropType', 'season', 'yieldUnit', 'stages']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by land parcel
        if ($request->has('land_parcel_id')) {
            $query->where('land_parcel_id', $request->land_parcel_id);
        }

        // Filter by crop type
        if ($request->has('crop_type_id')) {
            $query->where('crop_type_id', $request->crop_type_id);
        }

        // Filter by season
        if ($request->has('season_id')) {
            $query->where('season_id', $request->season_id);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('planned_start_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('planned_end_date', '<=', $request->end_date);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('cycle_code', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'planned_start_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSortFields = ['cycle_code', 'status', 'planned_start_date', 'planned_end_date', 'actual_start_date', 'actual_end_date', 'yield_value', 'created_at'];
        
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('planned_start_date', 'desc');
        }

        // Pagination
        $cycles = $query->paginate($this->getPerPage($request));

        return response()->json([
            'data' => CropCycleResource::collection($cycles->items()),
            'meta' => [
                'current_page' => $cycles->currentPage(),
                'last_page' => $cycles->lastPage(),
                'per_page' => $cycles->perPage(),
                'total' => $cycles->total(),
                'from' => $cycles->firstItem(),
                'to' => $cycles->lastItem(),
            ],
            'links' => [
                'first' => $cycles->url(1),
                'last' => $cycles->url($cycles->lastPage()),
                'prev' => $cycles->previousPageUrl(),
                'next' => $cycles->nextPageUrl(),
            ],
        ]);
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
