/**
 * Protected Route Component
 * ==========================
 * Route guard that ensures user is authenticated before accessing protected content.
 *
 * Features:
 * - Automatic redirect to login if not authenticated
 * - Preserves intended destination URL
 * - Handles token expiration gracefully
 * - Shows loading state during auth check
 */

import { useEffect } from 'react';

import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required role to access this route */
  requiredRole?: string;
  /** Fallback component while checking auth */
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const location = useLocation();

  const {
    isAuthenticated,
    isInitialized,
    user,
    initialize,
    setIntendedPath,
    checkInactivity,
  } = useAuthStore();

  // Initialize auth state if not already done
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Check for inactivity on route change
  useEffect(() => {
    if (isAuthenticated) {
      checkInactivity();
    }
  }, [location.pathname, isAuthenticated, checkInactivity]);

  // Save intended path when not authenticated
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setIntendedPath(location.pathname + location.search);
    }
  }, [isInitialized, isAuthenticated, location.pathname, location.search, setIntendedPath]);

  // Show loading while initializing
  if (!isInitialized) {
    return fallback || <AuthLoadingScreen />;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/dang-nhap"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Navigate
        to="/khong-co-quyen"
        state={{ from: location }}
        replace
      />
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}

/**
 * Loading screen shown while checking authentication
 */
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-farm-leaf-50 to-farm-soil-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-farm-leaf-100 flex items-center justify-center">
            <Shield className="h-8 w-8 text-farm-leaf-600" />
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className="h-6 w-6 animate-spin text-farm-leaf-600" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-farm-soil-700 font-medium">Đang xác thực...</p>
          <p className="text-farm-soil-500 text-sm">Vui lòng đợi trong giây lát</p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Public Route Component
 * ======================
 * Route wrapper for public pages that redirects authenticated users.
 */
interface PublicRouteProps {
  children: React.ReactNode;
  /** Redirect path for authenticated users */
  redirectTo?: string;
}

export function PublicRoute({ children, redirectTo = '/' }: PublicRouteProps) {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Show loading while initializing
  if (!isInitialized) {
    return <AuthLoadingScreen />;
  }

  // Already authenticated - redirect away from public pages like login
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
