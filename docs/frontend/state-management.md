# 🔄 State Management

Data fetching and state management strategies for the frontend.

---

## Overview

| State Type | Solution | Use Case |
|------------|----------|----------|
| Server State | TanStack Query | API data, caching, sync |
| Client State | Zustand | UI state, preferences |
| Form State | React Hook Form | Form inputs, validation |
| URL State | React Router | Navigation, query params |

---

## TanStack Query (React Query)

### Setup

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,      // 30 seconds
      gcTime: 5 * 60 * 1000,     // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

### Query Key Factory Pattern

```typescript
// Centralized query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  export: (format: string) => [...dashboardKeys.all, 'export', format] as const,
};

export const cropCycleKeys = {
  all: ['crop-cycles'] as const,
  lists: () => [...cropCycleKeys.all, 'list'] as const,
  list: (filters: CropCycleFilters) => [...cropCycleKeys.lists(), filters] as const,
  details: () => [...cropCycleKeys.all, 'detail'] as const,
  detail: (id: number) => [...cropCycleKeys.details(), id] as const,
};
```

### Basic Query

```typescript
import { useQuery } from '@tanstack/react-query';

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
    staleTime: 30 * 1000,
  });
}

// Usage in component
const { data, isLoading, isError, error, refetch } = useDashboardStats();
```

### Query with Parameters

```typescript
export function useCropCycles(filters: CropCycleFilters) {
  return useQuery({
    queryKey: cropCycleKeys.list(filters),
    queryFn: () => cropCycleService.getList(filters),
    enabled: !!filters.season_id, // Only fetch if season_id exists
  });
}
```

### Auto-Refresh

```typescript
export function useDashboardStats(options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: dashboardService.getStats,
    refetchInterval: options?.refetchInterval ?? 30 * 1000, // 30s default
  });
}
```

### Mutations

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateCropCycle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: cropCycleService.create,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: cropCycleKeys.lists() });
    },
  });
}

// Usage
const { mutate, isPending } = useCreateCropCycle();

const handleSubmit = (data: CreateCropCycleInput) => {
  mutate(data, {
    onSuccess: () => {
      toast.success('Tạo vụ mùa thành công');
      navigate('/crop-cycles');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
```

### Optimistic Updates

```typescript
export function useUpdateCropCycle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => cropCycleService.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cropCycleKeys.detail(id) });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(cropCycleKeys.detail(id));
      
      // Optimistically update
      queryClient.setQueryData(cropCycleKeys.detail(id), (old) => ({
        ...old,
        ...data,
      }));
      
      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        cropCycleKeys.detail(variables.id),
        context?.previous
      );
    },
    onSettled: (data, error, { id }) => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: cropCycleKeys.detail(id) });
    },
  });
}
```

---

## Zustand (Client State)

### Store Definition

```typescript
// stores/uiStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'system',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage', // localStorage key
    }
  )
);
```

### Usage

```tsx
import { useUIStore } from '@/stores/uiStore';

function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  return (
    <aside className={cn('sidebar', !sidebarOpen && 'hidden')}>
      {/* ... */}
    </aside>
  );
}
```

### Selectors (Performance)

```typescript
// ❌ Re-renders on any state change
const { sidebarOpen, theme } = useUIStore();

// ✅ Only re-renders when sidebarOpen changes
const sidebarOpen = useUIStore((state) => state.sidebarOpen);
const toggleSidebar = useUIStore((state) => state.toggleSidebar);
```

---

## React Hook Form + Zod

### Schema Definition

```typescript
// schemas/cropCycle.schema.ts
import { z } from 'zod';

export const createCropCycleSchema = z.object({
  land_parcel_id: z.number().min(1, 'Chọn thửa đất'),
  crop_type_id: z.number().min(1, 'Chọn loại cây trồng'),
  season_id: z.number().optional(),
  planned_start_date: z.string().min(1, 'Chọn ngày bắt đầu'),
  planned_end_date: z.string().min(1, 'Chọn ngày kết thúc'),
  notes: z.string().optional(),
});

export type CreateCropCycleInput = z.infer<typeof createCropCycleSchema>;
```

### Form Component

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function CreateCropCycleForm() {
  const form = useForm<CreateCropCycleInput>({
    resolver: zodResolver(createCropCycleSchema),
    defaultValues: {
      land_parcel_id: undefined,
      crop_type_id: undefined,
      planned_start_date: '',
      planned_end_date: '',
      notes: '',
    },
  });
  
  const { mutate, isPending } = useCreateCropCycle();
  
  const onSubmit = (data: CreateCropCycleInput) => {
    mutate(data);
  };
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        control={form.control}
        name="land_parcel_id"
        render={({ field, fieldState }) => (
          <div>
            <Select {...field}>
              {/* options */}
            </Select>
            {fieldState.error && (
              <p className="text-red-500">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
      
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Đang lưu...' : 'Tạo vụ mùa'}
      </Button>
    </form>
  );
}
```

---

## URL State (React Router)

### Search Params

```typescript
import { useSearchParams } from 'react-router-dom';

function CropCycleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const status = searchParams.get('status') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  
  const handleStatusChange = (newStatus: string) => {
    setSearchParams({ status: newStatus, page: '1' });
  };
  
  return (
    // ...
  );
}
```

### Route Params

```typescript
import { useParams } from 'react-router-dom';

function CropCycleDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: cropCycle } = useCropCycle(Number(id));
  
  return (
    // ...
  );
}
```

---

## API Service Layer

```typescript
// services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor (for auth token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

```typescript
// services/dashboard.service.ts
import { api } from './api';
import type { DashboardStats } from '@/schemas/dashboard.schema';

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
  
  exportPdf: async (): Promise<Blob> => {
    const response = await api.get('/dashboard/export/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },
};
```

---

## Best Practices

### 1. Keep Server State in React Query

```typescript
// ✅ Good - use React Query for server data
const { data: cropCycles } = useCropCycles();

// ❌ Bad - don't store server data in Zustand
const setCropCycles = useStore((s) => s.setCropCycles);
```

### 2. Use Query Key Factories

```typescript
// ✅ Good - centralized, typed keys
const { data } = useQuery({
  queryKey: cropCycleKeys.list({ status: 'active' }),
});

// ❌ Bad - inline string keys
const { data } = useQuery({
  queryKey: ['crop-cycles', 'list', { status: 'active' }],
});
```

### 3. Handle Loading & Error States

```tsx
const { data, isLoading, isError, error } = useCropCycles();

if (isLoading) return <LoadingSkeleton />;
if (isError) return <ErrorState error={error} />;

return <CropCycleList data={data} />;
```

### 4. Invalidate Related Queries

```typescript
onSuccess: () => {
  // Invalidate list
  queryClient.invalidateQueries({ queryKey: cropCycleKeys.lists() });
  // Also invalidate dashboard if it shows crop cycles
  queryClient.invalidateQueries({ queryKey: dashboardKeys.stats() });
},
```

---

*See also: [Architecture](architecture.md) | [Dashboard](dashboard.md)*
