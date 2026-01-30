# 📋 API Endpoints Reference

Base URL: `http://localhost:8000/api/v1`

---

## 📊 Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Get comprehensive dashboard statistics |
| GET | `/dashboard/export/csv` | Export dashboard data as CSV |
| GET | `/dashboard/export/pdf` | Export dashboard data as PDF |

**Response Schema (`/dashboard/stats`):**
```typescript
{
  total_area: number,              // Total land area
  total_area_unit: string,         // 'm²' or 'hectares'
  land_parcels_count: number,      // Total land parcels
  land_parcels_breakdown: {
    active: number,
    inactive: number
  },
  active_crop_cycles: number,      // Currently active cycles
  activities_today: number,        // Activities recorded today
  crop_cycles_by_season: [         // Bar chart data
    { season_id, season_name, year, count }
  ],
  land_parcel_status_distribution: [ // Pie chart data
    { status, label, count, color }
  ],
  activity_frequency: [            // Line chart data (30 days)
    { date, count }
  ],
  active_crop_cycles_list: [       // Timeline/table data
    { id, name, land_parcel_name, crop_type_name, status, 
      planned_start_date, planned_end_date, progress_percentage }
  ],
  recent_activities: [             // Recent activity table
    { id, activity_type_name, activity_type_code, crop_cycle_name,
      land_parcel_name, user_name, activity_date, description }
  ]
}
```

---

## 📐 Units of Measure

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/units-of-measure` | List all units |
| POST | `/units-of-measure` | Create unit |
| GET | `/units-of-measure/{id}` | Get single unit |
| PUT | `/units-of-measure/{id}` | Update unit |
| DELETE | `/units-of-measure/{id}` | Deactivate unit |
| GET | `/units-of-measure/type/{type}` | Get units by type |

**Query Parameters:**
- `type` - Filter by unit_type (area, weight, volume, etc.)
- `active_only` - Boolean, default true

---

## 🌸 Season Definitions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/season-definitions` | List all definitions |
| POST | `/season-definitions` | Create definition |
| GET | `/season-definitions/{id}` | Get single definition |
| PUT | `/season-definitions/{id}` | Update definition |
| DELETE | `/season-definitions/{id}` | Deactivate definition |

---

## 📅 Seasons

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/seasons` | List all seasons |
| POST | `/seasons` | Create season |
| GET | `/seasons/{id}` | Get single season |
| PUT | `/seasons/{id}` | Update season |
| DELETE | `/seasons/{id}` | Delete season |
| GET | `/seasons/year/{year}` | Get seasons for year |
| GET | `/seasons/current` | Get current season |

**Query Parameters:**
- `year` - Filter by year (e.g., 2026)

---

## 🏷️ Activity Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activity-types` | List all types |
| POST | `/activity-types` | Create type |
| GET | `/activity-types/{id}` | Get single type |
| PUT | `/activity-types/{id}` | Update type |
| DELETE | `/activity-types/{id}` | Deactivate type |
| GET | `/activity-types/category/{category}` | Get by category |

**Categories:** `land_preparation`, `planting`, `irrigation`, `fertilizing`, `pest_control`, `harvesting`, `maintenance`, `observation`, `other`

---

## 🌾 Land Parcels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/land-parcels` | List all parcels |
| POST | `/land-parcels` | Create parcel |
| GET | `/land-parcels/{id}` | Get single parcel |
| PUT | `/land-parcels/{id}` | Update parcel |
| DELETE | `/land-parcels/{id}` | Deactivate parcel |
| GET | `/land-parcels/{id}/water-sources` | Get water sources |
| POST | `/land-parcels/{id}/water-sources` | Attach water source |
| DELETE | `/land-parcels/{id}/water-sources/{wsId}` | Detach water source |
| GET | `/land-parcels/{id}/crop-cycles` | Get crop cycles |
| GET | `/land-parcels/{id}/activity-logs` | Get activity logs |

**Query Parameters:**
- `land_type` - Filter by type (rice_field, garden, etc.)
- `active_only` - Boolean, default true

**Land Types:** `rice_field`, `garden`, `fish_pond`, `mixed`, `fallow`, `other`

---

## 💧 Water Sources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/water-sources` | List all sources |
| POST | `/water-sources` | Create source |
| GET | `/water-sources/{id}` | Get single source |
| PUT | `/water-sources/{id}` | Update source |
| DELETE | `/water-sources/{id}` | Deactivate source |
| GET | `/water-sources/{id}/land-parcels` | Get connected parcels |

