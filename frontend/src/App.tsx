import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import { OfflineIndicator, InstallPrompt, UpdatePrompt } from '@/components/pwa';
import { PersistQueryProvider } from '@/lib/pwa';
import { queryClient } from '@/lib/query-client';
import { AppRoutes } from '@/routes';

/**
 * Main Application Component
 * =========================
 * Wraps the entire app with necessary providers:
 * 1. PersistQueryProvider - React Query with offline persistence
 * 2. BrowserRouter - Client-side routing
 * 3. Toaster - Toast notifications (shadcn/ui + sonner)
 * 4. PWA Components - Offline indicator, Install prompt, Update prompt
 */
function App() {
  return (
    <PersistQueryProvider client={queryClient}>
      <BrowserRouter>
        {/* PWA Components */}
        <OfflineIndicator />
        <InstallPrompt />
        <UpdatePrompt />

        {/* Main App */}
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
      {/* Only show devtools in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </PersistQueryProvider>
  );
}

export default App;
