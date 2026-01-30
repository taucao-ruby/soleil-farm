import axios from 'axios';

import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * API Configuration
 * =================
 * Centralized axios instance with:
 * - Base URL configuration
 * - Request/Response interceptors
 * - Error handling
 * - Token management
 */

// Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

/**
 * Create axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request interceptor
 * - Add authentication token
 * - Log requests in development
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or your auth store)
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * - Handle common error responses
 * - Refresh token on 401
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/dang-nhap';
      
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Forbidden - insufficient permissions');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('[API] Resource not found');
    }

    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      console.error('[API] Validation error', error.response.data);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('[API] Server error');
    }

    return Promise.reject(error);
  }
);

/**
 * Type-safe API helper functions
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
