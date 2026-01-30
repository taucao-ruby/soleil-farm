# 🏛️ Entity Models Reference

Complete documentation for all Eloquent models.

---

## 📐 UnitOfMeasure

**File:** `app/Models/UnitOfMeasure.php`  
**Table:** `units_of_measure`

### Description
Reference data for measurement units (area, weight, volume, etc.).

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| HasMany | landParcelAreas() | LandParcel |
| HasMany | yields() | CropCycle |
| HasMany | activityQuantities() | ActivityLog |
| HasMany | activityCosts() | ActivityLog |

### Scopes
- `scopeActive()` - Only is_active = true
- `scopeOfType($type)` - Filter by unit_type
- `scopeBase()` - Only base units

### Enum Values (unit_type)
- `area` - Sào, Hecta, m²
- `weight` - Kg, Tạ, Tấn
- `volume` - Lít, m³
- `quantity` - Cái, Bó, Bụi
- `currency` - VND, USD
- `time` - Giờ, Ngày

---

## 🌸 SeasonDefinition

**File:** `app/Models/SeasonDefinition.php`  
**Table:** `season_definitions`

### Description
Templates for farming seasons with typical start/end months.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| HasMany | seasons() | Season |

### Scopes
- `scopeActive()` - Only is_active = true

### Seeded Data
| Name | Code | Months |
|------|------|--------|
| Vụ Đông-Xuân | DONG-XUAN | Nov-May |
| Vụ Hè-Thu | HE-THU | May-Sep |
| Vụ Mùa | VU-MUA | Sep-Dec |

---

## 📅 Season

**File:** `app/Models/Season.php`  
**Table:** `seasons`

### Description
Actual season instances for a specific year.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsTo | seasonDefinition() | SeasonDefinition |
| HasMany | cropCycles() | CropCycle |

### Scopes
- `scopeForYear($year)` - Filter by year
- `scopeCurrent()` - Current active season

### Helper Methods
- `getFullNameAttribute()` - Returns "Vụ Đông-Xuân 2026"
- `isActive()` - Is current date within season?

---

## 🌾 LandParcel

**File:** `app/Models/LandParcel.php`  
**Table:** `land_parcels`

### Description
Farm land areas that can be cultivated.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsTo | areaUnit() | UnitOfMeasure |
| BelongsToMany | waterSources() | WaterSource |
| HasMany | cropCycles() | CropCycle |
| HasMany | activityLogs() | ActivityLog |

### Scopes
- `scopeActive()` - Only is_active = true
- `scopeOfType($type)` - Filter by land_type

### Enum Values (land_type)
- `rice_field` - Ruộng lúa
- `garden` - Vườn
- `fish_pond` - Ao cá
- `mixed` - Đất hỗn hợp
- `fallow` - Đất hoang
- `other` - Khác

### Enum Values (terrain_type)
- `flat`, `sloped`, `terraced`, `lowland`

### Enum Values (soil_type)
- `clay`, `sandy`, `loamy`, `alluvial`, `mixed`

---

## 💧 WaterSource

**File:** `app/Models/WaterSource.php`  
**Table:** `water_sources`

### Description
Water sources available for irrigation.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsToMany | landParcels() | LandParcel |
| HasMany | activityLogs() | ActivityLog |

### Scopes
- `scopeActive()` - Only is_active = true
- `scopeOfType($type)` - Filter by source_type
- `scopeReliable()` - Only permanent reliability

### Enum Values (source_type)
- `well`, `river`, `stream`, `pond`
- `irrigation_canal`, `rainwater`, `municipal`

### Enum Values (reliability)
- `permanent`, `seasonal`, `intermittent`

### Enum Values (water_quality)
- `excellent`, `good`, `fair`, `poor`

---

## 🔗 LandParcelWaterSource

**File:** `app/Models/LandParcelWaterSource.php`  
**Table:** `land_parcel_water_sources`

### Description
Pivot model for land parcel ↔ water source relationship.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsTo | landParcel() | LandParcel |
| BelongsTo | waterSource() | WaterSource |

### Enum Values (accessibility)
- `direct` - Direct access
- `pumped` - Requires pump
- `gravity_fed` - Gravity-fed
- `manual` - Manual carry

---

## 🌱 CropType

**File:** `app/Models/CropType.php`  
**Table:** `crop_types`

### Description
Catalog of crops that can be grown.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsTo | defaultYieldUnit() | UnitOfMeasure |
| HasMany | cropCycles() | CropCycle |

### Scopes
- `scopeActive()` - Only is_active = true
- `scopeOfCategory($cat)` - Filter by category

### Enum Values (category)
- `grain` - Lúa gạo
- `vegetable` - Rau củ
- `fruit` - Trái cây
- `legume` - Đậu
- `tuber` - Củ
- `herb` - Thảo mộc
- `flower` - Hoa
- `fodder` - Thức ăn chăn nuôi
- `other` - Khác

### Seeded Data
| Name | Code | Duration |
|------|------|----------|
| Lúa ST25 | LUA-ST25 | 110 days |
| Lúa IR50404 | LUA-IR50404 | 95 days |
| Lạc (Đậu phộng) | LAC | 120 days |
| Ớt chỉ thiên | OT-CHI-THIEN | 90 days |
| Rau muống | RAU-MUONG | 25 days |
| Đậu đen | DAU-DEN | 80 days |

---

## 🔄 CropCycle

**File:** `app/Models/CropCycle.php`  
**Table:** `crop_cycles`

### Description
A complete growing cycle from planting to harvest.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsTo | landParcel() | LandParcel |
| BelongsTo | cropType() | CropType |
| BelongsTo | season() | Season |
| BelongsTo | yieldUnit() | UnitOfMeasure |
| HasMany | stages() | CropCycleStage |
| HasMany | activityLogs() | ActivityLog |

