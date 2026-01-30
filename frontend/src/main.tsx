import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App';
import { registerServiceWorker } from './lib/pwa';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure there is a <div id="root"></div> in your index.html'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker for PWA
registerServiceWorker({
  onUpdate: (registration) => {
    console.log('[PWA] New content available, please refresh.');
    // The UpdatePrompt component will handle showing the update UI
    if (registration.waiting) {
      // Post message to service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  },
  onSuccess: (registration) => {
    console.log('[PWA] Content cached for offline use.', registration.scope);
  },
  onError: (error) => {
    console.error('[PWA] Service worker registration failed:', error);
  },
});
