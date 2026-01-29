<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CropCycleStage extends Model
{
    use HasFactory;

    protected $fillable = [
        'crop_cycle_id',
        'stage_name',
        'sequence_order',
        'planned_start_date',
        'planned_end_date',
        'actual_start_date',
        'actual_end_date',
        'status',
        'notes',
    ];

    protected $casts = [
        'sequence_order' => 'integer',
        'planned_start_date' => 'date',
        'planned_end_date' => 'date',
        'actual_start_date' => 'date',
        'actual_end_date' => 'date',
    ];

    // Relationships
    public function cropCycle(): BelongsTo
    {
        return $this->belongsTo(CropCycle::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Helpers
    public function start(): void
    {
        $this->status = 'in_progress';
        $this->actual_start_date = now()->toDateString();
        $this->save();
    }

    public function complete(): void
    {
        $this->status = 'completed';
        $this->actual_end_date = now()->toDateString();
        $this->save();
    }

    public function skip(): void
    {
        $this->status = 'skipped';
        $this->save();
    }
}
