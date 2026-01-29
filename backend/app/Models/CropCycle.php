<?php

namespace App\Models;

use App\Exceptions\InvalidStatusTransitionException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CropCycle extends Model
{
    use HasFactory;

    protected $fillable = [
        'cycle_code',
        'land_parcel_id',
        'crop_type_id',
        'season_id',
        'status',
        'planned_start_date',
        'planned_end_date',
        'actual_start_date',
        'actual_end_date',
        'yield_value',
        'yield_unit_id',
        'quality_rating',
        'notes',
    ];

    protected $casts = [
        'planned_start_date' => 'date',
        'planned_end_date' => 'date',
        'actual_start_date' => 'date',
        'actual_end_date' => 'date',
        'yield_value' => 'decimal:2',
    ];

    // Valid status transitions
    protected static array $allowedTransitions = [
        'planned' => ['active', 'abandoned'],
        'active' => ['completed', 'failed', 'abandoned'],
        'completed' => [],
        'failed' => [],
        'abandoned' => [],
    ];

    // Relationships
    public function landParcel(): BelongsTo
    {
        return $this->belongsTo(LandParcel::class);
    }

    public function cropType(): BelongsTo
    {
        return $this->belongsTo(CropType::class);
    }

    public function season(): BelongsTo
    {
        return $this->belongsTo(Season::class);
    }

    public function yieldUnit(): BelongsTo
    {
        return $this->belongsTo(UnitOfMeasure::class, 'yield_unit_id');
    }

    public function stages(): HasMany
    {
        return $this->hasMany(CropCycleStage::class)->orderBy('sequence_order');
    }

    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopePlanned($query)
    {
        return $query->where('status', 'planned');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeForLandParcel($query, int $landParcelId)
    {
        return $query->where('land_parcel_id', $landParcelId);
    }

    // Status transitions
    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::$allowedTransitions[$this->status] ?? []);
    }

    public function transitionTo(string $newStatus): void
    {
        if (!$this->canTransitionTo($newStatus)) {
            throw new InvalidStatusTransitionException(
                "Cannot transition from '{$this->status}' to '{$newStatus}'"
            );
        }
        $this->status = $newStatus;
    }

    public function activate(): void
    {
        $this->transitionTo('active');
        $this->actual_start_date = now()->toDateString();
        $this->save();
    }

    public function complete(array $data = []): void
    {
        $this->transitionTo('completed');
        $this->actual_end_date = now()->toDateString();
        
        if (isset($data['yield_value'])) {
            $this->yield_value = $data['yield_value'];
        }
        if (isset($data['yield_unit_id'])) {
            $this->yield_unit_id = $data['yield_unit_id'];
        }
        if (isset($data['quality_rating'])) {
            $this->quality_rating = $data['quality_rating'];
        }
        
        $this->save();
    }

    public function fail(string $notes = null): void
    {
        $this->transitionTo('failed');
        $this->actual_end_date = now()->toDateString();
        if ($notes) {
            $this->notes = $this->notes ? $this->notes . "\n" . $notes : $notes;
        }
        $this->save();
    }

    public function abandon(string $notes = null): void
    {
        $this->transitionTo('abandoned');
        $this->actual_end_date = now()->toDateString();
        if ($notes) {
            $this->notes = $this->notes ? $this->notes . "\n" . $notes : $notes;
        }
        $this->save();
    }

    // Helpers
    public function getDurationDays(): ?int
    {
        $start = $this->actual_start_date ?? $this->planned_start_date;
        $end = $this->actual_end_date ?? ($this->status === 'active' ? now() : $this->planned_end_date);
        
        return $start && $end ? $start->diffInDays($end) : null;
    }

    public function isOverdue(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }
        return now()->isAfter($this->planned_end_date);
    }

    public function getCurrentStage(): ?CropCycleStage
    {
        return $this->stages()->where('status', 'in_progress')->first();
    }
}
