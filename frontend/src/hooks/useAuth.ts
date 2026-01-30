/**
 * useAuth Hook
 * =============
 * Custom hook for authentication with security-focused features.
 */

import { useCallback, useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import type { User } from '@/schemas';
import {
  useAuthStore,
  startInactivityMonitor,
  stopInactivityMonitor,
} from '@/stores/auth.store';

export interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Authentication hook with automatic initialization and redirect handling
 */
export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    intendedPath,
    login: storeLogin,
    logout: storeLogout,
    initialize,
    clearError,
    setIntendedPath,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Start inactivity monitor when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      startInactivityMonitor();
    } else {
      stopInactivityMonitor();
    }

    return () => {
      stopInactivityMonitor();
    };
  }, [isAuthenticated]);

  // Login with redirect handling
  const login = useCallback(
    async (email: string, password: string, remember = false) => {
      await storeLogin(email, password, remember);

      // Redirect to intended path or dashboard
      const redirectPath = intendedPath || '/';
      setIntendedPath(null);
      navigate(redirectPath, { replace: true });
    },
    [storeLogin, navigate, intendedPath, setIntendedPath]
  );

  // Logout with redirect
  const logout = useCallback(async () => {
    await storeLogout(false);
    navigate('/dang-nhap', { replace: true });
  }, [storeLogout, navigate]);

  // Save current path when accessing protected route while not authenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated && location.pathname !== '/dang-nhap') {
      setIntendedPath(location.pathname);
    }
  }, [isInitialized, isAuthenticated, location.pathname, setIntendedPath]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    logout,
    clearError,
  };
}

/**
 * Hook for logout functionality only
 */
export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useCallback(async () => {
    await logout(false);
    navigate('/dang-nhap', { replace: true });
  }, [logout, navigate]);
}

/**
 * Hook to check if user has specific role
 */
export function useHasRole(role: string): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.role === role;
}

/**
 * Hook to require authentication (redirect if not)
 */
export function useRequireAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitialized, setIntendedPath } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setIntendedPath(location.pathname + location.search);
      navigate('/dang-nhap', { replace: true });
    }
  }, [isAuthenticated, isInitialized, navigate, location, setIntendedPath]);

  return { isAuthenticated, isInitialized };
}
