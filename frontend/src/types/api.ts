/**
 * Common API Types
 * =================
 * Shared types used across the application
 */

/**
 * Paginated response from Laravel API
 */
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

/**
 * Single resource response
 */
export interface ResourceResponse<T> {
  data: T;
}

/**
 * API Error response
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Timestamp fields (from Laravel models)
 */
export interface Timestamps {
  created_at: string;
  updated_at: string;
}

/**
 * Soft delete timestamp
 */
export interface SoftDeletes {
  deleted_at: string | null;
}
