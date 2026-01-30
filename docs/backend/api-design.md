# 🎯 API Design Principles

RESTful API design standards and conventions for Soleil Farm.

---

## API Versioning

All API endpoints are prefixed with version:

```
http://localhost:8000/api/v1/...
```

---

## URL Conventions

### Resources

| Pattern | Description | Example |
|---------|-------------|---------|
| `/resources` | Collection | `/land-parcels` |
| `/resources/{id}` | Single item | `/land-parcels/1` |
| `/resources/{id}/related` | Related collection | `/land-parcels/1/crop-cycles` |
| `/resources/{id}/action` | Custom action | `/crop-cycles/1/activate` |

### Naming Rules

- Use **kebab-case** for URLs: `crop-cycles`, not `cropCycles`
- Use **plural nouns** for resources: `land-parcels`, not `land-parcel`
- Use **verbs** only for custom actions: `activate`, `complete`

---

## HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| GET | Retrieve resource(s) | `GET /land-parcels` |
| POST | Create resource | `POST /land-parcels` |
| PUT | Update entire resource | `PUT /land-parcels/1` |
| PATCH | Partial update | `PATCH /land-parcels/1` |
| DELETE | Remove resource | `DELETE /land-parcels/1` |

---

## Response Format

### Success Response

```json
{
  "data": {
    "id": 1,
    "name": "Ruộng Đồng Trước",
    "code": "DONG-TRUOC-01",
    ...
  }
}
```

### Collection Response

```json
{
  "data": [
    { "id": 1, "name": "..." },
    { "id": 2, "name": "..." }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 50,
    "last_page": 3
  }
}
```

### Error Response

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": [
      "Error message 1",
      "Error message 2"
    ]
  }
}
```

---

## HTTP Status Codes

### Success Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST creating resource |
| 204 | No Content | Successful DELETE with no response body |

### Error Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 400 | Bad Request | Malformed request syntax |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Server Error | Internal server error |

---

## Query Parameters

### Filtering

```
GET /crop-cycles?status=active
GET /crop-cycles?land_parcel_id=1
GET /land-parcels?land_type=rice_field
```

### Date Range

```
GET /activity-logs?start_date=2026-01-01&end_date=2026-01-31
```

### Pagination

```
GET /activity-logs?page=2&per_page=20
```

### Including Relationships

```
GET /crop-cycles?include=landParcel,cropType,season
```

---

## Request Headers

### Required Headers

```http
Content-Type: application/json
Accept: application/json
```

### Authentication (Future)

```http
Authorization: Bearer {token}
```

---

## Validation Rules

Validation errors return 422 status with field-specific messages:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "planned_start_date": [
      "The planned start date field is required.",
      "The planned start date must be a date after today."
    ],
    "land_parcel_id": [
      "The selected land parcel id is invalid."
    ]
  }
}
```

---

## Soft Deletes

Instead of hard deletes, most resources use `is_active` flag:

```http
DELETE /land-parcels/1
```

**Effect:** Sets `is_active = false`, not actual deletion.

**Query Behavior:**
- By default, only active records are returned
- Use `?include_inactive=true` to include all records

---

## Immutable Resources

`ActivityLog` is immutable - cannot be updated or deleted:

```http
PUT /activity-logs/1   → 405 Method Not Allowed
DELETE /activity-logs/1 → 405 Method Not Allowed
```

---

## CORS Configuration

```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

---

*See also: [API Endpoints](api-endpoints.md) | [API Examples](api-examples.md)*
