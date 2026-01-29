<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_type_id',
        'crop_cycle_id',
        'land_parcel_id',
        'water_source_id',
        'activity_date',
        'start_time',
        'end_time',
        'description',
        'quantity_value',
        'quantity_unit_id',
        'cost_value',
        'cost_unit_id',
        'performed_by',
        'weather_conditions',
    ];

    protected $casts = [
        'activity_date' => 'date',
        'quantity_value' => 'decimal:2',
        'cost_value' => 'decimal:2',
    ];

    // Boot - prevent updates and deletes (immutable)
    protected static function boot()
    {
        parent::boot();

        static::updating(function ($model) {
            throw new \RuntimeException('Activity logs cannot be updated. They are immutable.');
        });

        static::deleting(function ($model) {
            throw new \RuntimeException('Activity logs cannot be deleted. They are immutable.');
        });
    }

    // Relationships
    public function activityType(): BelongsTo
    {
        return $this->belongsTo(ActivityType::class);
    }

    public function cropCycle(): BelongsTo
    {
        return $this->belongsTo(CropCycle::class);
    }

    public function landParcel(): BelongsTo
    {
        return $this->belongsTo(LandParcel::class);
    }

    public function waterSource(): BelongsTo
    {
        return $this->belongsTo(WaterSource::class);
    }

    public function quantityUnit(): BelongsTo
    {
        return $this->belongsTo(UnitOfMeasure::class, 'quantity_unit_id');
    }

    public function costUnit(): BelongsTo
    {
        return $this->belongsTo(UnitOfMeasure::class, 'cost_unit_id');
    }

    // Scopes
    public function scopeForDate($query, string $date)
    {
        return $query->whereDate('activity_date', $date);
    }

    public function scopeForDateRange($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('activity_date', [$startDate, $endDate]);
    }

    public function scopeByPerformer($query, string $performer)
    {
        return $query->where('performed_by', $performer);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('activity_date', '>=', now()->subDays($days)->toDateString());
    }
}
