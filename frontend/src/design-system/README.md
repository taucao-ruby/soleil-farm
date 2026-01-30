# Soleil Farm Design System

Hệ thống thiết kế toàn diện cho Soleil Farm - được xây dựng theo tiêu chuẩn của các design-driven companies như Airbnb, Stripe, Shopify.

## 🎨 Tổng quan

Design System này cung cấp:

- **Design Tokens**: Màu sắc, typography, spacing, animations, shadows
- **Components**: Button, StatusBadge, StatCard, FormField, Input, Card, Modal
- **Icons**: Custom farm icons + lucide-react integration
- **Hooks**: Accessibility và utility hooks
- **Storybook**: Documentation và playground

## 📦 Cấu trúc thư mục

```
src/design-system/
├── tokens/                 # Design tokens
│   ├── colors.ts          # Color palette
│   ├── spacing.ts         # Spacing scale
│   ├── typography.ts      # Font styles
│   ├── animations.ts      # Framer Motion presets
│   ├── shadows.ts         # Box shadows
│   ├── borders.ts         # Border & radius
│   ├── breakpoints.ts     # Responsive breakpoints
│   └── index.ts
├── components/             # UI Components
│   ├── Button/
│   ├── StatusBadge/
│   ├── StatCard/
│   ├── FormField/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   └── index.ts
├── icons/                  # Custom icons
│   ├── FarmIcons.tsx
│   └── index.ts
├── hooks/                  # Utility hooks
│   ├── useHotkeys.ts
│   ├── useFocusTrap.ts
│   ├── useMediaQuery.ts
│   ├── useAnnounce.ts
│   └── index.ts
└── index.ts               # Main entry point
```

## 🚀 Quick Start

### Import toàn bộ

```tsx
import { 
  Button, 
  StatusBadge, 
  tokens, 
  useHotkeys,
  FertilizerIcon 
} from '@/design-system';
```

### Import từng module

```tsx
// Components
import { Button, ButtonGroup } from '@/design-system/components';

// Tokens
import { colors, status } from '@/design-system/tokens';

// Icons
import { HarvestIcon, SeedlingIcon } from '@/design-system/icons';

// Hooks
import { useHotkeys, useFocusTrap } from '@/design-system/hooks';
```

## 🎨 Design Tokens

### Colors

```tsx
import { colors, status, getStatusColor } from '@/design-system/tokens';

// Primary colors
colors.primary[500] // #10b981 - Main brand

// Status colors
status.available   // #10b981
status.in_use     // #3b82f6
status.maintenance // #ef4444

// Get status color dynamically
const color = getStatusColor('active'); // #10b981
```

### Typography

```tsx
import { typography, textStyles } from '@/design-system/tokens';

// Font families
typography.fontFamily.sans // ['Inter', 'system-ui', ...]

// Text styles
textStyles['heading-lg'] // { fontSize, lineHeight, fontWeight }
textStyles['body-md']
textStyles['label-sm']
```

### Spacing

```tsx
import { spacing, semanticSpacing } from '@/design-system/tokens';

spacing[4]    // '1rem' (16px)
spacing[8]    // '2rem' (32px)

semanticSpacing['card-padding-md'] // 16px
semanticSpacing['form-gap']        // 16px
```

### Animations

```tsx
import { 
  fadeInAnimation, 
  slideUpVariants, 
  staggerContainerVariants 
} from '@/design-system/tokens';

// Framer Motion animation preset
<motion.div {...fadeInAnimation}>Content</motion.div>

// Variants
<motion.div
  variants={slideUpVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

## 🧱 Components

### Button

```tsx
import { Button, ButtonGroup } from '@/design-system';

// Variants
<Button variant="primary">Tạo mới</Button>
<Button variant="secondary">Hủy</Button>
<Button variant="destructive">Xóa</Button>
<Button variant="ghost">Chi tiết</Button>

// With icons
<Button leftIcon={<Plus />}>Thêm lô đất</Button>
<Button rightIcon={<ChevronRight />}>Tiếp theo</Button>

// Loading state
<Button loading loadingText="Đang lưu...">Lưu</Button>

// Button group
<ButtonGroup attached>
  <Button variant="outline">Ngày</Button>
  <Button variant="outline">Tuần</Button>
  <Button variant="outline">Tháng</Button>
</ButtonGroup>
```

### StatusBadge

```tsx
import { StatusBadge } from '@/design-system';

// Land parcel status
<StatusBadge status="available" />      // Sẵn sàng
<StatusBadge status="in_use" />         // Đang sử dụng
<StatusBadge status="resting" />        // Đang nghỉ
<StatusBadge status="maintenance" />    // Bảo trì

// Crop cycle status
<StatusBadge status="planned" />        // Đã lên kế hoạch
<StatusBadge status="active" />         // Đang hoạt động
<StatusBadge status="completed" />      // Hoàn thành

// Custom label
<StatusBadge status="active">Đang canh tác</StatusBadge>