### Scopes
- `scopeOfStatus($status)` - Filter by status
- `scopePlanned()` - Only status = planned
- `scopeActive()` - Only status = active
- `scopeCompleted()` - Only status = completed
- `scopeForLandParcel($id)` - Filter by land parcel
- `scopeForCropType($id)` - Filter by crop type
- `scopeOverdue()` - Overdue cycles

### Status Values
```
planned ──► active ──► completed
              │
              ├──► failed
              │
              └──► abandoned
```

### State Machine Methods
| Method | From → To |
|--------|-----------|
| `activate()` | planned → active |
| `complete($yield, $unit, $quality)` | active → completed |
| `fail($notes)` | active → failed |
| `abandon($notes)` | planned/active → abandoned |
| `transitionTo($status)` | Generic transition |

### Helper Methods
- `getDurationDaysAttribute()` - Planned duration
- `getActualDurationDaysAttribute()` - Actual duration
- `getIsOverdueAttribute()` - Is past planned end?
- `canTransitionTo($status)` - Check if transition allowed

### Business Rules
⚠️ **No Overlapping Cycles:** A land parcel cannot have two active/planned cycles with overlapping dates.

---

## 📊 CropCycleStage

**File:** `app/Models/CropCycleStage.php`  
**Table:** `crop_cycle_stages`

### Description
Individual stages within a crop cycle.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsTo | cropCycle() | CropCycle |

### Scopes
- `scopeOfStatus($status)` - Filter by status
- `scopePending()` - Only pending stages
- `scopeInProgress()` - Only in_progress stages
- `scopeCompleted()` - Only completed stages

### Status Values
- `pending` - Not started
- `in_progress` - Currently active
- `completed` - Done
- `skipped` - Skipped

### Helper Methods
- `start()` - Set status to in_progress, set actual_start
- `complete()` - Set status to completed, set actual_end
- `skip()` - Set status to skipped

---

## 🏷️ ActivityType

**File:** `app/Models/ActivityType.php`  
**Table:** `activity_types`

### Description
Categories of farm activities.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| HasMany | activityLogs() | ActivityLog |

### Scopes
- `scopeActive()` - Only is_active = true
- `scopeOfCategory($cat)` - Filter by category

### Category Values
- `land_preparation` - Chuẩn bị đất
- `planting` - Gieo trồng
- `irrigation` - Tưới nước
- `fertilizing` - Bón phân
- `pest_control` - Phòng trừ sâu bệnh
- `harvesting` - Thu hoạch
- `maintenance` - Bảo dưỡng
- `observation` - Quan sát
- `other` - Khác

### Seeded Data (Examples)
| Name | Code | Category |
|------|------|----------|
| Cày đất | CAY-DAT | land_preparation |
| Bừa đất | BUA-DAT | land_preparation |
| Gieo mạ | GIEO-MA | planting |
| Cấy lúa | CAY-LUA | planting |
| Tưới nước | TUOI-NUOC | irrigation |
| Bón phân | BON-PHAN | fertilizing |
| Phun thuốc | PHUN-THUOC | pest_control |
| Gặt lúa | GAT-LUA | harvesting |
| Làm cỏ | LAM-CO | maintenance |

---

## 📝 ActivityLog

**File:** `app/Models/ActivityLog.php`  
**Table:** `activity_logs`

### Description
Immutable audit trail of all farm activities.

### Relationships
| Type | Method | Related Model |
|------|--------|---------------|
| BelongsTo | activityType() | ActivityType |
| BelongsTo | cropCycle() | CropCycle |
| BelongsTo | landParcel() | LandParcel |
| BelongsTo | waterSource() | WaterSource |
| BelongsTo | quantityUnit() | UnitOfMeasure |
| BelongsTo | costUnit() | UnitOfMeasure |

### Scopes
- `scopeForDate($date)` - Filter by activity_date
- `scopeForDateRange($start, $end)` - Date range filter
- `scopeByPerformer($name)` - Filter by performed_by
- `scopeRecent($days)` - Last N days
- `scopeForCropCycle($id)` - Filter by crop_cycle_id
- `scopeForLandParcel($id)` - Filter by land_parcel_id

### ⚠️ IMMUTABLE
```php
protected static function boot()
{
    parent::boot();
    
    static::updating(function ($model) {
        throw new \Exception('Activity logs cannot be updated.');
    });
    
    static::deleting(function ($model) {
        throw new \Exception('Activity logs cannot be deleted.');
    });
}
```

---

## 👤 User

**File:** `app/Models/User.php`  
**Table:** `users`

### Description
System users (Laravel default with modifications).

### Traits
- `HasFactory`
- `Notifiable`
- `HasApiTokens` (planned for Sanctum)

---

## Model Files Summary

```
backend/app/Models/
├── ActivityLog.php          # 📝 Immutable activity records
├── ActivityType.php         # 🏷️ Activity categories
├── CropCycle.php            # 🔄 Main cycle entity with state machine
├── CropCycleStage.php       # 📊 Stages within cycles
├── CropType.php             # 🌱 Crop catalog
├── LandParcel.php           # 🌾 Farm land areas
├── LandParcelWaterSource.php # 🔗 Pivot model
├── Season.php               # 📅 Season instances
├── SeasonDefinition.php     # 🌸 Season templates
├── UnitOfMeasure.php        # 📐 Measurement units
├── User.php                 # 👤 System users
└── WaterSource.php          # 💧 Water sources
```

---

*See also: [Database Schema](database-schema.md) | [API Endpoints](api-endpoints.md)*
