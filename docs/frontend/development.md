# 👨‍💻 Frontend Development Guide

Best practices and workflows for developing the React frontend.

---

## Development Workflow

### 1. Starting Development

```bash
cd frontend
npm run dev
```

App runs at `http://localhost:5173` with hot module replacement.

### 2. Making Changes

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes...

# Type check
npm run typecheck

# Lint
npm run lint

# Commit
git add .
git commit -m "feat: add my feature"

# Push
git push origin feature/my-feature
```

---

## Creating New Features

### Adding a New Feature Module

1. **Create feature folder:**
```
src/features/my-feature/
├── components/
│   ├── MyComponent.tsx
│   └── index.ts
├── hooks/
│   └── useMyFeature.ts
└── pages/
    └── MyFeaturePage.tsx
```

2. **Create page component:**
```tsx
// src/features/my-feature/pages/MyFeaturePage.tsx
export function MyFeaturePage() {
  return (
    <div className="p-6">
      <h1>My Feature</h1>
    </div>
  );
}
```

3. **Add route:**
```tsx
// src/routes/index.tsx
import { MyFeaturePage } from '@/features/my-feature/pages/MyFeaturePage';

const routes = [
  // ... existing routes
  {
    path: '/my-feature',
    element: <MyFeaturePage />,
  },
];
```

### Adding shadcn/ui Component

```bash
# Using the CLI
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
```

Components are added to `src/components/ui/`.

### Adding Custom Hook

```typescript
// src/features/my-feature/hooks/useMyData.ts
import { useQuery } from '@tanstack/react-query';
import { myService } from '@/services/my.service';

export const myKeys = {
  all: ['my-data'] as const,
  list: () => [...myKeys.all, 'list'] as const,
  detail: (id: number) => [...myKeys.all, 'detail', id] as const,
};

export function useMyDataList() {
  return useQuery({
    queryKey: myKeys.list(),
    queryFn: myService.getList,
  });
}
```

### Adding API Service

```typescript
// src/services/my.service.ts
import { api } from './api';
import type { MyData } from '@/schemas/my.schema';

export const myService = {
  getList: async (): Promise<MyData[]> => {
    const response = await api.get('/my-endpoint');
    return response.data.data;
  },
  
  getById: async (id: number): Promise<MyData> => {
    const response = await api.get(`/my-endpoint/${id}`);
    return response.data.data;
  },
  
  create: async (data: CreateMyData): Promise<MyData> => {
    const response = await api.post('/my-endpoint', data);
    return response.data.data;
  },
};
```

---

## Code Style

### TypeScript

- Use strict mode
- Define interfaces for all props
- Use `type` for unions, `interface` for objects

```typescript
// ✅ Good
interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

// ❌ Bad
function StatCard(props: any) {
  // ...
}
```

### React Components

- Use function components
- Use hooks for state and effects
- Export named exports (not default)

```tsx
// ✅ Good
export function StatCard({ title, value, icon, onClick }: StatCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer">
      {/* ... */}
    </Card>
  );
}

// ❌ Bad
export default class StatCard extends React.Component {
  // ...
}
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `StatCard.tsx` |
| Hook | camelCase with `use` prefix | `useDashboardStats.ts` |
| Service | camelCase with `.service` suffix | `dashboard.service.ts` |
| Schema | camelCase with `.schema` suffix | `dashboard.schema.ts` |
| Store | camelCase with `Store` suffix | `useUIStore.ts` |
| Utility | camelCase | `formatDate.ts` |

### File Organization

```
// Feature component with barrel export
src/features/dashboard/components/
├── StatCard.tsx
├── CropCyclesBySeasonChart.tsx
├── ...
└── index.ts  // Barrel export

// index.ts
export * from './StatCard';
export * from './CropCyclesBySeasonChart';
```

### Commit Messages

Follow Conventional Commits:

```
feat: add crop cycle timeline chart
fix: resolve tooltip positioning issue
docs: update dashboard component docs
refactor: extract chart config to constants
style: format code with prettier
test: add unit tests for StatCard
```

---

## Testing

```bash
# Run tests (when added)
npm run test

# Run with coverage
npm run test:coverage
```

---

## Building for Production

```bash
# Build
npm run build

# Preview build locally
npm run preview
```

Build output is in `dist/` folder.

---

## Debugging

### React DevTools

Install [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/) browser extension.

### TanStack Query DevTools

Already included in development:

```tsx
// Appears in bottom-right corner in dev mode
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Console Logging

```typescript
// Debug API responses
api.interceptors.response.use((response) => {
  console.log('API Response:', response.config.url, response.data);
  return response;
});
```

### Network Tab

Use browser DevTools Network tab to inspect:
- API requests/responses
- Request headers
- Response timing

---

## Performance Tips

### 1. Memoize Expensive Components

```tsx
import { memo } from 'react';

export const ExpensiveChart = memo(function ExpensiveChart({ data }) {
  // ...
});
```

### 2. Use Zustand Selectors

```typescript
// ✅ Good - only re-renders when sidebarOpen changes
const sidebarOpen = useUIStore((s) => s.sidebarOpen);

// ❌ Bad - re-renders on any state change
const { sidebarOpen, theme } = useUIStore();
```

### 3. Lazy Load Routes

```tsx
import { lazy, Suspense } from 'react';

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

<Route 
  path="/dashboard" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardPage />
    </Suspense>
  } 
/>
```

### 4. Virtualize Long Lists

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

// For lists with 100+ items
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

*See also: [Installation Guide](installation.md) | [Architecture](architecture.md)*
