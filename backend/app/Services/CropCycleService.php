<?php

namespace App\Services;

use App\Models\CropCycle;
use App\Models\LandParcel;
use Illuminate\Support\Str;

class CropCycleService
{
    /**
     * Check if a new crop cycle would overlap with existing cycles on the same land parcel.
     */
    public function hasOverlappingCycle(
        int $landParcelId,
        string $startDate,
        string $endDate,
        ?int $excludeCycleId = null
    ): bool {
        $query = CropCycle::where('land_parcel_id', $landParcelId)
            ->whereIn('status', ['planned', 'active'])
            ->where(function ($q) use ($startDate, $endDate) {
                // Check for any overlap
                $q->where(function ($subQ) use ($startDate, $endDate) {
                    $subQ->where('planned_start_date', '<=', $endDate)
                         ->where('planned_end_date', '>=', $startDate);
                });
            });

        if ($excludeCycleId) {
            $query->where('id', '!=', $excludeCycleId);
        }

        return $query->exists();
    }

    /**
     * Generate a unique cycle code.
     */
    public function generateCycleCode(LandParcel $landParcel, string $year): string
    {
        $baseCode = strtoupper($landParcel->code) . '-' . $year;
        
        $existingCount = CropCycle::where('cycle_code', 'like', $baseCode . '%')->count();
        
        $sequence = str_pad($existingCount + 1, 2, '0', STR_PAD_LEFT);
        
        return $baseCode . '-' . $sequence;
    }

    /**
     * Get statistics for a land parcel's crop cycles.
     */
    public function getLandParcelStatistics(int $landParcelId): array
    {
        $cycles = CropCycle::where('land_parcel_id', $landParcelId)->get();

        return [
            'total_cycles' => $cycles->count(),
            'completed_cycles' => $cycles->where('status', 'completed')->count(),
            'active_cycles' => $cycles->where('status', 'active')->count(),
            'planned_cycles' => $cycles->where('status', 'planned')->count(),
            'failed_cycles' => $cycles->where('status', 'failed')->count(),
            'average_yield' => $cycles->where('status', 'completed')->avg('yield_value'),
        ];
    }
}
