# 🏗️ Backend Architecture

Design patterns and architecture decisions for the Laravel backend.

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         API LAYER                              │
├────────────────────────────────────────────────────────────────┤
│                    ┌───────────────────┐                       │
│                    │    Routes         │                       │
│                    │   routes/api.php  │                       │
│                    └─────────┬─────────┘                       │
│                              │                                 │
│                    ┌─────────▼─────────┐                       │
│                    │   Middleware      │                       │
│                    │  (Auth, CORS)     │                       │
│                    └─────────┬─────────┘                       │
└──────────────────────────────┼─────────────────────────────────┘
                               │
┌──────────────────────────────┼─────────────────────────────────┐
│                    APPLICATION LAYER                           │
├──────────────────────────────┼─────────────────────────────────┤
│                    ┌─────────▼─────────┐                       │
│                    │   Controllers     │                       │
│                    │  (11 Controllers) │                       │
│                    └─────────┬─────────┘                       │
│                              │                                 │
│         ┌────────────────────┼────────────────────┐            │
│         │                    │                    │            │
│  ┌──────▼──────┐     ┌───────▼───────┐    ┌───────▼───────┐   │
│  │  Services   │     │  Form Request │    │   Resources   │   │
│  │  (Business) │     │  (Validation) │    │  (Transform)  │   │
│  └──────┬──────┘     └───────────────┘    └───────────────┘   │
└─────────┼──────────────────────────────────────────────────────┘
          │
┌─────────┼──────────────────────────────────────────────────────┐
│         │              DOMAIN LAYER                            │
├─────────┼──────────────────────────────────────────────────────┤
│  ┌──────▼──────────────────────────────────────────────────┐   │
│  │                    Eloquent Models                       │   │
│  │  (12 Models with Relationships, Scopes, Accessors)      │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼──────────────────────────────────┘
                              │
┌─────────────────────────────┼──────────────────────────────────┐
│                    DATABASE LAYER                              │
├─────────────────────────────┼──────────────────────────────────┤
│                    ┌────────▼────────┐                         │
│                    │   MySQL 8.0+    │                         │
│                    │   (14 Tables)   │                         │
│                    └─────────────────┘                         │
└────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
backend/
├── app/
│   ├── Exceptions/              # Custom exceptions
│   │   └── InvalidStatusTransitionException.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/             # API controllers
│   │   │       ├── ActivityLogController.php
│   │   │       ├── ActivityTypeController.php
│   │   │       ├── CropCycleController.php
│   │   │       ├── CropCycleStageController.php
│   │   │       ├── CropTypeController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── LandParcelController.php
│   │   │       ├── SeasonController.php
│   │   │       ├── SeasonDefinitionController.php
│   │   │       ├── UnitOfMeasureController.php
│   │   │       └── WaterSourceController.php
│   │   └── Resources/           # JSON transformers
│   ├── Models/                  # Eloquent models
│   │   ├── ActivityLog.php
│   │   ├── ActivityType.php
│   │   ├── CropCycle.php
│   │   ├── CropCycleStage.php
│   │   ├── CropType.php
│   │   ├── LandParcel.php
│   │   ├── LandParcelWaterSource.php
│   │   ├── Season.php
│   │   ├── SeasonDefinition.php
│   │   ├── UnitOfMeasure.php
│   │   ├── User.php
│   │   └── WaterSource.php
│   ├── Providers/               # Service providers
│   └── Services/                # Business logic
│       └── CropCycleService.php
├── config/                      # Configuration
├── database/
│   ├── factories/               # Model factories
│   ├── migrations/              # 14 migrations
│   └── seeders/                 # 7 seeders
├── routes/
│   └── api.php                  # API routes
└── tests/                       # PHPUnit tests
```

---

## Design Patterns

### 1. Repository Pattern (Implicit)

Eloquent models act as repositories with built-in query builder:

```php
// Query directly on model
LandParcel::active()->with('waterSources')->get();

// Scopes for reusable queries
public function scopeActive($query) {
    return $query->where('is_active', true);
}
```

### 2. Service Layer

Business logic is encapsulated in service classes:

```php
// app/Services/CropCycleService.php
class CropCycleService
{
    public function validateNoOverlap(LandParcel $parcel, $startDate, $endDate, $excludeId = null): bool
    {
        // Complex validation logic
    }
    
    public function generateCycleCode(LandParcel $parcel, Season $season): string
    {
        // Code generation logic
    }
}
```

### 3. Resource Transformation

API responses use Laravel Resources for consistent JSON:

```php
// app/Http/Resources/CropCycleResource.php
class CropCycleResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'cycle_code' => $this->cycle_code,
            'land_parcel' => new LandParcelResource($this->whenLoaded('landParcel')),
            // ... consistent transformation
        ];
    }
}
```

### 4. State Machine

CropCycle status follows a state machine pattern:

```
┌─────────┐
│ planned │
└────┬────┘
     │ activate()
     ▼
┌─────────┐
│ active  │
└────┬────┘
     │
     ├──────────────► complete() ──► completed
     │
     ├──────────────► fail() ──────► failed
     │
     └──────────────► abandon() ───► abandoned
```

```php
// Valid transitions
const STATUS_TRANSITIONS = [
    'planned' => ['active'],
    'active' => ['completed', 'failed', 'abandoned'],
];
```

### 5. Immutable Logs

ActivityLog prevents modification at model level:

```php
class ActivityLog extends Model
{
    // Disable update
    public static function boot()
    {
        parent::boot();
        
        static::updating(function ($model) {
            throw new \Exception('Activity logs cannot be updated');
        });
        
        static::deleting(function ($model) {
            throw new \Exception('Activity logs cannot be deleted');
        });
    }
}
```

---

## Key Business Rules

### 1. No Overlapping Crop Cycles

A land parcel cannot have two active/planned crop cycles with overlapping dates:

```php
// CropCycleService::validateNoOverlap()
$overlapping = CropCycle::where('land_parcel_id', $parcel->id)
    ->whereIn('status', ['planned', 'active'])
    ->where(function ($query) use ($startDate, $endDate) {
        $query->whereBetween('planned_start_date', [$startDate, $endDate])
              ->orWhereBetween('planned_end_date', [$startDate, $endDate]);
    })
    ->exists();
```

### 2. Immutable Activity Logs

Once created, activity logs cannot be modified or deleted.

### 3. Soft Deletes

Entities use `is_active` flag instead of hard deletes:

```php
// Instead of delete
$landParcel->update(['is_active' => false]);

// Query active only
LandParcel::where('is_active', true)->get();
```

### 4. Cascade Rules

| Parent | Child | Rule |
|--------|-------|------|
| Land Parcel | Water Sources | CASCADE (pivot) |
| Crop Cycle | Stages | CASCADE |
| Activity Log | References | SET NULL |

---

## Request Flow Example

```
1. Request: POST /api/v1/crop-cycles
                    │
2. Route Match      ▼
   routes/api.php → CropCycleController@store
                    │
3. Validation       ▼
   StoreCropCycleRequest validates input
                    │
4. Service Layer    ▼
   CropCycleService::validateNoOverlap()
                    │
5. Model Create     ▼
   CropCycle::create($validated)
                    │
6. Transform        ▼
   CropCycleResource formats response
                    │
7. Response         ▼
   201 Created with JSON
```

---

*See also: [Database Schema](database-schema.md) | [API Design](api-design.md)*
