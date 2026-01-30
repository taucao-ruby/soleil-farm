/**
 * Application Configuration
 * =========================
 * Centralized configuration constants
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    version: import.meta.env.VITE_API_VERSION || 'v1',
    timeout: 30000,
  },

  // App Metadata
  app: {
    name: 'Soleil Farm',
    version: '1.0.0',
    description: 'Hệ thống quản lý trang trại thông minh',
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },

  // Date formats (Vietnamese)
  dateFormats: {
    display: 'dd/MM/yyyy',
    displayWithTime: 'dd/MM/yyyy HH:mm',
    api: 'yyyy-MM-dd',
  },

  // Supported locales
  locales: {
    default: 'vi-VN',
    supported: ['vi-VN', 'en-US'],
  },
} as const;

export default config;
