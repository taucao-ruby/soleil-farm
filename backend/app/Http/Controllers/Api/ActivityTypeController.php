<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

    public function store(Request $request): ActivityTypeResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:30|unique:activity_types,code',
            'category' => 'required|in:land_preparation,planting,irrigation,fertilizing,pest_control,harvesting,maintenance,observation,other',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $activityType = ActivityType::create($validated);

        return new ActivityTypeResource($activityType);
    }

    public function show(ActivityType $activityType): ActivityTypeResource
    {
        return new ActivityTypeResource($activityType);
    }

    public function update(Request $request, ActivityType $activityType): ActivityTypeResource
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30|unique:activity_types,code,' . $activityType->id,
            'category' => 'sometimes|in:land_preparation,planting,irrigation,fertilizing,pest_control,harvesting,maintenance,observation,other',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

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
