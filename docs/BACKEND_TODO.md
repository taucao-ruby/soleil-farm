# 📋 Backend TODO List - Soleil Farm

> **Ngày tạo**: 30/01/2026  
> **Mục tiêu**: Demo cho khách hàng vào thứ 6  
> **Backend URL**: http://localhost:8000

---

## 🔐 Thông tin đăng nhập hiện tại

| Field | Value |
|-------|-------|
| Email | `admin@soleilfarm.vn` |
| Password | `password123` |

---

## 📊 Tổng quan hoàn thiện

| Component | Status | % | Ghi chú |
|-----------|--------|---|---------|
| Controllers | ⚠️ | 90% | Thiếu FormRequest, pagination |
| Models | ✅ | 95% | OK |
| Resources | ✅ | 90% | Thiếu UserResource |
| Services | ⚠️ | 20% | Chỉ có CropCycleService |
| **Tests** | ❌ | **0%** | **CRITICAL - Không có tests** |
| Seeders | ⚠️ | 60% | Thiếu sample data |
| Routes | ⚠️ | 80% | Thiếu auth middleware |
| Middleware | ❌ | 0% | Không có custom middleware |
| FormRequests | ❌ | 0% | Không có |
| Factories | ❌ | 10% | Chỉ có UserFactory |
| Migrations | ✅ | 100% | OK |

---

## 🔴 CRITICAL - Ưu tiên cao nhất

### 1. [x] Setup Laravel Sanctum Authentication ✅ DONE
**Đã hoàn thành**: Migrated từ remember_token sang Laravel Sanctum
- ✅ Installed `laravel/sanctum` v4.3.0
- ✅ Updated `User.php` với `HasApiTokens` trait
- ✅ Refactored `AuthController.php` với Sanctum tokens
- ✅ Configured `config/sanctum.php` với token expiration 7 days
- ✅ Created `config/cors.php` cho frontend CORS

---

### 2. [x] Thêm Auth Middleware cho Protected Routes ✅ DONE
**Đã hoàn thành**: Protected routes với `auth:sanctum` middleware
- ✅ Public routes: `/auth/login`, `/auth/register` (với rate limiting 10/min)
- ✅ Protected routes: Tất cả endpoints khác (với rate limiting 60/min)
- ✅ Named routes cho tất cả endpoints
- ✅ Configured `bootstrap/app.php` với Sanctum middleware

---

### 3. [ ] Tạo Test Suite cơ bản
**Vấn đề**: Không có tests nào

**Priority order**:
1. `tests/Feature/Auth/LoginTest.php`
2. `tests/Feature/Auth/AuthenticationTest.php`
3. `tests/Feature/CropCycle/CropCycleTest.php`
4. `tests/Feature/ActivityLog/ActivityLogTest.php`
5. `tests/Feature/LandParcel/LandParcelTest.php`

---

## 🟠 HIGH Priority

### 4. [ ] Tạo Model Factories
**Vấn đề**: Không thể viết tests mà không có factories

**Files cần tạo**:
```
database/factories/
├── CropCycleFactory.php
├── LandParcelFactory.php
├── ActivityLogFactory.php
├── CropTypeFactory.php
├── SeasonFactory.php
├── SeasonDefinitionFactory.php
├── WaterSourceFactory.php
├── ActivityTypeFactory.php
├── UnitOfMeasureFactory.php
└── CropCycleStageFactory.php
```

---

### 5. [ ] Tạo FormRequest Classes
**Vấn đề**: Validation nằm trong controller, khó maintain

**Files cần tạo**:
```
app/Http/Requests/
├── Auth/
│   ├── LoginRequest.php
│   └── RegisterRequest.php
├── CropCycle/
│   ├── StoreCropCycleRequest.php
│   └── UpdateCropCycleRequest.php
├── LandParcel/
│   ├── StoreLandParcelRequest.php
│   └── UpdateLandParcelRequest.php
├── ActivityLog/
│   └── StoreActivityLogRequest.php
├── WaterSource/
│   ├── StoreWaterSourceRequest.php
│   └── UpdateWaterSourceRequest.php
└── CropType/
    ├── StoreCropTypeRequest.php
    └── UpdateCropTypeRequest.php
```

---

### 6. [ ] Tạo Missing Seeders (Sample Data)
**Vấn đề**: Thiếu sample data cho demo

**Files cần tạo**:
```
database/seeders/
├── SeasonSeeder.php              # Mùa vụ 2025, 2026
├── CropCycleSeeder.php           # 20+ crop cycles với các status
├── CropCycleStageSeeder.php      # Stages cho mỗi cycle
├── ActivityLogSeeder.php         # 50+ activity logs
└── LandParcelWaterSourceSeeder.php  # Link parcels với water sources
```

