# 🏗️ Frontend Architecture

Design patterns and architecture decisions for the React frontend.

---

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                        Routes (React Router)                    │   │
│  │                         /  /dashboard  /land-parcels  etc.     │   │
│  └───────────────────────────────┬────────────────────────────────┘   │
│                                  │                                     │
│  ┌───────────────────────────────▼────────────────────────────────┐   │
│  │                         Layouts                                 │   │
│  │                    MainLayout, AuthLayout                       │   │
│  └───────────────────────────────┬────────────────────────────────┘   │
│                                  │                                     │
│  ┌───────────────────────────────▼────────────────────────────────┐   │
│  │                          Pages                                  │   │
│  │           DashboardPage, LandParcelsPage, CropCyclesPage       │   │
│  └───────────────────────────────┬────────────────────────────────┘   │
│                                  │                                     │
│  ┌───────────────────────────────▼────────────────────────────────┐   │
│  │                     Feature Components                          │   │
│  │        StatCard, Charts, Tables, Forms, Modals                 │   │
│  └───────────────────────────────┬────────────────────────────────┘   │
│                                  │                                     │
│  ┌───────────────────────────────▼────────────────────────────────┐   │
│  │                        UI Components                            │   │
│  │          Button, Card, Table, Badge, Skeleton, Tooltip         │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────┼────────────────────────────────────┐
│                           STATE LAYER                                  │
├───────────────────────────────────┼────────────────────────────────────┤
│                                   │                                    │
│  ┌─────────────────┐     ┌────────▼────────┐     ┌─────────────────┐  │
│  │    TanStack     │     │     Custom      │     │     Zustand     │  │
│  │     Query       │     │     Hooks       │     │     Stores      │  │
│  │  (Server State) │     │ (Composition)   │     │ (Client State)  │  │
│  └────────┬────────┘     └─────────────────┘     └─────────────────┘  │
│           │                                                            │
└───────────┼────────────────────────────────────────────────────────────┘
            │
┌───────────┼────────────────────────────────────────────────────────────┐
│           │               DATA LAYER                                   │
├───────────┼────────────────────────────────────────────────────────────┤
│           │                                                            │
│  ┌────────▼────────┐     ┌─────────────────┐     ┌─────────────────┐  │
│  │   API Services  │     │   Zod Schemas   │     │   TypeScript    │  │
│  │     (Axios)     │     │  (Validation)   │     │     Types       │  │
│  └────────┬────────┘     └─────────────────┘     └─────────────────┘  │
│           │                                                            │
└───────────┼────────────────────────────────────────────────────────────┘
            │
┌───────────▼────────────────────────────────────────────────────────────┐
│                          BACKEND API                                   │
│                    Laravel REST API (Port 8000)                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
frontend/src/
├── components/              # Shared UI components
│   └── ui/                  # shadcn/ui base components
│       ├── button.tsx
│       ├── card.tsx
│       ├── table.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       ├── tooltip.tsx
│       └── ...
├── features/                # Feature modules (domain-driven)
│   ├── dashboard/
│   │   ├── components/      # Dashboard-specific components
│   │   │   ├── StatCard.tsx
│   │   │   ├── CropCyclesBySeasonChart.tsx
│   │   │   ├── LandParcelStatusChart.tsx
│   │   │   ├── ActivityTimelineChart.tsx
│   │   │   ├── CropCycleTimeline.tsx
│   │   │   ├── RecentActivitiesTable.tsx
│   │   │   ├── ActiveCropCyclesTable.tsx
│   │   │   ├── ExportButton.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useDashboardStats.ts
│   │   └── pages/
│   │       └── DashboardPage.tsx
│   ├── land-parcels/
│   ├── crop-cycles/
│   └── ...
├── hooks/                   # Shared custom hooks
├── layouts/                 # Layout components
│   └── MainLayout.tsx
├── lib/                     # Utility functions
│   └── utils.ts             # cn() helper for Tailwind
├── routes/                  # Route definitions
├── schemas/                 # Zod validation schemas
│   └── dashboard.schema.ts
├── services/                # API service layer
│   ├── api.ts               # Axios instance
│   └── dashboard.service.ts
├── stores/                  # Zustand state stores
├── styles/                  # Global CSS
│   └── globals.css
├── types/                   # TypeScript type definitions
├── App.tsx                  # Root component
└── main.tsx                 # Entry point
```

---

## Design Patterns

### 1. Feature-Based Architecture

Code is organized by feature/domain rather than type:

```
✅ features/dashboard/components/StatCard.tsx
✅ features/dashboard/hooks/useDashboardStats.ts

❌ components/dashboard/StatCard.tsx
❌ hooks/useDashboardStats.ts
```

Benefits:
- Co-located related code
- Better encapsulation
- Easier to navigate
- Simpler refactoring

### 2. Custom Hooks Pattern

Business logic extracted into reusable hooks:

```typescript
// features/dashboard/hooks/useDashboardStats.ts
export function useDashboardStats(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
    staleTime: 30 * 1000,
    refetchInterval: options?.refetchInterval ?? 30 * 1000,
  });
}
```

### 3. Query Key Factory

Centralized query keys for TanStack Query:

```typescript
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  export: (format: string) => [...dashboardKeys.all, 'export', format] as const,
};
```

### 4. Service Layer

API calls abstracted into service modules:

```typescript
// services/dashboard.service.ts
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },
  exportCsv: async (): Promise<Blob> => {
    const response = await api.get('/dashboard/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },
};
```

### 5. Schema-First Validation

Zod schemas define both validation and TypeScript types:

```typescript
// schemas/dashboard.schema.ts
export const cropCycleBySeasonSchema = z.object({
  season_id: z.number(),
  season_name: z.string(),
  year: z.number(),
  count: z.number(),
});

export type CropCycleBySeason = z.infer<typeof cropCycleBySeasonSchema>;
```

---

## Component Composition

### Compound Component Pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Render Props for Charts

```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <XAxis dataKey="season_name" />
    <YAxis />
    <Bar dataKey="count" fill="#10b981" />
  </BarChart>
</ResponsiveContainer>
```

---

## State Management Strategy

| Type | Solution | Use Case |
|------|----------|----------|
| Server State | TanStack Query | API data, caching |
| Client State | Zustand | UI state, preferences |
| Form State | React Hook Form | Form inputs, validation |
| URL State | React Router | Navigation, params |

---

## Data Flow

```
User Interaction
      │
      ▼
Component (onClick, onSubmit)
      │
      ▼
Custom Hook (useMutation)
      │
      ▼
Service Layer (API call)
      │
      ▼
Backend API Response
      │
      ▼
TanStack Query Cache Update
      │
      ▼
Component Re-render
```

---

## Styling Strategy

### Tailwind CSS + cn() Helper

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'flex items-center gap-2',
  isActive && 'text-green-500',
  className
)}>
```

### CSS Variables for Theming

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 142.1 76.2% 36.3%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

---

*See also: [Components](components.md) | [State Management](state-management.md)*
