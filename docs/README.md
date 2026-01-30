# 📚 Soleil Farm - Documentation

Welcome to the Soleil Farm documentation. This folder contains all technical documentation for the farm management system.

---

## 📁 Documentation Structure

```
docs/
├── README.md                    # This file - Documentation index
├── backend/                     # 🔧 Backend (Laravel API)
│   ├── README.md               # Backend overview & quick start
│   ├── architecture.md         # Backend architecture & patterns
│   ├── database-schema.md      # Database design & ERD
│   ├── api-design.md           # API design principles
│   ├── api-endpoints.md        # Complete API reference
│   ├── api-authentication.md   # Authentication guide
│   ├── api-examples.md         # API usage examples
│   ├── models.md               # Eloquent models documentation
│   ├── installation.md         # Backend setup guide
│   ├── development.md          # Backend development workflow
│   └── deployment.md           # Backend deployment guide
├── frontend/                    # 🎨 Frontend (React SPA)
│   ├── README.md               # Frontend overview & quick start
│   ├── architecture.md         # Frontend architecture & patterns
│   ├── components.md           # UI components documentation
│   ├── dashboard.md            # Dashboard analytics guide
│   ├── state-management.md     # React Query & Zustand
│   ├── installation.md         # Frontend setup guide
│   └── development.md          # Frontend development workflow
└── vietnamese/
    └── huong-dan-su-dung.md    # Vietnamese user guide
```

---

## 🚀 Quick Links

### Backend Documentation
| Document | Description |
|----------|-------------|
| [Backend Overview](backend/README.md) | Laravel API introduction |
| [Architecture](backend/architecture.md) | Backend patterns & structure |
| [Database Schema](backend/database-schema.md) | Tables, relationships, ERD |
| [API Endpoints](backend/api-endpoints.md) | Complete API reference |
| [Installation](backend/installation.md) | Backend setup guide |
| [Development](backend/development.md) | Backend dev workflow |

### Frontend Documentation
| Document | Description |
|----------|-------------|
| [Frontend Overview](frontend/README.md) | React SPA introduction |
| [Architecture](frontend/architecture.md) | Frontend patterns & structure |
| [Components](frontend/components.md) | UI components guide |
| [Dashboard](frontend/dashboard.md) | Analytics dashboard |
| [Installation](frontend/installation.md) | Frontend setup guide |
| [Development](frontend/development.md) | Frontend dev workflow |

---

## 📊 Project Stats

### Backend
| Metric | Value |
|--------|-------|
| Framework | Laravel 11.x |
| Language | PHP 8.2+ |
| Database | MySQL 8.0+ / SQLite |
| API Style | RESTful JSON API |
| Tables | 14 |
| Endpoints | 40+ |
| Models | 12 |

### Frontend
| Metric | Value |
|--------|-------|
| Framework | React 18.x |
| Language | TypeScript 5.x |
| Build Tool | Vite 5.x |
| Styling | Tailwind CSS 3.x |
| UI Library | shadcn/ui |
| State | React Query 5.x + Zustand |
| Charts | Recharts 2.x |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND                              │
│  React 18 + TypeScript + Vite + Tailwind + shadcn/ui       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Dashboard│  │Land     │  │Crop     │  │Activity │        │
│  │Analytics│  │Parcels  │  │Cycles   │  │Logs     │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
        └────────────┴────────────┴────────────┘
                          │
                    ┌─────▼─────┐
                    │  REST API │
                    │ /api/v1/* │
                    └─────┬─────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                       BACKEND                               │
│  Laravel 11 + PHP 8.2 + Eloquent ORM                       │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │Controllers│  │ Services  │  │ Resources │               │
│  └─────┬─────┘  └─────┬─────┘  └───────────┘               │
│        │              │                                     │
│  ┌─────▼──────────────▼─────┐                              │
│  │     Eloquent Models      │                              │
│  │     (12 Models)          │                              │
│  └────────────┬─────────────┘                              │
└───────────────┼─────────────────────────────────────────────┘
                │
         ┌──────▼──────┐
         │   MySQL     │
         │  14 Tables  │
         └─────────────┘
```

---

## 🔗 Related Resources

- [Backend README](../backend/README.md) - Laravel project readme
- [Frontend README](../frontend/README.md) - React project readme
- [Project Status](../PROJECT_STATUS.md) - Current development status

---

*Last updated: January 29, 2026*
