<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandParcelWaterSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'land_parcel_id',
        'water_source_id',
        'accessibility',
        'is_primary_source',
        'notes',
    ];

    protected $casts = [
        'is_primary_source' => 'boolean',
    ];

    // Relationships
    public function landParcel(): BelongsTo
    {
        return $this->belongsTo(LandParcel::class);
    }

    public function waterSource(): BelongsTo
    {
        return $this->belongsTo(WaterSource::class);
    }
}
