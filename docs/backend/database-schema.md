# 🗄️ Database Schema

Complete database schema for Soleil Farm.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              REFERENCE DATA                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐    │
│  │ units_of_measure │     │season_definitions│     │  activity_types  │    │
│  ├──────────────────┤     ├──────────────────┤     ├──────────────────┤    │
│  │ id               │     │ id               │     │ id               │    │
│  │ name             │     │ name             │     │ name             │    │
│  │ abbreviation     │     │ code             │     │ code             │    │
│  │ unit_type        │     │ typical_start    │     │ category         │    │
│  │ conversion_factor│     │ typical_end      │     │ description      │    │
│  │ is_base_unit     │     │ is_active        │     │ is_active        │    │
│  │ is_active        │     └────────┬─────────┘     └────────┬─────────┘    │
│  └────────┬─────────┘              │                        │              │
│           │                        │                        │              │
└───────────┼────────────────────────┼────────────────────────┼──────────────┘
            │                        │                        │
            │               ┌────────▼─────────┐              │
            │               │     seasons      │              │
            │               ├──────────────────┤              │
            │               │ id               │              │
            │               │ season_def_id FK │              │
            │               │ year             │              │
            │               │ actual_start     │              │
            │               │ actual_end       │              │
            │               └────────┬─────────┘              │
            │                        │                        │
┌───────────┼────────────────────────┼────────────────────────┼──────────────┐
│           │          CORE DOMAIN   │                        │              │
├───────────┼────────────────────────┼────────────────────────┼──────────────┤
│           │                        │                        │              │
│  ┌────────▼─────────┐    ┌─────────▼────────┐     ┌─────────▼────────┐    │
│  │   land_parcels   │    │   crop_cycles    │     │  activity_logs   │    │
│  ├──────────────────┤    ├──────────────────┤     ├──────────────────┤    │
│  │ id               │◄───│ land_parcel_id FK│     │ id               │    │
│  │ name             │    │ crop_type_id  FK │────►│ activity_type FK │    │
│  │ code             │    │ season_id     FK │     │ crop_cycle_id FK │────┤
│  │ land_type        │    │ cycle_code       │     │ land_parcel_id FK│◄───┤
│  │ area_value       │    │ status           │     │ water_source_id  │    │
│  │ area_unit_id  FK─┼───►│ planned_start    │     │ activity_date    │    │
│  │ terrain_type     │    │ planned_end      │     │ description      │    │
│  │ soil_type        │    │ actual_start     │     │ quantity_value   │    │
│  │ latitude         │    │ actual_end       │     │ cost_value       │    │
│  │ longitude        │    │ yield_value      │     │ performed_by     │    │
│  │ is_active        │    │ yield_unit_id FK │     │ weather          │    │
│  └────────┬─────────┘    │ quality_rating   │     └──────────────────┘    │
│           │              └────────┬─────────┘                             │
│           │                       │                                       │
│  ┌────────▼─────────┐    ┌────────▼─────────┐     ┌──────────────────┐    │
│  │  water_sources   │    │crop_cycle_stages │     │   crop_types     │    │
│  ├──────────────────┤    ├──────────────────┤     ├──────────────────┤    │
│  │ id               │    │ id               │     │ id               │    │
│  │ name             │    │ crop_cycle_id FK │     │ name             │    │
│  │ code             │    │ stage_name       │     │ code             │    │
│  │ source_type      │    │ sequence_order   │     │ scientific_name  │    │
│  │ reliability      │    │ planned_start    │     │ variety          │    │
│  │ water_quality    │    │ planned_end      │     │ category         │    │
│  │ latitude         │    │ actual_start     │     │ grow_duration    │    │
│  │ longitude        │    │ actual_end       │     │ yield_unit_id FK │    │
│  │ is_active        │    │ status           │     │ is_active        │    │
│  └────────┬─────────┘    └──────────────────┘     └──────────────────┘    │
│           │                                                               │
│  ┌────────▼─────────────────────┐                                         │
│  │land_parcel_water_sources     │ (Pivot Table)                           │
│  ├──────────────────────────────┤                                         │
│  │ land_parcel_id FK            │                                         │
│  │ water_source_id FK           │                                         │
│  │ accessibility                │                                         │
│  │ is_primary_source            │                                         │
│  └──────────────────────────────┘                                         │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Tables Reference

### 1. units_of_measure
Reference table for all measurement units.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(50) | Unit name (e.g., "Sào (Bắc)") |
| abbreviation | VARCHAR(20) | Short form (e.g., "sào") |
| unit_type | ENUM | area, weight, volume, quantity, currency, time |
| conversion_factor_to_base | DECIMAL(15,6) | Conversion multiplier |
| is_base_unit | BOOLEAN | Is this the base unit for its type? |
| is_active | BOOLEAN | Soft delete flag |

**Indexes:** unit_type, is_active

---

### 2. season_definitions
Templates for farming seasons.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Season name (e.g., "Vụ Đông-Xuân") |
| code | VARCHAR(20) | Unique code (e.g., "DONG-XUAN") |
| description | TEXT | Description |
| typical_start_month | TINYINT | 1-12 |
| typical_end_month | TINYINT | 1-12 |
| is_active | BOOLEAN | Soft delete flag |

---

### 3. seasons
Actual season occurrences per year.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| season_definition_id | BIGINT FK | Reference to template |
| year | YEAR | The year |
| actual_start_date | DATE | When season actually started |
| actual_end_date | DATE | When season actually ended |
| notes | TEXT | Notes |

**Unique:** (season_definition_id, year)

---

