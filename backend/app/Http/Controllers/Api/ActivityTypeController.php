<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityType\StoreActivityTypeRequest;
use App\Http\Requests\ActivityType\UpdateActivityTypeRequest;
use App\Http\Resources\ActivityTypeResource;
use App\Models\ActivityType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityTypeController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ActivityType::query();

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->boolean('active_only', true)) {
            $query->where('is_active', true);
        }

        return ActivityTypeResource::collection($query->get());
    }

    public function store(StoreActivityTypeRequest $request): ActivityTypeResource
    {
        $validated = $request->validated();

        $activityType = ActivityType::create($validated);

        return new ActivityTypeResource($activityType);
    }

    public function show(ActivityType $activityType): ActivityTypeResource
    {
        return new ActivityTypeResource($activityType);
    }

    public function update(UpdateActivityTypeRequest $request, ActivityType $activityType): ActivityTypeResource
    {
        $validated = $request->validated();

        $activityType->update($validated);

        return new ActivityTypeResource($activityType);
    }

    public function destroy(ActivityType $activityType): JsonResponse
    {
        $activityType->update(['is_active' => false]);

        return response()->json(['message' => 'Activity type deactivated successfully.']);
    }

    public function byCategory(string $category): AnonymousResourceCollection
    {
        $activityTypes = ActivityType::where('category', $category)
            ->where('is_active', true)
            ->get();

        return ActivityTypeResource::collection($activityTypes);
    }
}
