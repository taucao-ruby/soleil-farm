/**
 * Auth Store (Zustand)
 * =====================
 * Secure authentication state management with enterprise-grade features.
 *
 * Security Features:
 * - Token validation before storage
 * - Auto-refresh mechanism
 * - Inactivity timeout handling
 * - Secure logout with cleanup
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import {
  storeToken,
  getStoredToken,
  clearTokens,
  isTokenExpired,
  tokenNeedsRefresh,
  updateLastActivity,
  isInactive,
  isValidTokenFormat,
  INACTIVITY_TIMEOUT,
} from '@/lib/security';
import type { User } from '@/schemas';
import { authService } from '@/services';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  intendedPath: string | null;

  // Actions
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: (redirect?: boolean) => Promise<void>;
  initialize: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setIntendedPath: (path: string | null) => void;
  clearError: () => void;
  checkInactivity: () => boolean;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,
      intendedPath: null,

      /**
       * Login with email and password
       */
      login: async (email: string, password: string, remember = false) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.login({ email, password });

          // Response structure: { data: { user, tokens: { token } } }
          const accessToken = response.data?.tokens?.token;
          const user = response.data?.user;
          
          if (!accessToken || !isValidTokenFormat(accessToken)) {
            throw new Error('Token không hợp lệ từ server');
          }

          // Store token securely
          storeToken(accessToken);
          
          // Store remember preference
          if (remember) {
            localStorage.setItem('sf_remember', 'true');
          } else {
            sessionStorage.setItem('sf_session', 'true');
          }

          set((state) => {
            state.user = user;
            state.token = accessToken;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
          });

          updateLastActivity();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Đăng nhập thất bại. Vui lòng thử lại.';

          set((state) => {
            state.isLoading = false;
            state.error = message;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
          });

          throw error;
        }
      },

      /**
       * Logout and cleanup
       */
      logout: async (redirect = true) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          // Call logout API to invalidate token on server
          await authService.logout();
        } catch {
          // Continue with local logout even if API fails
          console.warn('[Auth] Logout API failed, continuing with local cleanup');
        } finally {
          // Clear all tokens and state
          clearTokens();
          localStorage.removeItem('sf_remember');
          sessionStorage.removeItem('sf_session');

          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
          });

          if (redirect && typeof window !== 'undefined') {
            window.location.href = '/dang-nhap';
          }
        }
      },

      /**
       * Initialize auth state on app load
       */
      initialize: async () => {
        const token = getStoredToken();

        if (!token) {
          set((state) => {
            state.isInitialized = true;
            state.isAuthenticated = false;
          });
          return;
        }

        // Check token expiry
        if (isTokenExpired(token)) {
          clearTokens();
          set((state) => {
            state.isInitialized = true;
            state.isAuthenticated = false;
          });
          return;
        }

        // Check inactivity
        if (isInactive()) {
          clearTokens();
          set((state) => {
            state.isInitialized = true;
            state.isAuthenticated = false;
            state.error = 'Phiên làm việc đã hết hạn do không hoạt động';
          });
          return;
        }

        try {
          // Fetch current user
          const user = await authService.getCurrentUser();

          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.isInitialized = true;
          });

          updateLastActivity();

          // Check if token needs refresh
          if (tokenNeedsRefresh(token)) {
            get().refreshToken();
          }
        } catch (error) {
          console.error('[Auth] Failed to initialize:', error);
          clearTokens();

          set((state) => {
            state.isInitialized = true;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
          });
        }
      },

      /**
       * Refresh the access token
       */
      refreshToken: async () => {
        try {
          const response = await authService.refreshToken();

          if (response.access_token && isValidTokenFormat(response.access_token)) {
            storeToken(response.access_token);

            set((state) => {
              state.token = response.access_token;
            });

            return true;
          }

          return false;
        } catch (error) {
          console.error('[Auth] Token refresh failed:', error);
          // Don't logout immediately, let the next API call handle it
          return false;
        }
      },

      /**
       * Set user data
       */
      setUser: (user) => {
        set((state) => {
          state.user = user;
        });
      },

      /**
       * Set error message
       */
      setError: (error) => {
        set((state) => {
          state.error = error;
        });
      },

      /**
       * Set intended path for redirect after login
       */
      setIntendedPath: (path) => {
        set((state) => {
          state.intendedPath = path;
        });
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      /**
       * Check and handle inactivity
       */
      checkInactivity: () => {
        if (isInactive() && get().isAuthenticated) {
          get().logout(true);
          return true;
        }
        updateLastActivity();
        return false;
      },
    })),
    {
      name: 'soleil-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Only persist non-sensitive data
        intendedPath: state.intendedPath,
      }),
    }
  )
);

// ============================================================================
// INACTIVITY MONITOR
// ============================================================================

let inactivityTimer: NodeJS.Timeout | null = null;
let activityListenersAttached = false;

/**
 * Start monitoring user inactivity
 */
export function startInactivityMonitor(): void {
  if (activityListenersAttached) return;

  const resetTimer = () => {
    updateLastActivity();

    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
      const { isAuthenticated, logout } = useAuthStore.getState();
      if (isAuthenticated) {
        logout(true);
      }
    }, INACTIVITY_TIMEOUT);
  };

  // Activity events
  const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
  
  events.forEach((event) => {
    document.addEventListener(event, resetTimer, { passive: true });
  });

  activityListenersAttached = true;
  resetTimer();
}

/**
 * Stop monitoring user inactivity
 */
export function stopInactivityMonitor(): void {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
}

// ============================================================================
// SELECTORS
// ============================================================================

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
export const selectIsInitialized = (state: AuthState) => state.isInitialized;
