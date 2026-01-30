import axios from 'axios';

import { config } from '@/config';

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';


// ============================================================================
// TYPES
// ============================================================================

/**
 * Extended config with retry and deduplication options
 */
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  _dedupe?: boolean;
  _dedupeKey?: string;
  _skipAuth?: boolean;
}

/**
 * Pending request for deduplication
 */
interface PendingRequest {
  promise: Promise<AxiosResponse>;
  timestamp: number;
}

/**
 * API Error structure from Laravel
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Parsed API Error with status
 */
export interface ParsedApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
  isNetworkError: boolean;
  isValidationError: boolean;
  isAuthError: boolean;
  isServerError: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const DEDUPE_WINDOW_MS = 100;

const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];
const RETRYABLE_ERRORS = ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH'];

// ============================================================================
// REQUEST DEDUPLICATION
// ============================================================================

const pendingRequests = new Map<string, PendingRequest>();

/**
 * Generate a unique key for request deduplication
 */
function generateDedupeKey(requestConfig: AxiosRequestConfig): string {
  const method = requestConfig.method ?? '';
  const url = requestConfig.url ?? '';
  const params = requestConfig.params as Record<string, unknown> | undefined;
  const data = requestConfig.data as Record<string, unknown> | undefined;
  return `${method.toUpperCase()}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`;
}

/**
 * Clean up expired pending requests
 */
function cleanupPendingRequests(): void {
  const now = Date.now();
  pendingRequests.forEach((request, key) => {
    if (now - request.timestamp > DEDUPE_WINDOW_MS) {
      pendingRequests.delete(key);
    }
  });
}

// ============================================================================
// LOADING STATE MANAGEMENT
// ============================================================================

type LoadingListener = (isLoading: boolean) => void;

let activeRequestCount = 0;
const loadingListeners = new Set<LoadingListener>();

/**
 * Subscribe to loading state changes
 * @returns Unsubscribe function
 */
export function subscribeToLoading(listener: LoadingListener): () => void {
  loadingListeners.add(listener);
  return () => loadingListeners.delete(listener);
}

/**
 * Get current loading state
 */
export function getIsLoading(): boolean {
  return activeRequestCount > 0;
}

function notifyLoadingListeners(): void {
  const loading = getIsLoading();
  loadingListeners.forEach((listener) => { listener(loading); });
}

function incrementLoading(): void {
  activeRequestCount++;
  notifyLoadingListeners();
}

function decrementLoading(): void {
  activeRequestCount = Math.max(0, activeRequestCount - 1);
  notifyLoadingListeners();
}

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

const TOKEN_KEY = 'soleil_farm_auth_token';
const REFRESH_TOKEN_KEY = 'soleil_farm_refresh_token';

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set refresh token
 */
export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Clear all auth tokens
 */
export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Check if error is retryable
 */
function isRetryableError(error: AxiosError): boolean {
  if (!error.response) {
    const code = error.code ?? '';
    return RETRYABLE_ERRORS.includes(code) || error.message === 'Network Error';
  }
  return RETRYABLE_STATUS_CODES.includes(error.response.status);
}

/**
 * Calculate retry delay with exponential backoff
 */
