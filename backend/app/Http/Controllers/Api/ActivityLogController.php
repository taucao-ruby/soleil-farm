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
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::query()
            ->with(['activityType', 'cropCycle', 'landParcel', 'waterSource']);

        // Filter by crop cycle
        if ($request->has('crop_cycle_id')) {
            $query->where('crop_cycle_id', $request->crop_cycle_id);
        }

        // Filter by activity type
        if ($request->has('activity_type_id')) {
            $query->where('activity_type_id', $request->activity_type_id);
        }

        // Filter by land parcel
        if ($request->has('land_parcel_id')) {
            $query->where('land_parcel_id', $request->land_parcel_id);
        }

        // Filter by performer
        if ($request->has('performed_by')) {
            $query->where('performed_by', $request->performed_by);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('activity_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('activity_date', '<=', $request->date_to);
        }

        // Legacy date range support
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('activity_date', [$request->start_date, $request->end_date]);
        }

        // Search in description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('description', 'like', "%{$search}%");
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'activity_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $allowedSortFields = ['activity_date', 'start_time', 'end_time', 'performed_by', 'created_at'];
        
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('activity_date', 'desc');
        }

        // Pagination
        $logs = $query->paginate($this->getPerPage($request));

        return response()->json([
            'data' => ActivityLogResource::collection($logs->items()),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'from' => $logs->firstItem(),
                'to' => $logs->lastItem(),
            ],
            'links' => [
                'first' => $logs->url(1),
                'last' => $logs->url($logs->lastPage()),
                'prev' => $logs->previousPageUrl(),
                'next' => $logs->nextPageUrl(),
            ],
        ]);
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
