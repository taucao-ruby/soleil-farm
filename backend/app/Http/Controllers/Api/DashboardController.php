<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CropCycle;
use App\Models\LandParcel;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $data = [
            'active_crop_cycles' => CropCycle::where('status', 'active')->count(),
            'planned_crop_cycles' => CropCycle::where('status', 'planned')->count(),
            'total_land_parcels' => LandParcel::where('is_active', true)->count(),
            'recent_activities' => ActivityLog::with(['activityType', 'landParcel'])
                ->orderBy('activity_date', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json(['data' => $data]);
    }

    public function statistics(): JsonResponse
    {
        $stats = [
            'crop_cycles' => [
                'total' => CropCycle::count(),
                'by_status' => [
                    'planned' => CropCycle::where('status', 'planned')->count(),
                    'active' => CropCycle::where('status', 'active')->count(),
                    'completed' => CropCycle::where('status', 'completed')->count(),
                    'failed' => CropCycle::where('status', 'failed')->count(),
                    'abandoned' => CropCycle::where('status', 'abandoned')->count(),
                ],
            ],
            'land_parcels' => [
                'total' => LandParcel::count(),
                'active' => LandParcel::where('is_active', true)->count(),
                'with_active_cycles' => LandParcel::whereHas('cropCycles', fn($q) => $q->where('status', 'active'))->count(),
            ],
            'activities' => [
                'total' => ActivityLog::count(),
                'this_week' => ActivityLog::where('activity_date', '>=', now()->subWeek())->count(),
                'this_month' => ActivityLog::where('activity_date', '>=', now()->subMonth())->count(),
            ],
        ];

        return response()->json(['data' => $stats]);
    }
}
