# 🛠️ Frontend Installation Guide

Complete setup instructions for the Soleil Farm React frontend.

---

## Prerequisites

| Software | Version | Required |
|----------|---------|----------|
| Node.js | ^18.0 or ^20.0 | ✅ Yes |
| npm | ^9.0 or ^10.0 | ✅ Yes |
| Git | Latest | ✅ Yes |

---

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd soleil-farm/frontend
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all packages defined in `package.json`.

---

## Step 3: Environment Configuration

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Step 4: Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Step 5: Verify Installation

Open `http://localhost:5173` in your browser. You should see the Soleil Farm dashboard.

---

## Connecting to Backend

Ensure the Laravel backend is running:

```bash
# In backend directory
cd ../backend
php artisan serve
```

Backend runs at `http://localhost:8000`

---

## Troubleshooting

### Error: "esbuild failed to start"

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Error: "Port 5173 already in use"

```bash
# Use different port
npm run dev -- --port 3000
```

### Error: "Cannot connect to API"

1. Check backend is running on port 8000
2. Verify `VITE_API_URL` in `.env.local`
3. Check CORS configuration in Laravel

### TypeScript Errors

```bash
# Check TypeScript errors
npm run typecheck
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |

---

## Dependencies Overview

### Core

| Package | Purpose |
|---------|---------|
| react | UI library |
| react-dom | DOM rendering |
| typescript | Type safety |
| vite | Build tool |

### UI

| Package | Purpose |
|---------|---------|
| tailwindcss | Utility CSS |
| @radix-ui/* | Headless components |
| class-variance-authority | Component variants |
| lucide-react | Icons |
| recharts | Charts |

### State & Data

| Package | Purpose |
|---------|---------|
| @tanstack/react-query | Server state |
| zustand | Client state |
| axios | HTTP client |
| zod | Schema validation |

### Forms

| Package | Purpose |
|---------|---------|
| react-hook-form | Form handling |
| @hookform/resolvers | Zod integration |

### Routing

| Package | Purpose |
|---------|---------|
| react-router-dom | Client routing |

---

## IDE Setup

### VS Code Extensions

Recommended extensions (`.vscode/extensions.json`):

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

---

## Path Aliases

The project uses path aliases configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:

```typescript
// Instead of relative imports
import { Button } from '../../../components/ui/button';

// Use alias imports
import { Button } from '@/components/ui/button';
```

---

*See also: [Development Guide](development.md) | [Architecture](architecture.md)*
