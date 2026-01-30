<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CropCycleStage\CompleteCropCycleStageRequest;
use App\Http\Requests\CropCycleStage\StartCropCycleStageRequest;
use App\Http\Requests\CropCycleStage\StoreCropCycleStageRequest;
use App\Http\Requests\CropCycleStage\UpdateCropCycleStageRequest;
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

    public function store(StoreCropCycleStageRequest $request, CropCycle $cropCycle): CropCycleStageResource
    {
        $validated = $request->validated();
        $validated['crop_cycle_id'] = $cropCycle->id;

        $stage = CropCycleStage::create($validated);

        return new CropCycleStageResource($stage);
    }

    public function update(UpdateCropCycleStageRequest $request, CropCycleStage $stage): CropCycleStageResource
    {
        $validated = $request->validated();

        $stage->update($validated);

        return new CropCycleStageResource($stage);
    }

    public function destroy(CropCycleStage $stage): JsonResponse
    {
        $stage->delete();

        return response()->json(['message' => 'Đã xóa giai đoạn thành công.']);
    }

    public function start(StartCropCycleStageRequest $request, CropCycleStage $stage): CropCycleStageResource
    {
        $validated = $request->validated();

        $stage->start($validated['actual_start_date'] ?? null);

        return new CropCycleStageResource($stage);
    }

    public function complete(CompleteCropCycleStageRequest $request, CropCycleStage $stage): CropCycleStageResource
    {
        $validated = $request->validated();

        $stage->complete($validated['actual_end_date'] ?? null);

        return new CropCycleStageResource($stage);
    }
}
