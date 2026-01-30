import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import type { User } from '@/schemas';
import { authService } from '@/services';

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch the current authenticated user
 *
 * @param options - Additional React Query options
 *
 * @example
 * const { data: user, isLoading } = useCurrentUser();
 *
 * if (user) {
 *   console.log(`Logged in as ${user.name}`);
 * }
 */
export function useCurrentUser(
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: authService.getCurrentUser,
    staleTime: Infinity, // User data doesn't change often
    retry: false, // Don't retry auth errors
    ...options,
  });
}

/**
 * Check if user is authenticated (based on cached user data)
 *
 * @example
 * const { isAuthenticated, isLoading } = useIsAuthenticated();
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, error } = useCurrentUser({
    enabled: authService.isAuthenticated(),
  });

  return {
    isAuthenticated: !!user && !error,
    isLoading,
    user,
  };
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Login mutation hook
 *
 * Features:
 * - Stores auth token automatically
 * - Updates user cache on success
 *
 * @example
 * const loginMutation = useLogin();
 *
 * loginMutation.mutate(
 *   { email: 'user@example.com', password: 'password123' },
 *   { onSuccess: () => navigate('/dashboard') }
 * );
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Set the user data in cache (data is wrapped in { data: { user, tokens } })
      if (data.data.user) {
        queryClient.setQueryData(queryKeys.auth.user(), data.data.user);
      }
    },
  });
}

/**
 * Register mutation hook
 *
 * Features:
 * - Stores auth token automatically (if provided)
 * - Updates user cache on success
 *
 * @example
 * const registerMutation = useRegister();
 *
 * registerMutation.mutate({
 *   name: 'Nguyễn Văn A',
 *   email: 'user@example.com',
 *   password: 'password123',
 *   password_confirmation: 'password123',
 * });
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (data.data.user) {
        queryClient.setQueryData(queryKeys.auth.user(), data.data.user);
      }
    },
  });
}

/**
 * Logout mutation hook
 *
 * Features:
 * - Removes auth token
 * - Clears all cached data
 *
 * @example
 * const logoutMutation = useLogout();
 *
 * logoutMutation.mutate(undefined, {
 *   onSuccess: () => navigate('/login'),
 * });
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
    onError: () => {
      // Still clear cache even if logout API fails
      queryClient.clear();
    },
  });
}

/**
 * Refresh token mutation hook
 *
 * @example
 * const refreshMutation = useRefreshToken();
 * refreshMutation.mutate();
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: authService.refreshToken,
  });
}

/**
 * Forgot password mutation hook
 *
 * @example
 * const forgotMutation = useForgotPassword();
 * forgotMutation.mutate('user@example.com');
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
}

/**
 * Reset password mutation hook
 *
 * @example
 * const resetMutation = useResetPassword();
 * resetMutation.mutate({
 *   token: 'reset-token',
 *   email: 'user@example.com',
 *   password: 'newPassword123',
 *   password_confirmation: 'newPassword123',
 * });
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
}
