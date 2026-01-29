<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UnitOfMeasure extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'abbreviation',
        'unit_type',
        'conversion_factor_to_base',
        'is_base_unit',
        'is_active',
    ];

    protected $casts = [
        'conversion_factor_to_base' => 'decimal:6',
        'is_base_unit' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function landParcels(): HasMany
    {
        return $this->hasMany(LandParcel::class, 'area_unit_id');
    }

    public function cropTypesYieldUnit(): HasMany
    {
        return $this->hasMany(CropType::class, 'default_yield_unit_id');
    }

    public function cropCyclesYieldUnit(): HasMany
    {
        return $this->hasMany(CropCycle::class, 'yield_unit_id');
    }

    public function activityLogsQuantityUnit(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'quantity_unit_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('unit_type', $type);
    }
}
