# 🔧 Backend Documentation - Soleil Farm

Laravel 11 RESTful API for farm management system.

---

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Laravel | 11.x |
| Language | PHP | ^8.2 |
| Database | MySQL / SQLite | 8.0+ |
| API | RESTful JSON | v1 |
| Auth (planned) | Laravel Sanctum | 4.x |

---

## Quick Start

```bash
# Navigate to backend
cd backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate --seed

# Start server
php artisan serve
```

Server runs at `http://localhost:8000`

---

## Project Structure

```
backend/
├── app/
│   ├── Exceptions/            # Custom exceptions
│   │   └── InvalidStatusTransitionException.php
│   ├── Http/
│   │   ├── Controllers/Api/   # 11 API controllers
│   │   └── Resources/         # 10 JSON transformers
│   ├── Models/                # 12 Eloquent models
│   ├── Providers/             # Service providers
│   └── Services/              # Business logic
│       └── CropCycleService.php
├── config/                    # Configuration files
├── database/
│   ├── factories/             # Model factories
│   ├── migrations/            # 14 migration files
│   └── seeders/               # 7 data seeders
├── routes/
│   └── api.php                # API routes (40+ endpoints)
└── tests/                     # PHPUnit tests
```

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | Backend patterns & design |
| [Database Schema](database-schema.md) | Tables & relationships |
| [API Design](api-design.md) | API principles & standards |
| [API Endpoints](api-endpoints.md) | Complete endpoint reference |
| [Authentication](api-authentication.md) | Auth implementation guide |
| [API Examples](api-examples.md) | Request/response examples |
| [Models](models.md) | Eloquent models documentation |
| [Installation](installation.md) | Detailed setup guide |
| [Development](development.md) | Development workflow |
| [Deployment](deployment.md) | Production deployment |

---

## Key Features

- ✅ RESTful API with consistent JSON responses
- ✅ Laravel Resources for data transformation
- ✅ Validation with Form Requests
- ✅ Service layer for business logic
- ✅ Eloquent ORM with relationships
- ✅ Database seeding for development
- ✅ Soft deletes with `is_active` flag
- ✅ Immutable activity logs
- ✅ Crop cycle overlap validation

---

## API Overview

Base URL: `http://localhost:8000/api/v1`

| Resource | Endpoints | Description |
|----------|-----------|-------------|
| Dashboard | 3 | Stats, export |
| Land Parcels | 8 | CRUD, relationships |
| Crop Cycles | 10 | CRUD, status actions |
| Activity Logs | 6 | Create, read only |
| Seasons | 7 | CRUD, current/year |
| Water Sources | 5 | CRUD, relationships |
| Crop Types | 5 | CRUD, stats |
| Activity Types | 5 | CRUD, categories |
| Units of Measure | 6 | CRUD, by type |

---

## Testing

```bash
# Run all tests
php artisan test

# Run specific suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

---

*See also: [Frontend Documentation](../frontend/README.md) | [Main Index](../README.md)*
