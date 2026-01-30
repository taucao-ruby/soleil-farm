# 📝 API Examples

Practical examples using cURL commands.

## Base URL
```
http://localhost:8000/api/v1
```

---

## Dashboard

### Get Dashboard Statistics
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/stats
```

### Export CSV
```bash
curl -X GET http://localhost:8000/api/v1/dashboard/export/csv -o dashboard.csv
```

---

## Land Parcels

### List All Land Parcels
```bash
curl -X GET http://localhost:8000/api/v1/land-parcels
```

### Filter by Type
```bash
curl -X GET "http://localhost:8000/api/v1/land-parcels?land_type=rice_field"
```

### Create Land Parcel
```bash
curl -X POST http://localhost:8000/api/v1/land-parcels \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ruộng Mới",
    "code": "RUONG-MOI-01",
    "land_type": "rice_field",
    "area_value": 2.5,
    "area_unit_id": 2,
    "terrain_type": "flat",
    "soil_type": "alluvial"
  }'
```

### Get Single Land Parcel
```bash
curl -X GET http://localhost:8000/api/v1/land-parcels/1
```

### Update Land Parcel
```bash
curl -X PUT http://localhost:8000/api/v1/land-parcels/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Ruộng lúa chính của gia đình"
  }'
```

### Attach Water Source
```bash
curl -X POST http://localhost:8000/api/v1/land-parcels/1/water-sources \
  -H "Content-Type: application/json" \
  -d '{
    "water_source_id": 1,
    "accessibility": "direct",
    "is_primary_source": true
  }'
```

---

## Crop Types

### List All Crop Types
```bash
curl -X GET http://localhost:8000/api/v1/crop-types
```

### Filter by Category
```bash
curl -X GET "http://localhost:8000/api/v1/crop-types?category=grain"
```

### Create Crop Type
```bash
curl -X POST http://localhost:8000/api/v1/crop-types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lúa OM18",
    "code": "LUA-OM18",
    "scientific_name": "Oryza sativa",
    "variety": "OM18",
    "category": "grain",
    "typical_grow_duration_days": 100,
    "default_yield_unit_id": 5
  }'
```

### Get Crop Statistics
```bash
curl -X GET http://localhost:8000/api/v1/crop-types/1/statistics
```

---

## Crop Cycles

### List All Crop Cycles
```bash
curl -X GET http://localhost:8000/api/v1/crop-cycles
```

### Filter by Status
```bash
curl -X GET "http://localhost:8000/api/v1/crop-cycles?status=active"
```

### Filter by Land Parcel
```bash
curl -X GET "http://localhost:8000/api/v1/crop-cycles?land_parcel_id=1"
```

### Create Crop Cycle
```bash
curl -X POST http://localhost:8000/api/v1/crop-cycles \
  -H "Content-Type: application/json" \
  -d '{
    "land_parcel_id": 1,
    "crop_type_id": 1,
    "season_id": 1,
    "planned_start_date": "2026-02-01",
    "planned_end_date": "2026-06-15",
    "notes": "Vụ lúa Đông-Xuân 2026"
  }'
```

### Activate Crop Cycle
```bash
curl -X POST http://localhost:8000/api/v1/crop-cycles/1/activate
```

### Complete Crop Cycle with Yield
```bash
curl -X POST http://localhost:8000/api/v1/crop-cycles/1/complete \
  -H "Content-Type: application/json" \
  -d '{
    "yield_value": 450.5,
    "yield_unit_id": 5,
    "quality_rating": "good"
  }'
```

### Mark as Failed
```bash
curl -X POST http://localhost:8000/api/v1/crop-cycles/1/fail \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Bị sâu bệnh nặng, mất mùa hoàn toàn"
  }'
```

### Add Stage to Crop Cycle
```bash
curl -X POST http://localhost:8000/api/v1/crop-cycles/1/stages \
  -H "Content-Type: application/json" \
  -d '{
    "stage_name": "Gieo mạ",
    "sequence_order": 1,
    "planned_start_date": "2026-02-01",
    "planned_end_date": "2026-02-15"
  }'
```

---

## Activity Logs

### List Recent Activity Logs
```bash
curl -X GET http://localhost:8000/api/v1/activity-logs/recent
```

### List with Pagination
```bash
curl -X GET "http://localhost:8000/api/v1/activity-logs?page=1&per_page=10"
```

### Filter by Date Range
```bash
curl -X GET "http://localhost:8000/api/v1/activity-logs?start_date=2026-01-01&end_date=2026-01-31"
```

### Create Activity Log
```bash
curl -X POST http://localhost:8000/api/v1/activity-logs \
  -H "Content-Type: application/json" \
  -d '{
    "activity_type_id": 1,
    "land_parcel_id": 1,
    "crop_cycle_id": 1,
    "activity_date": "2026-01-29",
    "start_time": "07:00",
    "end_time": "11:00",
    "description": "Cày đất lần 1, chuẩn bị cho vụ mới",
    "performed_by": "Ba",
    "weather_conditions": "Nắng nhẹ"
  }'
```

### Create Activity with Cost
```bash
curl -X POST http://localhost:8000/api/v1/activity-logs \
  -H "Content-Type: application/json" \
  -d '{
    "activity_type_id": 11,
    "land_parcel_id": 1,
    "crop_cycle_id": 1,
    "activity_date": "2026-02-20",
    "description": "Bón phân NPK 16-16-8",
    "quantity_value": 50,
    "quantity_unit_id": 5,
    "cost_value": 250000,
    "cost_unit_id": 11,
    "performed_by": "Ba"
  }'
```

---

## Seasons

### List Current Year Seasons
```bash
curl -X GET http://localhost:8000/api/v1/seasons/year/2026
```

### Get Current Season
```bash
curl -X GET http://localhost:8000/api/v1/seasons/current
```

### Create Season
```bash
curl -X POST http://localhost:8000/api/v1/seasons \
  -H "Content-Type: application/json" \
  -d '{
    "season_definition_id": 1,
    "year": 2026,
    "actual_start_date": "2025-11-15",
    "actual_end_date": "2026-05-30"
  }'
```

---

## Water Sources

### List All Water Sources
```bash
curl -X GET http://localhost:8000/api/v1/water-sources
```

### Get Land Parcels Connected to Water Source
```bash
curl -X GET http://localhost:8000/api/v1/water-sources/1/land-parcels
```

---

## Units of Measure

### List All Units
```bash
curl -X GET http://localhost:8000/api/v1/units-of-measure
```

### Get Units by Type
```bash
curl -X GET http://localhost:8000/api/v1/units-of-measure/type/weight
```

---

## Error Handling Examples

### Validation Error (422)
```bash
curl -X POST http://localhost:8000/api/v1/crop-cycles \
  -H "Content-Type: application/json" \
  -d '{}'
```

Response:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "land_parcel_id": ["The land parcel id field is required."],
    "crop_type_id": ["The crop type id field is required."],
    "planned_start_date": ["The planned start date field is required."],
    "planned_end_date": ["The planned end date field is required."]
  }
}
```

### Overlapping Cycle Error (422)
```json
{
  "message": "This land parcel already has an overlapping crop cycle for the specified dates."
}
```

### Invalid Status Transition (422)
```json
{
  "message": "Cannot transition from 'planned' to 'completed'"
}
```

---

*See also: [API Endpoints](api-endpoints.md) | [Authentication](api-authentication.md)*
