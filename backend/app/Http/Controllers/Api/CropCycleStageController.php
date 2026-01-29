<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CropCycleStageResource;
use App\Models\CropCycle;
use App\Models\CropCycleStage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CropCycleStageController extends Controller
{
    public function index(CropCycle $cropCycle): AnonymousResourceCollection
    {
        return CropCycleStageResource::collection(
            $cropCycle->stages()->orderBy('sequence_order')->get()
        );
    }

    public function store(Request $request, CropCycle $cropCycle): CropCycleStageResource
    {
        $validated = $request->validate([
            'stage_name' => 'required|string|max:100',
            'sequence_order' => 'required|integer|min:1',
            'planned_start_date' => 'nullable|date',
            'planned_end_date' => 'nullable|date|after_or_equal:planned_start_date',
            'notes' => 'nullable|string',
        ]);

        $validated['crop_cycle_id'] = $cropCycle->id;

        $stage = CropCycleStage::create($validated);

        return new CropCycleStageResource($stage);
    }

    public function update(Request $request, CropCycleStage $stage): CropCycleStageResource
    {
        $validated = $request->validate([
            'stage_name' => 'sometimes|string|max:100',
            'sequence_order' => 'sometimes|integer|min:1',
            'planned_start_date' => 'nullable|date',
            'planned_end_date' => 'nullable|date|after_or_equal:planned_start_date',
            'notes' => 'nullable|string',
        ]);

        $stage->update($validated);

        return new CropCycleStageResource($stage);
    }

    public function destroy(CropCycleStage $stage): JsonResponse
    {
        $stage->delete();

        return response()->json(['message' => 'Stage deleted successfully.']);
    }

    public function start(CropCycleStage $stage): CropCycleStageResource
    {
        $stage->start();

        return new CropCycleStageResource($stage);
    }

    public function complete(CropCycleStage $stage): CropCycleStageResource
    {
        $stage->complete();

        return new CropCycleStageResource($stage);
    }
}