function getRetryDelay(retryCount: number): number {
  return RETRY_DELAY_MS * Math.pow(2, retryCount);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse API error response into standardized format
 * @param error - Axios error
 * @returns Parsed error with status and flags
 */
export function parseApiError(error: AxiosError<ApiErrorResponse>): ParsedApiError {
  const status = error.response?.status ?? 0;

  // Network error
  if (!error.response) {
    let message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';

    if (error.code === 'ECONNABORTED') {
      message = 'Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.';
    }

    return {
      message,
      status: 0,
      isNetworkError: true,
      isValidationError: false,
      isAuthError: false,
      isServerError: false,
    };
  }

  // API returned error
  const data = error.response.data;

  return {
    message: data?.message || getDefaultErrorMessage(status),
    errors: data?.errors,
    status,
    isNetworkError: false,
    isValidationError: status === 422,
    isAuthError: status === 401 || status === 403,
    isServerError: status >= 500,
  };
}

/**
 * Get default error message by status code
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Yêu cầu không hợp lệ.';
    case 401:
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này.';
    case 404:
      return 'Không tìm thấy tài nguyên yêu cầu.';
    case 422:
      return 'Dữ liệu không hợp lệ.';
    case 429:
      return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
    case 500:
      return 'Lỗi máy chủ. Vui lòng thử lại sau.';
    case 503:
      return 'Dịch vụ tạm thời không khả dụng.';
    default:
      return 'Đã xảy ra lỗi không xác định.';
  }
}

// ============================================================================
// AXIOS INSTANCE FACTORY
// ============================================================================

/**
 * Create configured Axios instance with all interceptors
 */
function createHttpClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: `${config.api.baseUrl}/api/${config.api.version}`,
    timeout: config.api.timeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // =========================================================================
  // REQUEST INTERCEPTOR
  // =========================================================================
  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      const extendedConfig = requestConfig as InternalAxiosRequestConfig & ExtendedAxiosRequestConfig;

      // Inject auth token (unless skipAuth is set)
      if (!extendedConfig._skipAuth) {
        const token = getAuthToken();
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Add request timestamp
      requestConfig.headers['X-Request-Time'] = new Date().toISOString();

      // Add locale header
      requestConfig.headers['Accept-Language'] = 'vi';

      // Increment loading counter
      incrementLoading();

      // Log in development
      if (import.meta.env.DEV) {
        console.log(
          `[API ▶] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
          requestConfig.params ?? requestConfig.data ?? ''
        );
      }

      return requestConfig;
    },
    (error: AxiosError) => {
      decrementLoading();
      return Promise.reject(error);
    }
  );

  // =========================================================================
  // RESPONSE INTERCEPTOR
  // =========================================================================
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      decrementLoading();

      // Log in development
      if (import.meta.env.DEV) {
        console.log(
          `[API ✓] ${response.status} ${response.config.url}`,
          response.data
        );
      }

      return response;
    },
    async (error: AxiosError<ApiErrorResponse>) => {
      decrementLoading();

      const originalRequest = error.config as ExtendedAxiosRequestConfig & InternalAxiosRequestConfig;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // =====================================================================
      // RETRY LOGIC
      // =====================================================================
      const retryCount = originalRequest._retryCount ?? 0;

      if (isRetryableError(error) && retryCount < MAX_RETRY_ATTEMPTS) {
        originalRequest._retryCount = retryCount + 1;

        const delay = getRetryDelay(retryCount);

        if (import.meta.env.DEV) {
          console.warn(
            `[API ↻] Retry ${retryCount + 1}/${MAX_RETRY_ATTEMPTS} after ${delay}ms - ${originalRequest.url}`
          );
        }

        await sleep(delay);
        incrementLoading();

        return instance.request(originalRequest);
      }

      // =====================================================================
      // TOKEN REFRESH (401)
      // =====================================================================
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = getRefreshToken();

        if (refreshToken) {
          try {
            const response = await axios.post<{ data: { token: string } }>(
              `${config.api.baseUrl}/api/${config.api.version}/auth/refresh`,
              { refresh_token: refreshToken }
            );

            const newToken = response.data.data.token;
            setAuthToken(newToken);

            // Retry original request with new token
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            incrementLoading();

            return await instance.request(originalRequest);
          } catch (_refreshError) {
            clearAuthTokens();
            window.location.href = '/dang-nhap';
            return Promise.reject(error);
          }
        } else {
          clearAuthTokens();
          window.location.href = '/dang-nhap';
          return Promise.reject(error);
        }
      }

      // =====================================================================
      // ERROR LOGGING
      // =====================================================================
      if (import.meta.env.DEV) {
        const parsedError = parseApiError(error);
        console.error(
          `[API ✗] ${parsedError.status} ${originalRequest.url}`,
          parsedError
        );
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

// ============================================================================
// EXPORTED CLIENT INSTANCE
// ============================================================================

/**
 * Pre-configured Axios instance for API calls
 */
export const httpClient = createHttpClient();

// ============================================================================
// TYPE-SAFE API HELPERS
// ============================================================================

/**
 * Type-safe GET request with deduplication support
 *
 * @example
 * const parcels = await http.get<LandParcel[]>('/land-parcels');
 * const parcel = await http.get<LandParcel>('/land-parcels/1');
 */
async function get<T>(
  url: string,
  requestConfig?: ExtendedAxiosRequestConfig
): Promise<T> {
  // Deduplication for GET requests
  if (requestConfig?._dedupe !== false) {
    cleanupPendingRequests();
    const dedupeKey =
      requestConfig?._dedupeKey ?? generateDedupeKey({ method: 'GET', url, ...requestConfig });
    const pending = pendingRequests.get(dedupeKey);

    if (pending) {
      const response = await pending.promise;
      return response.data as T;
    }

    const promise = httpClient.get<T>(url, requestConfig);
    pendingRequests.set(dedupeKey, { promise, timestamp: Date.now() });

    try {
      const response = await promise;
      return response.data;
    } finally {
      pendingRequests.delete(dedupeKey);
    }
  }

  const response = await httpClient.get<T>(url, requestConfig);
  return response.data;
}

/**
 * Type-safe POST request
 *
 * @example
 * const newParcel = await http.post<LandParcel>('/land-parcels', { name: 'Lô A1' });
 */
async function post<T>(
  url: string,
  data?: unknown,
  requestConfig?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.post<T>(url, data, requestConfig);
  return response.data;
}

/**
 * Type-safe PUT request
 *
 * @example
 * const updated = await http.put<LandParcel>('/land-parcels/1', data);
 */
async function put<T>(
  url: string,
  data?: unknown,
  requestConfig?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.put<T>(url, data, requestConfig);
  return response.data;
}

/**
 * Type-safe PATCH request
 *
 * @example
 * const patched = await http.patch<LandParcel>('/land-parcels/1', { name: 'New Name' });
 */
async function patch<T>(
  url: string,
  data?: unknown,
  requestConfig?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.patch<T>(url, data, requestConfig);
  return response.data;
}

/**
 * Type-safe DELETE request
 *
 * @example
 * await http.delete('/land-parcels/1');
 */
async function del<T = void>(
  url: string,
  requestConfig?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.delete<T>(url, requestConfig);
  return response.data;
}

/**
 * Unified HTTP object with all methods
 * Use this for making API calls throughout the application
 */
export const http = {
  get,
  post,
  put,
  patch,
  delete: del,
  /** Raw axios instance for advanced use cases */
  client: httpClient,
} as const;

export default http;
