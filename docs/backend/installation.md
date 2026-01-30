# 🛠️ Backend Installation Guide

Complete setup instructions for the Soleil Farm Laravel backend.

---

## Prerequisites

| Software | Version | Required |
|----------|---------|----------|
| PHP | ^8.2 | ✅ Yes |
| Composer | ^2.0 | ✅ Yes |
| MySQL | ^8.0 | ⚠️ Recommended |
| SQLite | ^3.0 | Alternative |

---

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd soleil-farm/backend
```

---

## Step 2: Install Dependencies

```bash
composer install
```

---

## Step 3: Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file:

```env
APP_NAME="Soleil Farm"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=soleil_farm
DB_USERNAME=root
DB_PASSWORD=your_password
```

---

## Step 4: Generate Application Key

```bash
php artisan key:generate
```

---

## Step 5: Database Setup

### Option A: MySQL (Recommended)

1. Create database:
```sql
CREATE DATABASE soleil_farm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update `.env` with credentials

3. Run migrations:
```bash
php artisan migrate
```

4. Seed initial data:
```bash
php artisan db:seed
```

### Option B: SQLite (Development)

1. Create SQLite file:
```bash
touch database/database.sqlite
```

2. Update `.env`:
```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
```

3. Run migrations and seed:
```bash
php artisan migrate --seed
```

---

## Step 6: Verify Installation

### Start Development Server

```bash
php artisan serve
```

### Test API

```bash
curl http://localhost:8000/api/v1/dashboard/stats
```

Expected response:
```json
{
  "data": {
    "total_area": 45500,
    "land_parcels_count": 4,
    "active_crop_cycles": 2,
    ...
  }
}
```

---

## Step 7: Optional - Clear Caches

```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
php artisan view:clear
```

---

## Troubleshooting

### Error: "Class not found"
```bash
composer dump-autoload
```

### Error: "Permission denied"
```bash
chmod -R 775 storage bootstrap/cache
```

### Error: "No application encryption key"
```bash
php artisan key:generate
```

### Error: "Database does not exist"
Create the database manually or use SQLite.

### Error: "Migration failed"
```bash
php artisan migrate:fresh --seed
```
⚠️ Warning: This will delete all data!

---

## Development Commands

| Command | Description |
|---------|-------------|
| `php artisan serve` | Start dev server |
| `php artisan migrate` | Run migrations |
| `php artisan db:seed` | Seed database |
| `php artisan migrate:fresh --seed` | Reset & seed DB |
| `php artisan route:list` | List all routes |
| `php artisan tinker` | Interactive shell |
| `php artisan test` | Run tests |
| `php artisan pail` | Real-time log viewer |

---

*See also: [Development Guide](development.md) | [Deployment Guide](deployment.md)*
