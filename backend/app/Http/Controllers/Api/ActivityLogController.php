<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
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

    public function store(Request $request): ActivityLogResource
    {
        $validated = $request->validate([
            'activity_type_id' => 'required|exists:activity_types,id',
            'crop_cycle_id' => 'nullable|exists:crop_cycles,id',
            'land_parcel_id' => 'nullable|exists:land_parcels,id',
            'water_source_id' => 'nullable|exists:water_sources,id',
            'activity_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'description' => 'nullable|string',
            'quantity_value' => 'nullable|numeric|min:0',
            'quantity_unit_id' => 'nullable|exists:units_of_measure,id',
            'cost_value' => 'nullable|numeric|min:0',
            'cost_unit_id' => 'nullable|exists:units_of_measure,id',
            'performed_by' => 'nullable|string|max:100',
            'weather_conditions' => 'nullable|string|max:100',
        ]);

        $activityLog = ActivityLog::create($validated);
        $activityLog->load(['activityType', 'cropCycle', 'landParcel']);

        return new ActivityLogResource($activityLog);
    }

    public function show(ActivityLog $activityLog): ActivityLogResource
    {
        $activityLog->load(['activityType', 'cropCycle', 'landParcel', 'waterSource', 'quantityUnit', 'costUnit']);

        return new ActivityLogResource($activityLog);
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
