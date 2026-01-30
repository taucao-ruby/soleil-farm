# 🧩 UI Components

Component library documentation for Soleil Farm frontend.

---

## shadcn/ui Components

We use [shadcn/ui](https://ui.shadcn.com/) as our base component library. Components are copied into `src/components/ui/` and can be customized.

---

## Core Components

### Button

```tsx
import { Button } from '@/components/ui/button';

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button disabled>Disabled</Button>
```

**Variants:** `default`, `outline`, `destructive`, `ghost`, `link`, `secondary`

**Sizes:** `default`, `sm`, `lg`, `icon`

---

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    Main content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

---

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

**Custom Status Badges:**

```tsx
const statusColors = {
  active: 'bg-green-100 text-green-800',
  planned: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  failed: 'bg-red-100 text-red-800',
};

<Badge className={statusColors[status]}>{status}</Badge>
```

---

### Table

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Skeleton

Loading placeholder components:

```tsx
import { Skeleton } from '@/components/ui/skeleton';

// Basic skeleton
<Skeleton className="h-4 w-[250px]" />

// Custom skeletons
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  DashboardSkeleton,
} from '@/components/ui/skeleton';

<StatCardSkeleton />
<ChartSkeleton />
<TableSkeleton rows={5} />
<DashboardSkeleton />
```

---

### Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      Tooltip content
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## Dashboard Components

### StatCard

Displays a single statistic with icon and optional breakdown:

```tsx
import { StatCard } from '@/features/dashboard/components';

<StatCard
  title="Tổng diện tích"
  value="45,500"
  unit="m²"
  icon={<MapPin className="h-4 w-4" />}
  onClick={() => navigate('/land-parcels')}
/>

// With breakdown
<StatCard
  title="Thửa đất"
  value={4}
  icon={<Grid2X2 className="h-4 w-4" />}
  breakdown={{
    active: 3,
    inactive: 1,
  }}
/>
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| title | string | Card title |
| value | string \| number | Main value |
| unit | string? | Value unit |
| icon | ReactNode? | Icon element |
| breakdown | object? | Secondary breakdown |
| onClick | function? | Click handler |

---

### CropCyclesBySeasonChart

Bar chart showing crop cycles by season:

```tsx
import { CropCyclesBySeasonChart } from '@/features/dashboard/components';

<CropCyclesBySeasonChart data={cropCyclesBySeason} />
```

**Data Shape:**
```typescript
interface CropCycleBySeason {
  season_id: number;
  season_name: string;
  year: number;
  count: number;
}
```

---

### LandParcelStatusChart

Pie chart showing land parcel distribution:

```tsx
import { LandParcelStatusChart } from '@/features/dashboard/components';

<LandParcelStatusChart data={statusDistribution} />
```

**Data Shape:**
```typescript
interface LandParcelStatus {
  status: string;
  label: string;
  count: number;
  color: string;
}
```

---

### ActivityTimelineChart

Line/area chart for activity frequency:

```tsx
import { ActivityTimelineChart } from '@/features/dashboard/components';

<ActivityTimelineChart data={activityFrequency} />
```

**Data Shape:**
```typescript
interface ActivityFrequency {
  date: string;
  count: number;
}
```

---

### CropCycleTimeline

Gantt-style timeline visualization:

```tsx
import { CropCycleTimeline } from '@/features/dashboard/components';

<CropCycleTimeline cycles={activeCropCycles} />
```

---

### RecentActivitiesTable

Table of recent farm activities:

```tsx
import { RecentActivitiesTable } from '@/features/dashboard/components';

<RecentActivitiesTable activities={recentActivities} />
```

---

### ActiveCropCyclesTable

Table of active crop cycles with progress:

```tsx
import { ActiveCropCyclesTable } from '@/features/dashboard/components';

<ActiveCropCyclesTable 
  cycles={activeCropCycles}
  onRowClick={(id) => navigate(`/crop-cycles/${id}`)}
/>
```

---

### ExportButton

Dropdown for export options:

```tsx
import { ExportButton } from '@/features/dashboard/components';

<ExportButton
  onExportCsv={handleExportCsv}
  onExportPdf={handleExportPdf}
  isExporting={isExporting}
/>
```

---

### ErrorState

Error display with retry option:

```tsx
import { ErrorState } from '@/features/dashboard/components';

<ErrorState
  title="Không thể tải dữ liệu"
  message="Đã có lỗi xảy ra khi tải dữ liệu dashboard"
  onRetry={() => refetch()}
/>
```

---

## Adding New shadcn/ui Components

```bash
# Using the CLI
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
```

---

## Component Best Practices

### 1. Use TypeScript Props

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function StatCard({ title, value, unit, icon, onClick }: StatCardProps) {
  // ...
}
```

### 2. Forward Refs When Needed

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(...)} {...props} />
    );
  }
);
```

### 3. Use cn() for Conditional Classes

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
  className
)} />
```

---

*See also: [Architecture](architecture.md) | [Dashboard](dashboard.md)*
