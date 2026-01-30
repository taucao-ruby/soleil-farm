# Soleil Farm PWA Documentation

## Overview

Soleil Farm đã được transform thành một Progressive Web App (PWA) đầy đủ với các tính năng:

- ✅ **Installable** - Có thể cài đặt như native app
- ✅ **Offline-capable** - Hoạt động khi không có mạng
- ✅ **Auto-sync** - Tự động đồng bộ khi có mạng trở lại
- ✅ **Background sync** - Đồng bộ ngầm
- ✅ **Push-ready** - Sẵn sàng cho push notifications

## Architecture

### 1. Service Worker (vite-plugin-pwa)

Service worker được generate tự động bởi `vite-plugin-pwa` với Workbox. Các caching strategies:

| Content Type | Strategy | Cache Duration |
|-------------|----------|----------------|
| Static assets (JS, CSS, HTML) | Precache | Until update |
| Images, fonts | Cache First | 30 days |
| API calls | Network First | 24 hours |
| Google Fonts | Stale While Revalidate | 1 year |

### 2. Offline Data Sync

```typescript
// Thêm mutation vào queue khi offline
import { queueCreate, queueUpdate, queueDelete } from '@/lib/pwa';

// Create
queueCreate('activity-logs', '/api/activity-logs', { data: '...' });

// Update
queueUpdate('land-parcels', '/api/land-parcels/1', { data: '...' });

// Delete
queueDelete('crop-cycles', '/api/crop-cycles/1');
```

### 3. React Query Persistence

Data từ React Query được persist vào localStorage, cho phép app hiển thị data cached khi offline.

```typescript
import { PersistQueryProvider } from '@/lib/pwa';

// Wrap app với PersistQueryProvider thay vì QueryClientProvider
<PersistQueryProvider client={queryClient}>
  <App />
</PersistQueryProvider>
```

## PWA Components

### OfflineIndicator

Hiển thị banner khi offline hoặc có pending sync:

```tsx
import { OfflineIndicator } from '@/components/pwa';

<OfflineIndicator />
```

### InstallPrompt

Prompt user cài đặt app:

```tsx
import { InstallPrompt, InstallButton } from '@/components/pwa';

// Full banner
<InstallPrompt />

// Compact button cho nav/settings
<InstallButton />
```

### UpdatePrompt

Thông báo có version mới:

```tsx
import { UpdatePrompt } from '@/components/pwa';

<UpdatePrompt />
```

## Hooks

### useOnlineStatus

```typescript
import { useOnlineStatus, useIsOnline } from '@/lib/pwa';

// Full status
const { isOnline, wasOffline, lastOnlineAt, lastOfflineAt } = useOnlineStatus();

// Simple boolean
const isOnline = useIsOnline();
```

### useSyncQueue

```typescript
import { useSyncQueue } from '@/lib/pwa';

const {
  queue,           // Pending mutations
  pendingCount,    // Number of pending items
  isSyncing,       // Currently syncing
  isOnline,        // Online status
  addToQueue,      // Add mutation
  processQueue,    // Force sync
  clearQueue,      // Clear all pending
} = useSyncQueue();
```

### useInstallPrompt

```typescript
import { useInstallPrompt } from '@/lib/pwa';

const {
  canInstall,     // Can show install prompt
  isInstalled,    // Already installed
  promptInstall,  // Show install dialog
  dismissPrompt,  // Dismiss banner
  isDismissed,    // User dismissed
} = useInstallPrompt();
```

### useOfflineMutation

```typescript
import { useOfflineMutation } from '@/lib/pwa';

const { mutate, isPending, isOnline, wasQueued } = useOfflineMutation({
  resource: 'activity-logs',
  endpoint: '/api/activity-logs',
  type: 'create',
  mutationFn: async (data) => api.post('/activity-logs', data),
  optimisticData: (data) => ({ id: 'temp-id', ...data }),
});

// Use it
mutate({ name: 'Watering', date: new Date() });

if (wasQueued) {
  toast('Đã lưu. Sẽ đồng bộ khi có mạng.');
}
```

## Testing PWA

### Lighthouse Audit

```bash
npx lighthouse http://localhost:3000 --view
```

### Chrome DevTools

1. **Application tab** → Check manifest, service worker, storage
2. **Network tab** → Check "Offline" để test offline mode
3. **Application** → **Service Workers** → Update on reload

### Manual Testing

1. Build production: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools → Application → Manifest
4. Click "Add to homescreen" để test install
5. Check "Offline" trong Network tab để test offline

## File Structure

```
src/
├── components/
│   └── pwa/
│       ├── index.ts
│       ├── OfflineIndicator.tsx
│       ├── InstallPrompt.tsx
│       └── UpdatePrompt.tsx
├── lib/
│   └── pwa/
│       ├── index.ts
│       ├── sync-queue.ts
│       ├── background-sync.ts
│       ├── service-worker-registration.ts
│       ├── query-persistence.tsx
│       ├── use-online-status.ts
│       ├── use-sync-queue.ts
│       ├── use-install-prompt.ts
│       └── use-offline-mutation.ts
public/
├── manifest.json
├── offline.html
└── icons/
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## PWA Checklist

- [x] Manifest.json configured
- [x] Service worker registered (via vite-plugin-pwa)
- [x] Offline fallback page (offline.html)
- [x] Install prompt shown (InstallPrompt component)
- [x] Icons (72x72 to 512x512)
- [x] Offline data sync queue
- [x] React Query persistence
- [x] Background sync ready
- [x] Update prompt (UpdatePrompt component)
- [x] Offline indicator (OfflineIndicator component)

## Configuration

### vite.config.ts

PWA được cấu hình trong `vite.config.ts` với `vite-plugin-pwa`:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
  manifest: { ... },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [ ... ],
  },
  devOptions: {
    enabled: true, // Test PWA in dev mode
  },
})
```

### Theme Color

Theme color là `#10b981` (emerald-500). Cập nhật ở:
- `manifest.json`
- `index.html` meta tag
- `vite.config.ts` PWA manifest

## Troubleshooting

### Service Worker không update

```typescript
// Force update trong DevTools Console
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.update());
});
```

### Clear cache

```typescript
import { clearPersistedCache } from '@/lib/pwa';

// Clear React Query cache
clearPersistedCache();

// Clear all caches
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

### Check cache size

```typescript
import { getPersistedCacheSize, formatCacheSize } from '@/lib/pwa';

const size = getPersistedCacheSize();
console.log('Cache size:', formatCacheSize(size));
```
