# Soleil Farm Frontend

Hệ thống quản lý trang trại thông minh - Frontend Application

## 🌱 Giới thiệu

Soleil Farm là ứng dụng quản lý trang trại được thiết kế cho nông dân Việt Nam, với giao diện thân thiện, dễ sử dụng và hỗ trợ đầy đủ tiếng Việt.

## 🛠️ Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| React | 18.3 | UI Library |
| TypeScript | 5.6 | Type Safety |
| Vite | 5.4 | Build Tool |
| TailwindCSS | 3.4 | Styling |
| shadcn/ui | Latest | UI Components |
| React Query | 5.60 | Server State |
| Zustand | 5.0 | Client State |
| React Router | 6.28 | Routing |
| React Hook Form | 7.53 | Form Handling |
| Zod | 3.23 | Validation |

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── assets/          # Static assets (images, fonts)
│   ├── components/      # Shared components
│   │   ├── layout/      # Layout components (Header, Sidebar)
│   │   └── ui/          # shadcn/ui components
│   ├── config/          # App configuration
│   ├── features/        # Feature-based modules
│   │   ├── dashboard/   # Dashboard feature
│   │   ├── land-parcels/# Land parcel management
│   │   ├── crop-cycles/ # Crop cycle management
│   │   ├── seasons/     # Season management
│   │   └── errors/      # Error pages
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── lib/             # Utility libraries
│   ├── routes/          # Route definitions
│   ├── services/        # API services
│   │   └── api/         # Axios client & endpoints
│   ├── stores/          # Zustand stores
│   ├── styles/          # Global styles
│   ├── test/            # Test utilities
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── public/              # Public static files
├── components.json      # shadcn/ui config
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- Node.js >= 20.0.0
- npm >= 10.0.0

### Cài đặt

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt dependencies
npm install

# 3. Copy file environment
cp .env.example .env.local

# 4. Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Scripts có sẵn

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Kiểm tra lỗi ESLint
npm run lint:fix     # Tự động sửa lỗi ESLint
npm run format       # Format code với Prettier
npm run type-check   # Kiểm tra TypeScript
npm run test         # Chạy tests
npm run test:coverage # Chạy tests với coverage
```

## 🎨 Design System

### Bảng màu Soleil Farm

Thiết kế dựa trên theme nông nghiệp Việt Nam:

| Màu | Hex | Ý nghĩa |
|-----|-----|---------|
| Primary Green | `#22c55e` | Lá xanh, sức sống |
| Farm Sun | `#eab308` | Mặt trời (Soleil) |
| Farm Soil | `#a0522d` | Đất canh tác |
| Farm Water | `#0ea5e9` | Nguồn nước |
| Farm Harvest | `#f59e0b` | Mùa gặt |

### Components

Project sử dụng shadcn/ui với các components đã được cài đặt:
- Button
- Card
- Dialog
- Dropdown Menu
- Input
- Label
- Select
- Badge
- Table
- Scroll Area
- Toast (Sonner)

Để thêm components mới:
```bash
npx shadcn-ui@latest add [component-name]
```

## 📱 Responsive Design

Ứng dụng được thiết kế theo nguyên tắc Mobile-First:

| Breakpoint | Min Width | Thiết bị |
|------------|-----------|----------|
| Default | 0px | Mobile |
| sm | 640px | Large Mobile |
| md | 768px | Tablet |
| lg | 1024px | Laptop |
| xl | 1280px | Desktop |
| 2xl | 1400px | Large Desktop |

## 🔌 API Integration

Backend Laravel API endpoint: `http://localhost:8000/api/v1`

Cấu hình trong `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
```

## 🏗️ Kiến trúc

### Feature-Based Architecture

Mỗi feature là một module độc lập với cấu trúc:
```
features/
└── [feature-name]/
    ├── components/    # Feature-specific components
    ├── hooks/         # Feature-specific hooks
    ├── pages/         # Page components
    ├── services/      # API calls
    ├── types/         # TypeScript types
    └── index.ts       # Public exports
```

### State Management

- **Server State**: React Query (TanStack Query)
- **Client State**: Zustand
- **Form State**: React Hook Form + Zod

### Lý do chọn kiến trúc này

1. **Feature-based structure**: Dễ scale, mỗi team có thể làm việc độc lập
2. **TypeScript strict mode**: Giảm bugs, tăng developer experience
3. **React Query**: Cache tự động, background refetching, optimistic updates
4. **Zustand**: Nhẹ, đơn giản hơn Redux, không boilerplate
5. **Vite + SWC**: Build nhanh hơn 10-20x so với Webpack + Babel

## 📝 Coding Standards

### Import Order (tự động qua ESLint)

```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';

// 3. Internal aliases (@/)
import { Button } from '@/components/ui/button';

// 4. Relative imports
import { MyComponent } from './MyComponent';

// 5. Type imports
import type { MyType } from '@/types';
```

### Naming Conventions

- **Components**: PascalCase (`LandParcelCard.tsx`)
- **Hooks**: camelCase với prefix `use` (`useLandParcels.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`LandParcel`, `CropCycleStatus`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test -- --watch
```

## 🚢 Deployment

### Build Production

```bash
npm run build
```

Output sẽ nằm trong thư mục `dist/`.

### Environment Variables

Đảm bảo set các biến môi trường cho production:
- `VITE_API_BASE_URL`: URL của production API
- `VITE_API_VERSION`: API version (default: v1)

## 📄 License

MIT License - xem file [LICENSE](../LICENSE) để biết thêm chi tiết.

---

Được phát triển với ❤️ cho nông dân Việt Nam 🌾