**Source Types:** `well`, `river`, `stream`, `pond`, `irrigation_canal`, `rainwater`, `municipal`

---

## 🌱 Crop Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crop-types` | List all types |
| POST | `/crop-types` | Create type |
| GET | `/crop-types/{id}` | Get single type |
| PUT | `/crop-types/{id}` | Update type |
| DELETE | `/crop-types/{id}` | Deactivate type |
| GET | `/crop-types/{id}/statistics` | Get yield statistics |

**Categories:** `grain`, `vegetable`, `fruit`, `legume`, `tuber`, `herb`, `flower`, `fodder`, `other`

---

## 🔄 Crop Cycles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/crop-cycles` | List all cycles |
| POST | `/crop-cycles` | Create cycle |
| GET | `/crop-cycles/{id}` | Get single cycle |
| PUT | `/crop-cycles/{id}` | Update cycle |
| DELETE | `/crop-cycles/{id}` | Delete cycle (planned only) |
| POST | `/crop-cycles/{id}/activate` | Start the cycle |
| POST | `/crop-cycles/{id}/complete` | Complete with yield |
| POST | `/crop-cycles/{id}/fail` | Mark as failed |
| POST | `/crop-cycles/{id}/abandon` | Mark as abandoned |
| GET | `/crop-cycles/{id}/stages` | Get stages |
| POST | `/crop-cycles/{id}/stages` | Add stage |
| GET | `/crop-cycles/{id}/activity-logs` | Get activity logs |

**Query Parameters:**
- `status` - Filter by status
- `land_parcel_id` - Filter by land parcel
- `crop_type_id` - Filter by crop type

**Status Values:** `planned`, `active`, `completed`, `failed`, `abandoned`

**Status Transitions:**
```
planned ──► active ──► completed
              │
              ├──► failed
              │
              └──► abandoned
```

---

## 📊 Crop Cycle Stages

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/crop-cycle-stages/{id}` | Update stage |
| DELETE | `/crop-cycle-stages/{id}` | Delete stage |
| POST | `/crop-cycle-stages/{id}/start` | Start stage |
| POST | `/crop-cycle-stages/{id}/complete` | Complete stage |

**Status Values:** `pending`, `in_progress`, `completed`, `skipped`

---

## 📝 Activity Logs

⚠️ **IMMUTABLE:** Activity logs cannot be updated or deleted after creation.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activity-logs` | List all logs (paginated) |
| POST | `/activity-logs` | Create log |
| GET | `/activity-logs/{id}` | Get single log |
| GET | `/activity-logs/date/{date}` | Get logs for date |
| GET | `/activity-logs/performer/{name}` | Get logs by performer |
| GET | `/activity-logs/recent` | Get recent logs |

**Query Parameters:**
- `activity_type_id` - Filter by activity type
- `land_parcel_id` - Filter by land parcel
- `crop_cycle_id` - Filter by crop cycle
- `start_date` & `end_date` - Date range filter
- `performed_by` - Filter by performer
- `per_page` - Pagination size (default 20)
- `days` - For recent endpoint (default 7)

---

## Request/Response Examples

### Create Crop Cycle

**Request:**
```http
POST /api/v1/crop-cycles
Content-Type: application/json

{
  "land_parcel_id": 1,
  "crop_type_id": 1,
  "season_id": 1,
  "planned_start_date": "2026-02-01",
  "planned_end_date": "2026-06-15",
  "notes": "Vụ lúa Đông-Xuân 2026"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 1,
    "cycle_code": "DONG-TRUOC-01-2026-01",
    "status": "planned",
    "planned_start_date": "2026-02-01",
    "planned_end_date": "2026-06-15",
    "created_at": "2026-01-29T10:00:00.000000Z"
  }
}
```

### Complete Crop Cycle

**Request:**
```http
POST /api/v1/crop-cycles/1/complete
Content-Type: application/json

{
  "yield_value": 450.5,
  "yield_unit_id": 5,
  "quality_rating": "good"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "status": "completed",
    "actual_end_date": "2026-06-10",
    "yield_value": 450.5,
    "quality_rating": "good"
  }
}
```

---

*See also: [API Examples](api-examples.md) | [Authentication](api-authentication.md)*
