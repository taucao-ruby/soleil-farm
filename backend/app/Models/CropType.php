<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CropType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'scientific_name',
        'variety',
        'category',
        'description',
        'typical_grow_duration_days',
        'default_yield_unit_id',
        'is_active',
    ];

    protected $casts = [
        'typical_grow_duration_days' => 'integer',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function defaultYieldUnit(): BelongsTo
    {
        return $this->belongsTo(UnitOfMeasure::class, 'default_yield_unit_id');
    }

    public function cropCycles(): HasMany
    {
        return $this->hasMany(CropCycle::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOfCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    // Statistics
    public function getAverageYield(): ?float
    {
        return $this->cropCycles()
            ->where('status', 'completed')
            ->whereNotNull('yield_value')
            ->avg('yield_value');
    }

    public function getCompletedCyclesCount(): int
    {
        return $this->cropCycles()->where('status', 'completed')->count();
    }
}