### 4. land_parcels
Farm land areas.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Name (e.g., "Ruộng Đồng Trước") |
| code | VARCHAR(30) | Unique code |
| description | TEXT | Description |
| land_type | ENUM | rice_field, garden, fish_pond, mixed, fallow, other |
| area_value | DECIMAL(10,2) | Area size |
| area_unit_id | BIGINT FK | Unit of measurement |
| terrain_type | ENUM | flat, sloped, terraced, lowland |
| soil_type | ENUM | clay, sandy, loamy, alluvial, mixed |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| is_active | BOOLEAN | Soft delete flag |

---

### 5. water_sources
Water sources available on the farm.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Name (e.g., "Suối Đá") |
| code | VARCHAR(30) | Unique code |
| source_type | ENUM | well, river, stream, pond, irrigation_canal, rainwater, municipal |
| description | TEXT | Description |
| latitude | DECIMAL(10,8) | GPS latitude |
| longitude | DECIMAL(11,8) | GPS longitude |
| reliability | ENUM | permanent, seasonal, intermittent |
| water_quality | ENUM | excellent, good, fair, poor |
| is_active | BOOLEAN | Soft delete flag |

---

### 6. land_parcel_water_sources (Pivot)
Many-to-many relationship between land parcels and water sources.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| land_parcel_id | BIGINT FK | Land parcel |
| water_source_id | BIGINT FK | Water source |
| accessibility | ENUM | direct, pumped, gravity_fed, manual |
| is_primary_source | BOOLEAN | Is this the primary water source? |
| notes | TEXT | Notes |

**Unique:** (land_parcel_id, water_source_id)

---

### 7. crop_types
Catalog of crops that can be grown.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Name (e.g., "Lúa ST25") |
| code | VARCHAR(30) | Unique code |
| scientific_name | VARCHAR(150) | Scientific name |
| variety | VARCHAR(100) | Variety name |
| category | ENUM | grain, vegetable, fruit, legume, tuber, herb, flower, fodder, other |
| description | TEXT | Description |
| typical_grow_duration_days | SMALLINT | Typical growing days |
| default_yield_unit_id | BIGINT FK | Default unit for yield |
| is_active | BOOLEAN | Soft delete flag |

---

### 8. crop_cycles
Core entity: A single crop growing cycle on a land parcel.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| cycle_code | VARCHAR(50) | Unique code (auto-generated) |
| land_parcel_id | BIGINT FK | Where it's growing |
| crop_type_id | BIGINT FK | What's being grown |
| season_id | BIGINT FK | Which season (optional) |
| status | ENUM | planned, active, completed, failed, abandoned |
| planned_start_date | DATE | Planned start |
| planned_end_date | DATE | Planned end |
| actual_start_date | DATE | When actually started |
| actual_end_date | DATE | When actually ended |
| yield_value | DECIMAL(12,2) | Harvest yield |
| yield_unit_id | BIGINT FK | Unit for yield |
| quality_rating | ENUM | excellent, good, average, below_average, poor |
| notes | TEXT | Notes |

**Business Rule:** No overlapping cycles per land parcel.

---

### 9. crop_cycle_stages
Stages within a crop cycle.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| crop_cycle_id | BIGINT FK | Parent cycle |
| stage_name | VARCHAR(100) | Name (e.g., "Gieo mạ") |
| sequence_order | SMALLINT | Order in sequence |
| planned_start_date | DATE | Planned start |
| planned_end_date | DATE | Planned end |
| actual_start_date | DATE | Actual start |
| actual_end_date | DATE | Actual end |
| status | ENUM | pending, in_progress, completed, skipped |
| notes | TEXT | Notes |

**Unique:** (crop_cycle_id, sequence_order)

---

### 10. activity_types
Categories of farm activities.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Name (e.g., "Cày đất") |
| code | VARCHAR(30) | Unique code |
| category | ENUM | land_preparation, planting, irrigation, fertilizing, pest_control, harvesting, maintenance, observation, other |
| description | TEXT | Description |
| is_active | BOOLEAN | Soft delete flag |

---

### 11. activity_logs
**IMMUTABLE** audit trail of all farm activities.

| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| activity_type_id | BIGINT FK | Type of activity |
| crop_cycle_id | BIGINT FK | Related crop cycle (optional) |
| land_parcel_id | BIGINT FK | Where it happened (optional) |
| water_source_id | BIGINT FK | Water source used (optional) |
| activity_date | DATE | When it happened |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| description | TEXT | What was done |
| quantity_value | DECIMAL(12,2) | Quantity used |
| quantity_unit_id | BIGINT FK | Unit for quantity |
| cost_value | DECIMAL(12,2) | Cost incurred |
| cost_unit_id | BIGINT FK | Currency unit |
| performed_by | VARCHAR(100) | Who did it |
| weather_conditions | VARCHAR(100) | Weather at the time |

**⚠️ IMMUTABLE:** Cannot be updated or deleted after creation.

---

## Migration Order

```
1. 0001_01_01_000000_create_users_table.php      (Laravel default)
2. 0001_01_01_000001_create_cache_table.php      (Laravel default)
3. 0001_01_01_000002_create_jobs_table.php       (Laravel default)
4. 2026_01_28_000001_create_units_of_measure_table.php
5. 2026_01_28_000002_create_season_definitions_table.php
6. 2026_01_28_000003_create_seasons_table.php
7. 2026_01_28_000004_create_land_parcels_table.php
8. 2026_01_28_000005_create_water_sources_table.php
9. 2026_01_28_000006_create_land_parcel_water_sources_table.php
10. 2026_01_28_000007_create_crop_types_table.php
11. 2026_01_28_000008_create_crop_cycles_table.php
12. 2026_01_28_000009_create_crop_cycle_stages_table.php
13. 2026_01_28_000010_create_activity_types_table.php
14. 2026_01_28_000011_create_activity_logs_table.php
```

---

*See also: [Architecture](architecture.md) | [API Endpoints](api-endpoints.md)*
