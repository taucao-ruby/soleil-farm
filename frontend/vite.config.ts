import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        // SWC for faster builds (10-20x faster than Babel)
        jsxImportSource: undefined,
      }),
      // ===== PWA Configuration =====
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
        manifest: {
          name: 'Soleil Farm Management',
          short_name: 'Soleil Farm',
          description: 'Hệ thống quản lý trang trại thông minh',
          theme_color: '#10b981',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          lang: 'vi',
          categories: ['productivity', 'utilities', 'business'],
          icons: [
            {
              src: '/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
              purpose: 'any maskable',
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Ghi nhật ký nhanh',
              short_name: 'Ghi log',
              description: 'Thêm hoạt động mới vào nhật ký',
              url: '/nhat-ky?action=new',
              icons: [{ src: '/icons/shortcut-log.png', sizes: '96x96' }],
            },
            {
              name: 'Xem chu kỳ canh tác',
              short_name: 'Chu kỳ',
              description: 'Quản lý các chu kỳ canh tác',
              url: '/chu-ky',
              icons: [{ src: '/icons/shortcut-cycle.png', sizes: '96x96' }],
            },
            {
              name: 'Quản lý đất',
              short_name: 'Đất',
              description: 'Xem và quản lý các mảnh đất',
              url: '/dat',
              icons: [{ src: '/icons/shortcut-land.png', sizes: '96x96' }],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          // Clean old caches on activate
          cleanupOutdatedCaches: true,
          // Skip waiting for new service worker
          skipWaiting: true,
          clientsClaim: true,
          // Offline fallback page
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          // Runtime caching strategies
          runtimeCaching: [
            // Cache-first: Static assets (fonts, images)
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
              },
            },
            // Network-first: API calls with fallback to cache
            {
              urlPattern: /^https?:\/\/.*\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
                networkTimeoutSeconds: 10,
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            // Stale-while-revalidate: Dynamic content
            {
              urlPattern: /^https?:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true, // Enable PWA in development for testing
        },
      }),
    ],

    // ===== Path Aliases (Mirror tsconfig.json) =====
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/hooks': path.resolve(__dirname, './src/hooks'),
        '@/lib': path.resolve(__dirname, './src/lib'),
        '@/services': path.resolve(__dirname, './src/services'),
        '@/stores': path.resolve(__dirname, './src/stores'),
        '@/types': path.resolve(__dirname, './src/types'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/config': path.resolve(__dirname, './src/config'),
        '@/layouts': path.resolve(__dirname, './src/layouts'),
      },
    },

    // ===== Development Server =====
    server: {
      port: 3000,
      strictPort: true, // Fail if port is already in use
      host: true, // Expose to network for mobile testing
      open: true, // Auto-open browser
      cors: true,
      // Proxy API requests to Laravel backend
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },

    // ===== Preview Server (Production Build Testing) =====
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
    },

    // ===== Build Optimizations (Vercel/Shopify Best Practices) =====
    build: {
      target: 'ES2022',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development', // Only sourcemaps in dev
      minify: 'esbuild', // Fastest minification
      cssMinify: true,
      reportCompressedSize: false, // Faster builds

      // ===== Code Splitting Strategy =====
      rollupOptions: {
        output: {
          // Manual chunk splitting for optimal caching
          manualChunks: {
            // React core - rarely changes
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Data fetching layer
            'vendor-query': ['@tanstack/react-query', 'axios'],
            // Form handling
            'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
            // State management
            'vendor-state': ['zustand'],
            // UI utilities
            'vendor-ui': [
              'clsx',
              'tailwind-merge',
              'class-variance-authority',
              'lucide-react',
            ],
            // Date utilities
            'vendor-date': ['date-fns', 'react-day-picker'],
          },
          // Hashed filenames for cache busting
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },

      // ===== Chunk Size Warnings =====
      chunkSizeWarningLimit: 500, // Warn if chunk > 500KB
    },

    // ===== CSS Configuration =====
    css: {
      devSourcemap: true,
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },

    // ===== Dependency Optimization =====
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'axios',
        'zustand',
        'react-hook-form',
        'zod',
        'date-fns',
        'clsx',
        'tailwind-merge',
        'lucide-react',
      ],
      exclude: ['@tanstack/react-query-devtools'],
    },

    // ===== Environment Variables =====
    envPrefix: 'VITE_',

    // ===== JSON Handling =====
    json: {
      stringify: true, // Better performance for large JSON
    },

    // ===== Test Configuration =====
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/test/'],
      },
    },
  };
});
