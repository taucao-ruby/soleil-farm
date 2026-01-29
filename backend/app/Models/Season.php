<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    use HasFactory;

    protected $fillable = [
        'season_definition_id',
        'year',
        'actual_start_date',
        'actual_end_date',
        'notes',
    ];

    protected $casts = [
        'year' => 'integer',
        'actual_start_date' => 'date',
        'actual_end_date' => 'date',
    ];

    // Relationships
    public function seasonDefinition(): BelongsTo
    {
        return $this->belongsTo(SeasonDefinition::class);
    }

    public function cropCycles(): HasMany
    {
        return $this->hasMany(CropCycle::class);
    }

    // Scopes
    public function scopeForYear($query, int $year)
    {
        return $query->where('year', $year);
    }

    public function scopeCurrent($query)
    {
        $today = now()->toDateString();
        return $query->where('actual_start_date', '<=', $today)
                     ->where('actual_end_date', '>=', $today);
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return $this->seasonDefinition->name . ' ' . $this->year;
    }
}