---

## 🟡 MEDIUM Priority

### 7. [ ] Thêm Pagination cho Index Endpoints
**Vấn đề**: Trả về tất cả records, chậm khi data lớn

**Controllers cần sửa**:
- `LandParcelController::index()`
- `CropCycleController::index()`
- `ActivityLogController::index()`
- `WaterSourceController::index()`
- `CropTypeController::index()`

**Sửa từ**:
```php
return CropCycleResource::collection(CropCycle::all());
```

**Thành**:
```php
return CropCycleResource::collection(
    CropCycle::paginate($request->get('per_page', 15))
);
```

---

### 8. [ ] Tạo Services Layer
**Vấn đề**: Business logic nằm trong controllers

**Files cần tạo**:
```
app/Services/
├── CropCycleService.php    ✅ Đã có
├── AuthService.php         ❌ Cần tạo
├── DashboardService.php    ❌ Cần tạo
├── ActivityLogService.php  ❌ Cần tạo
└── SeasonService.php       ❌ Cần tạo
```

---

### 9. [ ] Tạo Authorization Policies
**Vấn đề**: Không có authorization, ai cũng edit được data của người khác

**Files cần tạo**:
```
app/Policies/
├── CropCyclePolicy.php
├── LandParcelPolicy.php
├── ActivityLogPolicy.php
└── WaterSourcePolicy.php
```

---

### 10. [ ] Thêm Rate Limiting
**File**: `routes/api.php`

```php
Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(function () {
        // routes...
    });
```

---

## 🟢 LOW Priority (Nice to have)

### 11. [ ] Đặt tên cho Routes
```php
Route::get('land-parcels', [LandParcelController::class, 'index'])
    ->name('land-parcels.index');
```

### 12. [ ] Tạo UserResource
**File**: `app/Http/Resources/UserResource.php`

### 13. [ ] Thêm Soft Deletes cho Models quan trọng
- `LandParcel`
- `CropCycle`
- `WaterSource`

### 14. [ ] Tạo API Documentation (OpenAPI/Swagger)

### 15. [ ] Thêm Request/Response Logging Middleware

---

## 📝 Ghi chú khi làm

### Thứ tự recommend:
1. **Sanctum + Auth middleware** (30 phút) → Bảo mật
2. **Factories** (1 giờ) → Cần cho tests
3. **Core Tests** (2 giờ) → Auth, CropCycle, LandParcel
4. **Seeders** (30 phút) → Demo data
5. **FormRequests** (1 giờ) → Code quality
6. **Pagination** (30 phút) → Performance

### Commands hữu ích:
```bash
# Chạy tests
php artisan test

# Chạy tests với coverage
php artisan test --coverage

# Tạo factory
php artisan make:factory CropCycleFactory

# Tạo FormRequest
php artisan make:request StoreCropCycleRequest

# Tạo Policy
php artisan make:policy CropCyclePolicy --model=CropCycle

# Tạo Seeder
php artisan make:seeder CropCycleSeeder

# Chạy seeder cụ thể
php artisan db:seed --class=CropCycleSeeder

# Fresh database + seed
php artisan migrate:fresh --seed
```

---

## ✅ Đã hoàn thành

- [x] Tạo AuthController với login/register/logout/me
- [x] Thêm auth routes vào api.php
- [x] Tạo AdminUserSeeder
- [x] Fix UnitOfMeasure table name
- [x] Seed sample data (units, seasons, crop types, land parcels, water sources)
- [x] Frontend có thể gọi login API
- [x] **Setup Laravel Sanctum Authentication** (30/01/2026)
  - Installed laravel/sanctum v4.3.0
  - Updated User model với HasApiTokens trait
  - Refactored AuthController với Sanctum tokens
  - Token expiration: 7 days
  - Added refresh token endpoint
- [x] **Protected API Routes với auth:sanctum** (30/01/2026)
  - Public routes: login, register (rate limit: 10/min)
  - Protected routes: all other endpoints (rate limit: 60/min)
  - Named routes cho tất cả endpoints
- [x] **CORS Configuration** (30/01/2026)
  - Support localhost:5173 (React frontend)
  - credentials support enabled

---

## 📞 Liên hệ

Khi cần làm item nào, gửi message với format:
```
Làm item #[số] - [tên item]
```

Ví dụ:
- "Làm item #1 - Setup Laravel Sanctum"
- "Làm item #4 - Tạo Model Factories"
- "Làm item #6 - Tạo Missing Seeders"
