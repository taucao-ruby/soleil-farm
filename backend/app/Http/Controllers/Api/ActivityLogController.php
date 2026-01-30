<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityLog\StoreActivityLogRequest;
use App\Http\Requests\ActivityLog\UpdateActivityLogRequest;
use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityLogController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = ActivityLog::with(['activityType', 'cropCycle', 'landParcel', 'waterSource']);

        if ($request->has('activity_type_id')) {
            $query->where('activity_type_id', $request->activity_type_id);
        }

        if ($request->has('land_parcel_id')) {
            $query->where('land_parcel_id', $request->land_parcel_id);
        }

        if ($request->has('crop_cycle_id')) {
            $query->where('crop_cycle_id', $request->crop_cycle_id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('activity_date', [$request->start_date, $request->end_date]);
        }

        if ($request->has('performed_by')) {
            $query->where('performed_by', $request->performed_by);
        }

        return ActivityLogResource::collection(
            $query->orderBy('activity_date', 'desc')->paginate($request->per_page ?? 20)
        );
    }

    public function store(StoreActivityLogRequest $request): ActivityLogResource
    {
        $validated = $request->validated();

        $activityLog = ActivityLog::create($validated);
        $activityLog->load(['activityType', 'cropCycle', 'landParcel']);

        return new ActivityLogResource($activityLog);
    }

    public function show(ActivityLog $activityLog): ActivityLogResource
    {
        $activityLog->load(['activityType', 'cropCycle', 'landParcel', 'waterSource', 'quantityUnit', 'costUnit']);

        return new ActivityLogResource($activityLog);
    }

    public function update(UpdateActivityLogRequest $request, ActivityLog $activityLog): ActivityLogResource
    {
        $validated = $request->validated();

        $activityLog->update($validated);
        $activityLog->load(['activityType', 'cropCycle', 'landParcel']);

        return new ActivityLogResource($activityLog);
    }

    public function destroy(ActivityLog $activityLog): JsonResponse
    {
        $activityLog->delete();

        return response()->json(['message' => 'Đã xóa nhật ký hoạt động thành công.']);
    }

    public function byDate(string $date): AnonymousResourceCollection
    {
        $logs = ActivityLog::with(['activityType', 'cropCycle', 'landParcel'])
            ->whereDate('activity_date', $date)
            ->orderBy('start_time')
            ->get();

        return ActivityLogResource::collection($logs);
    }

    public function byPerformer(string $performer): AnonymousResourceCollection
    {
        $logs = ActivityLog::with(['activityType', 'cropCycle', 'landParcel'])
            ->where('performed_by', $performer)
            ->orderBy('activity_date', 'desc')
            ->get();

        return ActivityLogResource::collection($logs);
    }

    public function recent(Request $request): AnonymousResourceCollection
    {
        $days = $request->input('days', 7);

        $logs = ActivityLog::with(['activityType', 'cropCycle', 'landParcel'])
            ->where('activity_date', '>=', now()->subDays($days)->toDateString())
            ->orderBy('activity_date', 'desc')
            ->get();

        return ActivityLogResource::collection($logs);
    }
}