// With animation
<StatusBadge status="in_progress" animateDot />
```

### StatCard

```tsx
import { StatCard, StatCardGroup } from '@/design-system';

<StatCard
  title="Tổng lô đất"
  value={24}
  icon={<MapPin />}
  trend="+12%"
  description="so với tháng trước"
  animateValue
  interactive
/>

// Grid of stats
<StatCardGroup columns={4}>
  <StatCard title="Lô đất" value={24} />
  <StatCard title="Diện tích" value="50,000" unit="m²" />
  <StatCard title="Sản lượng" value="2,500" unit="kg" />
  <StatCard title="Nhân công" value={15} />
</StatCardGroup>
```

### FormField

```tsx
import { FormField, Input } from '@/design-system';

<FormField
  label="Tên lô đất"
  error="Tên không được để trống"
  required
>
  <Input placeholder="Nhập tên..." />
</FormField>

// With helper text
<FormField
  label="Diện tích"
  helperText="Đơn vị: mét vuông"
>
  <Input type="number" rightAddon="m²" />
</FormField>
```

### Input

```tsx
import { Input, SearchInput, NumberInput } from '@/design-system';

// Basic
<Input placeholder="Nhập nội dung..." />

// With icons
<Input leftIcon={<Search />} placeholder="Tìm kiếm..." />

// With addons
<Input leftAddon="https://" placeholder="example.com" />
<Input rightAddon="m²" type="number" />

// Search input
<SearchInput 
  value={query}
  onChange={setQuery}
  clearable
  loading={isSearching}
/>

// Number with stepper
<NumberInput
  value={count}
  onValueChange={setCount}
  min={1}
  max={100}
  showStepper
/>
```

## 🎭 Icons

### Custom Farm Icons

```tsx
import { 
  FertilizerIcon,
  HarvestIcon,
  LandParcelIcon,
  SeedlingIcon,
  IrrigationIcon,
  PestControlIcon,
  CropCycleIcon,
  WeatherIcon,
} from '@/design-system/icons';

<SeedlingIcon size={24} className="text-primary" />
<HarvestIcon size={32} className="text-farm-harvest" />
```

### Lucide Icons

```tsx
import { 
  Sprout, 
  Droplets, 
  Calendar, 
  BarChart3 
} from '@/design-system/icons';
```

## 🎯 Hooks

### useHotkeys

```tsx
import { useHotkeys, HotkeyIndicator } from '@/design-system/hooks';

// Single hotkey
useHotkeys('ctrl+k', () => openSearchModal());

// Escape to close
useHotkeys('esc', () => closeDialog(), { enabled: isOpen });

// Show hotkey hint
<button>
  Tìm kiếm
  <HotkeyIndicator hotkey="ctrl+k" />
</button>
```

### useFocusTrap

```tsx
import { useFocusTrap, FocusLock } from '@/design-system/hooks';

// Hook
const dialogRef = useFocusTrap<HTMLDivElement>({
  enabled: isOpen,
  onEscape: handleClose,
});

// Component
<FocusLock enabled={isOpen} onEscape={handleClose}>
  <Dialog>...</Dialog>
</FocusLock>
```

### useMediaQuery

```tsx
import { 
  useIsMobile, 
  useIsDesktop, 
  useBreakpoint,
  usePrefersReducedMotion,
} from '@/design-system/hooks';

const isMobile = useIsMobile();
const breakpoint = useBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
const reducedMotion = usePrefersReducedMotion();
```

### useAnnounce

```tsx
import { useAnnounce, VisuallyHidden, SkipLink } from '@/design-system/hooks';

const announce = useAnnounce();

const handleSave = async () => {
  await saveData();
  announce('Đã lưu thành công!', { politeness: 'polite' });
};

// Skip link for accessibility
<SkipLink href="#main-content">Bỏ qua điều hướng</SkipLink>
```

## 📖 Storybook

Chạy Storybook để xem documentation và playground:

```bash
# Install dependencies
npm install -D @storybook/react-vite @storybook/addon-essentials @storybook/addon-a11y @storybook/addon-interactions

# Run Storybook
npm run storybook
```

## ✅ Accessibility

Design system này được xây dựng với accessibility-first approach:

- **ARIA Labels**: Tất cả interactive elements có proper labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Focus trap cho modals/dialogs
- **Screen Reader**: Live regions cho announcements
- **Color Contrast**: WCAG 2.1 AA compliant
- **Reduced Motion**: Respects `prefers-reduced-motion`

## 🔧 Customization

### Extend tokens

```ts
// Trong tailwind.config.ts
import { colors } from './src/design-system/tokens';

export default {
  theme: {
    extend: {
      colors: {
        // Add custom colors
        brand: colors.primary,
      },
    },
  },
};
```

### Create custom components

```tsx
// Sử dụng CVA pattern
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const myComponentVariants = cva('base-styles', {
  variants: {
    variant: {
      primary: 'primary-styles',
      secondary: 'secondary-styles',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
```

## 📚 Resources

- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [CVA (Class Variance Authority)](https://cva.style/)
