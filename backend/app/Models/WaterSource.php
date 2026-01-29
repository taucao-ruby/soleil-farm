<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WaterSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'source_type',
        'description',
        'latitude',
        'longitude',
        'reliability',
        'water_quality',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function landParcels(): BelongsToMany
    {
        return $this->belongsToMany(LandParcel::class, 'land_parcel_water_sources')
                    ->withPivot(['accessibility', 'is_primary_source', 'notes'])
                    ->withTimestamps();
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
        return $query->where('source_type', $type);
    }

    public function scopeReliable($query)
    {
        return $query->where('reliability', 'permanent');
    }
}
