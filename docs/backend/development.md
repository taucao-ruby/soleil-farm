# 👨‍💻 Backend Development Guide

Best practices and workflows for developing the Laravel backend.

---

## Development Workflow

### 1. Starting Development

```bash
cd backend
php artisan serve
```

Server runs at `http://localhost:8000`

### 2. Making Changes

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes...

# Test
php artisan test

# Commit
git add .
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature
```

---

## Creating New Features

### Adding a New Model

1. **Create migration:**
```bash
php artisan make:migration create_example_table
```

2. **Create model:**
```bash
php artisan make:model Example
```

3. **Create controller:**
```bash
php artisan make:controller Api/ExampleController --api
```

4. **Create resource:**
```bash
php artisan make:resource ExampleResource
```

5. **Add routes in `routes/api.php`:**
```php
Route::apiResource('examples', ExampleController::class);
```

### Adding a New Seeder

1. **Create seeder:**
```bash
php artisan make:seeder ExampleSeeder
```

2. **Add to `DatabaseSeeder.php`:**
```php
$this->call([
    // ... existing seeders
    ExampleSeeder::class,
]);
```

3. **Run seeder:**
```bash
php artisan db:seed --class=ExampleSeeder
```

---

## Code Style

### PHP / Laravel

- Follow PSR-12 coding standards
- Use Laravel Pint for formatting:
```bash
./vendor/bin/pint
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Model | PascalCase, singular | `CropCycle` |
| Controller | PascalCase + Controller | `CropCycleController` |
| Migration | snake_case with date | `2026_01_28_000008_create_crop_cycles_table` |
| Table | snake_case, plural | `crop_cycles` |
| Column | snake_case | `land_parcel_id` |
| Route | kebab-case | `/crop-cycles` |
| Resource | PascalCase + Resource | `CropCycleResource` |

### Commit Messages

Follow Conventional Commits:

```
feat: add crop cycle filtering by status
fix: resolve overlapping cycle validation
docs: update API documentation
refactor: extract cycle validation to service
test: add unit tests for CropCycleService
```

---

## Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=ExampleTest

# Run feature tests only
php artisan test --testsuite=Feature

# Run unit tests only
php artisan test --testsuite=Unit

# With coverage
php artisan test --coverage
```

---

## Database Operations

### Fresh Migration (Reset)
```bash
php artisan migrate:fresh --seed
```

### Rollback Last Migration
```bash
php artisan migrate:rollback
```

### Check Migration Status
```bash
php artisan migrate:status
```

### Using Tinker (Interactive Shell)
```bash
php artisan tinker

# Examples:
>>> \App\Models\LandParcel::count()
>>> \App\Models\CropCycle::with('cropType')->first()
>>> \App\Models\ActivityLog::recent(7)->get()
```

---

## Debugging

### View Routes
```bash
php artisan route:list
php artisan route:list --path=api/v1/crop
```

### Clear All Caches
```bash
php artisan optimize:clear
```

### View Logs
```bash
tail -f storage/logs/laravel.log
```

Or use Laravel Pail (installed):
```bash
php artisan pail
```

### Debug in Controller
```php
// Dump and die
dd($variable);

// Dump without dying
dump($variable);

// Log to file
\Log::info('Debug message', ['data' => $variable]);
```

---

## API Testing with cURL

### Quick Health Check
```bash
curl http://localhost:8000/api/v1/dashboard/stats
```

### GET with Query Params
```bash
curl "http://localhost:8000/api/v1/crop-cycles?status=active"
```

### POST Request
```bash
curl -X POST http://localhost:8000/api/v1/crop-cycles \
  -H "Content-Type: application/json" \
  -d '{
    "land_parcel_id": 1,
    "crop_type_id": 1,
    "season_id": 1,
    "planned_start_date": "2026-02-01",
    "planned_end_date": "2026-06-15"
  }'
```

### PUT Request
```bash
curl -X PUT http://localhost:8000/api/v1/crop-cycles/1 \
  -H "Content-Type: application/json" \
  -d '{"notes": "Updated notes"}'
```

### DELETE Request
```bash
curl -X DELETE http://localhost:8000/api/v1/crop-cycles/1
```

---

## Environment Configuration

### Local Development
```env
APP_ENV=local
APP_DEBUG=true
LOG_LEVEL=debug
```

### Testing
```env
APP_ENV=testing
DB_DATABASE=soleil_farm_test
```

### Production
```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error
```

---

*See also: [Installation Guide](installation.md) | [API Endpoints](api-endpoints.md)*
