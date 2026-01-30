# 📊 Dashboard Feature

Comprehensive analytics dashboard for Soleil Farm.

---

## Overview

The dashboard provides real-time insights into farm operations with:

- 📈 Key statistics cards
- 📊 Interactive charts (Bar, Pie, Line)
- 📅 Crop cycle timeline (Gantt-style)
- 📋 Data tables with actions
- 💾 Export functionality (CSV, PDF)

---

## Architecture

```
features/dashboard/
├── components/
│   ├── StatCard.tsx              # Statistics card
│   ├── CropCyclesBySeasonChart.tsx  # Bar chart
│   ├── LandParcelStatusChart.tsx    # Pie chart
│   ├── ActivityTimelineChart.tsx    # Line/Area chart
│   ├── CropCycleTimeline.tsx        # Gantt timeline
│   ├── RecentActivitiesTable.tsx    # Activity table
│   ├── ActiveCropCyclesTable.tsx    # Cycles table
│   ├── ExportButton.tsx             # Export dropdown
│   ├── ErrorState.tsx               # Error display
│   └── index.ts                     # Barrel exports
├── hooks/
│   └── useDashboardStats.ts      # Data fetching hooks
└── pages/
    └── DashboardPage.tsx         # Main page component
```

---

## Data Schema

### DashboardStats

```typescript
interface DashboardStats {
  // Summary stats
  total_area: number;
  total_area_unit: string;
  land_parcels_count: number;
  land_parcels_breakdown: {
    active: number;
    inactive: number;
  };
  active_crop_cycles: number;
  activities_today: number;
  
  // Chart data
  crop_cycles_by_season: CropCycleBySeason[];
  land_parcel_status_distribution: LandParcelStatus[];
  activity_frequency: ActivityFrequency[];
  
  // Table data
  active_crop_cycles_list: ActiveCropCycle[];
  recent_activities: RecentActivity[];
}
```

### Chart Data Types

```typescript
interface CropCycleBySeason {
  season_id: number;
  season_name: string;
  year: number;
  count: number;
}

interface LandParcelStatus {
  status: string;
  label: string;
  count: number;
  color: string;
}

interface ActivityFrequency {
  date: string;
  count: number;
}
```

### Table Data Types

```typescript
interface ActiveCropCycle {
  id: number;
  name: string;
  land_parcel_name: string;
  crop_type_name: string;
  status: string;
  planned_start_date: string;
  planned_end_date: string;
  progress_percentage: number;
}

interface RecentActivity {
  id: number;
  activity_type_name: string;
  activity_type_code: string;
  crop_cycle_name: string | null;
  land_parcel_name: string | null;
  user_name: string;
  activity_date: string;
  description: string | null;
}
```

---

## Hooks

### useDashboardStats

Fetches and caches dashboard statistics:

```typescript
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';

const { data, isLoading, isError, error, refetch } = useDashboardStats({
  refetchInterval: 30000, // Auto-refresh every 30s
});
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| refetchInterval | number | 30000 | Auto-refresh interval (ms) |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| data | DashboardStats | Dashboard data |
| isLoading | boolean | Initial loading state |
| isError | boolean | Error state |
| error | Error | Error object |
| refetch | function | Manual refetch |

### useExportDashboard

Export mutation hook:

```typescript
import { useExportDashboard } from '@/features/dashboard/hooks/useDashboardStats';

const { mutate, isPending } = useExportDashboard();

// Usage
mutate('csv'); // or 'pdf'
```

---

## Components

### Page Layout

```tsx
<div className="p-6 space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <h1>Tổng quan trang trại</h1>
    <ExportButton />
  </div>
  
  {/* Stat Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard title="Tổng diện tích" ... />
    <StatCard title="Thửa đất" ... />
    <StatCard title="Vụ mùa đang hoạt động" ... />
    <StatCard title="Hoạt động hôm nay" ... />
  </div>
  
  {/* Charts Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card><CropCyclesBySeasonChart /></Card>
    <Card><LandParcelStatusChart /></Card>
  </div>
  
  {/* Activity Timeline */}
  <Card><ActivityTimelineChart /></Card>
  
  {/* Crop Cycle Timeline */}
  <Card><CropCycleTimeline /></Card>
  
  {/* Tables Row */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card><ActiveCropCyclesTable /></Card>
    <Card><RecentActivitiesTable /></Card>
  </div>
</div>
```

### Loading State

```tsx
if (isLoading) {
  return <DashboardSkeleton />;
}
```

### Error State

```tsx
if (isError) {
  return (
    <ErrorState
      title="Không thể tải dữ liệu"
      message={error?.message}
      onRetry={refetch}
    />
  );
}
```

---

## Charts (Recharts)

### Bar Chart Example

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={cropCyclesBySeason}>
    <XAxis 
      dataKey="season_name" 
      tick={{ fontSize: 12 }}
    />
    <YAxis allowDecimals={false} />
    <Tooltip 
      formatter={(value) => [value, 'Số vụ']}
      labelFormatter={(label) => `Mùa: ${label}`}
    />
    <Bar 
      dataKey="count" 
      fill="#10b981" 
      radius={[4, 4, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
```

### Pie Chart Example

```tsx
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={statusDistribution}
      dataKey="count"
      nameKey="label"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {data.map((entry, index) => (
        <Cell key={index} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

### Area Chart Example

```tsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={activityFrequency}>
    <XAxis dataKey="date" />
    <YAxis allowDecimals={false} />
    <Tooltip />
    <Area 
      type="monotone" 
      dataKey="count" 
      stroke="#3b82f6" 
      fill="#93c5fd" 
      fillOpacity={0.3}
    />
  </AreaChart>
</ResponsiveContainer>
```

---

## Export Functionality

```typescript
const handleExport = async (format: 'csv' | 'pdf') => {
  const blob = format === 'csv' 
    ? await dashboardService.exportCsv()
    : await dashboardService.exportPdf();
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-${new Date().toISOString()}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## Auto-Refresh

Dashboard auto-refreshes every 30 seconds:

```typescript
const { data } = useDashboardStats({
  refetchInterval: 30 * 1000, // 30 seconds
});
```

To disable auto-refresh:
```typescript
const { data } = useDashboardStats({
  refetchInterval: false,
});
```

---

## Navigation

Clicking cards navigates to detail pages:

```typescript
<StatCard
  title="Thửa đất"
  value={stats.land_parcels_count}
  onClick={() => navigate('/land-parcels')}
/>

<ActiveCropCyclesTable
  cycles={stats.active_crop_cycles_list}
  onRowClick={(id) => navigate(`/crop-cycles/${id}`)}
/>
```

---

## Customization

### Adding New Charts

1. Create component in `features/dashboard/components/`
2. Add to barrel export in `index.ts`
3. Import in `DashboardPage.tsx`
4. Add data to schema if needed

### Changing Chart Colors

```typescript
// In component or theme
const COLORS = {
  primary: '#10b981',   // Green
  secondary: '#3b82f6', // Blue
  warning: '#f59e0b',   // Amber
  danger: '#ef4444',    // Red
};
```

---

*See also: [Components](components.md) | [State Management](state-management.md)*
