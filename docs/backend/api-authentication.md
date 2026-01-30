# 🔐 Authentication Guide

## Current Status

⚠️ **Authentication is not yet implemented.** All API endpoints are currently public.

## Planned Implementation

The API will use **Laravel Sanctum** for token-based authentication.

---

## Authentication Flow

### 1. Register (Future)

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "Farmer Name",
  "email": "farmer@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Farmer Name",
      "email": "farmer@example.com"
    },
    "token": "1|abc123xyz..."
  }
}
```

### 2. Login (Future)

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Farmer Name",
      "email": "farmer@example.com"
    },
    "token": "2|def456abc..."
  }
}
```

### 3. Using the Token

Include the token in the Authorization header:

```http
GET /api/v1/crop-cycles
Authorization: Bearer 2|def456abc...
```

### 4. Logout (Future)

```http
POST /api/v1/auth/logout
Authorization: Bearer 2|def456abc...
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Error Responses

### 401 Unauthorized (No token)

```json
{
  "message": "Unauthenticated."
}
```

### 401 Unauthorized (Invalid token)

```json
{
  "message": "Invalid or expired token."
}
```

---

## Implementation Steps

To implement authentication:

1. **Install Sanctum:**
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   php artisan migrate
   ```

2. **Add trait to User model:**
   ```php
   use Laravel\Sanctum\HasApiTokens;
   
   class User extends Authenticatable
   {
       use HasApiTokens, HasFactory, Notifiable;
   }
   ```

3. **Protect routes in `routes/api.php`:**
   ```php
   Route::middleware('auth:sanctum')->group(function () {
       // Protected routes here
   });
   ```

4. **Create AuthController** with login/register/logout methods.

---

*See also: [API Endpoints](api-endpoints.md) | [API Examples](api-examples.md)*
