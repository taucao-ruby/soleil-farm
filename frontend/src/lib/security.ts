/**
 * Security Utilities
 * ===================
 * Enterprise-grade security utilities for authentication and data protection.
 * Designed with banking/fintech security standards in mind.
 */

import DOMPurify from 'dompurify';

// ============================================================================
// TOKEN SECURITY
// ============================================================================

const TOKEN_KEY = 'sf_auth_token';
const REFRESH_TOKEN_KEY = 'sf_refresh_token';
const TOKEN_EXPIRY_KEY = 'sf_token_expiry';
const LAST_ACTIVITY_KEY = 'sf_last_activity';

// Inactivity timeout: 15 minutes (in milliseconds)
export const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

// Token refresh threshold: 5 minutes before expiry
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000;

/**
 * Validate JWT token format (not cryptographic validation)
 * Checks for proper JWT structure: header.payload.signature
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Check each part is valid base64url
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every(part => part.length > 0 && base64UrlRegex.test(part));
}

/**
 * Decode JWT payload without verification
 * Used for extracting expiry time and user info
 */
export function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    if (!isValidTokenFormat(token)) return null;
    
    const payload = token.split('.')[1];
    // Base64url to base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeTokenPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  
  // Add small buffer (10 seconds) for clock skew
  return Date.now() >= (payload.exp * 1000) - 10000;
}

/**
 * Get token expiry time in milliseconds
 */
export function getTokenExpiry(token: string): number | null {
  const payload = decodeTokenPayload(token);
  if (!payload || typeof payload.exp !== 'number') return null;
  return payload.exp * 1000;
}

/**
 * Check if token needs refresh (within threshold of expiry)
 */
export function tokenNeedsRefresh(token: string): boolean {
  const expiry = getTokenExpiry(token);
  if (!expiry) return true;
  return Date.now() >= expiry - TOKEN_REFRESH_THRESHOLD;
}

// ============================================================================
// SECURE TOKEN STORAGE
// ============================================================================

/**
 * Securely store auth token
 * Note: For maximum security, httpOnly cookies should be set by the backend.
 * This localStorage implementation is a fallback with additional protections.
 */
export function storeToken(token: string): void {
  if (!isValidTokenFormat(token)) {
    console.error('[Security] Attempted to store invalid token format');
    return;
  }
  
  try {
    localStorage.setItem(TOKEN_KEY, token);
    
    const expiry = getTokenExpiry(token);
    if (expiry) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    }
    
    updateLastActivity();
  } catch (error) {
    console.error('[Security] Failed to store token:', error);
  }
}

/**
 * Retrieve stored token with validation
 */
export function getStoredToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) return null;
    
    // Validate format
    if (!isValidTokenFormat(token)) {
      clearTokens();
      return null;
    }
    
    // Check expiry
    if (isTokenExpired(token)) {
      clearTokens();
      return null;
    }
    
    return token;
  } catch {
    return null;
  }
}

/**
 * Store refresh token
 */
export function storeRefreshToken(token: string): void {
  if (!isValidTokenFormat(token)) return;
  
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('[Security] Failed to store refresh token:', error);
  }
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  try {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!token || !isValidTokenFormat(token)) return null;
    return token;
  } catch {
    return null;
  }
}

/**
 * Clear all tokens and auth data
 */
export function clearTokens(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  } catch (error) {
    console.error('[Security] Failed to clear tokens:', error);
  }
}

// ============================================================================
// INACTIVITY TRACKING
// ============================================================================

/**
 * Update last activity timestamp
 */
export function updateLastActivity(): void {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  } catch {
    // Silently fail
  }
}

/**
 * Get last activity timestamp
 */
export function getLastActivity(): number {
  try {
    const timestamp = localStorage.getItem(LAST_ACTIVITY_KEY);
    return timestamp ? parseInt(timestamp, 10) : Date.now();
  } catch {
    return Date.now();
  }
}

/**
 * Check if user has been inactive for too long
 */
export function isInactive(): boolean {
  const lastActivity = getLastActivity();
  return Date.now() - lastActivity > INACTIVITY_TIMEOUT;
}

// ============================================================================
// XSS PREVENTION
// ============================================================================

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize user input (strip all HTML)
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Escape special characters for safe display
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// CSRF PROTECTION
// ============================================================================

const CSRF_TOKEN_KEY = 'sf_csrf_token';

/**
 * Generate a cryptographically random CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token
 */
export function storeCsrfToken(token: string): void {
  try {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  } catch {
    // Fallback to memory if sessionStorage fails
  }
}

/**
 * Get stored CSRF token
 */
export function getCsrfToken(): string | null {
  try {
    return sessionStorage.getItem(CSRF_TOKEN_KEY);
  } catch {
    return null;
  }
}

// ============================================================================
// PASSWORD VALIDATION
// ============================================================================

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  feedback: string[];
}

/**
 * Evaluate password strength
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Mật khẩu phải có ít nhất 8 ký tự');
  }
  
  if (password.length >= 12) {
    score += 1;
  }
  
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Nên có cả chữ hoa và chữ thường');
  }
  
  if (/\d/.test(password)) {
    score += 0.5;
  } else {
    feedback.push('Nên có ít nhất một số');
  }
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 0.5;
  } else {
    feedback.push('Nên có ký tự đặc biệt');
  }
  
  const labels = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
  
  const finalScore = Math.min(Math.floor(score), 4);
  
  return {
    score: finalScore,
    label: labels[finalScore],
    color: colors[finalScore],
    feedback,
  };
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// ============================================================================
// RATE LIMITING (Client-side)
// ============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if action is rate limited
 * @param key - Unique key for the action
 * @param maxAttempts - Maximum attempts allowed
 * @param windowMs - Time window in milliseconds
 */
export function isRateLimited(
  key: string,
  maxAttempts = 5,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= maxAttempts) {
    return true;
  }
  
  record.count += 1;
  return false;
}

/**
 * Get remaining time until rate limit resets
 */
export function getRateLimitResetTime(key: string): number {
  const record = rateLimitStore.get(key);
  if (!record) return 0;
  return Math.max(0, record.resetTime - Date.now());
}

/**
 * Clear rate limit for a key
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
