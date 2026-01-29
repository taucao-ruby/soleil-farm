<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LandParcel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'land_type',
        'area_value',
        'area_unit_id',
        'terrain_type',
        'soil_type',
        'latitude',
        'longitude',
        'is_active',
    ];

    protected $casts = [
        'area_value' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function areaUnit(): BelongsTo
    {
        return $this->belongsTo(UnitOfMeasure::class, 'area_unit_id');
    }

    public function waterSources(): BelongsToMany
    {
        return $this->belongsToMany(WaterSource::class, 'land_parcel_water_sources')
                    ->withPivot(['accessibility', 'is_primary_source', 'notes'])
                    ->withTimestamps();
    }

    public function cropCycles(): HasMany
    {
        return $this->hasMany(CropCycle::class);
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('land_type', $type);
    }

    public function scopeWithActiveCropCycle($query)
    {
        return $query->whereHas('cropCycles', function ($q) {
            $q->where('status', 'active');
        });
    }

    // Helpers
    public function hasActiveCropCycle(): bool
    {
        return $this->cropCycles()->where('status', 'active')->exists();
    }

    public function getActiveCropCycle(): ?CropCycle
    {
        return $this->cropCycles()->where('status', 'active')->first();
    }

    public function getPrimaryWaterSource(): ?WaterSource
    {
        return $this->waterSources()->wherePivot('is_primary_source', true)->first();
    }
}
