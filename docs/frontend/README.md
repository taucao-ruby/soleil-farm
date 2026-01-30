# 🎨 Frontend Documentation - Soleil Farm

React + TypeScript SPA for farm management system.

---

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | Latest |
| State (Server) | TanStack Query | 5.x |
| State (Client) | Zustand | Latest |
| Forms | React Hook Form + Zod | Latest |
| Charts | Recharts | 2.x |
| Routing | React Router | 6.x |
| HTTP Client | Axios | Latest |

---

## Quick Start

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Shared UI components
│   │   └── ui/              # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── table.tsx
│   │       ├── skeleton.tsx
│   │       ├── tooltip.tsx
│   │       └── ...
│   ├── features/            # Feature modules
│   │   ├── dashboard/       # Dashboard feature
│   │   │   ├── components/  # Dashboard-specific components
│   │   │   ├── hooks/       # Dashboard hooks
│   │   │   └── pages/       # Dashboard pages
│   │   ├── land-parcels/    # Land parcels management
│   │   ├── crop-cycles/     # Crop cycles management
│   │   └── ...
│   ├── hooks/               # Shared custom hooks
│   ├── layouts/             # Layout components
│   ├── lib/                 # Utility functions
│   ├── routes/              # Route definitions
│   ├── schemas/             # Zod validation schemas
│   ├── services/            # API services
│   ├── stores/              # Zustand stores
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies
```

---

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | Frontend patterns & design |
| [Components](components.md) | UI component library |
| [Dashboard](dashboard.md) | Dashboard feature guide |
| [State Management](state-management.md) | Data fetching & state |
| [Installation](installation.md) | Detailed setup guide |
| [Development](development.md) | Development workflow |

---

## Key Features

- ✅ Modern React 18 with hooks
- ✅ Full TypeScript for type safety
- ✅ shadcn/ui component library
- ✅ TanStack Query for server state
- ✅ Recharts for data visualization
- ✅ Feature-based architecture
- ✅ Zod schema validation
- ✅ Responsive design with Tailwind
- ✅ Dark mode support (planned)

---

## Available Scripts

```bash
# Development
npm run dev           # Start dev server (port 5173)

# Build
npm run build         # Production build
npm run preview       # Preview production build

# Linting
npm run lint          # Run ESLint

# Type Check
npm run typecheck     # TypeScript check
```

---

## Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

*See also: [Backend Documentation](../backend/README.md) | [Main Index](../README.md)*
