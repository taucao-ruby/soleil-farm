<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SeasonDefinition extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'typical_start_month',
        'typical_end_month',
        'is_active',
    ];

    protected $casts = [
        'typical_start_month' => 'integer',
        'typical_end_month' => 'integer',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function seasons(): HasMany
    {
        return $this->hasMany(Season::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
